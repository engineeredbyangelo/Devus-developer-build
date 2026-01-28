import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Category, Tag } from "@/lib/types";
import { tools, searchTools } from "@/lib/data";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { TagFilter } from "@/components/TagFilter";
import { ToolGrid } from "@/components/ToolGrid";
import { ActivityTicker } from "@/components/ActivityTicker";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const filteredTools = useMemo(() => {
    let result = searchQuery ? searchTools(searchQuery) : tools;

    if (selectedCategory) {
      result = result.filter((tool) => tool.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      result = result.filter((tool) =>
        selectedTags.some((tag) => tool.tags.includes(tag))
      );
    }

    return result;
  }, [searchQuery, selectedCategory, selectedTags]);

  const handleToggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <Header />

      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <ActivityTicker />
          
          <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Discover the best
            <br />
            <span className="text-primary glow-text">developer tools</span>
          </h1>
          
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of frameworks, libraries, and tools to supercharge your development workflow.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tools, frameworks, libraries..."
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <TagFilter selectedTags={selectedTags} onToggleTag={handleToggleTag} />
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filteredTools.length}</span> tools
            {selectedCategory && (
              <span>
                {" "}in <span className="text-primary">{selectedCategory}</span>
              </span>
            )}
          </p>
        </motion.div>

        {/* Tool Grid */}
        <ToolGrid tools={filteredTools} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">
              Dev<span className="text-primary">us</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for developers, by developers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
