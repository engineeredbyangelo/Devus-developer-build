import { Category } from "@/lib/types";
import { getCategoryInfo } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Layout,
  Server,
  Container,
  Brain,
  Database,
  TestTube,
  Smartphone,
  Shield,
  Zap,
} from "lucide-react";

const iconMap = {
  Layout,
  Server,
  Container,
  Brain,
  Database,
  TestTube,
  Smartphone,
  Shield,
  Zap,
};

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({
  category,
  size = "md",
  showIcon = true,
  className,
}: CategoryBadgeProps) {
  const info = getCategoryInfo(category);
  if (!info) return null;

  const Icon = iconMap[info.icon as keyof typeof iconMap] || Layout;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium",
        "bg-secondary/50 text-muted-foreground",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{info.name}</span>
    </span>
  );
}
