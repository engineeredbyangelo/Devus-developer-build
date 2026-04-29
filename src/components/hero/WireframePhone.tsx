import { motion } from "framer-motion";
import { Home, User, Grid3x3, Settings } from "lucide-react";
import { WireframeShimmer } from "./WireframeShimmer";

export function WireframePhone() {
  return (
    <div className="relative w-full rounded-[2rem] border border-border/60 bg-background/80 backdrop-blur-xl p-1.5 shadow-[0_0_50px_-10px_hsl(var(--primary)/0.5)]">
      <div className="relative rounded-[1.6rem] overflow-hidden bg-card/60 border border-border/40">
        {/* Dynamic island */}
        <div className="flex justify-center pt-2">
          <div className="w-14 h-3 rounded-full bg-background border border-border/60" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="flex items-center justify-between px-3 pt-3"
        >
          <div className="flex flex-col gap-0.5">
            <div className="w-3 h-0.5 bg-foreground/60 rounded" />
            <div className="w-3 h-0.5 bg-foreground/60 rounded" />
            <div className="w-3 h-0.5 bg-foreground/60 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-primary/80" />
            <div className="h-1.5 w-8 rounded bg-foreground/70" />
          </div>
          <div className="w-4 h-4 rounded-full bg-muted/60" />
        </motion.div>

        {/* Tool of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 1.2 }}
          className="mx-3 mt-3 rounded-xl overflow-hidden border border-primary/40 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.5)]"
        >
          <div className="h-14 bg-gradient-to-br from-primary/50 via-accent/40 to-primary/30" />
          <div className="p-2 space-y-1 bg-background/40">
            <WireframeShimmer className="h-1.5 w-2/3" delay={1.4} />
            <WireframeShimmer className="h-1.5 w-1/2" delay={1.5} />
          </div>
        </motion.div>

        {/* Tool list rows */}
        <div className="px-3 mt-2.5 space-y-1.5">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1.5 + i * 0.1 }}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/40 to-accent/30 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-1.5 w-3/4 rounded bg-foreground/40" />
                <div className="h-1.5 w-1/2 rounded bg-muted/70" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-3 flex items-center justify-around py-2 border-t border-border/40 bg-background/60"
        >
          {[Home, Grid3x3, User, Settings].map((Icon, i) => (
            <Icon
              key={i}
              className={`w-3.5 h-3.5 ${i === 0 ? "text-primary" : "text-muted-foreground/50"}`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}