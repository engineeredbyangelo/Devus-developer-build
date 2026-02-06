import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ExternalLink, Github, Loader2, AlertCircle } from "lucide-react";
import { useWeeklyTools, WeeklyTool } from "@/hooks/use-weekly-tools";
import { cn } from "@/lib/utils";

const learningCurveLabels = {
  low: { label: "Easy", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  medium: { label: "Moderate", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  high: { label: "Advanced", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const communityLabels = {
  "still-building": { label: "Still Building", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  "early-stage": { label: "Early Stage", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  active: { label: "Active", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  "very-active": { label: "Very Active", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

function WeeklyToolCard({ tool, index }: { tool: WeeklyTool; index: number }) {
  const learning = learningCurveLabels[tool.learningCurve] || learningCurveLabels.medium;
  const community = communityLabels[tool.communityActivity] || communityLabels.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative h-full"
    >
      <div className="glass glass-hover rounded-xl p-5 h-full flex flex-col">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold text-primary shrink-0 border border-primary/20">
            {tool.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {tool.name}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground capitalize">
              {tool.category.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {tool.description}
        </p>

        {/* Use Cases */}
        {tool.useCases && tool.useCases.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Use Cases:</p>
            <ul className="space-y-1">
              {tool.useCases.slice(0, 2).map((useCase, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-1">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Fit */}
        {tool.techStackFit && tool.techStackFit.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tool.techStackFit.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs border", community.color)}>
            {community.label}
          </span>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs border", learning.color)}>
            {learning.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visit
          </a>
          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ToolsOfTheWeek() {
  const { tools, isLoading, error, weekOf } = useWeeklyTools();

  return (
    <section className="mb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 md:p-8 mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <span className="text-foreground">Tools of the</span>
              <span className="text-primary glow-text">Week</span>
              <TrendingUp className="w-5 h-5 text-primary ml-1" />
            </h2>
            <p className="text-sm text-muted-foreground">
              Week of {weekOf || "..."} • Fresh developer tools discovered across GitHub, ProductHunt & npm
            </p>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="glass rounded-xl p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Discovering trending tools...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="glass rounded-xl p-8 text-center border border-destructive/20">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-2">Failed to load weekly tools</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Tools Grid */}
      {!isLoading && !error && tools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <WeeklyToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && tools.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No tools discovered this week yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Check back soon!</p>
        </div>
      )}
    </section>
  );
}
