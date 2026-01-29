import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Sparkles } from "lucide-react";
import { Category, Tag } from "@/lib/types";
import { tools, searchTools } from "@/lib/data";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { ToolCard } from "./ToolCard";
import { Button } from "@/components/ui/button";

interface DemoPreviewProps {
  onSignUp: () => void;
}

export function DemoPreview({ onSignUp }: DemoPreviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Limit to 6 tools for demo
  const demoTools = useMemo(() => {
    let result = searchQuery ? searchTools(searchQuery) : tools;
    
    if (selectedCategory) {
      result = result.filter((tool) => tool.category === selectedCategory);
    }
    
    return result.slice(0, 6);
  }, [searchQuery, selectedCategory]);

  return (
    <section id="explore" className="py-20 relative overflow-hidden">
      {/* Section glow */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-sm font-medium mb-4">
            <Filter className="w-4 h-4" />
            Try It Out
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Experience the Demo
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get a taste of how easy it is to discover tools. Search, filter, and explore — 
            this is just a preview of what's available.
          </p>
        </motion.div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-6"
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tools, frameworks, libraries..."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </motion.div>

        {/* Demo Grid - Limited to 6 tools */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {demoTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </motion.div>

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Want to see all 35+ tools?
            </h3>
            <p className="text-muted-foreground mb-6">
              Sign up for free to unlock the full collection, save favorites, and get personalized recommendations.
            </p>
            <Button size="lg" className="glow-sm" onClick={onSignUp}>
              Get Full Access — Free
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
