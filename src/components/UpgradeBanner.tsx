import { Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UpgradeBannerProps {
  message?: string;
  className?: string;
}

export function UpgradeBanner({ 
  message = "Upgrade to Pro to unlock all 65+ tools and premium features.",
  className = "" 
}: UpgradeBannerProps) {
  const navigate = useNavigate();

  return (
    <div className={`glass rounded-2xl p-6 border border-primary/20 bg-primary/5 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
          <Crown className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Unlock Pro</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button
          onClick={() => navigate("/pricing")}
          className="glow-sm shrink-0"
        >
          Upgrade to Pro
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
