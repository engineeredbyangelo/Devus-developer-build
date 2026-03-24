import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  User,
  Folder,
  Settings,
  Search,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type DashboardTab = "home" | "profile" | "categories" | "settings";

interface DashboardTopNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSignOut: () => void;
  userName: string;
  avatarUrl?: string;
  isPro?: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const navItems = [
  { id: "home" as DashboardTab, label: "Home", icon: Home },
  { id: "profile" as DashboardTab, label: "Profile", icon: User },
  { id: "categories" as DashboardTab, label: "Categories", icon: Folder },
  { id: "settings" as DashboardTab, label: "Settings", icon: Settings },
];

export function DashboardTopNav({
  activeTab,
  onTabChange,
  onSignOut,
  userName,
  avatarUrl,
  isPro = false,
  searchQuery,
  onSearchChange,
}: DashboardTopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop top nav */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-[56] hidden lg:flex items-center h-16 px-6 bg-card/90 backdrop-blur-xl border-b border-border"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">Devus</span>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search or ask anything… e.g., 'lightweight React alternatives'"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
            />
          </div>
        </div>

        {/* Right side: avatar + sign out */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 ring-2 ring-primary/20">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground leading-tight">{userName}</span>
              {isPro && (
                <span className="text-[10px] font-bold text-primary">PRO</span>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile: Top bar + bottom nav */}
      <div className="lg:hidden">
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 z-[56] flex items-center h-14 px-4 bg-card/95 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
              <Home className="w-4 h-4 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">Devus</span>
          </div>
          <div className="flex-1 mx-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
          <Avatar className="w-7 h-7 ring-1 ring-primary/20">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-[56] bg-card/95 backdrop-blur-xl border-t border-border"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex items-center justify-around h-14 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isActive && "bg-primary/15"
                    )}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
