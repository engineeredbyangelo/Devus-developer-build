import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, format } from "date-fns";

export interface WeeklyTool {
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

interface WeeklyToolsCache {
  week_start_date: string;
  tools_data: WeeklyTool[];
}

export function useWeeklyTools() {
  const [tools, setTools] = useState<WeeklyTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOf, setWeekOf] = useState<string>("");

  useEffect(() => {
    async function fetchWeeklyTools() {
      setIsLoading(true);
      setError(null);

      try {
        // Get start of current week (Monday)
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekStartStr = format(weekStart, "yyyy-MM-dd");
        setWeekOf(format(weekStart, "MMMM d, yyyy"));

        // Check cache first
        const { data: cached, error: cacheError } = await supabase
          .from("weekly_tools_cache")
          .select("tools_data")
          .eq("week_start_date", weekStartStr)
          .single();

        if (cached && !cacheError) {
          console.log("Using cached weekly tools");
          // The tools_data is stored as JSONB, so we need to cast it properly
          const toolsData = cached.tools_data as unknown as WeeklyTool[];
          setTools(toolsData);
          setIsLoading(false);
          return;
        }

        console.log("Fetching fresh weekly tools");
        
        // Fetch from edge function
        const { data: functionData, error: functionError } = await supabase.functions.invoke(
          "weekly-tools",
          { body: {} }
        );

        if (functionError) {
          throw new Error(functionError.message);
        }

        if (!functionData?.success) {
          throw new Error(functionData?.error || "Failed to fetch weekly tools");
        }

        const freshTools = functionData.tools as WeeklyTool[];
        setTools(freshTools);

        // Cache the results - use type assertion for JSONB field
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cacheData: any = {
            week_start_date: weekStartStr,
            tools_data: freshTools,
          };
          
          const { error: upsertError } = await supabase
            .from("weekly_tools_cache")
            .upsert(cacheData, { onConflict: "week_start_date" });
          
          if (upsertError) {
            console.warn("Failed to cache weekly tools:", upsertError);
          } else {
            console.log("Cached weekly tools successfully");
          }
        } catch (cacheWriteError) {
          console.warn("Failed to cache weekly tools:", cacheWriteError);
        }
      } catch (err) {
        console.error("Error fetching weekly tools:", err);
        setError(err instanceof Error ? err.message : "Failed to load weekly tools");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeeklyTools();
  }, []);

  return { tools, isLoading, error, weekOf };
}
