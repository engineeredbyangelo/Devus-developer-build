 import { motion } from "framer-motion";
 import {
   Check,
   X,
   Minus,
   Sparkles,
   LayoutGrid,
   Filter,
   GitCompare,
   Heart,
   Zap,
   Upload,
   Bell,
   ShieldCheck,
   LucideIcon,
 } from "lucide-react";
 import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonItem {
  feature: string;
   icon: LucideIcon;
  devus: "full" | "partial" | "none";
  twitter: "full" | "partial" | "none";
  reddit: "full" | "partial" | "none";
  indiehacker: "full" | "partial" | "none";
}

const comparisonData: ComparisonItem[] = [
   { feature: "Curated Developer Tools", icon: LayoutGrid, devus: "full", twitter: "none", reddit: "partial", indiehacker: "partial" },
   { feature: "Category Filtering", icon: Filter, devus: "full", twitter: "none", reddit: "partial", indiehacker: "none" },
   { feature: "Quick Tool Comparison", icon: GitCompare, devus: "full", twitter: "none", reddit: "none", indiehacker: "none" },
   { feature: "Save Favorites", icon: Heart, devus: "full", twitter: "partial", reddit: "partial", indiehacker: "none" },
   { feature: "Noise-Free Discovery", icon: Zap, devus: "full", twitter: "none", reddit: "partial", indiehacker: "partial" },
   { feature: "Tool Submission", icon: Upload, devus: "full", twitter: "none", reddit: "full", indiehacker: "full" },
   { feature: "Custom Alerts", icon: Bell, devus: "full", twitter: "partial", reddit: "none", indiehacker: "none" },
   { feature: "Verified Reviews", icon: ShieldCheck, devus: "full", twitter: "none", reddit: "partial", indiehacker: "partial" },
];

const platforms = [
  { key: "devus" as const, label: "Devus", highlight: true },
  { key: "twitter" as const, label: "Twitter", highlight: false },
  { key: "reddit" as const, label: "Reddit", highlight: false },
  { key: "indiehacker" as const, label: "IndieHacker", highlight: false },
];

 const StatusIcon = ({
   status,
   isDevus = false,
 }: {
   status: "full" | "partial" | "none";
   isDevus?: boolean;
 }) => {
   const size = isDevus ? "w-7 h-7" : "w-6 h-6";
   const iconSize = isDevus ? "w-4.5 h-4.5" : "w-4 h-4";
 
  if (status === "full") {
    return (
       <div
         className={`${size} rounded-full flex items-center justify-center ${
           isDevus
             ? "bg-green-500/30 ring-2 ring-green-500/20"
             : "bg-green-500/20"
         }`}
       >
         <Check className={`${iconSize} text-green-500`} />
      </div>
    );
  }
  if (status === "partial") {
    return (
       <div
         className={`${size} rounded-full flex items-center justify-center ${
           isDevus
             ? "bg-yellow-500/30 ring-2 ring-yellow-500/20"
             : "bg-yellow-500/20"
         }`}
       >
         <Minus className={`${iconSize} text-yellow-500`} />
      </div>
    );
  }
  return (
     <div
       className={`${size} rounded-full flex items-center justify-center ${
         isDevus ? "bg-red-500/30 ring-2 ring-red-500/20" : "bg-red-500/20"
       }`}
     >
       <X className={`${iconSize} text-red-500`} />
    </div>
  );
};

// Mobile card for each feature
function MobileFeatureCard({ item, index }: { item: ComparisonItem; index: number }) {
   const Icon = item.icon;
   const devusScore = item.devus === "full" ? "Full Support" : item.devus === "partial" ? "Partial" : "None";
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
       className="glass rounded-xl overflow-hidden"
    >
       {/* Devus highlight at top */}
       <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-3 border-b border-primary/20">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
               <Sparkles className="w-4 h-4 text-primary" />
             </div>
             <span className="font-semibold text-primary">Devus</span>
          </div>
           <div className="flex items-center gap-2">
             <StatusIcon status={item.devus} isDevus />
             <span className="text-sm font-medium text-green-500">{devusScore}</span>
           </div>
         </div>
       </div>
 
       {/* Feature name with icon */}
       <div className="p-4 border-b border-border/30">
         <div className="flex items-center gap-2">
           <Icon className="w-4 h-4 text-muted-foreground" />
           <h3 className="font-medium text-sm text-foreground">{item.feature}</h3>
         </div>
       </div>
 
       {/* Other platforms */}
       <div className="p-3 space-y-2 bg-secondary/20">
         {platforms.slice(1).map((platform) => (
           <div
             key={platform.key}
             className="flex items-center justify-between py-1"
           >
             <span className="text-sm text-muted-foreground">{platform.label}</span>
             <div className="flex items-center gap-2">
               <StatusIcon status={item[platform.key]} />
               <span className="text-xs text-muted-foreground w-14">
                 {item[platform.key] === "full"
                   ? "Full"
                   : item[platform.key] === "partial"
                   ? "Partial"
                   : "None"}
               </span>
             </div>
           </div>
         ))}
      </div>
    </motion.div>
  );
}

