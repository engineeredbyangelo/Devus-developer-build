import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  Folder,
  Clock,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { ToolGrid } from "@/components/ToolGrid";
import { useFavorites } from "@/hooks/use-tools";
import { categories } from "@/lib/data";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Tab = "favorites" | "categories" | "submissions";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("favorites");
  const { favoriteTools } = useFavorites();
  const [followedCategories, setFollowedCategories] = useState<Category[]>([
    "frontend",
    "ai-ml",
  ]);

  const toggleCategory = (category: Category) => {
    setFollowedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const tabs = [
    { id: "favorites" as Tab, label: "Favorites", icon: Heart, count: favoriteTools.length },
    { id: "categories" as Tab, label: "Categories", icon: Folder, count: followedCategories.length },
    { id: "submissions" as Tab, label: "Submissions", icon: Clock, count: 0 },
  ];

  // Mock user
  const user = {
    name: "Developer",
    email: "dev@example.com",
    avatar: "",
  };

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
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
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
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-border mt-6 pt-6 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
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
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your saved tools and preferences
                </p>
              </div>
            </div>

            {/* Tab Content */}
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
                    <p className="text-muted-foreground">
                      No favorites yet. Start exploring!
                    </p>
                    <Link to="/">
                      <Button className="mt-4">Discover Tools</Button>
                    </Link>
                  </div>
                ) : (
                  <ToolGrid tools={favoriteTools} />
                )}
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="categories"
              >
                <h2 className="text-lg font-semibold mb-4">Followed Categories</h2>
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
