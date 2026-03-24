import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ChevronRight,
  Search,
  Loader2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Zap,
} from "lucide-react";
import { DashboardTopNav, DashboardTab } from "@/components/dashboard/DashboardTopNav";
import { DashboardToolCard } from "@/components/dashboard/DashboardToolCard";
import { ToolHeroView } from "@/components/dashboard/ToolHeroView";
import { AIAssistantWidget } from "@/components/dashboard/AIAssistantWidget";
import { AIDiscoveredTools } from "@/components/AIDiscoveredTools";
import { WeeklyDigestBanner } from "@/components/dashboard/WeeklyDigestBanner";
import { RecommendedSection } from "@/components/dashboard/RecommendedSection";
import { TrendingSection } from "@/components/dashboard/TrendingSection";
import { ToolkitStrip } from "@/components/dashboard/ToolkitStrip";
import { DashboardRightSidebar } from "@/components/dashboard/DashboardRightSidebar";
import { OnboardingPrompt } from "@/components/dashboard/OnboardingPrompt";
import { useFavoritesDb, useFollowedCategoriesDb } from "@/hooks/use-tools";
import { useAISearch } from "@/hooks/use-ai-search";
import { useFreshTools } from "@/hooks/use-fresh-tools";
import { useRecommendations } from "@/hooks/use-recommendations";
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
  const { isPro, isLoading: subLoading } = useSubscription();
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
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

  const { freshTools, isLoading: freshLoading, discoverFresh } = useFreshTools();

  const { recommendations, trending } = useRecommendations(
    followedCategories,
    favoriteTools.map((t) => t.id)
  );

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

  const handleAskDevus = (query: string) => {
    discoverTools(null, [], query);
  };

  const handleOnboardingComplete = (cats: string[]) => {
    cats.forEach((cat) => {
      if (!followedCategories.includes(cat)) {
        toggleCategory(cat);
      }
    });
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

  const displayedFreshTools = isPro ? freshTools : freshTools.slice(0, 5);

  const isNewUser = followedCategories.length === 0 && favoriteTools.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <DashboardTopNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedTool(null);
        }}
        onSignOut={handleSignOut}
        userName={userName}
        avatarUrl={profile?.avatar_url || undefined}
        isPro={isPro}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="pt-16 lg:pt-16 min-h-screen relative z-10" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="flex max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 gap-6">
          {/* Main content */}
          <main className="flex-1 min-w-0">
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
                {/* HOME TAB */}
                {activeTab === "home" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="home"
                    className="space-y-6 sm:space-y-8"
                  >
                    {isNewUser ? (
                      <OnboardingPrompt onComplete={handleOnboardingComplete} />
                    ) : (
                      <>
                        <WeeklyDigestBanner
                          followedCategories={followedCategories}
                          onBrowse={() => setActiveTab("explore")}
                          onToolClick={setSelectedTool}
                        />

                        <RecommendedSection
                          recommendations={recommendations}
                          isFavorite={isFavorite}
                          onToggleFavorite={toggleFavorite}
                          onToolClick={setSelectedTool}
                          onSeeAll={() => setActiveTab("explore")}
                        />

                        <TrendingSection
                          trending={trending}
                          followedCategories={followedCategories}
                          isFavorite={isFavorite}
                          onToggleFavorite={toggleFavorite}
                          onToolClick={setSelectedTool}
                          onSeeAll={() => setActiveTab("explore")}
                        />

                        {favoriteTools.length > 0 && (
                          <ToolkitStrip
                            favoriteTools={favoriteTools}
                            onToolClick={setSelectedTool}
                          />
                        )}

                        {/* Fresh Finds inline */}
                        <section className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-primary" />
                              <h2 className="text-lg font-semibold text-foreground">Fresh Finds</h2>
                            </div>
                            <Button
                              onClick={() => discoverFresh()}
                              disabled={freshLoading}
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-primary"
                            >
                              {freshLoading ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4 mr-1" />
                              )}
                              {freshLoading ? "Discovering..." : "Refresh"}
                            </Button>
                          </div>

                          {displayedFreshTools.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                              {displayedFreshTools.slice(0, 4).map((tool) => (
                                <div key={tool.id} className="glass glass-hover rounded-2xl p-4 cursor-pointer">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                      <Zap className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-sm font-semibold text-foreground truncate">{tool.name}</h4>
                                      <span className="text-[10px] text-primary">Just discovered</span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                                </div>
                              ))}
                            </div>
                          ) : !freshLoading ? (
                            <div className="glass rounded-2xl p-8 text-center">
                              <p className="text-sm text-muted-foreground">Hit Refresh to discover fresh tools.</p>
                            </div>
                          ) : null}
                        </section>

                        {!isPro && (
                          <UpgradeBanner message="Upgrade to Pro for unlimited recommendations, trending insights, and fresh tool discovery." />
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* EXPLORE TAB */}
                {activeTab === "explore" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="explore"
                    className="space-y-6"
                  >
                    {/* Filter chips */}
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
                      {!isPro && filteredTools.length > 35 && (
                        <span className="text-primary ml-1">(showing 35 of {filteredTools.length})</span>
                      )}
                    </p>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
                      }}
                    >
                      {(isPro ? filteredTools : filteredTools.slice(0, 35)).map((tool) => (
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

                    {!isPro && filteredTools.length > 35 && (
                      <UpgradeBanner message={`You're viewing 35 of ${filteredTools.length} tools. Upgrade to Pro to unlock the full directory.`} />
                    )}

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

                {/* TOOLKIT TAB (formerly Favorites) */}
                {activeTab === "toolkit" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="toolkit" className="space-y-6">
                    <h2 className="text-lg font-semibold text-foreground">My Toolkit</h2>
                    {favoriteTools.length === 0 ? (
                      <div className="glass rounded-2xl p-12 text-center">
                        <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">No tools in your toolkit yet. Start exploring!</p>
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

                {/* CATEGORIES TAB */}
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
                                    isFollowed ? "border-primary bg-primary" : "border-muted-foreground"
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
              </>
            )}
          </main>

          {/* Right sidebar — desktop only, hidden when viewing tool detail */}
          {!selectedTool && activeTab === "home" && (
            <DashboardRightSidebar
              followedCategories={followedCategories}
              onAskDevus={handleAskDevus}
              isSearching={isSearching}
            />
          )}
        </div>
      </div>

      <AIAssistantWidget />
    </div>
  );
};

export default Dashboard;
