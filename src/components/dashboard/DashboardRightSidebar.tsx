import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Search, MessageSquare, ChevronRight, Send } from "lucide-react";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

interface DashboardRightSidebarProps {
  followedCategories: string[];
  onAskDevus: (query: string) => void;
  isSearching?: boolean;
}

export function DashboardRightSidebar({
  followedCategories,
  onAskDevus,
  isSearching = false,
}: DashboardRightSidebarProps) {
  const [askQuery, setAskQuery] = useState("");

  const totalCategories = categories.length;
  const covered = followedCategories.length;
  const coveragePercent = Math.round((covered / totalCategories) * 100);

  const handleAsk = () => {
    if (askQuery.trim()) {
      onAskDevus(askQuery.trim());
      setAskQuery("");
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden xl:block w-72 shrink-0 space-y-5"
    >
      {/* Stack Coverage */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Stack Coverage</h3>
        </div>
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${coveragePercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{covered}/{totalCategories}</span> categories covered
          {covered < totalCategories && (
            <span className="text-primary ml-1">— explore more?</span>
          )}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {categories.map((cat) => {
            const isFollowed = followedCategories.includes(cat.id);
            return (
              <span
                key={cat.id}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border",
                  isFollowed
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {cat.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Ask Devus */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Ask Devus</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Ask about tools, stacks, or recommendations
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="e.g., 'Best auth for SaaS?'"
            className="flex-1 h-8 px-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30"
            disabled={isSearching}
          />
          <button
            onClick={handleAsk}
            disabled={!askQuery.trim() || isSearching}
            className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/25 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
