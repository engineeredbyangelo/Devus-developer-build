const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');

interface Source {
  name: string;
  url: string;
  type: 'aggregator' | 'listing' | 'blog' | 'reddit';
  priority: 'high' | 'medium';
}

interface ScrapedTool {
  name: string;
  category: string;
  description: string;
  announcementDate?: string;
  creator?: string;
  version?: string;
  sourceUrl?: string;
  sourceName: string;
}

const SOURCES: Source[] = [
  // High priority
  { name: 'console_dev', url: 'https://console.dev/tools', type: 'aggregator', priority: 'high' },
  { name: 'devhunt', url: 'https://devhunt.org', type: 'aggregator', priority: 'high' },
  { name: 'hackernews_show', url: 'https://news.ycombinator.com/show', type: 'listing', priority: 'high' },
  { name: 'openai_blog', url: 'https://openai.com/blog', type: 'blog', priority: 'high' },
  { name: 'anthropic_news', url: 'https://www.anthropic.com/news', type: 'blog', priority: 'high' },
  { name: 'vercel_blog', url: 'https://vercel.com/blog', type: 'blog', priority: 'high' },
  { name: 'github_blog', url: 'https://github.blog/category/engineering/', type: 'blog', priority: 'high' },
  { name: 'supabase_blog', url: 'https://supabase.com/blog', type: 'blog', priority: 'high' },
  // Medium priority
  { name: 'huggingface_blog', url: 'https://huggingface.co/blog', type: 'blog', priority: 'medium' },
  { name: 'reddit_programming', url: 'https://www.reddit.com/r/programming/new/.json?limit=50', type: 'reddit', priority: 'medium' },
  { name: 'dev_to', url: 'https://dev.to/t/showdev/latest', type: 'listing', priority: 'medium' },
  { name: 'stackshare_new', url: 'https://stackshare.io/tools/new', type: 'aggregator', priority: 'medium' },
];

const TOOL_SCHEMA = {
  type: 'object',
  properties: {
    tools: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'EXACT tool name ONLY - maximum 3 words' },
          category: {
            type: 'string',
            enum: ['AI Model', 'Code Editor', 'CLI Tool', 'API Platform', 'Framework', 'Library', 'Extension', 'DevOps', 'Database', 'Deployment', 'Testing', 'AI Agent', 'UI/UX Tool', 'No-Code/Low-Code', 'Other'],
          },
          description: { type: 'string', description: 'One concise sentence describing what it does' },
          announcementDate: { type: 'string', description: 'Date announced (YYYY-MM-DD)' },
          creator: { type: 'string', description: 'Company or creator name' },
          version: { type: 'string', description: 'Version number if applicable' },
          sourceUrl: { type: 'string', description: 'Direct URL to the announcement or tool page' },
        },
        required: ['name', 'category', 'description'],
      },
    },
  },
  required: ['tools'],
};

const EXTRACTION_PROMPTS: Record<string, string> = {
  aggregator: `Extract NEWLY LISTED developer tools from this curated directory.

STRICT EXTRACTION RULES:
- Tool name: EXACT name as listed, 1-3 words maximum
- ONLY developer tools: coding, AI/ML, DevOps, APIs, databases, deployment, testing, UI/UX for developers
- SKIP: consumer apps, productivity tools not for developers, games, non-technical products

CATEGORIES TO FOCUS ON:
✓ AI Models, Code Editors/IDEs, CLI Tools, Frameworks, APIs, DevOps, AI Agents, No-Code/Low-Code

EXTRACT: Exact tool name, Category, Brief description, Creator/company, Version if specified`,

  blog: `Extract developer tool ANNOUNCEMENTS from this blog post or page.

STRICT RULES:
- ONLY extract tools being ANNOUNCED, RELEASED, or LAUNCHED
- Tool name must be 1-3 words
- SKIP tutorials, how-tos, opinion pieces, general discussions

ANNOUNCEMENT PATTERNS TO DETECT:
✓ "Introducing [Tool]", "Announcing [Tool]", "Today we're launching [Tool]"
✓ "[Tool] is now available", "[Company] releases [Tool]"

EXCLUDE:
✗ Feature updates to existing well-known tools
✗ Tutorials, opinion pieces, or comparisons
✗ General company news

Extract ONLY the tool name as announced (exact wording).`,

  listing: `Extract developer tools or projects from this listing page.

STRICT RULES:
- ONLY extract actual tools, libraries, frameworks, or developer projects
- Tool name: 1-3 words maximum, exact as listed
- SKIP: blog posts, articles, discussions, questions, job postings

FOCUS ON:
✓ Show HN posts that are tools/libraries/frameworks
✓ New open-source projects
✓ Developer utilities and platforms

Extract: Tool name, Category, One-line description, Creator if shown, URL if available`,

  reddit: `Extract developer tool announcements or launches from these Reddit posts.

STRICT RULES:
- ONLY posts announcing NEW tools, libraries, or frameworks
- Tool name: 1-3 words, exact as mentioned
- SKIP: questions, discussions, memes, job posts, tutorials

FOCUS ON:
✓ "[Launch]" or "I built" or "Just released" posts
✓ New open-source project announcements
✓ Tool release announcements

Extract: Tool name, Category, Brief description, Creator/poster`,
};

