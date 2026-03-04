import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Clock,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import { DashboardSidebar, DashboardTab } from "@/components/dashboard/DashboardSidebar";
import { DashboardToolCard } from "@/components/dashboard/DashboardToolCard";
import { ToolHeroView } from "@/components/dashboard/ToolHeroView";
import { AIAssistantWidget } from "@/components/dashboard/AIAssistantWidget";
import { AIDiscoveredTools } from "@/components/AIDiscoveredTools";
import { useFavoritesDb, useFollowedCategoriesDb } from "@/hooks/use-tools";
import { useAISearch } from "@/hooks/use-ai-search";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import { categories, tools } from "@/lib/data";
import { Category, Tag, Tool } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("explore");
  const { favoriteTools, isFavorite, toggleFavorite } = useFavoritesDb();
  const { followedCategories, toggleCategory, categoryTools } = useFollowedCategoriesDb();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const {
    discoveredTools,
    isSearching,
    searchQuery: aiSearchQuery,
    hasActiveFilters,
    discoverTools,
    clearResults,
  } = useAISearch(selectedCategory, selectedTags);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/", { state: { openAuth: true } });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => tool.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    clearResults();
  };

  const handleDiscover = () => {
    discoverTools(selectedCategory, selectedTags, searchQuery || undefined);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userName = profile?.full_name || user.email?.split("@")[0] || "Developer";

  const currentToolIndex = selectedTool
    ? filteredTools.findIndex((t) => t.id === selectedTool.id)
    : -1;

  const handlePrevTool = () => {
    if (currentToolIndex > 0) setSelectedTool(filteredTools[currentToolIndex - 1]);
  };
  const handleNextTool = () => {
    if (currentToolIndex < filteredTools.length - 1)
      setSelectedTool(filteredTools[currentToolIndex + 1]);
  };

  const filterChips: { label: string; value: Category | null }[] = [
    { label: "All", value: null },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedTool(null);
        }}
        onSignOut={handleSignOut}
        userName={userName}
        avatarUrl={profile?.avatar_url || undefined}
      />

      {/* Main content — offset by sidebar on lg+, full width on mobile */}
      <main className="lg:ml-[60px] min-h-screen p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8 relative z-10">
        {selectedTool ? (
          <ToolHeroView
            tool={selectedTool}
            toolIndex={currentToolIndex >= 0 ? currentToolIndex : 0}
            totalTools={filteredTools.length}
            isFavorite={isFavorite(selectedTool.id)}
            onToggleFavorite={() => toggleFavorite(selectedTool.id)}
            onPrev={handlePrevTool}
            onNext={handleNextTool}
            onBack={() => setSelectedTool(null)}
          />
        ) : (
          <>
            {activeTab === "explore" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="explore"
                className="space-y-6"
              >
                {/* Search */}
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search developer tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-2xl glass text-foreground text-sm placeholder:text-muted-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Filter chips — scrollable on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
                  {filterChips.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => handleCategoryChange(chip.value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0",
                        selectedCategory === chip.value
                          ? "bg-primary text-primary-foreground glow-sm"
                          : "glass text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} found
                </p>

                {/* Tool Grid — responsive columns */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.04 },
                    },
                  }}
                >
                  {filteredTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <DashboardToolCard
                        tool={tool}
                        isFavorite={isFavorite(tool.id)}
                        onToggleFavorite={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                        onClick={() => setSelectedTool(tool)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {filteredTools.length === 0 && (
                  <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-muted-foreground">No tools found matching your criteria.</p>
                  </div>
                )}

                <AIDiscoveredTools
                  tools={discoveredTools}
                  isSearching={isSearching}
                  searchQuery={aiSearchQuery}
                  hasActiveFilters={hasActiveFilters}
                  onDiscover={handleDiscover}
                  onClear={clearResults}
                />
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="favorites" className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Saved Tools</h2>
                {favoriteTools.length === 0 ? (
                  <div className="glass rounded-2xl p-12 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No favorites yet. Start exploring!</p>
                    <Button onClick={() => setActiveTab("explore")} className="mt-2">
                      Explore Tools
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {favoriteTools.map((tool) => (
                      <DashboardToolCard
                        key={tool.id}
                        tool={tool}
                        isFavorite={true}
                        onToggleFavorite={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                        onClick={() => setSelectedTool(tool)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="categories" className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">Followed Categories</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Get notified about new tools in these categories
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => {
                      const isFollowed = followedCategories.includes(category.id);
                      return (
                        <motion.button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={cn(
                            "glass glass-hover rounded-xl p-4 text-left transition-all",
                            isFollowed && "border-primary/50 bg-primary/5"
                          )}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">{category.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                            </div>
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                isFollowed
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              )}
                            >
                              {isFollowed && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <ChevronRight className="w-4 h-4 text-primary-foreground" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                {followedCategories.length > 0 && categoryTools.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Tools from Followed Categories
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {categoryTools.map((tool) => (
                        <DashboardToolCard
                          key={tool.id}
                          tool={tool}
                          isFavorite={isFavorite(tool.id)}
                          onToggleFavorite={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          onClick={() => setSelectedTool(tool)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "submissions" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="submissions" className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Your Submissions</h2>
                <div className="glass rounded-2xl p-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">You haven't submitted any tools yet.</p>
                  <Link to="/submit">
                    <Button className="mt-4 glow-sm">Submit a Tool</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      <AIAssistantWidget />
    </div>
  );
};

export default Dashboard;
