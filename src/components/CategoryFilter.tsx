import { motion } from "framer-motion";
import { Category } from "@/lib/types";
import { categories } from "@/lib/data";
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

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
  className?: string;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectCategory(null)}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          selectedCategory === null
            ? "bg-primary text-primary-foreground glow-sm"
            : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        All
      </motion.button>
      {categories.map((category) => {
        const Icon = iconMap[category.icon as keyof typeof iconMap] || Layout;
        const isSelected = selectedCategory === category.id;

        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isSelected
                ? "bg-primary text-primary-foreground glow-sm"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{category.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