// Scrape a single source via Firecrawl
async function scrapeSource(source: Source): Promise<ScrapedTool[]> {
  if (!FIRECRAWL_API_KEY) throw new Error('FIRECRAWL_API_KEY not configured');

  // Reddit JSON endpoint doesn't need Firecrawl
  if (source.type === 'reddit') {
    return scrapeReddit(source);
  }

  const prompt = EXTRACTION_PROMPTS[source.type] || EXTRACTION_PROMPTS.listing;

  try {
    console.log(`Scraping ${source.name}: ${source.url}`);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: source.url,
        formats: ['extract'],
        extract: { schema: TOOL_SCHEMA, prompt },
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Firecrawl error for ${source.name}: ${response.status}`, errText);
      return [];
    }

    const data = await response.json();
    const extractData = data?.data?.extract || data?.extract;

    if (!extractData?.tools || !Array.isArray(extractData.tools)) {
      console.warn(`No tools extracted from ${source.name}`);
      return [];
    }

    console.log(`Extracted ${extractData.tools.length} tools from ${source.name}`);

    return extractData.tools.map((t: any) => ({
      name: t.name,
      category: t.category || 'Other',
      description: t.description || '',
      announcementDate: t.announcementDate,
      creator: t.creator,
      version: t.version,
      sourceUrl: t.sourceUrl,
      sourceName: source.name,
    }));
  } catch (err) {
    console.error(`Failed to scrape ${source.name}:`, err);
    return [];
  }
}

// Handle Reddit's JSON API directly
async function scrapeReddit(source: Source): Promise<ScrapedTool[]> {
  try {
    console.log(`Fetching Reddit: ${source.url}`);
    const response = await fetch(source.url, {
      headers: { 'User-Agent': 'DevusBot/1.0' },
    });

    if (!response.ok) {
      console.error(`Reddit fetch failed: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data?.data?.children || [];

    const tools: ScrapedTool[] = [];
    const launchPatterns = /\b(launched?|releas(?:ed?|ing)|built|introducing|announcing|open[- ]?sourc)/i;

    for (const post of posts) {
      const { title, selftext, url, author } = post.data || {};
      if (!title || !launchPatterns.test(title + ' ' + (selftext || ''))) continue;

      // Extract a tool name from the title (first few words before a dash/colon/pipe)
      const nameMatch = title.match(/^(?:Show HN:\s*)?(?:\[.*?\]\s*)?(.+?)(?:\s*[-–—:|]|\s*-\s)/);
      const name = nameMatch ? nameMatch[1].trim().slice(0, 40) : title.slice(0, 40);

      tools.push({
        name,
        category: 'Other',
        description: title,
        sourceUrl: url,
        creator: author,
        sourceName: source.name,
      });
    }

    console.log(`Found ${tools.length} potential tools from Reddit`);
    return tools;
  } catch (err) {
    console.error('Reddit scrape failed:', err);
    return [];
  }
}

// Deduplicate by normalized name
function deduplicateTools(tools: ScrapedTool[]): ScrapedTool[] {
  const seen = new Map<string, ScrapedTool>();

  for (const tool of tools) {
    if (!tool.name) continue;
    const key = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (key.length < 2) continue;

    const genericNames = ['newtool', 'thetool', 'ourtool', 'thistool', 'mytool', 'tool', 'untitled'];
    if (genericNames.includes(key)) continue;
    if (tool.name.split(/\s+/).length > 4) continue;

    // Prefer high-priority sources
    if (!seen.has(key)) {
      seen.set(key, tool);
    }
  }

  return Array.from(seen.values());
}

// Map raw categories to our app categories
function mapCategory(category: string): string {
  const map: Record<string, string> = {
    'AI Model': 'ai-ml',
    'AI Agent': 'ai-ml',
    'Code Editor': 'productivity',
    'CLI Tool': 'devops',
    'API Platform': 'backend',
    'Framework': 'frontend',
    'Library': 'frontend',
    'Extension': 'productivity',
    'DevOps': 'devops',
    'Database': 'database',
    'Deployment': 'devops',
    'Testing': 'testing',
    'UI/UX Tool': 'frontend',
    'No-Code/Low-Code': 'productivity',
    'Other': 'productivity',
  };
  return map[category] || 'productivity';
}

