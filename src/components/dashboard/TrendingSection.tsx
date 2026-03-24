import { motion } from "framer-motion";
import { TrendingUp, ChevronRight } from "lucide-react";
import { DashboardToolCard } from "./DashboardToolCard";
import { Tool } from "@/lib/types";
import { categories } from "@/lib/data";

interface TrendingSectionProps {
  trending: Tool[];
  followedCategories: string[];
  isFavorite: (toolId: string) => boolean;
  onToggleFavorite: (toolId: string) => void;
  onToolClick: (tool: Tool) => void;
  onSeeAll: () => void;
}

export function TrendingSection({
  trending,
  followedCategories,
  isFavorite,
  onToggleFavorite,
  onToolClick,
  onSeeAll,
}: TrendingSectionProps) {
  if (trending.length === 0) return null;

  const headerCategory = followedCategories.length > 0
    ? categories.find((c) => c.id === followedCategories[0])?.name || "Your"
    : "All";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Trending in {headerCategory}
          </h2>
        </div>
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          See all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
        }}
      >
        {trending.slice(0, 4).map((tool) => (
          <motion.div
            key={tool.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <DashboardToolCard
              tool={tool}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(tool.id);
              }}
              onClick={() => onToolClick(tool)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
