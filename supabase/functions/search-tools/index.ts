import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface SearchRequest {
  category?: string;
  tags?: string[];
  searchQuery?: string;
}

interface DiscoveredTool {
  id: string;
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  category: string;
  tags: string[];
  source: "firecrawl";
  citations: string[];
}

// Domains to skip - articles, blogs, listicles, social media
const skipDomains = [
  // Social media
  'linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'youtube.com', 'instagram.com',
  // Blog/article platforms
  'medium.com', 'dev.to', 'hashnode.dev', 'substack.com', 'wordpress.com', 'blogger.com',
  // News/content sites
  'reddit.com', 'news.ycombinator.com', 'techcrunch.com', 'wired.com', 'theverge.com',
  'zdnet.com', 'cnet.com', 'infoworld.com', 'venturebeat.com',
  // Aggregator/comparison sites
  'g2.com', 'capterra.com', 'alternativeto.com', 'slant.co', 'trustradius.com', 'getapp.com',
  'softwareadvice.com', 'sourceforge.net/software',
  // Listicle/roadmap sites
  'roadmap.sh', 'stackshare.io/stacks', 'tooljet.com/blog',
  // Q&A / Forums
  'stackoverflow.com', 'quora.com', 'stackexchange.com',
];

// URL patterns to skip - blog paths, listicle patterns
const skipPatterns = [
  '/blog/', '/articles/', '/news/', '/best-', '/top-', '/posts/',
  '/comparing/', '/vs/', '/comparison/', '/alternatives/',
  'awesome-list', 'awesome-', '-awesome',
];

// Quality tool sources to prioritize
const prioritySites = [
  'github.com',
  'producthunt.com',
  'npmjs.com',
  'pypi.org',
];

// Extract clean tool name from URL and title
function extractToolName(url: string, title: string): string {
  if (url.includes('github.com')) {
    const repoMatch = url.match(/github\.com\/[\w-]+\/([\w-]+)/);
    if (repoMatch) {
      const repoName = repoMatch[1];
      return repoName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
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
  
  return title
    .split(' - ')[0]
    .split(' | ')[0]
    .split(':')[0]
    .replace(/^\d+\.\s*/, '')
    .trim()
    .slice(0, 50);
}

function shouldSkipUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  if (skipDomains.some(domain => lowerUrl.includes(domain))) {
    return true;
  }
  if (skipPatterns.some(pattern => lowerUrl.includes(pattern))) {
    return true;
  }
  return false;
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

    const { category, tags, searchQuery } = await req.json() as SearchRequest;

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const siteQuery = prioritySites.map(s => `site:${s}`).join(' OR ');
    
    const filterParts: string[] = [];
    if (category) {
      filterParts.push(category.replace(/-/g, ' '));
    }
    if (tags && tags.length > 0) {
      filterParts.push(...tags.map(t => t.replace(/-/g, ' ')));
    }
    if (searchQuery) {
      filterParts.push(searchQuery);
    }
    
    const filterString = filterParts.join(' ');
    const toolTerms = 'developer tool OR programming tool OR coding tool OR CLI OR SDK OR framework OR library';
    const finalQuery = `(${siteQuery}) ${filterString} (${toolTerms}) -"best tools" -"top tools" -"list of"`;
    console.log('Searching for:', finalQuery);

    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: finalQuery,
        limit: 15,
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: 'Search service error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const discoveredTools: DiscoveredTool[] = [];
    const results = data.data || [];
    const seenNames = new Set<string>();
    
    for (const result of results) {
      if (!result.url || !result.title) continue;
      if (shouldSkipUrl(result.url)) continue;
      
      const toolName = extractToolName(result.url, result.title);
      const normalizedName = toolName.toLowerCase();
      if (seenNames.has(normalizedName)) continue;
      seenNames.add(normalizedName);
      
      if (toolName.split(' ').length > 5) continue;
      
      const tool: DiscoveredTool = {
        id: crypto.randomUUID(),
        name: toolName,
        description: result.description || `A ${category || 'developer'} tool`,
        url: result.url,
        githubUrl: result.url.includes('github.com') ? result.url : undefined,
        category: category || 'productivity',
        tags: tags || [],
        source: "firecrawl",
        citations: [result.url],
      };
      
      discoveredTools.push(tool);
      if (discoveredTools.length >= 8) break;
    }

    console.log(`Found ${discoveredTools.length} tools after filtering`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tools: discoveredTools,
        query: finalQuery,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching tools:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to search tools' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
