import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityTicker } from "./ActivityTicker";
import { HeroNexusAnimation } from "./HeroNexusAnimation";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col">
            {/* Activity ticker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ActivityTicker />
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              Discover the best
              <br />
              <span className="text-primary glow-text">developer tools</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl"
            >
              A curated collection of frameworks, libraries, and tools to supercharge 
              your development workflow. Stop doom-scrolling, start building.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-start gap-4"
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className="h-12 px-8 text-base gap-2 glow"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base gap-2 border-border hover:bg-secondary/50"
                onClick={() => {
                  document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Tools
                <Sparkles className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Zap, label: "35+ Curated Tools", desc: "Hand-picked for quality" },
                { icon: Shield, label: "Honest Reviews", desc: "Pros, cons, alternatives" },
                { icon: Users, label: "Community Driven", desc: "Vote & submit tools" },
              ].map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-start p-4 rounded-xl glass glass-hover"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{feature.label}</span>
                  <span className="text-sm text-muted-foreground">{feature.desc}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Nexus Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <HeroNexusAnimation />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
