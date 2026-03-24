import { motion } from "framer-motion";
import { Lightbulb, Layers, TrendingUp, GitBranch, Smartphone, Bot, Star, Heart, Settings, User, Home } from "lucide-react";

interface WhyCard {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

const cards: WhyCard[] = [
  {
    id: "problem",
    icon: Layers,
    title: "The Tool Overload Problem",
    description: "Developers juggle an average of 14 tools in their daily workflows. The ecosystem is fragmented, making it hard to find what you actually need.",
    stat: "14",
    statLabel: "Average tools per developer",
  },
  {
    id: "consolidation",
    icon: TrendingUp,
    title: "The Push for Consolidation",
    description: "62% of executives are prioritizing tool consolidation to reduce complexity and boost productivity across their engineering teams.",
    stat: "62%",
    statLabel: "Executives prioritizing consolidation",
  },
  {
    id: "augment",
    icon: GitBranch,
    title: "Augment, Don't Replace",
    description: "We're not here to replace your favorites—we help you find complementary tools that fill gaps and enhance your existing workflow.",
    stat: "69%",
    statLabel: "Developers augmenting their stack yearly",
  },
];

interface MobileFeature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const mobileFeatures: MobileFeature[] = [
  { id: "feed", icon: Layers, title: "Personalized Feed", description: "Tools matched to your followed categories and tech stack" },
  { id: "totd", icon: Star, title: "Tool of the Day", description: "A daily hand-picked tool recommendation just for you" },
  { id: "ask", icon: Bot, title: "Ask Devus AI", description: "Compare tools, find alternatives, check compatibility instantly" },
  { id: "categories", icon: Layers, title: "Category Following", description: "Follow categories and get recommendations tailored to your interests" },
  { id: "profile", icon: Heart, title: "Profile & Favorites", description: "Build your personal toolkit and track your favorite tools" },
];

function GlassCard({ card, index }: { card: WhyCard; index: number }) {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm" />
        
        <div className="relative z-10 flex flex-col h-full">
          <motion.div
            className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>

          <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground group-hover:text-primary/90 transition-colors duration-300">
            {card.title}
          </h3>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed flex-grow">
            {card.description}
          </p>

          {card.stat && (
            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-primary glow-text">
                  {card.stat}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {card.statLabel}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

function MobileAppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative flex justify-center"
    >
      {/* Phone frame */}
      <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px] rounded-[36px] border-2 border-border/60 bg-background shadow-2xl shadow-primary/10 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-background rounded-b-2xl z-20 border-b border-x border-border/40" />

        {/* Screen content */}
        <div className="relative h-full pt-8 pb-0 px-3 flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                <Star className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-foreground">
                Dev<span className="text-primary">us</span>
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-3 h-3 text-primary" />
            </div>
          </div>

          {/* Tool of the Day */}
          <div className="mx-1 mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Star className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-semibold text-foreground">Tool of the Day</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border/40 bg-card/60 overflow-hidden"
            >
              {/* Abstract gradient visual banner */}
              <div
                className="h-16 w-full relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(190 90% 50% / 0.3), hsl(210 80% 60% / 0.2), hsl(250 70% 55% / 0.15))",
                }}
              >
                {/* Decorative shapes */}
                <div className="absolute top-2 right-4 w-10 h-10 rounded-full border border-white/10" />
                <div className="absolute bottom-1 left-6 w-6 h-6 rounded-lg bg-white/5 rotate-12" />
                <div className="absolute top-3 left-1/3 w-14 h-[2px] bg-white/10 rotate-[-20deg]" />
              </div>
              <div className="p-2">
                <div className="text-[10px] font-semibold text-foreground">Vite 6.0</div>
                <div className="text-[8px] text-muted-foreground">Matched to your stack</div>
              </div>
            </motion.div>
          </div>

          {/* Recommended Section */}
          <div className="mx-1 mb-3 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Layers className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-semibold text-foreground">Recommended</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Prisma ORM", gradient: "linear-gradient(135deg, hsl(270 70% 50% / 0.3), hsl(290 60% 45% / 0.2))", cat: "Backend" },
                { name: "Playwright", gradient: "linear-gradient(135deg, hsl(10 80% 55% / 0.3), hsl(25 70% 50% / 0.2))", cat: "Testing" },
              ].map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="rounded-lg border border-border/40 bg-card/60 overflow-hidden"
                >
                  <div
                    className="h-10 w-full relative overflow-hidden"
                    style={{ background: tool.gradient }}
                  >
                    <div className="absolute top-1 right-2 w-5 h-5 rounded-full border border-white/10" />
                    <div className="absolute bottom-1 left-2 w-3 h-3 rounded bg-white/5 rotate-6" />
                  </div>
                  <div className="p-1.5">
                    <div className="text-[9px] font-semibold text-foreground truncate">{tool.name}</div>
                    <div className="text-[7px] text-muted-foreground">{tool.cat}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ask Devus input bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="mx-1 mb-2 h-8 rounded-lg bg-secondary/50 border border-border/30 flex items-center px-2.5 gap-1.5"
          >
            <Bot className="w-3 h-3 text-primary" />
            <span className="text-[9px] text-muted-foreground">Ask Devus anything...</span>
          </motion.div>

          {/* Bottom nav — 4 tabs */}
          <div className="flex items-center justify-around py-2 mt-auto border-t border-border/30">
            {[
              { icon: Home, label: "Home", active: true },
              { icon: User, label: "Profile", active: false },
              { icon: Layers, label: "Categories", active: false },
              { icon: Settings, label: "Settings", active: false },
            ].map((tab) => (
              <div key={tab.label} className={`flex flex-col items-center gap-0.5 p-1 rounded-lg ${tab.active ? "bg-primary/10" : ""}`}>
                <tab.icon className={`w-3.5 h-3.5 ${tab.active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[7px] ${tab.active ? "text-primary font-medium" : "text-muted-foreground"}`}>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow behind phone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
    </motion.div>
  );
}

export function WhyDevusSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Developers Choose Us</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Why <span className="text-foreground">Dev</span>
            <span className="text-primary glow-text">us</span> Exists
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            The developer tool landscape is overwhelming. We're here to help you navigate it.
          </motion.p>
        </div>

        {/* Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-28 md:mb-36">
          {cards.map((card, i) => (
            <GlassCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Mobile App Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Features list */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Built for Your Workflow</span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
            >
              Your toolkit,{" "}
              <span className="text-primary glow-text">personalized</span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg"
            >
              A personalized dashboard that learns your preferences, recommends tools matched to your stack, and keeps you ahead with weekly drops.
            </motion.p>

            <div className="space-y-4">
              {mobileFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Phone mockup */}
          <MobileAppPreview />
        </div>
      </div>
    </section>
  );
}
