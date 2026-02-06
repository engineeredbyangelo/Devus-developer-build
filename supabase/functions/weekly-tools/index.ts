const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface WeeklyTool {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  url: string;
  githubUrl?: string;
  category: string;
  tags: string[];
  useCases: string[];
  techStackFit: string[];
  learningCurve: "low" | "medium" | "high";
  communityActivity: "still-building" | "early-stage" | "active" | "very-active";
  source: "firecrawl";
}

// Quality tool sources to prioritize
const prioritySites = [
  'github.com',
  'producthunt.com',
  'npmjs.com',
];

// Domains to skip
const skipDomains = [
  'linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'youtube.com', 'instagram.com',
  'medium.com', 'dev.to', 'hashnode.dev', 'substack.com', 'wordpress.com', 'blogger.com',
  'reddit.com', 'news.ycombinator.com', 'techcrunch.com', 'wired.com', 'theverge.com',
  'g2.com', 'capterra.com', 'alternativeto.com', 'slant.co', 'trustradius.com',
  'stackoverflow.com', 'quora.com', 'stackexchange.com',
];

const skipPatterns = [
  '/blog/', '/articles/', '/news/', '/best-', '/top-', '/posts/',
  '/comparing/', '/vs/', '/comparison/', '/alternatives/',
  'awesome-list', 'awesome-',
];

function shouldSkipUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  if (skipDomains.some(domain => lowerUrl.includes(domain))) return true;
  if (skipPatterns.some(pattern => lowerUrl.includes(pattern))) return true;
  return false;
}

function extractToolName(url: string, title: string): string {
  if (url.includes('github.com')) {
    const repoMatch = url.match(/github\.com\/[\w-]+\/([\w-]+)/);
    if (repoMatch) {
      return repoMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  if (url.includes('producthunt.com')) {
    return title.split(' - ')[0].split(' | ')[0].split(':')[0].trim();
  }
  if (url.includes('npmjs.com')) {
    const pkgMatch = url.match(/npmjs\.com\/package\/([@\w-]+(?:\/[\w-]+)?)/);
    if (pkgMatch) {
      return pkgMatch[1].replace(/^@/, '').replace(/\//g, ' ').replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  return title.split(' - ')[0].split(' | ')[0].split(':')[0].replace(/^\d+\.\s*/, '').trim().slice(0, 50);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lovable AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build trending-focused query for current week
    const currentYear = new Date().getFullYear();
    const siteQuery = prioritySites.map(s => `site:${s}`).join(' OR ');
    const searchQuery = `(${siteQuery}) new developer tool ${currentYear} trending (CLI OR SDK OR framework OR library OR devtool) -"best tools" -"top tools" -"list of"`;
    
    console.log('Weekly tools search query:', searchQuery);

    // Search with Firecrawl
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 20,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });

    const searchData = await searchResponse.json();
    
    if (!searchResponse.ok) {
      console.error('Firecrawl search error:', searchData);
      return new Response(
        JSON.stringify({ success: false, error: searchData.error || 'Firecrawl search failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = searchData.data || [];
    const toolCandidates: { name: string; url: string; description: string; markdown?: string }[] = [];
    const seenNames = new Set<string>();

    for (const result of results) {
      if (!result.url || !result.title) continue;
      if (shouldSkipUrl(result.url)) continue;
      
      const toolName = extractToolName(result.url, result.title);
      const normalizedName = toolName.toLowerCase();
      
      if (seenNames.has(normalizedName)) continue;
      if (toolName.split(' ').length > 5) continue;
      
      seenNames.add(normalizedName);
      toolCandidates.push({
        name: toolName,
        url: result.url,
        description: result.description || '',
        markdown: result.markdown?.slice(0, 2000) || '',
      });
      
      if (toolCandidates.length >= 12) break;
    }

    console.log(`Found ${toolCandidates.length} tool candidates`);

    // Use Lovable AI to extract rich metadata for each tool
    const enrichedTools: WeeklyTool[] = [];
    
    for (const candidate of toolCandidates.slice(0, 5)) {
      try {
        const aiPrompt = `Analyze this developer tool and extract structured information.

Tool Name: ${candidate.name}
URL: ${candidate.url}
Description: ${candidate.description}
Content Preview: ${candidate.markdown}

Respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "description": "One sentence description of what this tool does",
  "longDescription": "2-3 sentence detailed description of the tool's purpose and features",
  "category": "one of: frontend, backend, devops, ai-ml, database, testing, mobile, security, productivity",
  "tags": ["array", "of", "relevant", "tags"],
  "useCases": ["Use case 1", "Use case 2", "Use case 3"],
  "techStackFit": ["Technology 1", "Technology 2"],
  "learningCurve": "low or medium or high",
  "communityActivity": "still-building or early-stage or active or very-active"
}`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [
              { role: 'system', content: 'You are a developer tools expert. Extract structured information about tools. Always respond with valid JSON only, no markdown formatting.' },
              { role: 'user', content: aiPrompt },
            ],
          }),
        });

        if (!aiResponse.ok) {
          console.error('AI response not ok for', candidate.name);
          continue;
        }

        const aiData = await aiResponse.json();
        const aiContent = aiData.choices?.[0]?.message?.content || '';
        
        // Parse AI response - clean up markdown code blocks if present
        let cleanContent = aiContent.trim();
        if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        
        const parsed = JSON.parse(cleanContent);
        
        enrichedTools.push({
          id: crypto.randomUUID(),
          name: candidate.name,
          description: parsed.description || candidate.description,
          longDescription: parsed.longDescription,
          url: candidate.url,
          githubUrl: candidate.url.includes('github.com') ? candidate.url : undefined,
          category: parsed.category || 'productivity',
          tags: parsed.tags || [],
          useCases: parsed.useCases || [],
          techStackFit: parsed.techStackFit || [],
          learningCurve: parsed.learningCurve || 'medium',
          communityActivity: parsed.communityActivity || 'active',
          source: 'firecrawl',
        });
        
        console.log('Enriched tool:', candidate.name);
      } catch (parseError) {
        console.error('Failed to enrich tool:', candidate.name, parseError);
        // Add with basic info if AI fails
        enrichedTools.push({
          id: crypto.randomUUID(),
          name: candidate.name,
          description: candidate.description || `A developer tool from ${candidate.url}`,
          url: candidate.url,
          githubUrl: candidate.url.includes('github.com') ? candidate.url : undefined,
          category: 'productivity',
          tags: [],
          useCases: ['Development workflow', 'Productivity'],
          techStackFit: [],
          learningCurve: 'medium',
          communityActivity: 'active',
          source: 'firecrawl',
        });
      }
    }

    console.log(`Returning ${enrichedTools.length} enriched weekly tools`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tools: enrichedTools,
        weekOf: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching weekly tools:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
