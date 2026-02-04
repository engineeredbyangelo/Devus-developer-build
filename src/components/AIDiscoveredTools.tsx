import { motion } from "framer-motion";
import { Sparkles, ExternalLink, Github, Loader2, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscoveredTool } from "@/hooks/use-ai-search";
import { cn } from "@/lib/utils";

interface AIDiscoveredToolsProps {
  tools: DiscoveredTool[];
  isSearching: boolean;
  searchQuery: string | null;
  hasActiveFilters: boolean;
  onDiscover: () => void;
  onClear: () => void;
}

export function AIDiscoveredTools({
  tools,
  isSearching,
  searchQuery,
  hasActiveFilters,
  onDiscover,
  onClear,
}: AIDiscoveredToolsProps) {
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
          Find additional tools matching your filters using AI-powered search
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
          Searching the web for developer tools...
        </p>
      </motion.div>
    );
  }

  // Show results
  if (tools.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">AI-Discovered ({tools.length})</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
        
        {searchQuery && (
          <p className="text-xs text-muted-foreground">
            Search: "{searchQuery}"
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "glass glass-hover rounded-xl p-4 border border-primary/10",
                "group relative"
              )}
            >
              <div className="absolute top-2 right-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  AI
                </span>
              </div>

              <h4 className="font-medium text-sm mb-2 pr-8 line-clamp-1">
                {tool.name}
              </h4>
              
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {tool.description}
              </p>

              <div className="flex items-center gap-2">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit
                </a>
                {tool.githubUrl && (
                  <a
                    href={tool.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Github className="w-3 h-3" />
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Powered by Firecrawl • Real-time web search
        </p>
      </motion.div>
    );
  }

  return null;
}
