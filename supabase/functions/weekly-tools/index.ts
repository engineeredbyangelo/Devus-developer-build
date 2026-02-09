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

const SOURCES = [
  { name: 'hackernews', url: 'https://news.ycombinator.com/newest', type: 'listing' },
  { name: 'hackernews_show', url: 'https://news.ycombinator.com/show', type: 'listing' },
  { name: 'openai_blog', url: 'https://openai.com/blog', type: 'blog' },
  { name: 'anthropic_news', url: 'https://www.anthropic.com/news', type: 'blog' },
  { name: 'vercel_blog', url: 'https://vercel.com/blog', type: 'blog' },
  { name: 'github_blog', url: 'https://github.blog/category/engineering/', type: 'blog' },
  { name: 'console_dev', url: 'https://console.dev', type: 'aggregator' },
];

const TOOL_SCHEMA = {
  type: 'object',
  properties: {
    tools: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Exact tool name only - 1-3 words maximum (e.g. "Cursor", "v0", "Claude Opus 4")',
          },
          category: {
            type: 'string',
            enum: ['AI Model', 'CLI Tool', 'API', 'Framework', 'Library', 'IDE/Editor', 'Extension', 'DevOps Tool', 'UI/UX Tool', 'AI Agent', 'Database', 'Deployment Platform', 'Testing Tool', 'Other'],
          },
          description: {
            type: 'string',
            description: 'One sentence describing what it does',
          },
          announcementDate: {
            type: 'string',
            description: 'Date announced if mentioned (YYYY-MM-DD format)',
          },
          creator: {
            type: 'string',
            description: 'Company or creator name',
          },
          sourceUrl: {
            type: 'string',
            description: 'URL to the announcement',
          },
        },
        required: ['name', 'category', 'description'],
      },
    },
  },
  required: ['tools'],
};

const PROMPTS: Record<string, string> = {
  blog: `You are extracting ONLY newly announced developer tools from this page.

STRICT RULES:
- Extract ONLY tools that are being ANNOUNCED or RELEASED on this page
- Tool name must be 1-3 words maximum (e.g. "Cursor", "GitHub Copilot", "Claude Sonnet 4")
- Focus ONLY on developer tools: coding, programming, DevOps, AI/ML, UI/UX, frontend, backend, databases, deployment, testing, AI agents
- SKIP: tutorials, how-to guides, blog posts about existing tools, discussions, opinions, reviews, comparisons

INCLUDE ONLY:
✓ New product launches
✓ New model releases (e.g. GPT-5, Claude Opus 4)
✓ New framework/library releases
✓ New developer APIs
✓ New CLI tools
✓ New IDE/editor tools
✓ New DevOps platforms
✓ New AI agent frameworks

EXCLUDE:
✗ Tutorials ("How to use...")
✗ Discussions or forums
✗ Opinion pieces
✗ General news articles
✗ Non-developer tools (consumer apps, games, etc.)
✗ Updates to existing well-known tools (unless major version like 2.0)

Extract the exact tool name as it appears in the announcement.`,

  listing: `You are scanning a list of posts to find ONLY announcements of new developer tools.

STRICT RULES:
- Look for posts that ANNOUNCE or LAUNCH new tools
- Tool name must be 1-3 words maximum
- Focus ONLY on developer tools: coding, programming, DevOps, AI/ML, UI/UX, frontend, backend, databases, AI agents
- SKIP: "Show HN" projects that are not polished tools, tutorials, discussions, "Ask HN" posts

IDENTIFY posts with patterns like:
✓ "Introducing [Tool]"
✓ "Announcing [Tool]"
✓ "[Tool] - new [category] for developers"
✓ "We built [Tool]"
✓ "Launching [Tool]"
✓ "[Company] releases [Tool]"

SKIP posts like:
✗ "How to build..."
✗ "Why I switched to..."
✗ "Discussion: ..."
✗ "Ask HN: ..."
✗ Personal projects without clear product name
✗ Blog posts, articles, tutorials

Extract ONLY the tool name (1-3 words) from qualifying posts.`,

  aggregator: `You are extracting developer tools from a curated tools directory or newsletter.

STRICT RULES:
- Extract ONLY the tool name (1-3 words maximum)
- Focus ONLY on developer tools: coding, programming, DevOps, AI/ML, UI/UX, frontend, backend, databases, AI agents
- SKIP: consumer apps, games, productivity tools not for developers, design tools not for UI/UX work

Extract the exact tool name as listed.`,
};

async function scrapeWithFirecrawl(url: string, prompt: string, apiKey: string) {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['extract'],
        extract: { prompt, schema: TOOL_SCHEMA },
        timeout: 30000,
      }),
    });

    if (!response.ok) {
      console.error(`Firecrawl API error for ${url}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data?.data?.extract?.tools || [];
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return [];
  }
}

function deduplicateTools(tools: any[]) {
  const seen = new Map();
  return tools.filter((tool) => {
    const normalizedName = tool.name.toLowerCase().trim();
    if (seen.has(normalizedName)) return false;
    if (tool.name.split(' ').length > 4) return false;
    const genericNames = ['new tool', 'the tool', 'our tool', 'this tool', 'my tool', 'tool'];
    if (genericNames.includes(normalizedName)) return false;
    seen.set(normalizedName, true);
    return true;
  });
}

// Map Firecrawl categories to our app categories
function mapCategory(firecrawlCategory: string): string {
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
  return map[firecrawlCategory] || 'productivity';
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

    console.log('Starting curated source scrape...');

    // Scrape all sources in parallel
    const scrapePromises = SOURCES.map(async (source) => {
      console.log(`Scraping ${source.name}...`);
      const prompt = PROMPTS[source.type];
      const tools = await scrapeWithFirecrawl(source.url, prompt, firecrawlKey);
      return tools.map((tool: any) => ({
        ...tool,
        source: source.name,
        scrapedAt: new Date().toISOString(),
      }));
    });

    const results = await Promise.all(scrapePromises);
    const allTools: any[] = [];
    results.forEach((tools) => allTools.push(...tools));

    console.log(`Found ${allTools.length} tools before deduplication`);

    const uniqueTools = deduplicateTools(allTools);
    console.log(`${uniqueTools.length} unique tools after dedup`);

    // Take top 5 and enrich with Gemini
    const top5 = uniqueTools.slice(0, 5);
    const enrichedTools: WeeklyTool[] = [];

    for (const candidate of top5) {
      try {
        const aiPrompt = `Analyze this developer tool and extract structured information.

Tool Name: ${candidate.name}
Category: ${candidate.category}
Description: ${candidate.description}
Creator: ${candidate.creator || 'Unknown'}
Source URL: ${candidate.sourceUrl || ''}

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
  "url": "Official website URL for this tool (best guess if not provided)"
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
          console.error('AI response not ok for', candidate.name, aiResponse.status);
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
          url: parsed.url || candidate.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(candidate.name + ' developer tool')}`,
          githubUrl: undefined,
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
          description: candidate.description || `A developer tool`,
          url: candidate.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(candidate.name + ' developer tool')}`,
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
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
