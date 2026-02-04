import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { NewThisWeek } from "@/components/NewThisWeek";
import { ComparisonChart } from "@/components/ComparisonChart";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DemoPreview } from "@/components/DemoPreview";
import { BenefitsSection } from "@/components/BenefitsSection";
import { AuthModal } from "@/components/AuthModal";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUserName, setWelcomeUserName] = useState("");

  const openSignUp = () => setAuthModalOpen(true);

  const handleSignInSuccess = (userName: string) => {
    setWelcomeUserName(userName);
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Landing Hero */}
      <LandingHero onGetStarted={openSignUp} />

      {/* New This Week Carousel */}
      <NewThisWeek />

      {/* Comparison Chart - Devus vs Twitter/Reddit/IndieHacker */}
      <ComparisonChart />

      {/* Features Section - Core features elaboration */}
      <FeaturesSection />

      {/* Demo Preview - Limited sample for testing */}
      <DemoPreview onSignUp={openSignUp} />

      {/* Benefits Section - Full product features */}
      <BenefitsSection onSignUp={openSignUp} />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">
              Dev<span className="text-primary">us</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for developers, by developers
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
        onSignInSuccess={handleSignInSuccess}
      />

      {/* Welcome Animation */}
      <WelcomeAnimation
        isVisible={showWelcome}
        userName={welcomeUserName}
        onComplete={handleWelcomeComplete}
      />
    </div>
  );
};

export default Index;
