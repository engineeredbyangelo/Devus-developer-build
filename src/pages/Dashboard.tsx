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
  Send,
  Star,
} from "lucide-react";
import { DashboardTopNav, DashboardTab } from "@/components/dashboard/DashboardTopNav";
import { DashboardToolCard } from "@/components/dashboard/DashboardToolCard";
import { ToolCardVisual } from "@/components/dashboard/ToolCardVisual";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  const [askQuery, setAskQuery] = useState("");

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAskDevus = (query: string) => {
    discoverTools(null, [], query);
  };

  const handleInlineAsk = () => {
    if (!askQuery.trim()) return;
    handleAskDevus(askQuery.trim());
    setAskQuery("");
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

  const displayedFreshTools = isPro ? freshTools : freshTools.slice(0, 5);

  const isNewUser = followedCategories.length === 0 && favoriteTools.length === 0;

  // Tool of the Day — pick top recommendation, deterministic per day
  const toolOfTheDay = recommendations.length > 0 ? recommendations[0] : null;

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
                          onToolClick={setSelectedTool}
                        />

                        <RecommendedSection
                          recommendations={recommendations}
                          isFavorite={isFavorite}
                          onToggleFavorite={toggleFavorite}
                          onToolClick={setSelectedTool}
                        />

                        <TrendingSection
                          trending={trending}
                          followedCategories={followedCategories}
                          isFavorite={isFavorite}
                          onToggleFavorite={toggleFavorite}
                          onToolClick={setSelectedTool}
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
                                <div key={tool.id} className="glass glass-hover rounded-2xl p-3 sm:p-4 cursor-pointer">
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

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="profile" className="space-y-6 sm:space-y-8">
                    {/* Profile Header */}
                    <div className="glass rounded-2xl p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
                            {userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-foreground">{userName}</h2>
                            {isPro && (
                              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">PRO</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Followed category pills */}
                      {followedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {followedCategories.map((catId) => {
                            const cat = categories.find((c) => c.id === catId);
                            return cat ? (
                              <span
                                key={catId}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                              >
                                {cat.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>

                    {/* Tool of the Day */}
                    {toolOfTheDay && (
                      <section className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />
                          <h2 className="text-lg font-semibold text-foreground">Tool of the Day</h2>
                        </div>
                        <motion.div
                          className="glass rounded-2xl p-5 sm:p-6 cursor-pointer hover:border-primary/30 transition-all"
                          whileHover={{ y: -2 }}
                          onClick={() => setSelectedTool(toolOfTheDay.tool)}
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-lg font-bold text-primary">
                              {toolOfTheDay.tool.logoUrl ? (
                                <img src={toolOfTheDay.tool.logoUrl} alt={toolOfTheDay.tool.name} className="w-10 h-10 rounded-lg object-contain" />
                              ) : (
                                toolOfTheDay.tool.name.charAt(0)
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-lg font-semibold text-foreground">{toolOfTheDay.tool.name}</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                  {toolOfTheDay.reason}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                                {toolOfTheDay.tool.description}
                              </p>
                              <Button
                                size="sm"
                                className="mt-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTool(toolOfTheDay.tool);
                                }}
                              >
                                View Details
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </section>
                    )}

                    {/* Ask Devus inline */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">Ask Devus</h2>
                      </div>
                      <div className="glass rounded-2xl p-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ask about tools, comparisons, recommendations..."
                            value={askQuery}
                            onChange={(e) => setAskQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleInlineAsk()}
                            disabled={isSearching}
                            className="flex-1 h-10 px-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 disabled:opacity-50"
                          />
                          <Button
                            onClick={handleInlineAsk}
                            disabled={isSearching || !askQuery.trim()}
                            size="icon"
                            className="shrink-0"
                          >
                            {isSearching ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Show AI results inline */}
                      <AIDiscoveredTools
                        tools={discoveredTools}
                        isSearching={isSearching}
                        searchQuery={aiSearchQuery}
                        hasActiveFilters={hasActiveFilters}
                        onDiscover={() => {}}
                        onClear={clearResults}
                      />
                    </section>

                    {/* Favorites */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">My Favorites</h2>
                        {favoriteTools.length > 0 && (
                          <span className="text-xs text-muted-foreground">({favoriteTools.length})</span>
                        )}
                      </div>
                      {favoriteTools.length === 0 ? (
                        <div className="glass rounded-2xl p-8 sm:p-12 text-center">
                          <Heart className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">
                            No favorites yet — explore the Home feed and heart the tools you love.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
                    </section>
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

                {/* SETTINGS TAB */}
                {activeTab === "settings" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="settings" className="space-y-6">
                    <h2 className="text-lg font-semibold text-foreground">Settings</h2>

                    <div className="glass rounded-2xl p-5 sm:p-6 space-y-6">
                      {/* Account section */}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3">Account</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                            <AvatarImage src={profile?.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/15 text-primary text-lg font-bold">
                              {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{userName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Subscription */}
                      <div className="border-t border-border pt-4">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Subscription</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "text-xs",
                            isPro
                              ? "bg-primary/15 text-primary border-primary/30"
                              : "bg-secondary text-secondary-foreground"
                          )}>
                            {isPro ? "Pro" : "Free"}
                          </Badge>
                          {!isPro && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate("/pricing")}
                              className="text-xs"
                            >
                              Upgrade
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-border pt-4">
                        <Button
                          variant="outline"
                          onClick={handleSignOut}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
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
