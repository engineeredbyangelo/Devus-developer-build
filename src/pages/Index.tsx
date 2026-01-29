import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Category, Tag } from "@/lib/types";
import { tools, searchTools } from "@/lib/data";
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { NewThisWeek } from "@/components/NewThisWeek";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { TagFilter } from "@/components/TagFilter";
import { ToolGrid } from "@/components/ToolGrid";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
      <Header />

      {/* Landing Hero */}
      <LandingHero onGetStarted={() => setAuthModalOpen(true)} />

      {/* New This Week Carousel */}
      <NewThisWeek />

      {/* Explore Section */}
      <section id="explore" className="py-16 border-t border-border/30">
        <div className="container">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Explore the Collection
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Browse 35+ carefully curated tools across 9 categories. 
              Filter, search, and find exactly what you need.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-8"
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tools, frameworks, libraries..."
            />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
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
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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
        </div>
      </section>

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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
      />
    </div>
  );
};

export default Index;
