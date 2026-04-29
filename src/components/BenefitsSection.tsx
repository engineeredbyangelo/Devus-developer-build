import { motion } from "framer-motion";
import { 
  Zap,
  ArrowRight,
  CheckCircle,
  X,
  Crown,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TierFeature {
  name: string;
  free: boolean;
  pro: boolean;
}

const features: TierFeature[] = [
  { name: "Full tool directory access", free: true, pro: true },
  { name: "Category following & filtering", free: true, pro: true },
  { name: "Personalized recommendations", free: true, pro: true },
  { name: "Profile & favorites collection", free: true, pro: true },
  { name: "Tool of the Day", free: true, pro: true },
  { name: "Ask Devus AI assistant", free: false, pro: true },
  { name: "Fresh Finds (AI discovery)", free: false, pro: true },
  { name: "Weekly new tool alerts", free: false, pro: true },
  { name: "Early access to new tools", free: false, pro: true },
  { name: "Priority support", free: false, pro: true },
];

interface BenefitsSectionProps {
  onSignUp: () => void;
}

export function BenefitsSection({ onSignUp }: BenefitsSectionProps) {
  return (
    <section id="pricing" className="py-20 relative overflow-hidden border-t border-border/30">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Choose your plan
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Start free.{" "}
            <span className="text-primary glow-text">Upgrade when ready.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Explore the product on the free tier. Unlock AI-powered discovery and priority features when you&apos;re ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full relative overflow-hidden border border-border/50 bg-card/40 backdrop-blur-xl transition-all duration-300 hover:border-border hover:bg-card/60">
              <div className="absolute top-4 left-4">
                <div className="px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/50 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Start free
                </div>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">Free</CardTitle>
                <CardDescription>Perfect for exploring</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3 text-sm">
                      {feature.free ? (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={feature.free ? "text-foreground" : "text-muted-foreground/50"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-6 border-border/60 hover:border-primary/40 hover:bg-primary/5"
                  onClick={onSignUp}
                >
                  Sign up free — explore the product
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full relative overflow-hidden border border-primary/40 bg-card/50 backdrop-blur-xl shadow-[0_0_50px_hsl(var(--primary)/0.18)]">
              <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-primary/30 via-primary/0 to-primary/10 pointer-events-none opacity-60" />
              <div className="absolute top-4 right-4 z-10">
                <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-medium flex items-center gap-1 backdrop-blur-md">
                  <Crown className="w-3 h-3" />
                  Most popular
                </div>
              </div>
              
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Pro</CardTitle>
                <CardDescription>For power users</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$16</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Annual plan coming soon</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground">{feature.name}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6 glow" 
                  onClick={onSignUp}
                >
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            No card required · Free forever tier · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
