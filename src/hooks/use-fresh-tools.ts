import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FreshTool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  source: "firecrawl";
  discoveredAt: string;
}

interface UseFreshToolsResult {
  freshTools: FreshTool[];
  isLoading: boolean;
  error: string | null;
  discoverFresh: (category?: string) => Promise<void>;
  clearFresh: () => void;
}

export function useFreshTools(): UseFreshToolsResult {
  const [freshTools, setFreshTools] = useState<FreshTool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discoverFresh = useCallback(async (category?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("discover-fresh-tools", {
        body: { category, limit: 12 },
      });

      if (fnError) throw fnError;

      if (data?.success && data.tools) {
        setFreshTools(data.tools);
        toast({ title: "Fresh tools found!", description: `Discovered ${data.tools.length} new tools.` });
      } else {
        throw new Error(data?.error || "No tools returned");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to discover tools";
      setError(msg);
      toast({ title: "Discovery failed", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearFresh = useCallback(() => {
    setFreshTools([]);
    setError(null);
  }, []);

  return { freshTools, isLoading, error, discoverFresh, clearFresh };
}
