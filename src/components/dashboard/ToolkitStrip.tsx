import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Tool } from "@/lib/types";
import { categories } from "@/lib/data";
import { ToolCardVisual } from "./ToolCardVisual";

interface ToolkitStripProps {
  favoriteTools: Tool[];
  onToolClick: (tool: Tool) => void;
}

export function ToolkitStrip({ favoriteTools, onToolClick }: ToolkitStripProps) {
  if (favoriteTools.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">My Toolkit</h2>
        <span className="text-xs text-muted-foreground">({favoriteTools.length})</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {favoriteTools.map((tool) => {
          const cat = categories.find((c) => c.id === tool.category);
          return (
            <motion.button
              key={tool.id}
              onClick={() => onToolClick(tool)}
              className="glass glass-hover rounded-xl p-3 min-w-[160px] text-left shrink-0 flex items-center gap-3"
              whileTap={{ scale: 0.97 }}
            >
              <ToolCardVisual tool={tool} size="sm" className="w-9 h-9" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-foreground truncate">{tool.name}</h4>
                <span className="text-[10px] text-muted-foreground">{cat?.name}</span>
              </div>
              {tool.isNew && (
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                  NEW
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
