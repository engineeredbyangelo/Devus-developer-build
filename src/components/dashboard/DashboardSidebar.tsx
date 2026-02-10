import { motion } from "framer-motion";
import {
  Compass,
  Heart,
  Folder,
  Clock,
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
  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 top-0 bottom-0 w-[60px] bg-dash-sidebar flex flex-col items-center py-4 z-50"
      >
        {/* Avatar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="w-9 h-9 mb-6 cursor-pointer ring-2 ring-dash-primary/30">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="bg-dash-primary text-dash-primary-foreground text-sm font-semibold">
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
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                      isActive
                        ? "bg-dash-primary text-dash-primary-foreground shadow-lg"
                        : "text-dash-sidebar-foreground/60 hover:text-dash-sidebar-foreground hover:bg-white/10"
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
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-dash-sidebar-foreground/60 hover:text-dash-sidebar-foreground hover:bg-white/10 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onSignOut}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-dash-sidebar-foreground/60 hover:text-dash-sidebar-foreground hover:bg-white/10 transition-all"
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
