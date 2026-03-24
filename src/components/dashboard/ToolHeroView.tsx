import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Heart,
  Share2,
  Star,
  Code,
} from "lucide-react";
import { Tool } from "@/lib/types";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ToolInfoCards } from "./ToolInfoCards";
import { ToolCardVisual } from "./ToolCardVisual";
import { cn } from "@/lib/utils";

interface ToolHeroViewProps {
  tool: Tool;
  toolIndex: number;
  totalTools: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPrev: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function ToolHeroView({
  tool,
  toolIndex,
  totalTools,
  isFavorite,
  onToggleFavorite,
  onPrev,
  onNext,
  onBack,
}: ToolHeroViewProps) {
  const category = categories.find((c) => c.id === tool.category);
  const starsFormatted = tool.stars
    ? `${(tool.stars / 1000).toFixed(1)}k`
    : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tool.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {toolIndex + 1} of {totalTools} tools
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onPrev}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onToggleFavorite}
              className={cn(
                "w-8 h-8 rounded-lg glass flex items-center justify-center transition-all",
                isFavorite
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>
            <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero content — stacks on mobile */}
        <div className="grid lg:grid-cols-[1fr,40%] gap-6 lg:gap-8">
          {/* Left: Hero */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl overflow-hidden"
          >
            {/* Hero visual banner */}
            <ToolCardVisual tool={tool} size="lg" />

            <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
              {/* Logo */}
              <div className="w-20 h-20 sm:w-[120px] sm:h-[120px] rounded-2xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                {tool.logoUrl ? (
                  <img
                    src={tool.logoUrl}
                    alt={tool.name}
                    className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <Code className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                {/* Name + stars */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl sm:text-[48px] font-bold leading-tight text-foreground">
                    {tool.name}
                  </h1>
                  {starsFormatted && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm font-semibold text-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {starsFormatted}
                    </span>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    {category?.name || tool.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
                  {tool.longDescription || tool.description}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2 glow-sm">
                  Visit {tool.name}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              {tool.githubUrl && (
                <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl font-semibold text-sm gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </Button>
                </a>
              )}
            </div>
            </div>
          </motion.div>

          {/* Right: Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:overflow-y-auto lg:max-h-[calc(100vh-180px)] lg:pr-1"
          >
            <ToolInfoCards tool={tool} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
