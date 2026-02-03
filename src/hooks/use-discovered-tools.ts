import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tool, Category, Tag } from "@/lib/types";

interface DiscoveredTool extends Tool {
  ai_generated?: boolean;
  approved?: boolean;
  discovered_by?: string;
}

interface UseDiscoveredToolsReturn {
  discoveredTools: DiscoveredTool[];
  isDiscovering: boolean;
  error: string | null;
  discoverTools: (query: string, category?: Category | null) => Promise<void>;
  saveToolToCollection: (tool: DiscoveredTool) => Promise<boolean>;
  clearResults: () => void;
}

export function useDiscoveredTools(): UseDiscoveredToolsReturn {
  const [discoveredTools, setDiscoveredTools] = useState<DiscoveredTool[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const discoverTools = async (query: string, category?: Category | null) => {
    setIsDiscovering(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discover-tools`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ query, category }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          setError("Rate limit reached. Please try again in a moment.");
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please wait a moment.",
            variant: "destructive",
          });
          return;
        }
        
        if (response.status === 402) {
          setError("AI credits depleted. Please add credits to continue.");
          toast({
            title: "Credits Required",
            description: "Please add AI credits to continue discovering tools.",
            variant: "destructive",
          });
          return;
        }
        
        throw new Error(errorData.error || "Failed to discover tools");
      }

      const data = await response.json();
      
      // Validate and transform the tools to match our Tool type
      const validatedTools: DiscoveredTool[] = (data.tools || []).map((tool: any) => ({
        id: tool.id || `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: tool.name,
        description: tool.description,
        longDescription: tool.longDescription,
        category: tool.category as Category,
        tags: (tool.tags || []).filter((tag: string) => 
          ["open-source", "free", "freemium", "paid", "self-hosted", "cloud", "cli", "gui", "api", "new"].includes(tag)
        ) as Tag[],
        url: tool.url,
        githubUrl: tool.githubUrl,
        useCases: tool.useCases || [],
        techStackFit: tool.techStackFit || [],
        learningCurve: tool.learningCurve,
        communityActivity: tool.communityActivity,
        upvotes: 0,
        isNew: true,
        createdAt: new Date().toISOString(),
        ai_generated: true,
        approved: false,
      }));

      setDiscoveredTools(validatedTools);
      
      if (validatedTools.length === 0) {
        toast({
          title: "No tools found",
          description: "Try a different search query or category.",
        });
      }
    } catch (err) {
      console.error("Tool discovery error:", err);
      const message = err instanceof Error ? err.message : "Failed to discover tools";
      setError(message);
      toast({
        title: "Discovery Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const saveToolToCollection = async (tool: DiscoveredTool): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save tools to your collection.",
          variant: "destructive",
        });
        return false;
      }

      const { error: insertError } = await supabase
        .from("discovered_tools")
        .insert({
          name: tool.name,
          description: tool.description,
          long_description: tool.longDescription,
          category: tool.category,
          tags: tool.tags,
          url: tool.url,
          github_url: tool.githubUrl,
          use_cases: tool.useCases,
          tech_stack_fit: tool.techStackFit,
          learning_curve: tool.learningCurve,
          community_activity: tool.communityActivity,
          ai_generated: true,
          approved: false,
          discovered_by: user.id,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Tool saved!",
        description: `${tool.name} has been added to your collection.`,
      });
      
      return true;
    } catch (err) {
      console.error("Save tool error:", err);
      toast({
        title: "Save failed",
        description: "Could not save the tool. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearResults = () => {
    setDiscoveredTools([]);
    setError(null);
  };

  return {
    discoveredTools,
    isDiscovering,
    error,
    discoverTools,
    saveToolToCollection,
    clearResults,
  };
}
