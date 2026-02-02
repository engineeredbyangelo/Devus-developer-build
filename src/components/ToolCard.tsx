import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import { Tool } from "@/lib/types";
import { getCategoryInfo } from "@/lib/data";
import { CategoryBadge } from "./CategoryBadge";

interface ToolCardProps {
  tool: Tool;
  index?: number;
  onClick?: () => void;
}

export function ToolCard({ tool, index = 0, onClick }: ToolCardProps) {
  const categoryInfo = getCategoryInfo(tool.category);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

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
      className="group relative h-full cursor-pointer"
      onClick={handleCardClick}
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
        <div className="flex items-start gap-3 mb-3">
          {/* Logo placeholder */}
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {tool.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {tool.name}
            </h3>
            <CategoryBadge category={tool.category} size="sm" />
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
          {tool.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-secondary text-secondary-foreground"
            >
              {tag.replace("-", " ")}
            </span>
          ))}
        </div>

        {/* Actions - Link & GitHub */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/50 mt-auto">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visit
          </a>
          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
