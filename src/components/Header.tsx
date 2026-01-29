import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Heart, PlusCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./AuthModal";

const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/submit", label: "Submit", icon: PlusCircle },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: "signin" | "signup" }>({
    open: false,
    mode: "signin",
  });
  const location = useLocation();

  const openSignIn = () => setAuthModal({ open: true, mode: "signin" });
  const openSignUp = () => setAuthModal({ open: true, mode: "signup" });
  const closeAuth = () => setAuthModal({ ...authModal, open: false });

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Glass background */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50" />

        <div className="container relative flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-foreground">Dev</span>
              <span className="text-primary glow-text">us</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link key={link.href} to={link.href}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={openSignIn}
            >
              Sign In
            </Button>
            <Button size="sm" className="glow-sm" onClick={openSignUp}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50"
            >
              <nav className="container py-4 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </motion.div>
                    </Link>
                  );
                })}
                <div className="flex gap-2 mt-4 px-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openSignIn();
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openSignUp();
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        onClose={closeAuth}
        initialMode={authModal.mode}
      />
    </>
  );
}
