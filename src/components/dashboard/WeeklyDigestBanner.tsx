import { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Tool } from "@/lib/types";
import { tools } from "@/lib/data";

interface WeeklyDigestBannerProps {
  followedCategories: string[];
  onToolClick: (tool: Tool) => void;
}

const DISMISS_KEY = "devus-weekly-digest-dismissed";

export function WeeklyDigestBanner({ followedCategories, onToolClick }: WeeklyDigestBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    const stored = localStorage.getItem(DISMISS_KEY);
    if (!stored) return false;
    const dismissedAt = new Date(stored);
    const now = new Date();
    const daysSince = (now.getTime() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 7;
  });

  const newTools = tools.filter((t) => t.isNew).slice(0, 4);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
  };

  if (dismissed || newTools.length === 0) return null;

  const catNames = followedCategories.length > 0
    ? followedCategories
        .map((c) => c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))
        .slice(0, 3)
        .join(", ")
    : "your interests";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative glass rounded-2xl p-6 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Fresh This Week</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{newTools.length} new high-signal tools</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Curated for developers who follow {catNames}
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {newTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolClick(tool)}
              className="glass glass-hover rounded-xl p-3 min-w-[140px] text-left shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-sm font-bold text-primary">
                {tool.name.charAt(0)}
              </div>
              <h4 className="text-xs font-semibold text-foreground truncate">{tool.name}</h4>
              <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
