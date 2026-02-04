import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  Folder,
  Clock,
  Settings,
  LogOut,
  ChevronRight,
  Compass,
  Search,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { DashboardToolGrid } from "@/components/DashboardToolGrid";
import { AIDiscoveredTools } from "@/components/AIDiscoveredTools";
import { useFavoritesDb, useFollowedCategoriesDb } from "@/hooks/use-tools";
import { useAISearch } from "@/hooks/use-ai-search";
import { useAuth } from "@/hooks/useAuth";
import { categories, tools } from "@/lib/data";
import { Category, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { CategoryFilter } from "@/components/CategoryFilter";
import { TagFilter } from "@/components/TagFilter";

type Tab = "explore" | "favorites" | "categories" | "submissions";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const { favoriteTools, isFavorite, toggleFavorite } = useFavoritesDb();
  const { followedCategories, toggleCategory, categoryTools } = useFollowedCategoriesDb();
  
  // Explore tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  
  // AI Search hook
  const {
    discoveredTools,
    isSearching,
    searchQuery: aiSearchQuery,
    hasActiveFilters,
    discoverTools,
    clearResults,
  } = useAISearch(selectedCategory, selectedTags);

  // Auth guard - redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/", { state: { openAuth: true } });
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Filter tools for Explore tab
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => tool.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    // Clear AI results when filters change
    clearResults();
  };
  
  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    // Clear AI results when filters change
    clearResults();
  };

  const handleDiscover = () => {
    discoverTools(selectedCategory, selectedTags, searchQuery || undefined);
  };

  const tabs = [
    { id: "explore" as Tab, label: "Explore", icon: Compass, count: tools.length },
    { id: "favorites" as Tab, label: "Favorites", icon: Heart, count: favoriteTools.length },
    { id: "categories" as Tab, label: "Categories", icon: Folder, count: followedCategories.length },
    { id: "submissions" as Tab, label: "Submissions", icon: Clock, count: 0 },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userName = profile?.full_name || user.email?.split("@")[0] || "Developer";
  const userEmail = user.email || "";

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Header />

      <main className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* User Card */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{userName}</h3>
                  <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </div>
                      {tab.count !== null && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs",
                            isActive
                              ? "bg-primary/20"
                              : "bg-secondary"
                          )}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-border mt-6 pt-6 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Intelligence Hub</h1>
                <p className="text-sm text-muted-foreground">
                  Discover, compare, and track developer tools
                </p>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "explore" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="explore"
                className="space-y-6"
              >
                {/* Search and Filters */}
                <div className="glass rounded-xl p-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <CategoryFilter
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleCategoryChange}
                    />
                    <TagFilter
                      selectedTags={selectedTags}
                      onToggleTag={toggleTag}
                    />
                  </div>
                </div>

                {/* Results count */}
                <p className="text-sm text-muted-foreground">
                  {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} found
                </p>

                {/* Tool Grid */}
                <DashboardToolGrid
                  tools={filteredTools}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />

                {/* AI Discovery Section */}
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="favorites"
              >
                <h2 className="text-lg font-semibold mb-4">Saved Tools</h2>
                {favoriteTools.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      No favorites yet. Start exploring!
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click the heart icon on any tool to save it here.
                    </p>
                    <Button onClick={() => setActiveTab("explore")}>
                      Explore Tools
                    </Button>
                  </div>
                ) : (
                  <DashboardToolGrid
                    tools={favoriteTools}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="categories"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">Followed Categories</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Get notified about new tools in these categories
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
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
                              <h3 className="font-medium">{category.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {category.description}
                              </p>
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
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
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

                {/* Show tools from followed categories */}
                {followedCategories.length > 0 && categoryTools.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Tools from Followed Categories
                    </h3>
                    <DashboardToolGrid
                      tools={categoryTools}
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
                )}
              </motion.div>
            )}


            {activeTab === "submissions" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="submissions"
              >
                <h2 className="text-lg font-semibold mb-4">Your Submissions</h2>
                <div className="glass rounded-xl p-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    You haven't submitted any tools yet.
                  </p>
                  <Link to="/submit">
                    <Button className="mt-4 glow-sm">Submit a Tool</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
