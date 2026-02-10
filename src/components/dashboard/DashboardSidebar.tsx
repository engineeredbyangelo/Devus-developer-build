import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Heart,
  Folder,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DashboardTab = "explore" | "favorites" | "categories" | "submissions";

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSignOut: () => void;
  userName: string;
  avatarUrl?: string;
}

const navItems = [
  { id: "explore" as DashboardTab, label: "Explore", icon: Compass },
  { id: "favorites" as DashboardTab, label: "Favorites", icon: Heart },
  { id: "categories" as DashboardTab, label: "Categories", icon: Folder },
  { id: "submissions" as DashboardTab, label: "Submissions", icon: Clock },
];

export function DashboardSidebar({
  activeTab,
  onTabChange,
  onSignOut,
  userName,
  avatarUrl,
}: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tab: DashboardTab) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <TooltipProvider delayDuration={200}>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={cn(
          "fixed left-0 top-0 bottom-0 w-[60px] bg-card border-r border-border flex flex-col items-center py-4 z-[56] transition-transform duration-300",
          "max-lg:translate-x-[-60px]",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Close on mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground mb-2 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="w-9 h-9 mb-6 cursor-pointer ring-2 ring-primary/30">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
                    onClick={() => handleTabChange(item.id)}
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
    </TooltipProvider>
  );
}
