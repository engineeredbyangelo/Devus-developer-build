import { motion } from "framer-motion";
import { Tool } from "@/lib/types";
import { ToolCard } from "./ToolCard";

interface ToolGridProps {
  tools: Tool[];
  isLoading?: boolean;
}

export function ToolGrid({ tools, isLoading }: ToolGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-secondary/50 animate-pulse h-[280px]"
          />
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-muted-foreground text-lg">
          No tools found matching your criteria.
        </p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Try adjusting your filters or search query.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
      {tools.map((tool, index) => (
        <ToolCard key={tool.id} tool={tool} index={index} />
      ))}
    </motion.div>
  );
}
