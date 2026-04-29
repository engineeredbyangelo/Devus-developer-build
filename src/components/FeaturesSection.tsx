import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { FeatureSwitcher } from "./landing/FeatureSwitcher";

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">How it works</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            One platform.{" "}
            <span className="text-primary glow-text">Four superpowers.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            From discovery to decision — every part of finding the right tool, redesigned around you.
          </p>
        </motion.div>

        <FeatureSwitcher />
      </div>
    </section>
  );
}
