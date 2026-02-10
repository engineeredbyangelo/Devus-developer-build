import { motion } from "framer-motion";
import { Zap, Monitor, BookOpen, Users, Check, Ban } from "lucide-react";
import { Tool } from "@/lib/types";

interface ToolInfoCardsProps {
  tool: Tool;
}

const cardClass =
  "glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30";

export function ToolInfoCards({ tool }: ToolInfoCardsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Use Cases */}
      {tool.useCases && tool.useCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cardClass}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Zap className="w-5 h-5 text-primary" />
            Use Cases
          </h3>
          <ul className="space-y-2">
            {tool.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                {uc}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Works Great With */}
      {tool.techStackFit && tool.techStackFit.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cardClass}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Monitor className="w-5 h-5 text-primary" />
            Works Great With
          </h3>
          <div className="flex flex-wrap gap-2">
            {tool.techStackFit.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Learning & Community */}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cardClass}
        >
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5 text-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            Learning Curve
          </h3>
          <p className="text-sm font-semibold text-primary capitalize">
            {tool.learningCurve === "low"
              ? "Easy to Learn"
              : tool.learningCurve === "medium"
              ? "Moderate"
              : "Steep"}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={cardClass}
        >
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5 text-foreground">
            <Users className="w-4 h-4 text-primary" />
            Community
          </h3>
          <p className="text-sm font-semibold text-primary capitalize">
            {tool.communityActivity?.replace("-", " ") || "Unknown"}
          </p>
        </motion.div>
      </div>

      {/* Pros & Cons */}
      {(tool.pros || tool.cons) && (
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cardClass}
          >
            <h3 className="text-sm font-semibold mb-3 text-primary">Pros</h3>
            <ul className="space-y-2">
              {tool.pros?.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  {pro}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={cardClass}
          >
            <h3 className="text-sm font-semibold mb-3 text-destructive">Cons</h3>
            <ul className="space-y-2">
              {tool.cons?.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Ban className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                  {con}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </div>
  );
}