export function ComparisonChart() {
   const isMobile = useIsMobile();
 
  return (
     <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container relative px-4 md:px-6">
         {/* Legend - Top on mobile */}
         {isMobile && (
           <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-muted-foreground"
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
               <span>None</span>
             </div>
           </motion.div>
         )}
 
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Why Devus?
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
             See How Devus Compares
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
           className="hidden lg:block glass rounded-2xl overflow-hidden border border-border/50"
        >
          {/* Table Header */}
           <div className="grid grid-cols-5 gap-4 p-4 border-b border-border/50 bg-secondary/40">
             <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
               Feature
             </div>
             <div className="text-center relative">
               {/* Devus column glow effect */}
               <div className="absolute inset-0 -top-4 bg-gradient-to-b from-primary/10 to-transparent rounded-t-xl pointer-events-none" />
               <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary/30 to-primary/20 text-primary font-semibold text-sm shadow-lg shadow-primary/10 border border-primary/30">
                <Sparkles className="w-4 h-4" />
                Devus
              </div>
            </div>
            <div className="text-center text-sm font-medium text-muted-foreground">Twitter</div>
            <div className="text-center text-sm font-medium text-muted-foreground">Reddit</div>
            <div className="text-center text-sm font-medium text-muted-foreground">IndieHacker</div>
          </div>

          {/* Table Rows */}
           {comparisonData.map((item, index) => {
             const Icon = item.icon;
             return (
               <motion.div
                 key={item.feature}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.05 }}
                 className={`grid grid-cols-5 gap-4 p-4 border-b border-border/30 last:border-0 transition-all duration-200 hover:bg-secondary/30 group ${
                   index % 2 === 0 ? "bg-secondary/10" : ""
                 }`}
               >
                 <div className="text-sm font-medium flex items-center gap-2">
                   <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                   {item.feature}
                 </div>
                 {/* Devus column with highlight */}
                 <div className="flex justify-center relative">
                   <div className="absolute inset-0 bg-primary/5 -mx-2 group-hover:bg-primary/10 transition-colors" />
                   <div className="relative">
                     <StatusIcon status={item.devus} isDevus />
                   </div>
                 </div>
                 <div className="flex justify-center opacity-60 group-hover:opacity-80 transition-opacity">
                   <StatusIcon status={item.twitter} />
                 </div>
                 <div className="flex justify-center opacity-60 group-hover:opacity-80 transition-opacity">
                   <StatusIcon status={item.reddit} />
                 </div>
                 <div className="flex justify-center opacity-60 group-hover:opacity-80 transition-opacity">
                   <StatusIcon status={item.indiehacker} />
                 </div>
               </motion.div>
             );
           })}
        </motion.div>

         {/* Legend - Bottom on desktop */}
         {!isMobile && (
           <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground"
           >
             <div className="flex items-center gap-2">
               <StatusIcon status="full" />
               <span>Full Support</span>
             </div>
             <div className="flex items-center gap-2">
               <StatusIcon status="partial" />
               <span>Partial Support</span>
             </div>
             <div className="flex items-center gap-2">
               <StatusIcon status="none" />
               <span>Not Available</span>
             </div>
           </motion.div>
         )}

         {/* Summary score */}
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4 }}
           className="text-center mt-8"
         >
           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30">
             <Sparkles className="w-5 h-5 text-primary" />
             <span className="font-semibold">
               Devus: <span className="text-green-500">8/8</span> Full Support
             </span>
           </div>
         </motion.div>
      </div>
    </section>
  );
}
