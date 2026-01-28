import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Heart,
  ChevronUp,
  Star,
  Check,
  X,
} from "lucide-react";
import { useTool, useFavorites, useUpvotes } from "@/hooks/use-tools";
import { getToolById, getCategoryInfo } from "@/lib/data";
import { Header } from "@/components/Header";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tool, isLoading } = useTool(id || "");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getUpvotes, toggleUpvote, hasUpvoted } = useUpvotes();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-secondary rounded" />
            <div className="h-12 w-96 bg-secondary rounded" />
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discover
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const upvoteCount = getUpvotes(tool.id);
  const favorited = isFavorite(tool.id);
  const upvoted = hasUpvoted(tool.id);

  // Get alternative tools
  const alternatives = (tool.alternatives || [])
    .map((altId) => getToolById(altId))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Header />

      <main className="container py-8 md:py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 md:p-12 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-2xl font-bold text-primary glow-sm">
                {tool.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{tool.name}</h1>
                  {tool.isNew && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      New
                    </span>
                  )}
                </div>
                <CategoryBadge category={tool.category} size="lg" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleUpvote(tool.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors",
                  upvoted
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                <ChevronUp className={cn("w-5 h-5", upvoted && "fill-current")} />
                <span>{upvoteCount}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFavorite(tool.id)}
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  favorited
                    ? "bg-red-500/20 text-red-500"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                <Heart className={cn("w-5 h-5", favorited && "fill-current")} />
              </motion.button>

              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                <Button className="glow-sm">
                  Visit Site
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>

              {tool.githubUrl && (
                <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <Github className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
            {tool.longDescription || tool.description}
          </p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {tool.stars && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>{(tool.stars / 1000).toFixed(1)}k stars</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                >
                  {tag.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pros and Cons */}
        {(tool.pros || tool.cons) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            {tool.pros && tool.pros.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  Pros
                </h3>
                <ul className="space-y-2">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tool.cons && tool.cons.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  Cons
                </h3>
                <ul className="space-y-2">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-6">Similar Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alternatives.map((alt, index) => (
                <ToolCard key={alt!.id} tool={alt!} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ToolDetail;
