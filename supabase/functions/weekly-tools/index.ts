import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

interface PerplexityTool {
  name: string;
  category: string;
  description: string;
  url: string;
  creator: string;
}

async function discoverToolsWithPerplexity(apiKey: string): Promise<PerplexityTool[]> {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dateRange = `${weekAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: `You are a developer tools researcher. Find the most interesting NEW developer tools announced or released in the past week. Focus on tools that are genuinely useful for software developers.

IMPORTANT: Respond with ONLY a valid JSON array, no markdown, no code blocks, no explanation.`,
        },
        {
          role: 'user',
          content: `Find 10-15 new developer tools, frameworks, libraries, APIs, or AI models that were announced or released between ${dateRange}.

Search across: Hacker News, Product Hunt, GitHub trending, tech blogs (Vercel, OpenAI, Anthropic, Google, GitHub), developer newsletters (Console.dev, TLDR, Changelog), and Twitter/X developer community.

Focus on:
- New AI coding tools and agents
- New frameworks and libraries  
- New APIs and developer platforms
- New CLI tools and DevOps tools
- New database tools
- New testing frameworks
- AI model releases (GPT, Claude, Gemini, open-source models)

For each tool provide:
- name: exact tool name (1-3 words)
- category: one of "AI Model", "AI Agent", "CLI Tool", "API", "Framework", "Library", "IDE/Editor", "DevOps Tool", "UI/UX Tool", "Database", "Deployment Platform", "Testing Tool"
- description: one sentence about what it does
- url: official website or announcement URL
- creator: company or person who made it

Respond as a JSON array of objects. NO markdown formatting.`,
        },
      ],
      search_recency_filter: 'week',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Perplexity API error:', response.status, errText);
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  let cleanContent = content.trim();
  if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const tools = JSON.parse(cleanContent);
    return Array.isArray(tools) ? tools : tools.tools || [];
  } catch (e) {
    console.error('Failed to parse Perplexity response:', cleanContent.substring(0, 200));
    throw new Error('Failed to parse Perplexity tool discovery response');
  }
}

function deduplicateTools(tools: PerplexityTool[]) {
  const seen = new Map<string, boolean>();
  return tools.filter((tool) => {
    if (!tool.name) return false;
    const normalizedName = tool.name.toLowerCase().trim();
    if (seen.has(normalizedName)) return false;
    if (tool.name.split(' ').length > 4) return false;
    const genericNames = ['new tool', 'the tool', 'our tool', 'this tool', 'my tool', 'tool'];
    if (genericNames.includes(normalizedName)) return false;
    seen.set(normalizedName, true);
    return true;
  });
}

function mapCategory(category: string): string {
  const map: Record<string, string> = {
    'AI Model': 'ai-ml',
    'AI Agent': 'ai-ml',
    'CLI Tool': 'devops',
    'API': 'backend',
    'Framework': 'frontend',
    'Library': 'frontend',
    'IDE/Editor': 'productivity',
    'Extension': 'productivity',
    'DevOps Tool': 'devops',
    'UI/UX Tool': 'frontend',
    'Database': 'database',
    'Deployment Platform': 'devops',
    'Testing Tool': 'testing',
    'Other': 'productivity',
  };
  return map[category] || 'productivity';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');

    if (!perplexityKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Perplexity API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lovable AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Discovering tools with Perplexity...');
    const discoveredTools = await discoverToolsWithPerplexity(perplexityKey);
    console.log(`Perplexity found ${discoveredTools.length} tools`);

    const uniqueTools = deduplicateTools(discoveredTools);
    console.log(`${uniqueTools.length} unique tools after dedup`);

    const top5 = uniqueTools.slice(0, 5);
    const enrichedTools: WeeklyTool[] = [];

    for (const candidate of top5) {
      try {
        const aiPrompt = `Analyze this developer tool and extract structured information.

Tool Name: ${candidate.name}
Category: ${candidate.category}
Description: ${candidate.description}
Creator: ${candidate.creator || 'Unknown'}
URL: ${candidate.url || ''}

Respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "description": "One sentence description of what this tool does",
  "longDescription": "2-3 sentence detailed description of the tool's purpose and features",
  "category": "one of: frontend, backend, devops, ai-ml, database, testing, mobile, security, productivity",
  "tags": ["array", "of", "relevant", "tags"],
  "useCases": ["Use case 1", "Use case 2", "Use case 3"],
  "techStackFit": ["Technology 1", "Technology 2"],
  "learningCurve": "low or medium or high",
  "communityActivity": "still-building or early-stage or active or very-active",
  "url": "Official website URL for this tool",
  "githubUrl": "GitHub URL if it's open source, or null"
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
          console.error('AI enrichment failed for', candidate.name, aiResponse.status);
          continue;
        }

        const aiData = await aiResponse.json();
        const aiContent = aiData.choices?.[0]?.message?.content || '';

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
          url: parsed.url || candidate.url || `https://www.google.com/search?q=${encodeURIComponent(candidate.name + ' developer tool')}`,
          githubUrl: parsed.githubUrl || undefined,
          category: parsed.category || mapCategory(candidate.category),
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
        enrichedTools.push({
          id: crypto.randomUUID(),
          name: candidate.name,
          description: candidate.description || 'A developer tool',
          url: candidate.url || `https://www.google.com/search?q=${encodeURIComponent(candidate.name + ' developer tool')}`,
          category: mapCategory(candidate.category),
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
      JSON.stringify({ success: false, error: 'Failed to fetch weekly tools' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
