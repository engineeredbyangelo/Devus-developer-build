import { motion } from "framer-motion";
import { Code, Database, Cloud, Cpu, Box, Globe, Layers, Bot } from "lucide-react";

const chaosIcons = [
  { Icon: Code, color: "hsl(190 90% 55%)" },
  { Icon: Database, color: "hsl(270 70% 60%)" },
  { Icon: Cloud, color: "hsl(210 80% 60%)" },
  { Icon: Cpu, color: "hsl(320 70% 60%)" },
  { Icon: Box, color: "hsl(150 70% 50%)" },
  { Icon: Globe, color: "hsl(40 90% 55%)" },
  { Icon: Layers, color: "hsl(190 90% 55%)" },
  { Icon: Bot, color: "hsl(290 70% 60%)" },
];

// Chaotic start positions (scattered)
const chaosPositions = [
  { x: -120, y: -80 },
  { x: 130, y: -100 },
  { x: -150, y: 40 },
  { x: 140, y: 60 },
  { x: -60, y: -120 },
  { x: 80, y: 110 },
  { x: -110, y: 120 },
  { x: 160, y: -30 },
];

export function ChaosToOrderVisual() {
  return (
    <div className="relative w-full aspect-square max-w-[480px] mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full blur-2xl" />

      {/* Glass panel */}
      <div className="relative w-full h-full rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Center target frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%] rounded-2xl border border-primary/30 bg-background/60 backdrop-blur-md p-4 shadow-[0_0_40px_hsl(var(--primary)/0.25)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="h-1.5 flex-1 rounded-full bg-primary/15">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                viewport={{ once: true }}
                transition={{ delay: 2.2, duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/40"
              />
            </div>
          </div>
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2.4 + i * 0.15 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/30"
              >
                <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/25" />
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 w-3/5 rounded-full bg-foreground/15" />
                  <div className="h-1 w-2/5 rounded-full bg-foreground/10" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating chaos icons -> collapse into the frame */}
        {chaosIcons.map(({ Icon, color }, i) => {
          const start = chaosPositions[i];
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-10 h-10 rounded-xl border border-border/50 bg-background/70 backdrop-blur-md flex items-center justify-center shadow-lg"
              initial={{ x: start.x, y: start.y, opacity: 0, scale: 0.6, rotate: -15 }}
              whileInView={{
                x: [start.x, start.x, 0],
                y: [start.y, start.y, 0],
                opacity: [0, 1, 1, 0.2],
                scale: [0.6, 1, 0.4],
                rotate: [-15, 0, 0],
              }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 2.4,
                delay: 0.2 + i * 0.08,
                times: [0, 0.3, 1],
                ease: "easeInOut",
              }}
              style={{ marginLeft: -20, marginTop: -20 }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </motion.div>
          );
        })}

        {/* Pulse ring on collapse */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-primary/40"
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: [0, 0.6, 0], scale: [0.4, 1.6, 2] }}
          viewport={{ once: true }}
          transition={{ delay: 1.6, duration: 1.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}