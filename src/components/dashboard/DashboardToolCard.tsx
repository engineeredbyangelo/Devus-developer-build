import { motion } from "framer-motion";
import { Heart, Star, Code } from "lucide-react";
import { Tool } from "@/lib/types";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

interface DashboardToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
  reasonTag?: string;
}

export function DashboardToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
  onClick,
  reasonTag,
}: DashboardToolCardProps) {
  const category = categories.find((c) => c.id === tool.category);
  const starsFormatted = tool.stars
    ? `${(tool.stars / 1000).toFixed(1)}k`
    : null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-4 sm:p-6 cursor-pointer relative group"
    >
      {/* Favorite */}
      <button
        onClick={onToggleFavorite}
        className={cn(
          "absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10",
          isFavorite
            ? "opacity-100 bg-red-500/20 text-red-500"
            : "bg-secondary/80 text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isFavorite && "fill-current")} />
      </button>

      {/* Mobile: horizontal layout / Desktop: vertical layout */}
      <div className="flex flex-row sm:flex-col gap-3 sm:gap-0">
        {/* Logo */}
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 sm:mb-4 overflow-hidden">
          {tool.logoUrl ? (
            <img src={tool.logoUrl} alt={tool.name} className="w-6 h-6 sm:w-9 sm:h-9 object-contain" />
          ) : (
            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          )}
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          {/* Reason tag */}
          {reasonTag && (
            <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 mb-1.5">
              {reasonTag}
            </span>
          )}

          {/* Name */}
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-0.5 sm:mb-1 pr-8 sm:pr-0">
            {tool.name}
          </h3>

          {/* Category + Stars */}
          <div className="flex items-center gap-2 mb-1.5 sm:mb-3">
            <span className="text-[11px] sm:text-xs text-muted-foreground">{category?.name}</span>
            {starsFormatted && (
              <span className="flex items-center gap-0.5 text-[11px] sm:text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {starsFormatted}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {tool.techStackFit && tool.techStackFit.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 sm:mt-4">
          {tool.techStackFit.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full bg-secondary text-[11px] font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {tool.techStackFit.length > 3 && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-[11px] font-medium text-muted-foreground">
              +{tool.techStackFit.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
