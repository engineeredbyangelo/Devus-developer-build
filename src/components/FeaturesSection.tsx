import { motion } from "framer-motion";
import {
  Layers,
  Bot,
  Palette,
  Filter,
  Zap,
  LucideIcon,
  Tag,
  Sparkles,
  Heart,
  Star,
  MessageSquare,
  Eye,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  visual: "recommendations" | "ai" | "visuals" | "filter";
}

const features: FeatureItem[] = [
  {
    icon: Layers,
    title: "Personalized Recommendations",
    description:
      "Follow the categories you care about and get tools matched to your tech stack. Your feed learns from your favorites and adapts over time.",
    benefits: ["Stack-matched suggestions", "Category following", "Smarter over time"],
    visual: "recommendations",
  },
  {
    icon: Bot,
    title: "Ask Devus AI",
    description:
      "Need to compare two frameworks? Find an alternative? Check compatibility? Ask Devus and get instant, context-aware answers.",
    benefits: ["Tool comparisons", "Alternative finder", "Compatibility checks"],
    visual: "ai",
  },
  {
    icon: Palette,
    title: "Immersive Tool Cards",
    description:
      "Every tool gets a unique generative artwork based on its category and identity — no two cards look the same. A visual experience, not a spreadsheet.",
    benefits: ["Unique per-tool art", "Category color DNA", "Layered compositions"],
    visual: "visuals",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description:
      "Filter by category, tags, or tech stack compatibility. Follow categories to curate your feed and surface what matters most.",
    benefits: ["Category filters", "Tag-based search", "Tech stack matching"],
    visual: "filter",
  },
];

// Visual components for each feature
function RecommendationsVisual() {
  return (
    <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
      {/* Central icon */}
      <motion.div
        className="relative z-10"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
          <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary" />
        </div>
      </motion.div>

      {/* Floating recommendation cards */}
      {[
        { name: "For You", icon: Star, pos: { top: "10%", left: "5%" } },
        { name: "Trending", icon: Sparkles, pos: { top: "65%", left: "8%" } },
        { name: "New Match", icon: Layers, pos: { top: "20%", left: "70%" } },
      ].map((item, i) => (
        <motion.div
          key={item.name}
          className="absolute px-3 py-1.5 rounded-lg bg-secondary/80 backdrop-blur-sm border border-border/50 flex items-center gap-2"
          style={item.pos}
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
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
    <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
      {/* Central bot icon */}
      <motion.div
        className="relative z-10"
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
          <Bot className="w-10 h-10 md:w-12 md:h-12 text-primary" />
        </div>
      </motion.div>

      {/* Chat bubbles */}
      {[
        { text: "Compare Vite vs Webpack?", pos: { top: "10%", left: "3%" }, align: "left" },
        { text: "Vite is 10x faster...", pos: { top: "60%", right: "3%" }, align: "right" },
      ].map((bubble, i) => (
        <motion.div
          key={bubble.text}
          className={`absolute px-3 py-2 rounded-xl text-[11px] font-medium max-w-[140px] ${
            bubble.align === "left"
              ? "bg-secondary/80 border border-border/50 text-foreground/80"
              : "bg-primary/20 border border-primary/30 text-primary"
          }`}
          style={bubble.pos as any}
          animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
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
  const categoryColors = [
    { label: "Frontend", colors: ["hsl(190 90% 50%)", "hsl(210 80% 60%)"] },
    { label: "AI/ML", colors: ["hsl(320 80% 55%)", "hsl(340 70% 60%)"] },
    { label: "Backend", colors: ["hsl(270 70% 50%)", "hsl(250 60% 55%)"] },
  ];

  return (
    <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
      <motion.div className="relative z-10">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
          <Eye className="w-10 h-10 md:w-12 md:h-12 text-primary" />
        </div>
      </motion.div>

      {/* Mini gradient cards */}
      {categoryColors.map((cat, i) => (
        <motion.div
          key={cat.label}
          className="absolute w-16 md:w-20 rounded-lg overflow-hidden border border-border/50 shadow-lg"
          style={{
            top: `${15 + (i % 2) * 45}%`,
            left: i === 0 ? "5%" : i === 1 ? "70%" : "65%",
          }}
          animate={{ y: [0, i % 2 === 0 ? -5 : 5, 0], rotate: [0, i % 2 === 0 ? 2 : -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
        >
          <div
            className="h-8 md:h-10 w-full"
            style={{ background: `linear-gradient(135deg, ${cat.colors[0]}40, ${cat.colors[1]}30)` }}
          />
          <div className="bg-card/80 px-1.5 py-1">
            <span className="text-[8px] font-medium text-foreground">{cat.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FilterVisual() {
  const tags = ["React", "API", "Auth", "DB"];
  return (
    <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
      <motion.div className="relative z-10">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
          <Filter className="w-10 h-10 md:w-12 md:h-12 text-primary" />
        </div>
      </motion.div>

      {tags.map((tag, i) => (
        <motion.div
          key={tag}
          className="absolute px-2 md:px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-xs md:text-sm font-medium text-muted-foreground"
          style={{
            top: `${15 + (i % 2) * 55}%`,
            left: i < 2 ? `${10 + i * 10}%` : `${60 + (i - 2) * 10}%`,
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

      <motion.div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Layers className="w-6 h-6 text-primary/40" />
      </motion.div>
    </div>
  );
}

const visualComponents = {
  recommendations: RecommendationsVisual,
  ai: AIVisual,
  visuals: VisualsVisual,
  filter: FilterVisual,
};

function FeatureRow({ feature, index }: { feature: FeatureItem; index: number }) {
  const isReversed = index % 2 === 1;
  const isMobile = useIsMobile();
  const VisualComponent = visualComponents[feature.visual];
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="py-8 md:py-12"
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center ${
          isReversed && !isMobile ? "md:[direction:rtl]" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`space-y-4 ${isReversed && !isMobile ? "md:[direction:ltr]" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              {feature.title}
            </h3>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>

          <ul className="space-y-2 pt-2">
            {feature.benefits.map((benefit, i) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-foreground/80">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`glass rounded-2xl p-4 md:p-6 ${isReversed && !isMobile ? "md:[direction:ltr]" : ""}`}
        >
          <VisualComponent />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container relative px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Core Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A personalized dashboard that recommends, discovers, and organizes your developer toolkit
          </p>
        </motion.div>

        <div className="space-y-8 md:space-y-16">
          {features.map((feature, index) => (
            <FeatureRow key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
