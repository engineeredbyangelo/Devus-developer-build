import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Star, Check, AlertCircle, BookOpen, Users, Zap, Code2 } from "lucide-react";
import { Tool } from "@/lib/types";
import { getCategoryInfo } from "@/lib/data";
import { CategoryBadge } from "./CategoryBadge";
import { Button } from "@/components/ui/button";

interface DemoToolModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

const getLearningCurveLabel = (curve?: "low" | "medium" | "high") => {
  switch (curve) {
    case "low":
      return { label: "Easy to Learn", color: "text-green-500" };
    case "medium":
      return { label: "Moderate", color: "text-yellow-500" };
    case "high":
      return { label: "Steep", color: "text-red-500" };
    default:
      return { label: "Not rated", color: "text-muted-foreground" };
  }
};

const getCommunityLabel = (activity?: "low" | "moderate" | "active" | "very-active") => {
  switch (activity) {
    case "very-active":
      return { label: "Very Active", color: "text-green-500" };
    case "active":
      return { label: "Active", color: "text-green-400" };
    case "moderate":
      return { label: "Moderate", color: "text-yellow-500" };
    case "low":
      return { label: "Low Activity", color: "text-red-500" };
    default:
      return { label: "Unknown", color: "text-muted-foreground" };
  }
};

export function DemoToolModal({ tool, isOpen, onClose }: DemoToolModalProps) {
  if (!tool) return null;

  const categoryInfo = getCategoryInfo(tool.category);
  const learningCurve = getLearningCurveLabel(tool.learningCurve);
  const community = getCommunityLabel(tool.communityActivity);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal Wrapper - Flexbox centered with scroll */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-border/50 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{tool.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={tool.category} size="sm" />
                      {tool.stars && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span>{(tool.stars / 1000).toFixed(1)}k</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Description */}
                <div>
                  <p className="text-muted-foreground">
                    {tool.longDescription || tool.description}
                  </p>
                </div>

                {/* Use Cases */}
                {tool.useCases && tool.useCases.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <Zap className="w-4 h-4 text-primary" />
                      Use Cases
                    </h3>
                    <ul className="space-y-2">
                      {tool.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack Fit */}
                {tool.techStackFit && tool.techStackFit.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <Code2 className="w-4 h-4 text-primary" />
                      Works Great With
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.techStackFit.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-sm bg-secondary text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Developer Insights */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Learning Curve
                    </h3>
                    <span className={`text-sm font-medium ${learningCurve.color}`}>
                      {learningCurve.label}
                    </span>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      Community
                    </h3>
                    <span className={`text-sm font-medium ${community.color}`}>
                      {community.label}
                    </span>
                  </div>
                </div>

                {/* Pros & Cons */}
                {(tool.pros || tool.cons) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {tool.pros && tool.pros.length > 0 && (
                      <div className="glass rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-green-500 mb-3">Pros</h3>
                        <ul className="space-y-2">
                          {tool.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tool.cons && tool.cons.length > 0 && (
                      <div className="glass rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-red-500 mb-3">Cons</h3>
                        <ul className="space-y-2">
                          {tool.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
                    >
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 md:p-6 border-t border-border/50 flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1 gap-2">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Visit {tool.name}
                  </a>
                </Button>
                {tool.githubUrl && (
                  <Button asChild variant="outline" className="flex-1 gap-2">
                    <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
