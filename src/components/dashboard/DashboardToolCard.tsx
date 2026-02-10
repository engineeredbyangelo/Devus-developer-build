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
}

export function DashboardToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
  onClick,
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
      className="glass glass-hover rounded-2xl p-6 cursor-pointer relative group"
    >
      {/* Favorite */}
      <button
        onClick={onToggleFavorite}
        className={cn(
          "absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
          isFavorite
            ? "opacity-100 bg-red-500/20 text-red-500"
            : "bg-secondary/80 text-muted-foreground hover:text-red-500"
        )}
      >
        <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
      </button>

      {/* Logo */}
      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 overflow-hidden">
        {tool.logoUrl ? (
          <img src={tool.logoUrl} alt={tool.name} className="w-9 h-9 object-contain" />
        ) : (
          <Code className="w-6 h-6 text-primary" />
        )}
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-foreground mb-1">
        {tool.name}
      </h3>

      {/* Category + Stars */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground">{category?.name}</span>
        {starsFormatted && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {starsFormatted}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {tool.description}
      </p>

      {/* Tags */}
      {tool.techStackFit && tool.techStackFit.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
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
