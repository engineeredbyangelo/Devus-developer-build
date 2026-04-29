import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { WireframeShimmer } from "./WireframeShimmer";

const QUERY = "react animation library";

export function WireframeDesktop() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? QUERY : "");
  const [highlight, setHighlight] = useState(reduce);
  const [showChat, setShowChat] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const loop = () => {
      setTyped("");
      setHighlight(false);
      setShowChat(false);

      // Type characters
      QUERY.split("").forEach((_, i) => {
        timeouts.push(
          setTimeout(() => {
            if (!cancelled) setTyped(QUERY.slice(0, i + 1));
          }, 2000 + i * 60),
        );
      });
      timeouts.push(setTimeout(() => !cancelled && setHighlight(true), 2000 + QUERY.length * 60 + 300));
      timeouts.push(setTimeout(() => !cancelled && setShowChat(true), 2000 + QUERY.length * 60 + 900));
      timeouts.push(setTimeout(loop, 7500));
    };
    loop();
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border/60 bg-card/40 backdrop-blur-xl shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-background/40">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex-1 mx-3 h-5 rounded-md bg-muted/50 flex items-center justify-center">
          <span className="text-[9px] text-muted-foreground/70 font-mono">devus.one</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Top nav */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-primary/80" />
            <div className="h-2.5 w-12 rounded bg-foreground/70" />
          </div>
          <div className="flex gap-1.5 ml-3">
            <div className="h-2 w-10 rounded bg-muted/70" />
            <div className="h-2 w-10 rounded bg-muted/70" />
            <div className="h-2 w-10 rounded bg-muted/70" />
          </div>
          <div className="ml-auto w-6 h-6 rounded-full bg-muted/60" />
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          style={{ transformOrigin: "left" }}
          className="flex items-center gap-2 h-9 px-3 rounded-lg bg-muted/40 border border-border/40"
        >
          <Search className="w-3.5 h-3.5 text-primary/80" />
          <span className="text-[11px] text-foreground/90 font-mono flex-1 truncate">
            {typed}
            {!reduce && (
              <motion.span
                className="inline-block w-[1px] h-3 bg-primary ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            {!typed && (
              <span className="text-muted-foreground/60">Ask Devus...</span>
            )}
          </span>
        </motion.div>

        {/* Recommended row label */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-2 w-20 rounded bg-foreground/40" />
          <div className="h-2 w-10 rounded bg-muted/60" />
        </div>

        {/* Tool cards row */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 + i * 0.08 }}
              className={`relative rounded-lg border overflow-hidden bg-background/60 transition-all duration-500 ${
                highlight && i === 1
                  ? "border-primary/60 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]"
                  : "border-border/40"
              }`}
            >
              <div
                className={`h-10 ${
                  i === 0
                    ? "bg-gradient-to-br from-primary/40 to-accent/30"
                    : i === 1
                    ? "bg-gradient-to-br from-accent/40 to-primary/30"
                    : "bg-gradient-to-br from-primary/30 to-muted/40"
                }`}
              />
              <div className="p-2 space-y-1.5">
                <WireframeShimmer className="h-1.5 w-3/4" delay={1.4 + i * 0.08} />
                <WireframeShimmer className="h-1.5 w-1/2" delay={1.5 + i * 0.08} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trending row label */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-2 w-16 rounded bg-foreground/40" />
        </div>

        {/* Trending small cards */}
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <WireframeShimmer
              key={i}
              className="h-10"
              rounded="rounded-md"
              delay={1.6 + i * 0.06}
            />
          ))}
        </div>
      </div>

      {/* AI chat bubble */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/15 border border-primary/40 backdrop-blur"
        >
          <Sparkles className="w-3 h-3 text-primary" />
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}