import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WireframeShimmerProps {
  className?: string;
  delay?: number;
  glow?: boolean;
  rounded?: string;
}

export function WireframeShimmer({
  className,
  delay = 0,
  glow = false,
  rounded = "rounded-md",
}: WireframeShimmerProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden bg-muted/60",
        rounded,
        glow && "ring-1 ring-primary/40 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)]",
        className,
      )}
    >
      {!reduce && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.18) 50%, transparent 100%)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1.6,
            delay: delay + 0.6,
          }}
        />
      )}
    </motion.div>
  );
}