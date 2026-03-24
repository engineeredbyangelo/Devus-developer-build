import { useMemo } from "react";
import { tools, categories } from "@/lib/data";
import { Tool, Category } from "@/lib/types";

interface RecommendationResult {
  tool: Tool;
  reason: string;
}

export function useRecommendations(
  followedCategories: string[],
  favorites: string[]
): { recommendations: RecommendationResult[]; trending: Tool[] } {
  return useMemo(() => {
    const favoriteSet = new Set(favorites);

    // Gather tech stack from favorited tools
    const favoritedTools = tools.filter((t) => favoriteSet.has(t.id));
    const userTechStack = new Set<string>();
    favoritedTools.forEach((t) => {
      t.techStackFit?.forEach((ts) => userTechStack.add(ts.toLowerCase()));
    });

    // Score each non-favorited tool
    const scored = tools
      .filter((t) => !favoriteSet.has(t.id))
      .map((tool) => {
        let score = 0;
        let reason = "";

        // Category match
        if (followedCategories.includes(tool.category)) {
          score += 3;
          const catName = categories.find((c) => c.id === tool.category)?.name || tool.category;
          reason = `Matches your ${catName} stack`;
        }

        // Tech stack overlap
        const stackOverlap = tool.techStackFit?.filter((ts) =>
          userTechStack.has(ts.toLowerCase())
        );
        if (stackOverlap && stackOverlap.length > 0) {
          score += stackOverlap.length * 2;
          reason = `Complements your ${stackOverlap.slice(0, 2).join(" + ")} stack`;
        }

        // New tools bonus
        if (tool.isNew) {
          score += 2;
          if (!reason) reason = "New this week";
        }

        // High stars bonus
        if (tool.stars && tool.stars > 50000) {
          score += 1;
        }

        if (!reason) {
          reason = "Popular in the community";
        }

        return { tool, score, reason };
      })
      .sort((a, b) => b.score - a.score);

    const recommendations = scored.slice(0, 6).map(({ tool, reason }) => ({ tool, reason }));

    // Trending: top tools by stars in followed categories, or overall if none
    const trendingPool = followedCategories.length > 0
      ? tools.filter((t) => followedCategories.includes(t.category))
      : tools;

    const trending = [...trendingPool]
      .sort((a, b) => (b.stars || 0) - (a.stars || 0))
      .slice(0, 8);

    return { recommendations, trending };
  }, [followedCategories, favorites]);
}
