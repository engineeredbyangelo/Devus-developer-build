import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb, TrendingUp, Layers, Zap, Search, GitBranch, Filter, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhySlide {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  gradient: string;
}

const slides: WhySlide[] = [
  {
    id: "problem",
    icon: Layers,
    title: "The Tool Overload Problem",
    description: "Developers juggle an average of 14 tools in their daily workflows. The ecosystem is fragmented, making it hard to find what you actually need.",
    stat: "14",
    statLabel: "Average tools per developer",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "consolidation",
    icon: TrendingUp,
    title: "The Push for Consolidation",
    description: "62% of executives are prioritizing tool consolidation to reduce complexity and boost productivity across their engineering teams.",
    stat: "62%",
    statLabel: "Executives prioritizing consolidation",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "discover",
    icon: Search,
    title: "Discover What Matters",
    description: "We aggregate tools from GitHub, ProductHunt, npm, and more—surfacing the best options so you don't have to hunt across platforms.",
    gradient: "from-primary/20 to-purple-500/20",
  },
  {
    id: "curate",
    icon: Target,
    title: "Curated, Not Cluttered",
    description: "Our AI-powered curation filters out the noise. Get recommendations based on your tech stack, use case, and community activity.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "streamline",
    icon: Zap,
    title: "Streamline Your Stack",
    description: "Compare tools side-by-side, access direct links and GitHub repos, and make informed decisions faster than ever.",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    id: "augment",
    icon: GitBranch,
    title: "Augment, Don't Replace",
    description: "We're not here to replace your favorites—we help you find complementary tools that fill gaps and enhance your existing workflow.",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
];

function WhySlideCard({ slide, index }: { slide: WhySlide; index: number }) {
  const Icon = slide.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative h-full"
    >
      <div className={`relative h-full rounded-2xl border border-border/50 bg-gradient-to-br ${slide.gradient} backdrop-blur-sm p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10`}>
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 rounded-2xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <motion.div
            className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Icon className="w-7 h-7 text-primary" />
          </motion.div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
            {slide.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed flex-grow">
            {slide.description}
          </p>

          {/* Stat (if exists) */}
          {slide.stat && (
            <div className="mt-6 pt-4 border-t border-border/50">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-baseline gap-2"
              >
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {slide.stat}
                </span>
                <span className="text-sm text-muted-foreground">
                  {slide.statLabel}
                </span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[100px]" />
      </div>
    </motion.div>
  );
}

export function WhyDevusSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slidesPerView = { mobile: 1, tablet: 2, desktop: 3 };
  
  // Get current slides per view based on screen (we'll use 3 for desktop)
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return slidesPerView.mobile;
      if (window.innerWidth < 1024) return slidesPerView.tablet;
      return slidesPerView.desktop;
    }
    return slidesPerView.desktop;
  };

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(slides.length / visibleCount);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalPages, isPaused]);

  const visibleSlides = slides.slice(
    currentIndex * visibleCount,
    currentIndex * visibleCount + visibleCount
  );

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  return (
    <section 
      className="py-20 md:py-28 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

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
            Why <span className="text-primary">Devus</span> Exists
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

        {/* Navigation row */}
        <div className="flex items-center justify-end mb-6 gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="h-10 w-10 rounded-xl hover:bg-secondary border border-border/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Page indicators */}
          <div className="flex items-center gap-2 px-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="h-10 w-10 rounded-xl hover:bg-secondary border border-border/50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Carousel */}
        <div className="relative min-h-[400px] md:min-h-[380px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleSlides.map((slide, i) => (
                <WhySlideCard key={slide.id} slide={slide} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Source citation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-muted-foreground/60">
            Source:{" "}
            <a
              href="https://www.mordorintelligence.com/industry-reports/software-development-tools-market"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-muted-foreground transition-colors"
            >
              Mordor Intelligence - Software Development Tools Market Report
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
