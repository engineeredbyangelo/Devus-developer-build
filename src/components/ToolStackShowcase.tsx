import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Code, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, tools } from "@/lib/data";
import { Category, Tool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";
import { DemoToolModal } from "./DemoToolModal";

interface ToolStackShowcaseProps {
  onSignUp: () => void;
}

export function ToolStackShowcase({ onSignUp }: ToolStackShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("frontend");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const filteredTools = useMemo(() => {
    return tools.filter((t) => t.category === selectedCategory).slice(0, 6);
  }, [selectedCategory]);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Layers className="w-4 h-4" />
            Explore the Stack
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            65+ Tools Across {categories.length} Categories
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From AI models to deployment platforms — handpicked for quality
          </p>
        </motion.div>

        {/* Category pills — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8 md:mb-10 md:flex-wrap md:justify-center scrollbar-hide"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  isActive
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >
                {cat.name}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tool cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 md:mb-14"
          >
            {filteredTools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ y: -4 }}
                className="glass glass-hover rounded-xl p-5 flex items-start gap-4 cursor-pointer"
                onClick={() => setSelectedTool(tool)}
              >
                {/* Logo placeholder */}
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {tool.logoUrl ? (
                    <img
                      src={tool.logoUrl}
                      alt={tool.name}
                      className="w-7 h-7 rounded"
                    />
                  ) : (
                    <Code className="w-5 h-5 text-primary" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate">{tool.name}</span>
                    {tool.isNew && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="mt-2">
                    <CategoryBadge category={tool.category} size="sm" />
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No tools in this category yet — check back soon!
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center"
        >
          <Button size="lg" onClick={onSignUp} className="h-12 px-8 gap-2 glow-sm">
            Sign up to explore the full collection
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      <DemoToolModal
        tool={selectedTool}
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
      />
    </section>
  );
}
