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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, tags, searchQuery } = await req.json() as SearchRequest;

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build a search query based on filters
    const queryParts: string[] = [];
    if (category) {
      queryParts.push(category.replace(/-/g, ' '));
    }
    if (tags && tags.length > 0) {
      queryParts.push(...tags.map(t => t.replace(/-/g, ' ')));
    }
    if (searchQuery) {
      queryParts.push(searchQuery);
    }
    
    const finalQuery = `best ${queryParts.join(' ')} developer tools 2025`;
    console.log('Searching for:', finalQuery);

    // Use Firecrawl's search API
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: finalQuery,
        limit: 10,
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed with status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse results into DiscoveredTool format
    const discoveredTools: DiscoveredTool[] = [];
    const results = data.data || [];
    
    for (const result of results) {
      if (!result.url || !result.title) continue;
      
      // Skip generic results that aren't tools
      const skipPatterns = ['linkedin.com', 'twitter.com', 'facebook.com', 'youtube.com'];
      if (skipPatterns.some(p => result.url.includes(p))) continue;
      
      const tool: DiscoveredTool = {
        id: crypto.randomUUID(),
        name: result.title.split(' - ')[0].split(' | ')[0].trim().slice(0, 50),
        description: result.description || result.title,
        url: result.url,
        githubUrl: result.url.includes('github.com') ? result.url : undefined,
        category: category || 'productivity',
        tags: tags || [],
        source: "firecrawl",
        citations: [result.url],
      };
      
      discoveredTools.push(tool);
    }

    console.log(`Found ${discoveredTools.length} tools`);

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
    const errorMessage = error instanceof Error ? error.message : 'Failed to search tools';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
