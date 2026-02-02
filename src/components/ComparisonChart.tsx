import { motion } from "framer-motion";
import { Check, X, Minus, Sparkles } from "lucide-react";

interface ComparisonItem {
  feature: string;
  devus: "full" | "partial" | "none";
  twitter: "full" | "partial" | "none";
  reddit: "full" | "partial" | "none";
  indiehacker: "full" | "partial" | "none";
}

const comparisonData: ComparisonItem[] = [
  { feature: "Curated Developer Tools", devus: "full", twitter: "none", reddit: "partial", indiehacker: "partial" },
  { feature: "Category Filtering", devus: "full", twitter: "none", reddit: "partial", indiehacker: "none" },
  { feature: "Quick Tool Comparison", devus: "full", twitter: "none", reddit: "none", indiehacker: "none" },
  { feature: "Save Favorites", devus: "full", twitter: "partial", reddit: "partial", indiehacker: "none" },
  { feature: "Noise-Free Discovery", devus: "full", twitter: "none", reddit: "partial", indiehacker: "partial" },
  { feature: "Tool Submission", devus: "full", twitter: "none", reddit: "full", indiehacker: "full" },
  { feature: "Custom Alerts", devus: "full", twitter: "partial", reddit: "none", indiehacker: "none" },
  { feature: "Verified Reviews", devus: "full", twitter: "none", reddit: "partial", indiehacker: "partial" },
];

const platforms = [
  { key: "devus" as const, label: "Devus", highlight: true },
  { key: "twitter" as const, label: "Twitter", highlight: false },
  { key: "reddit" as const, label: "Reddit", highlight: false },
  { key: "indiehacker" as const, label: "IndieHacker", highlight: false },
];

const StatusIcon = ({ status }: { status: "full" | "partial" | "none" }) => {
  if (status === "full") {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-500" />
      </div>
    );
  }
  if (status === "partial") {
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <Minus className="w-4 h-4 text-yellow-500" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
      <X className="w-4 h-4 text-red-500" />
    </div>
  );
};

// Mobile card for each feature
function MobileFeatureCard({ item, index }: { item: ComparisonItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl p-4"
    >
      <h3 className="font-medium text-sm mb-3 text-foreground">{item.feature}</h3>
      <div className="space-y-2">
        {platforms.map((platform) => (
          <div
            key={platform.key}
            className={`flex items-center justify-between py-1.5 px-2 rounded-lg ${
              platform.highlight ? "bg-primary/10" : ""
            }`}
          >
            <span className={`text-sm ${platform.highlight ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {platform.label}
            </span>
            <StatusIcon status={item[platform.key]} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function ComparisonChart() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container relative px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Why Devus?
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Stop Scrolling. Start Building.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Finding the right dev tool shouldn't mean hours on Twitter threads or Reddit rabbit holes. 
            See how Devus compares to traditional discovery methods.
          </p>
        </motion.div>

        {/* Mobile Layout - Stacked Cards */}
        <div className="lg:hidden space-y-4">
          {comparisonData.map((item, index) => (
            <MobileFeatureCard key={item.feature} item={item} index={index} />
          ))}
        </div>

        {/* Desktop Layout - Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="hidden lg:block glass rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-border/50 bg-secondary/30">
            <div className="text-sm font-medium text-muted-foreground">Feature</div>
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/20 text-primary font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                Devus
              </div>
            </div>
            <div className="text-center text-sm font-medium text-muted-foreground">Twitter</div>
            <div className="text-center text-sm font-medium text-muted-foreground">Reddit</div>
            <div className="text-center text-sm font-medium text-muted-foreground">IndieHacker</div>
          </div>

          {/* Table Rows */}
          {comparisonData.map((item, index) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-5 gap-4 p-4 border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors"
            >
              <div className="text-sm font-medium">{item.feature}</div>
              <div className="flex justify-center">
                <StatusIcon status={item.devus} />
              </div>
              <div className="flex justify-center">
                <StatusIcon status={item.twitter} />
              </div>
              <div className="flex justify-center">
                <StatusIcon status={item.reddit} />
              </div>
              <div className="flex justify-center">
                <StatusIcon status={item.indiehacker} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <StatusIcon status="full" />
            <span>Full Support</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status="partial" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status="none" />
            <span>Not Available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
