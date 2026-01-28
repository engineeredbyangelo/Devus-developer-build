import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Star, ChevronUp } from "lucide-react";
import { Tool } from "@/lib/types";
import { getCategoryInfo } from "@/lib/data";
import { useFavorites, useUpvotes } from "@/hooks/use-tools";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getUpvotes, toggleUpvote, hasUpvoted } = useUpvotes();
  const categoryInfo = getCategoryInfo(tool.category);
  const upvoteCount = getUpvotes(tool.id);
  const favorited = isFavorite(tool.id);
  const upvoted = hasUpvoted(tool.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="glass glass-hover rounded-xl p-5 h-full flex flex-col">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* New badge */}
        {tool.isNew && (
          <div className="absolute -top-2 -right-2 z-10">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground animate-glow-pulse">
              New
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold text-primary">
              {tool.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <CategoryBadge category={tool.category} size="sm" />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {tool.description}
        </p>

        {/* Stars */}
        {tool.stars && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span>{(tool.stars / 1000).toFixed(1)}k</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-secondary text-secondary-foreground"
            >
              {tag.replace("-", " ")}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            {/* Upvote button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleUpvote(tool.id);
              }}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                upvoted
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
              )}
            >
              <ChevronUp className={cn("w-4 h-4", upvoted && "fill-current")} />
              <span>{upvoteCount}</span>
            </motion.button>

            {/* Favorite button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(tool.id);
              }}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                favorited
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className={cn("w-4 h-4", favorited && "fill-current")} />
            </motion.button>
          </div>

          {/* View link */}
          <Link
            to={`/tool/${tool.id}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
