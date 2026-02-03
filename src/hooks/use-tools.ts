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

// Legacy localStorage-based favorites (for unauthenticated users)
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

// Supabase-backed favorites for authenticated users
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useFavoritesDb() {
  const { user, profile, refreshProfile } = useAuth();
  
  // Fallback to localStorage for unauthenticated
  const [localFavorites, setLocalFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Sync localStorage to profile on login
  useEffect(() => {
    if (user && profile && localFavorites.length > 0) {
      const profileFavorites = profile.favorites || [];
      const mergedFavorites = [...new Set([...profileFavorites, ...localFavorites])];
      
      if (mergedFavorites.length > profileFavorites.length) {
        supabase
          .from("profiles")
          .update({ favorites: mergedFavorites })
          .eq("id", user.id)
          .then(() => {
            refreshProfile();
            localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
            setLocalFavorites([]);
          });
      }
    }
  }, [user, profile]);

  const favorites = user ? (profile?.favorites || []) : localFavorites;
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id));

  const toggleFavorite = useCallback(async (toolId: string) => {
    if (!user) {
      // Use localStorage for unauthenticated
      setLocalFavorites((prev) => {
        const newFavorites = prev.includes(toolId)
          ? prev.filter((id) => id !== toolId)
          : [...prev, toolId];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        return newFavorites;
      });
      return;
    }

    const currentFavorites = profile?.favorites || [];
    const newFavorites = currentFavorites.includes(toolId)
      ? currentFavorites.filter((id) => id !== toolId)
      : [...currentFavorites, toolId];

    await supabase
      .from("profiles")
      .update({ favorites: newFavorites })
      .eq("id", user.id);

    await refreshProfile();
  }, [user, profile, refreshProfile]);

  const isFavorite = useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites]
  );

  return {
    favorites,
    favoriteTools,
    toggleFavorite,
    isFavorite,
  };
}

// Supabase-backed followed categories
export function useFollowedCategoriesDb() {
  const { user, profile, refreshProfile } = useAuth();
  
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  const followedCategories = user 
    ? (profile?.followed_categories || []) 
    : localCategories;
  
  const categoryTools = tools.filter((tool) => 
    followedCategories.includes(tool.category)
  );

  const toggleCategory = useCallback(async (categoryId: string) => {
    if (!user) {
      setLocalCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
      return;
    }

    const currentCategories = profile?.followed_categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    await supabase
      .from("profiles")
      .update({ followed_categories: newCategories })
      .eq("id", user.id);

    await refreshProfile();
  }, [user, profile, refreshProfile]);

  return {
    followedCategories,
    categoryTools,
    toggleCategory,
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
