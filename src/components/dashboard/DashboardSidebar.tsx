import { motion } from "framer-motion";
import {
  Compass,
  Heart,
  Folder,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DashboardTab = "explore" | "favorites" | "categories" | "fresh";

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSignOut: () => void;
  userName: string;
  avatarUrl?: string;
  isPro?: boolean;
}

const navItems = [
  { id: "explore" as DashboardTab, label: "Explore", icon: Compass },
  { id: "favorites" as DashboardTab, label: "Favorites", icon: Heart },
  { id: "categories" as DashboardTab, label: "Categories", icon: Folder },
  { id: "fresh" as DashboardTab, label: "Fresh Finds", icon: Sparkles },
];

export function DashboardSidebar({
  activeTab,
  onTabChange,
  onSignOut,
  userName,
  avatarUrl,
  isPro = false,
}: DashboardSidebarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      {/* Desktop: Left sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 top-0 bottom-0 w-[60px] bg-card border-r border-border flex-col items-center py-4 z-[56] hidden lg:flex"
      >
        {/* Avatar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center cursor-pointer">
              <Avatar className="w-9 h-9 mb-1 ring-2 ring-primary/30">
                <AvatarImage src={avatarUrl || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isPro ? (
                <span className="text-[9px] font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded-full mb-4">
                  PRO
                </span>
              ) : (
                <div className="mb-4" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">{userName}</TooltipContent>
        </Tooltip>

        {/* Nav */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground glow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onSignOut}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign Out</TooltipContent>
          </Tooltip>
        </div>
      </motion.aside>

      {/* Mobile: Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[56] lg:hidden bg-card/95 backdrop-blur-xl border-t border-border" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                    isActive && "bg-primary/15 glow-sm"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={onSignOut}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Sign Out</span>
          </button>
        </div>
      </nav>
    </TooltipProvider>
  );
}
