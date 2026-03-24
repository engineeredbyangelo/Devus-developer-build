import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CATEGORY_QUERIES: Record<string, string> = {
  'ai-ml': 'new AI developer tools released this week',
  'frontend': 'new frontend developer tools and frameworks 2026',
  'backend': 'new backend frameworks and tools for developers',
  'devops': 'new DevOps tools and CI/CD platforms',
  'database': 'new database tools and ORMs for developers',
  'testing': 'new testing frameworks and developer tools',
  'default': 'new developer tools released this week trending GitHub',
};

interface FreshTool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  source: 'firecrawl';
  discoveredAt: string;
}

function extractToolName(url: string, title: string): string {
  try {
    const u = new URL(url);
    if (u.hostname === 'github.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) return parts[1];
    }
  } catch {}
  return title.split(/[|\-–—:]/)[0].trim().slice(0, 40);
}

const skipDomains = ['reddit.com', 'twitter.com', 'x.com', 'youtube.com', 'medium.com', 'stackoverflow.com', 'wikipedia.org'];

function shouldSkip(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return skipDomains.some(d => hostname.includes(d));
  } catch {
    return true;
  }
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

    const { category, limit = 10 } = await req.json();
    
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const query = CATEGORY_QUERIES[category] || CATEGORY_QUERIES['default'];
    console.log('Discovering fresh tools:', query);

    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit: Math.min(limit, 20),
        tbs: 'qdr:w',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl error:', data);
      return new Response(
        JSON.stringify({ success: false, error: 'Discovery service error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = data.data || [];
    const seen = new Set<string>();
    const tools: FreshTool[] = [];

    for (const r of results) {
      if (!r.url || shouldSkip(r.url)) continue;
      const name = extractToolName(r.url, r.title || '');
      const normalized = name.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);

      tools.push({
        id: crypto.randomUUID(),
        name,
        description: r.description || r.title || '',
        url: r.url,
        category: category || 'general',
        tags: [],
        source: 'firecrawl',
        discoveredAt: new Date().toISOString(),
      });
    }

    console.log(`Found ${tools.length} fresh tools`);
    return new Response(
      JSON.stringify({ success: true, tools: tools.slice(0, limit) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
