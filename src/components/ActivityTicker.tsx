import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNewTools } from "@/hooks/use-tools";

export function ActivityTicker() {
  const newTools = useNewTools();
  const count = newTools.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-4 h-4 text-primary" />
      </motion.div>
      <span className="text-sm font-medium text-primary">
        {count} new tools added this week
      </span>
    </motion.div>
  );
}
