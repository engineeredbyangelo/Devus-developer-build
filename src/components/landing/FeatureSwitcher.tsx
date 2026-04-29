import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Bot,
  Palette,
  Filter,
  LucideIcon,
  Tag,
  Sparkles,
  Heart,
  Star,
  MessageSquare,
  Eye,
} from "lucide-react";

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  Visual: React.ComponentType;
}

function RecommendationsVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm"
      >
        <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary" />
      </motion.div>
      {[
        { name: "For You", icon: Star, pos: { top: "12%", left: "8%" } },
        { name: "Trending", icon: Sparkles, pos: { bottom: "12%", left: "10%" } },
        { name: "New Match", icon: Layers, pos: { top: "18%", right: "10%" } },
      ].map((item, i) => (
        <motion.div
          key={item.name}
          className="absolute px-3 py-1.5 rounded-lg bg-secondary/80 backdrop-blur-sm border border-border/50 flex items-center gap-2"
          style={item.pos as any}
          animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
        >
          <item.icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground/80">{item.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function AIVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm"
      >
        <Bot className="w-10 h-10 md:w-12 md:h-12 text-primary" />
      </motion.div>
      {[
        { text: "Compare Vite vs Webpack?", pos: { top: "12%", left: "6%" }, align: "left" },
        { text: "Vite is 10x faster…", pos: { bottom: "14%", right: "6%" }, align: "right" },
      ].map((bubble, i) => (
        <motion.div
          key={bubble.text}
          className={`absolute px-3 py-2 rounded-xl text-[11px] font-medium max-w-[150px] ${
            bubble.align === "left"
              ? "bg-secondary/80 border border-border/50 text-foreground/80"
              : "bg-primary/20 border border-primary/30 text-primary"
          }`}
          style={bubble.pos as any}
          animate={{ y: [0, -4, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
        >
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 shrink-0" />
            {bubble.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VisualsVisual() {
  const cats = [
    { label: "Frontend", colors: ["hsl(190 90% 50%)", "hsl(210 80% 60%)"], pos: { top: "14%", left: "8%" } },
    { label: "AI/ML", colors: ["hsl(320 80% 55%)", "hsl(340 70% 60%)"], pos: { top: "16%", right: "8%" } },
    { label: "Backend", colors: ["hsl(270 70% 50%)", "hsl(250 60% 55%)"], pos: { bottom: "14%", left: "30%" } },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm">
        <Eye className="w-10 h-10 md:w-12 md:h-12 text-primary" />
      </div>
      {cats.map((cat, i) => (
        <motion.div
          key={cat.label}
          className="absolute w-20 rounded-lg overflow-hidden border border-border/50 shadow-lg"
          style={cat.pos as any}
          animate={{ y: [0, i % 2 === 0 ? -5 : 5, 0], rotate: [0, i % 2 === 0 ? 2 : -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
        >
          <div className="h-10 w-full" style={{ background: `linear-gradient(135deg, ${cat.colors[0]}40, ${cat.colors[1]}30)` }} />
          <div className="bg-card/80 px-1.5 py-1">
            <span className="text-[9px] font-medium text-foreground">{cat.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FilterVisual() {
  const tags = ["React", "API", "Auth", "DB"];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 backdrop-blur-sm">
        <Filter className="w-10 h-10 md:w-12 md:h-12 text-primary" />
      </div>
      {tags.map((tag, i) => (
        <motion.div
          key={tag}
          className="absolute px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted-foreground"
          style={{
            top: `${15 + (i % 2) * 60}%`,
            left: i < 2 ? `${10 + i * 8}%` : `${65 + (i - 2) * 8}%`,
          }}
          animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
        >
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {tag}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const features: Feature[] = [
  {
    id: "rec",
    icon: Layers,
    title: "Personalized Recommendations",
    description:
      "Follow categories you care about and get tools matched to your tech stack. Your feed learns from your favorites and adapts over time.",
    benefits: ["Stack-matched suggestions", "Category following", "Smarter over time"],
    Visual: RecommendationsVisual,
  },
  {
    id: "ai",
    icon: Bot,
    title: "Ask Devus AI",
    description:
      "Compare frameworks, find alternatives, check compatibility — get instant, context-aware answers in natural language.",
    benefits: ["Tool comparisons", "Alternative finder", "Compatibility checks"],
    Visual: AIVisual,
  },
  {
    id: "viz",
    icon: Palette,
    title: "Immersive Tool Cards",
    description:
      "Every tool gets unique generative artwork based on its category and identity — a visual experience, not a spreadsheet.",
    benefits: ["Unique per-tool art", "Category color DNA", "Layered compositions"],
    Visual: VisualsVisual,
  },
  {
    id: "filter",
    icon: Filter,
    title: "Smart Filtering",
    description:
      "Filter by category, tags, or tech stack compatibility. Curate your feed and surface what matters most to you.",
    benefits: ["Category filters", "Tag-based search", "Tech stack matching"],
    Visual: FilterVisual,
  },
];

export function FeatureSwitcher() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % features.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  const current = features[active];
  const Visual = current.Visual;

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tabs */}
      <div className="lg:col-span-5 space-y-2.5">
        {features.map((f, i) => {
          const Icon = f.icon;
          const isActive = i === active;
          return (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              className={`group relative w-full text-left rounded-2xl border p-4 md:p-5 transition-all duration-300 ${
                isActive
                  ? "border-primary/40 bg-primary/5 shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
                  : "border-border/50 bg-card/40 hover:border-border hover:bg-card/60"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="feature-indicator"
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary glow"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-primary/20 border border-primary/40"
                      : "bg-secondary/60 border border-border/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold text-base md:text-lg ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                    {f.title}
                  </h3>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {f.description}
                        </p>
                        <ul className="flex flex-wrap gap-2 mt-3">
                          {f.benefits.map((b) => (
                            <li
                              key={b}
                              className="text-[11px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual panel */}
      <div className="lg:col-span-7">
        <div className="relative rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_hsl(var(--primary)/0.08)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-background/40">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-3 py-1 rounded-md bg-secondary/60 text-[10px] text-muted-foreground border border-border/40">
                devus.app / {current.id}
              </div>
            </div>
          </div>
          {/* Visual area */}
          <div className="relative h-[260px] sm:h-[320px] md:h-[400px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Visual />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 py-3 border-t border-border/50 bg-background/40">
            {features.map((f, i) => (
              <button
                key={f.id}
                onClick={() => setActive(i)}
                aria-label={f.title}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-primary glow-sm" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
