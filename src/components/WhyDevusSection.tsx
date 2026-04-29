import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { ChaosToOrderVisual } from "./landing/ChaosToOrderVisual";

const stats = [
  { value: "14", label: "Tools the average dev juggles daily" },
  { value: "62%", label: "Of teams prioritize stack consolidation" },
  { value: "69%", label: "Of devs augment their stack every year" },
];

export function WhyDevusSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: narrative */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Why Devus exists</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
            >
              The dev tool space is{" "}
              <span className="text-foreground/60">noisy.</span>
              <br />
              <span className="text-primary glow-text">Your stack shouldn&apos;t be.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg"
            >
              Devus turns the chaos of thousands of libraries, frameworks and AI tools
              into a focused, personalized feed — so you only see what fits the way you build.
            </motion.p>

            {/* Stat chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid grid-cols-3 gap-3"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.value}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-md p-3 md:p-4"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary glow-text leading-none">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[11px] md:text-xs text-muted-foreground leading-snug">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="order-first lg:order-last"
          >
            <ChaosToOrderVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
