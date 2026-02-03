import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const toolDiscoverySchema = {
  type: "function",
  function: {
    name: "discover_developer_tools",
    description: "Discover and return developer tools matching the search query. Return real, existing tools that developers actually use.",
    parameters: {
      type: "object",
      properties: {
        tools: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { 
                type: "string",
                description: "The official name of the tool"
              },
              description: { 
                type: "string",
                description: "A concise description under 100 characters"
              },
              longDescription: { 
                type: "string",
                description: "A detailed description of 2-3 sentences"
              },
              category: { 
                type: "string", 
                enum: ["frontend", "backend", "devops", "ai-ml", "database", "testing", "mobile", "security", "productivity"]
              },
              tags: { 
                type: "array", 
                items: { 
                  type: "string",
                  enum: ["open-source", "free", "freemium", "paid", "self-hosted", "cloud", "cli", "gui", "api", "new"]
                }
              },
              url: { 
                type: "string",
                description: "The official website URL"
              },
              githubUrl: { 
                type: "string",
                description: "GitHub repository URL if open source"
              },
              useCases: { 
                type: "array", 
                items: { type: "string" },
                description: "3-4 specific use cases"
              },
              techStackFit: { 
                type: "array", 
                items: { type: "string" },
                description: "4-6 compatible technologies"
              },
              learningCurve: { 
                type: "string", 
                enum: ["low", "medium", "high"]
              },
              communityActivity: { 
                type: "string", 
                enum: ["low", "moderate", "active", "very-active"]
              }
            },
            required: ["name", "description", "category", "url", "tags", "useCases", "techStackFit", "learningCurve", "communityActivity"]
          }
        }
      },
      required: ["tools"]
    }
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const searchContext = category 
      ? `Find developer tools in the "${category}" category. ${query || ''}`
      : query || "Find trending developer tools released in the last year";

    const systemPrompt = `You are a developer tools expert. Your job is to discover and recommend real, existing developer tools that match the user's query.

CRITICAL RULES:
1. Only return REAL tools that actually exist and are actively maintained
2. Include accurate URLs - verify the tool exists at the URL you provide
3. Prioritize tools that are:
   - Recently released or updated (2024-2025)
   - Have active communities
   - Solve real developer problems
4. Include a mix of well-known and lesser-known gems
5. Return 3-5 tools per query

For each tool, provide complete and accurate information including use cases, tech stack compatibility, and learning curve assessment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: searchContext }
        ],
        tools: [toolDiscoverySchema],
        tool_choice: { type: "function", function: { name: "discover_developer_tools" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    
    // Extract tools from tool call response
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "discover_developer_tools") {
      return new Response(
        JSON.stringify({ error: "Invalid AI response format", tools: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const toolsData = JSON.parse(toolCall.function.arguments);
    
    // Add unique IDs to each tool
    const toolsWithIds = toolsData.tools.map((tool: any, index: number) => ({
      ...tool,
      id: `ai-${Date.now()}-${index}`,
      upvotes: 0,
      isNew: true,
      createdAt: new Date().toISOString()
    }));

    return new Response(
      JSON.stringify({ tools: toolsWithIds }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("discover-tools error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
