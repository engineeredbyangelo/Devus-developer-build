import { useState, useEffect, useCallback } from "react";
import { Tool, Category, Tag } from "@/lib/types";
import { tools, searchTools, getToolsByCategory, getNewTools } from "@/lib/data";

interface UseToolsOptions {
  category?: Category;
  tag?: Tag;
  searchQuery?: string;
}

export function useTools(options: UseToolsOptions = {}) {
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    let result = tools;
    
    if (options.searchQuery) {
      result = searchTools(options.searchQuery);
    }
    
    if (options.category) {
      result = result.filter((tool) => tool.category === options.category);
    }
    
    if (options.tag) {
      result = result.filter((tool) => tool.tags.includes(options.tag));
    }
    
    // Simulate async for future backend compatibility
    setTimeout(() => {
      setFilteredTools(result);
      setIsLoading(false);
    }, 100);
  }, [options.category, options.tag, options.searchQuery]);

  return { tools: filteredTools, isLoading };
}

export function useTool(id: string) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const found = tools.find((t) => t.id === id);
    setTimeout(() => {
      setTool(found || null);
      setIsLoading(false);
    }, 100);
  }, [id]);

  return { tool, isLoading };
}

export function useNewTools() {
  const [newTools, setNewTools] = useState<Tool[]>([]);

  useEffect(() => {
    setNewTools(getNewTools());
  }, []);

  return newTools;
}

const FAVORITES_KEY = "devus-favorites";
const UPVOTES_KEY = "devus-upvotes";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => [...new Set([...prev, toolId])]);
  }, []);

  const removeFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== toolId));
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  }, []);

  const isFavorite = useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites]
  );

  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id));

  return {
    favorites,
    favoriteTools,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}

export function useUpvotes() {
  const [upvotes, setUpvotes] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem(UPVOTES_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const [userUpvoted, setUserUpvoted] = useState<string[]>(() => {
    const stored = localStorage.getItem(`${UPVOTES_KEY}-user`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(UPVOTES_KEY, JSON.stringify(upvotes));
  }, [upvotes]);

  useEffect(() => {
    localStorage.setItem(`${UPVOTES_KEY}-user`, JSON.stringify(userUpvoted));
  }, [userUpvoted]);

  const getUpvotes = useCallback(
    (toolId: string) => {
      const tool = tools.find((t) => t.id === toolId);
      const baseUpvotes = tool?.upvotes || 0;
      const additionalUpvotes = upvotes[toolId] || 0;
      return baseUpvotes + additionalUpvotes;
    },
    [upvotes]
  );

  const toggleUpvote = useCallback((toolId: string) => {
    if (userUpvoted.includes(toolId)) {
      setUserUpvoted((prev) => prev.filter((id) => id !== toolId));
      setUpvotes((prev) => ({
        ...prev,
        [toolId]: (prev[toolId] || 0) - 1,
      }));
    } else {
      setUserUpvoted((prev) => [...prev, toolId]);
      setUpvotes((prev) => ({
        ...prev,
        [toolId]: (prev[toolId] || 0) + 1,
      }));
    }
  }, [userUpvoted]);

  const hasUpvoted = useCallback(
    (toolId: string) => userUpvoted.includes(toolId),
    [userUpvoted]
  );

  return { getUpvotes, toggleUpvote, hasUpvoted };
}
