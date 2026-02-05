import { motion } from "framer-motion";
import { Lightbulb, Layers, TrendingUp, GitBranch } from "lucide-react";

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
      {/* Glass card */}
      <div className="relative h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <motion.div
            className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground group-hover:text-primary/90 transition-colors duration-300">
            {card.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed flex-grow">
            {card.description}
          </p>

          {/* Stat (if exists) */}
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

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
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
            <span className="text-sm font-medium text-primary">We Did Our Homework</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <GlassCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
