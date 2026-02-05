 import { motion } from "framer-motion";
 import {
   ExternalLink,
   Github,
   Filter,
   Sparkles,
   Zap,
   LucideIcon,
   Search,
   Database,
   Code2,
   Tag,
   Layers,
 } from "lucide-react";
 import { useIsMobile } from "@/hooks/use-mobile";
 
 interface FeatureItem {
   icon: LucideIcon;
   title: string;
   description: string;
   benefits: string[];
   visual: "ai" | "links" | "github" | "filter";
 }
 
 const features: FeatureItem[] = [
   {
     icon: Sparkles,
     title: "AI-Powered Discovery",
     description:
       "Find tools across GitHub, ProductHunt & npm in real-time with intelligent search that understands what you need.",
     benefits: ["Semantic search", "Real-time results", "Cross-platform indexing"],
     visual: "ai",
   },
   {
     icon: ExternalLink,
     title: "Direct Links",
     description:
       "Jump straight to any tool's official website, documentation, or demo with one click. No middleman.",
     benefits: ["One-click access", "Official sources", "No redirects"],
     visual: "links",
   },
   {
     icon: Github,
     title: "GitHub Access",
     description:
       "Explore source code, star counts, and contribution activity. Contribute to open-source projects directly.",
     benefits: ["Source code access", "Star metrics", "Contribution insights"],
     visual: "github",
   },
   {
     icon: Filter,
     title: "Smart Filtering",
     description:
       "Find tools by category, tags, or tech stack compatibility. Filter by learning curve, pricing, and more.",
     benefits: ["Category filters", "Tag-based search", "Tech stack matching"],
     visual: "filter",
   },
 ];
 
 // Visual components for each feature
 function AIVisual() {
   return (
     <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
       {/* Central icon with glow */}
       <motion.div
         className="relative z-10"
         animate={{ scale: [1, 1.05, 1] }}
         transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
       >
         <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
           <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary" />
         </div>
       </motion.div>
 
       {/* Floating orbs */}
       {[Search, Database, Code2].map((Icon, i) => (
         <motion.div
           key={i}
           className="absolute w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/80 backdrop-blur-sm border border-border/50 flex items-center justify-center"
           style={{
             top: `${20 + i * 25}%`,
             left: i % 2 === 0 ? "15%" : "75%",
           }}
           animate={{
             y: [0, -8, 0],
             opacity: [0.7, 1, 0.7],
           }}
           transition={{
             duration: 2 + i * 0.5,
             repeat: Infinity,
             delay: i * 0.3,
           }}
         >
           <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
         </motion.div>
       ))}
 
       {/* Connecting lines (hidden on mobile) */}
       <svg className="absolute inset-0 w-full h-full hidden md:block" style={{ zIndex: 0 }}>
         <motion.line
           x1="20%" y1="30%" x2="45%" y2="50%"
           stroke="hsl(var(--primary) / 0.2)"
           strokeWidth="1"
           strokeDasharray="4 4"
           initial={{ pathLength: 0 }}
           whileInView={{ pathLength: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
         />
         <motion.line
           x1="80%" y1="35%" x2="55%" y2="50%"
           stroke="hsl(var(--primary) / 0.2)"
           strokeWidth="1"
           strokeDasharray="4 4"
           initial={{ pathLength: 0 }}
           whileInView={{ pathLength: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.2 }}
         />
       </svg>
     </div>
   );
 }
 
 function LinksVisual() {
   return (
     <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
       {/* Central link icon */}
       <motion.div
         className="relative z-10"
         whileHover={{ scale: 1.05 }}
       >
         <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
           <ExternalLink className="w-10 h-10 md:w-12 md:h-12 text-primary" />
         </div>
       </motion.div>
 
       {/* Connection nodes */}
       {[0, 1, 2].map((i) => (
         <motion.div
           key={i}
           className="absolute w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary/80 backdrop-blur-sm border border-border/50 flex items-center justify-center"
           style={{
             top: i === 0 ? "15%" : i === 1 ? "75%" : "50%",
             left: i === 2 ? "80%" : i === 0 ? "25%" : "20%",
           }}
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
         >
           <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary" />
         </motion.div>
       ))}
 
       {/* Animated connection lines */}
       <svg className="absolute inset-0 w-full h-full hidden md:block" style={{ zIndex: 0 }}>
         {[
           { x1: "30%", y1: "20%", x2: "45%", y2: "45%" },
           { x1: "25%", y1: "80%", x2: "45%", y2: "55%" },
           { x1: "85%", y1: "50%", x2: "55%", y2: "50%" },
         ].map((line, i) => (
           <motion.line
             key={i}
             {...line}
             stroke="hsl(var(--primary) / 0.3)"
             strokeWidth="2"
             initial={{ pathLength: 0 }}
             whileInView={{ pathLength: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: i * 0.2 }}
           />
         ))}
       </svg>
     </div>
   );
 }
 
 function GithubVisual() {
   return (
     <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
       {/* Central GitHub icon */}
       <motion.div
         className="relative z-10"
         animate={{ rotate: [0, 5, -5, 0] }}
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
       >
         <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
           <Github className="w-10 h-10 md:w-12 md:h-12 text-primary" />
         </div>
       </motion.div>
 
       {/* Code brackets */}
       <motion.div
         className="absolute left-[10%] md:left-[15%] top-1/2 -translate-y-1/2 text-3xl md:text-4xl font-mono text-primary/40"
         animate={{ x: [-5, 0, -5] }}
         transition={{ duration: 2, repeat: Infinity }}
       >
         {"<"}
       </motion.div>
       <motion.div
         className="absolute right-[10%] md:right-[15%] top-1/2 -translate-y-1/2 text-3xl md:text-4xl font-mono text-primary/40"
         animate={{ x: [5, 0, 5] }}
         transition={{ duration: 2, repeat: Infinity }}
       >
         {"/>"}
       </motion.div>
 
       {/* Floating code lines */}
       {[0, 1, 2].map((i) => (
         <motion.div
           key={i}
           className="absolute h-1 rounded-full bg-gradient-to-r from-primary/20 to-transparent"
           style={{
             width: `${40 + i * 15}px`,
             top: `${30 + i * 20}%`,
             left: i % 2 === 0 ? "20%" : "60%",
           }}
           animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.8, 1, 0.8] }}
           transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
         />
       ))}
     </div>
   );
 }
 
 function FilterVisual() {
   const tags = ["React", "API", "Auth", "DB"];
   return (
     <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
       {/* Central filter icon */}
       <motion.div className="relative z-10">
         <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
           <Filter className="w-10 h-10 md:w-12 md:h-12 text-primary" />
         </div>
       </motion.div>
 
       {/* Floating category tags */}
       {tags.map((tag, i) => (
         <motion.div
           key={tag}
           className="absolute px-2 md:px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-xs md:text-sm font-medium text-muted-foreground"
           style={{
             top: `${15 + (i % 2) * 55}%`,
             left: i < 2 ? `${10 + i * 10}%` : `${60 + (i - 2) * 10}%`,
           }}
           animate={{
             y: [0, i % 2 === 0 ? -6 : 6, 0],
             opacity: [0.7, 1, 0.7],
           }}
           transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
         >
           <div className="flex items-center gap-1">
             <Tag className="w-3 h-3" />
             {tag}
           </div>
         </motion.div>
       ))}
 
       {/* Layer icon */}
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
   ai: AIVisual,
   links: LinksVisual,
   github: GithubVisual,
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
         {/* Text Content */}
         <motion.div
           initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className={`space-y-4 ${isReversed && !isMobile ? "md:[direction:ltr]" : ""}`}
         >
           {/* Icon badge */}
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
             <Icon className="w-4 h-4 text-primary" />
             <span className="text-sm font-medium text-primary">Feature {index + 1}</span>
           </div>
 
           <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
             {feature.title}
           </h3>
 
           <p className="text-muted-foreground leading-relaxed">
             {feature.description}
           </p>
 
           {/* Benefits list */}
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
 
         {/* Visual */}
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
       {/* Background glow */}
       <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
 
       <div className="container relative px-4 md:px-6">
         {/* Section Header */}
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
             Why Developers Choose Devus
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Everything you need to discover, compare, and track the best developer tools
           </p>
         </motion.div>
 
         {/* Feature Rows - Alternating Layout */}
         <div className="space-y-8 md:space-y-16">
           {features.map((feature, index) => (
             <FeatureRow key={feature.title} feature={feature} index={index} />
           ))}
         </div>
       </div>
     </section>
   );
 }
