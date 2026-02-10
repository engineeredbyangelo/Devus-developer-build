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
        className="font-dash"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-dash-text-secondary hover:text-dash-card-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-dash-text-secondary">
              {toolIndex + 1} of {totalTools} tools
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onPrev}
                className="w-8 h-8 rounded-lg bg-dash-card flex items-center justify-center text-dash-card-foreground hover:bg-dash-primary hover:text-dash-primary-foreground transition-all"
                style={{ boxShadow: "var(--dash-shadow)" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                className="w-8 h-8 rounded-lg bg-dash-card flex items-center justify-center text-dash-card-foreground hover:bg-dash-primary hover:text-dash-primary-foreground transition-all"
                style={{ boxShadow: "var(--dash-shadow)" }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onToggleFavorite}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isFavorite
                  ? "bg-red-50 text-red-500"
                  : "bg-dash-card text-dash-text-secondary hover:text-red-500"
              )}
              style={{ boxShadow: "var(--dash-shadow)" }}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>
            <button
              className="w-8 h-8 rounded-lg bg-dash-card flex items-center justify-center text-dash-text-secondary hover:text-dash-card-foreground transition-all"
              style={{ boxShadow: "var(--dash-shadow)" }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero content */}
        <div className="grid lg:grid-cols-[1fr,40%] gap-8">
          {/* Left: Hero */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-dash-card to-dash-bg rounded-3xl p-10"
            style={{ boxShadow: "0 4px 20px hsla(0,0%,0%,0.06)" }}
          >
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div
                className="w-[120px] h-[120px] rounded-2xl bg-dash-bg flex items-center justify-center shrink-0 overflow-hidden"
                style={{ boxShadow: "var(--dash-shadow)" }}
              >
                {tool.logoUrl ? (
                  <img
                    src={tool.logoUrl}
                    alt={tool.name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <Code className="w-12 h-12 text-dash-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                {/* Name + stars */}
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-[48px] font-bold leading-tight text-dash-card-foreground">
                    {tool.name}
                  </h1>
                  {starsFormatted && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-dash-bg text-sm font-semibold text-dash-card-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {starsFormatted}
                    </span>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-dash-bg text-xs font-medium text-dash-text-secondary flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    {category?.name || tool.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-lg leading-relaxed text-dash-text-secondary max-w-xl">
                  {tool.longDescription || tool.description}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-8">
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full h-12 rounded-xl bg-dash-primary hover:bg-dash-primary/90 text-dash-primary-foreground font-semibold text-sm gap-2">
                  Visit {tool.name}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              {tool.githubUrl && (
                <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-dash-sidebar text-dash-card-foreground font-semibold text-sm gap-2 hover:bg-dash-sidebar hover:text-dash-sidebar-foreground"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </Button>
                </a>
              )}
            </div>
          </motion.div>

          {/* Right: Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-y-auto max-h-[calc(100vh-180px)] pr-1"
          >
            <ToolInfoCards tool={tool} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
