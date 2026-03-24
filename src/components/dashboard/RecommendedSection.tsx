import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";
import { DashboardToolCard } from "./DashboardToolCard";
import { Tool } from "@/lib/types";

interface RecommendationItem {
  tool: Tool;
  reason: string;
}

interface RecommendedSectionProps {
  recommendations: RecommendationItem[];
  isFavorite: (toolId: string) => boolean;
  onToggleFavorite: (toolId: string) => void;
  onToolClick: (tool: Tool) => void;
  onSeeAll: () => void;
}

export function RecommendedSection({
  recommendations,
  isFavorite,
  onToggleFavorite,
  onToolClick,
  onSeeAll,
}: RecommendedSectionProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
        </div>
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          See all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
        }}
      >
        {recommendations.map(({ tool, reason }) => (
          <motion.div
            key={tool.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            className="relative"
          >
            {/* "Why this?" tag */}
            <div className="absolute top-2 right-12 z-10">
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {reason}
              </span>
            </div>
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
