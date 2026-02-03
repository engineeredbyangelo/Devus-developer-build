import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Tool } from "@/lib/types";
import { ToolCard } from "./ToolCard";
import { DemoToolModal } from "./DemoToolModal";
import { cn } from "@/lib/utils";

interface DashboardToolGridProps {
  tools: Tool[];
  isFavorite: (toolId: string) => boolean;
  onToggleFavorite: (toolId: string) => void;
}

export function DashboardToolGrid({ tools, isFavorite, onToggleFavorite }: DashboardToolGridProps) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <>
      <motion.div
        className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        {tools.map((tool) => (
          <motion.div
            key={tool.id}
            className="relative"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {/* Favorite button overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tool.id);
              }}
              className={cn(
                "absolute top-3 right-3 z-10 p-2 rounded-lg backdrop-blur-sm transition-all",
                isFavorite(tool.id)
                  ? "bg-red-500/20 text-red-500"
                  : "bg-secondary/80 text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-all",
                  isFavorite(tool.id) && "fill-current"
                )}
              />
            </button>
            <ToolCard
              tool={tool}
              onClick={() => setSelectedTool(tool)}
            />
          </motion.div>
        ))}
      </motion.div>

      {tools.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No tools found matching your criteria.</p>
        </div>
      )}

      <DemoToolModal
        tool={selectedTool}
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
      />
    </>
  );
}
