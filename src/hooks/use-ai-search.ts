import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category, Tag } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export interface DiscoveredTool {
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

interface UseAISearchResult {
  discoveredTools: DiscoveredTool[];
  isSearching: boolean;
  searchError: string | null;
  searchQuery: string | null;
  discoverTools: (category: Category | null, tags: Tag[], customQuery?: string) => Promise<void>;
  clearResults: () => void;
  hasActiveFilters: boolean;
}

export function useAISearch(
  selectedCategory: Category | null,
  selectedTags: Tag[]
): UseAISearchResult {
  const [discoveredTools, setDiscoveredTools] = useState<DiscoveredTool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { toast } = useToast();

  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0;

  const discoverTools = useCallback(async (
    category: Category | null,
    tags: Tag[],
    customQuery?: string
  ) => {
    if (!category && tags.length === 0 && !customQuery) {
      toast({
        title: "Select filters first",
        description: "Choose a category or tags to discover relevant tools.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const { data, error } = await supabase.functions.invoke('search-tools', {
        body: {
          category: category || undefined,
          tags: tags.length > 0 ? tags : undefined,
          searchQuery: customQuery,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      setDiscoveredTools(data.tools || []);
      setSearchQuery(data.query || null);

      if (data.tools?.length === 0) {
        toast({
          title: "No additional tools found",
          description: "Try different filter combinations.",
        });
      } else {
        toast({
          title: `Found ${data.tools.length} tools`,
          description: "Real-time results from across the web.",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search';
      setSearchError(message);
      toast({
        title: "Search failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const clearResults = useCallback(() => {
    setDiscoveredTools([]);
    setSearchQuery(null);
    setSearchError(null);
  }, []);

  return {
    discoveredTools,
    isSearching,
    searchError,
    searchQuery,
    discoverTools,
    clearResults,
    hasActiveFilters,
  };
}
