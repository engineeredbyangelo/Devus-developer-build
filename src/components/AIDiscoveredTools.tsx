import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscoveredTool } from "@/hooks/use-ai-search";
import { ToolCard } from "./ToolCard";
import { DemoToolModal } from "./DemoToolModal";
import { Tool, Category, Tag } from "@/lib/types";

interface AIDiscoveredToolsProps {
  tools: DiscoveredTool[];
  isSearching: boolean;
  searchQuery: string | null;
  hasActiveFilters: boolean;
  onDiscover: () => void;
  onClear: () => void;
}

// Convert DiscoveredTool to Tool format for consistent display
function toToolFormat(discovered: DiscoveredTool): Tool {
  return {
    id: discovered.id,
    name: discovered.name,
    description: discovered.description,
    category: discovered.category as Category,
    tags: discovered.tags as Tag[],
    url: discovered.url,
    githubUrl: discovered.githubUrl,
    upvotes: 0,
    createdAt: new Date().toISOString(),
    isNew: true, // Mark as AI-discovered
  };
}

export function AIDiscoveredTools({
  tools,
  isSearching,
  searchQuery,
  hasActiveFilters,
  onDiscover,
  onClear,
}: AIDiscoveredToolsProps) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Show discover button when filters are active
  if (hasActiveFilters && tools.length === 0 && !isSearching) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 text-center border border-primary/20"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Discover More Tools</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Discover more tools matching your filters
        </p>
        <Button onClick={onDiscover} className="glow-sm">
          <Zap className="w-4 h-4 mr-2" />
          Discover with AI
        </Button>
      </motion.div>
    );
  }

  // Show loading state
  if (isSearching) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-8 text-center"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Searching GitHub, ProductHunt & more for developer tools...
        </p>
      </motion.div>
    );
  }

  // Show results using ToolCard component with modal support
  if (tools.length > 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Discovered ({tools.length})</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
          
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              Found on GitHub, ProductHunt, npm & more
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => {
              const toolForCard = toToolFormat(tool);
              return (
                <ToolCard
                  key={tool.id}
                  tool={toolForCard}
                  index={index}
                  onClick={() => setSelectedTool(toolForCard)}
                />
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Curated developer tools
          </p>
        </motion.div>

        <DemoToolModal
          tool={selectedTool}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      </>
    );
  }

  return null;
}
