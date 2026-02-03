import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Search, 
  Loader2, 
  Plus, 
  ExternalLink, 
  AlertCircle,
  Wand2,
  TrendingUp,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useDiscoveredTools } from "@/hooks/use-discovered-tools";
import { categories } from "@/lib/data";
import { Category, Tool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DemoToolModal } from "@/components/DemoToolModal";

interface AIToolDiscoveryProps {
  onAddToFavorites?: (toolId: string) => void;
  isFavorite?: (toolId: string) => boolean;
}

const quickSearches = [
  { label: "AI Coding Assistants", query: "AI coding assistants and code generation tools" },
  { label: "API Development", query: "API development and testing tools" },
  { label: "New This Month", query: "developer tools released in the last 30 days" },
  { label: "Database Tools", query: "modern database management and ORM tools" },
];

export function AIToolDiscovery({ onAddToFavorites, isFavorite }: AIToolDiscoveryProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  
  const { 
    discoveredTools, 
    isDiscovering, 
    error, 
    discoverTools,
    saveToolToCollection,
    clearResults 
  } = useDiscoveredTools();

  const handleDiscover = () => {
    if (!query.trim() && !selectedCategory) return;
    discoverTools(query, selectedCategory);
  };

  const handleQuickSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    discoverTools(searchQuery, null);
  };

  const handleSaveTool = async (tool: Tool) => {
    const success = await saveToolToCollection(tool as any);
    if (success) {
      setSavedTools(prev => new Set(prev).add(tool.id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDiscover();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI Tool Discovery</h2>
          <p className="text-sm text-muted-foreground">
            Find new developer tools powered by AI
          </p>
        </div>
      </div>

      {/* Search Interface */}
      <div className="glass rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for tools... (e.g., 'AI code review tools')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-background/50"
            />
          </div>
          
          <Select 
            value={selectedCategory || "all"} 
            onValueChange={(val) => setSelectedCategory(val === "all" ? null : val as Category)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleDiscover}
            disabled={isDiscovering || (!query.trim() && !selectedCategory)}
            className="gap-2 glow-sm"
          >
            {isDiscovering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Discovering...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Discover
              </>
            )}
          </Button>
        </div>

        {/* Quick Searches */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground mr-1 self-center">Quick:</span>
          {quickSearches.map((search) => (
            <button
              key={search.label}
              onClick={() => handleQuickSearch(search.query)}
              disabled={isDiscovering}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border border-border/50",
                "bg-secondary/30 hover:bg-secondary/50 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {search.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {isDiscovering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <Sparkles className="w-12 h-12 text-primary" />
          </motion.div>
          <p className="text-muted-foreground">
            AI is searching for developer tools...
          </p>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {!isDiscovering && discoveredTools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {discoveredTools.length} tool{discoveredTools.length !== 1 ? "s" : ""}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearResults}
                className="text-muted-foreground"
              >
                Clear Results
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {discoveredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass glass-hover rounded-xl p-5 relative group cursor-pointer"
                  onClick={() => setSelectedTool(tool)}
                >
                  {/* AI Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    <Sparkles className="w-3 h-3" />
                    AI Found
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-1 pr-16">{tool.name}</h3>
                    <CategoryBadge category={tool.category} size="sm" />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {tool.description}
                  </p>

                  {/* Tech Stack */}
                  {tool.techStackFit && tool.techStackFit.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tool.techStackFit.slice(0, 3).map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-secondary/50 text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {tool.techStackFit.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-secondary/50 text-muted-foreground">
                          +{tool.techStackFit.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(tool.url, "_blank");
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1.5"
                      disabled={savedTools.has(tool.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveTool(tool);
                      }}
                    >
                      {savedTools.has(tool.id) ? (
                        <>Saved</>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isDiscovering && discoveredTools.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Discover New Tools</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Use AI to find the latest developer tools. Search by name, category, or describe what you're looking for.
          </p>
        </motion.div>
      )}

      {/* Tool Detail Modal */}
      <DemoToolModal
        tool={selectedTool}
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
}
