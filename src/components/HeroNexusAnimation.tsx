import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Paintbrush,
  FileCode,
  Triangle,
  Github,
  Box,
  Cpu,
  Globe,
  Terminal,
  Layers,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Tool definitions with icons and names
const tools = [
  { icon: Code2, name: "React", ring: 1 },
  { icon: Code2, name: "Vue", ring: 1 },
  { icon: Code2, name: "Svelte", ring: 1 },
  { icon: Server, name: "Node.js", ring: 1 },
  { icon: Database, name: "Supabase", ring: 2 },
  { icon: Paintbrush, name: "Tailwind", ring: 2 },
  { icon: FileCode, name: "TypeScript", ring: 2 },
  { icon: Database, name: "Prisma", ring: 2 },
  { icon: Triangle, name: "Vercel", ring: 2 },
  { icon: Github, name: "GitHub", ring: 3 },
  { icon: Box, name: "Docker", ring: 3 },
  { icon: Cpu, name: "Deno", ring: 3 },
  { icon: Globe, name: "Next.js", ring: 3 },
  { icon: Terminal, name: "Bun", ring: 3 },
  { icon: Layers, name: "Vite", ring: 3 },
];

// Orbital ring configurations
const ringConfigs = [
  { radius: 100, duration: 25, direction: 1 },
  { radius: 160, duration: 35, direction: -1 },
  { radius: 220, duration: 45, direction: 1 },
];

export function HeroNexusAnimation() {
  // Group tools by ring
  const ring1Tools = tools.filter((t) => t.ring === 1);
  const ring2Tools = tools.filter((t) => t.ring === 2);
  const ring3Tools = tools.filter((t) => t.ring === 3);
  const ringGroups = [ring1Tools, ring2Tools, ring3Tools];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
        {/* Orbital rings (visual guides) */}
        {ringConfigs.map((config, ringIndex) => (
          <div
            key={`ring-${ringIndex}`}
            className="absolute rounded-full border border-primary/10"
            style={{
              width: config.radius * 2,
              height: config.radius * 2,
            }}
          />
        ))}

        {/* Rotating orbital containers with tools */}
        {ringConfigs.map((config, ringIndex) => (
          <motion.div
            key={`orbit-${ringIndex}`}
            className="absolute"
            style={{
              width: config.radius * 2,
              height: config.radius * 2,
            }}
            animate={{ rotate: 360 * config.direction }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {ringGroups[ringIndex].map((tool, toolIndex) => {
              const angle =
                (360 / ringGroups[ringIndex].length) * toolIndex - 90;
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * config.radius;
              const y = Math.sin(radian) * config.radius;

              return (
                <Tooltip key={tool.name}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="absolute cursor-pointer"
                      style={{
                        left: `calc(50% + ${x}px - 20px)`,
                        top: `calc(50% + ${y}px - 20px)`,
                      }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {/* Counter-rotate to keep icons upright */}
                      <motion.div
                        animate={{ rotate: -360 * config.direction }}
                        transition={{
                          duration: config.duration,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-10 h-10 rounded-full bg-card border border-primary/20 flex items-center justify-center orb-glow hover:border-primary/50 transition-colors"
                      >
                        <tool.icon className="w-5 h-5 text-primary" />
                      </motion.div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-card/90 backdrop-blur border-primary/20"
                  >
                    <span className="text-sm font-medium">{tool.name}</span>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </motion.div>
        ))}

        {/* Connection lines (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 500 500"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Animated connection pulses */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.line
              key={`line-${i}`}
              x1="250"
              y1="250"
              x2={250 + Math.cos((angle * Math.PI) / 180) * 220}
              y2={250 + Math.sin((angle * Math.PI) / 180) * 220}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="4 6"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
            />
          ))}
        </svg>

        {/* Central Nexus */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-primary/20 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute w-20 h-20 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          {/* Core */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center nexus-glow">
            <span className="text-2xl font-bold text-primary-foreground">D</span>
          </div>

          {/* Radiating rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={`radiate-${i}`}
              className="absolute rounded-full border border-primary/20"
              style={{
                width: 64 + i * 20,
                height: 64 + i * 20,
              }}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: [0.8, 1.2],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
