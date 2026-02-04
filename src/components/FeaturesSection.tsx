import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Filter,
  Star,
  CheckCircle,
  Lightbulb,
  Zap,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ExternalLink,
    title: "Direct Links",
    description: "Jump straight to any tool's official website with one click",
  },
  {
    icon: Github,
    title: "GitHub Access",
    description: "Explore source code and contribute to open-source projects",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description: "Find tools by category, tags, or tech stack compatibility",
  },
  {
    icon: Star,
    title: "Community Rated",
    description: "See upvotes and discover what developers love most",
  },
  {
    icon: CheckCircle,
    title: "Verified Details",
    description: "Accurate pros, cons, and learning curve for each tool",
  },
  {
    icon: Lightbulb,
    title: "Real Use Cases",
    description: "Understand exactly when and how to use each tool",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Core Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What makes Devus your go-to developer hub
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover, compare, and track the best developer tools
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="glass glass-hover rounded-xl p-6 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