// Enrich tools with Lovable AI (Gemini)
async function enrichTools(tools: ScrapedTool[], lovableKey: string) {
  const enriched = [];

  for (const tool of tools) {
    try {
      const aiPrompt = `Analyze this developer tool and extract structured information.

Tool Name: ${tool.name}
Category: ${tool.category}
Description: ${tool.description}
Creator: ${tool.creator || 'Unknown'}
URL: ${tool.sourceUrl || ''}

Respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "description": "One sentence description",
  "longDescription": "2-3 sentence detailed description",
  "category": "one of: frontend, backend, devops, ai-ml, database, testing, mobile, security, productivity",
  "tags": ["tag1", "tag2"],
  "useCases": ["Use case 1", "Use case 2", "Use case 3"],
  "techStackFit": ["Tech 1", "Tech 2"],
  "learningCurve": "low or medium or high",
  "communityActivity": "still-building or early-stage or active or very-active",
  "url": "Official website URL",
  "githubUrl": "GitHub URL if open source, or null"
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
            { role: 'system', content: 'You are a developer tools expert. Respond with valid JSON only.' },
            { role: 'user', content: aiPrompt },
          ],
        }),
      });

      if (!aiResponse.ok) {
        console.error(`AI enrichment failed for ${tool.name}:`, aiResponse.status);
        continue;
      }

      const aiData = await aiResponse.json();
      let content = (aiData.choices?.[0]?.message?.content || '').trim();
      if (content.startsWith('```')) {
        content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      const parsed = JSON.parse(content);

      enriched.push({
        id: crypto.randomUUID(),
        name: tool.name,
        description: parsed.description || tool.description,
        longDescription: parsed.longDescription,
        url: parsed.url || tool.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(tool.name + ' developer tool')}`,
        githubUrl: parsed.githubUrl || undefined,
        category: parsed.category || mapCategory(tool.category),
        tags: parsed.tags || [],
        useCases: parsed.useCases || [],
        techStackFit: parsed.techStackFit || [],
        learningCurve: parsed.learningCurve || 'medium',
        communityActivity: parsed.communityActivity || 'active',
        source: 'firecrawl',
        creator: tool.creator,
        version: tool.version,
        announcementDate: tool.announcementDate,
        scrapedFrom: tool.sourceName,
      });

      console.log(`Enriched: ${tool.name}`);
    } catch (err) {
      console.error(`Enrichment parse error for ${tool.name}:`, err);
      enriched.push({
        id: crypto.randomUUID(),
        name: tool.name,
        description: tool.description || 'A developer tool',
        url: tool.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(tool.name + ' developer tool')}`,
        category: mapCategory(tool.category),
        tags: [],
        useCases: ['Development workflow'],
        techStackFit: [],
        learningCurve: 'medium',
        communityActivity: 'active',
        source: 'firecrawl',
        creator: tool.creator,
        scrapedFrom: tool.sourceName,
      });
    }
  }

  return enriched;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lovable AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse options from request body
    let maxTools = 10;
    let priorityFilter: 'all' | 'high' | 'medium' = 'all';
    try {
      const body = await req.json();
      maxTools = body.maxTools || 10;
      priorityFilter = body.priority || 'all';
    } catch {
      // Empty body is fine, use defaults
    }

    // Filter sources by priority
    const sourcesToScrape = priorityFilter === 'all'
      ? SOURCES
      : SOURCES.filter(s => s.priority === priorityFilter);

    console.log(`Scraping ${sourcesToScrape.length} sources (priority: ${priorityFilter})...`);

    // Scrape all sources in parallel (batch high-priority first)
    const highPriority = sourcesToScrape.filter(s => s.priority === 'high');
    const mediumPriority = sourcesToScrape.filter(s => s.priority === 'medium');

    // Run high-priority in parallel
    const highResults = await Promise.allSettled(highPriority.map(scrapeSource));
    const highTools = highResults
      .filter((r): r is PromiseFulfilledResult<ScrapedTool[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);

    console.log(`High-priority sources yielded ${highTools.length} raw tools`);

    // Run medium-priority in parallel
    const medResults = await Promise.allSettled(mediumPriority.map(scrapeSource));
    const medTools = medResults
      .filter((r): r is PromiseFulfilledResult<ScrapedTool[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);

    console.log(`Medium-priority sources yielded ${medTools.length} raw tools`);

    // Combine and deduplicate (high-priority tools first for preference)
    const allTools = [...highTools, ...medTools];
    const uniqueTools = deduplicateTools(allTools);
    console.log(`${uniqueTools.length} unique tools after dedup`);

    // Take top N and enrich
    const topTools = uniqueTools.slice(0, maxTools);
    const enrichedTools = await enrichTools(topTools, lovableKey);

    console.log(`Returning ${enrichedTools.length} enriched tools from ${sourcesToScrape.length} sources`);

    return new Response(
      JSON.stringify({
        success: true,
        tools: enrichedTools,
        metadata: {
          sourcesScraped: sourcesToScrape.length,
          rawToolsFound: allTools.length,
          uniqueTools: uniqueTools.length,
          enrichedTools: enrichedTools.length,
          scrapedAt: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-dev-tools:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
