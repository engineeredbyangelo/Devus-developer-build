import { motion } from "framer-motion";
import { Tag } from "@/lib/types";
import { tags } from "@/lib/data";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  selectedTags: Tag[];
  onToggleTag: (tag: Tag) => void;
  className?: string;
}

export function TagFilter({
  selectedTags,
  onToggleTag,
  className,
}: TagFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.id);

        return (
          <motion.button
            key={tag.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleTag(tag.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              "border",
              isSelected
                ? "bg-primary/20 border-primary text-primary"
                : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground"
            )}
          >
            {tag.name}
          </motion.button>
        );
      })}
    </div>
  );
}
