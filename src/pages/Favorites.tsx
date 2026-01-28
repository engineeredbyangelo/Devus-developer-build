import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useFavorites } from "@/hooks/use-tools";
import { Header } from "@/components/Header";
import { ToolGrid } from "@/components/ToolGrid";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { favoriteTools } = useFavorites();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Header />

      <main className="container py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold">Your Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Tools you've saved for quick access.
          </p>
        </motion.div>

        {favoriteTools.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 glass rounded-2xl"
          >
            <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and save tools you love!
            </p>
            <Link to="/">
              <Button className="glow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Tools
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground mb-6"
            >
              <span className="text-foreground font-medium">
                {favoriteTools.length}
              </span>{" "}
              saved tools
            </motion.p>
            <ToolGrid tools={favoriteTools} />
          </>
        )}
      </main>
    </div>
  );
};

export default Favorites;
