import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { NewThisWeek } from "@/components/NewThisWeek";
import { FeaturesSection } from "@/components/FeaturesSection";
 import { ComparisonChart } from "@/components/ComparisonChart";
import { DemoPreview } from "@/components/DemoPreview";
import { BenefitsSection } from "@/components/BenefitsSection";
import { AuthModal } from "@/components/AuthModal";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { showWelcome, welcomeUserName, completeWelcome, triggerWelcome } = useAuth();

  const openSignUp = () => setAuthModalOpen(true);

  const handleSignInSuccess = (userName: string) => {
    triggerWelcome(userName);
  };

  const handleWelcomeComplete = () => {
    completeWelcome();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Landing Hero */}
      <LandingHero onGetStarted={openSignUp} />

      {/* New This Week Carousel */}
      <NewThisWeek />

      {/* Features Section - Core features elaboration */}
      <FeaturesSection />

       {/* Comparison Chart - Devus vs Twitter/Reddit/IndieHacker */}
       <ComparisonChart />
 
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
