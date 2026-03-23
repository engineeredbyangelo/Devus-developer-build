import { motion } from "framer-motion";
import { 
  Search, 
  PlusCircle, 
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
  { name: "Category & tag filtering", free: true, pro: true },
  { name: "Direct links & GitHub access", free: true, pro: true },
  { name: "Personal favorites collection", free: true, pro: true },
  { name: "Weekly new tool updates", free: true, pro: true },
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Choose Your Plan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with full access to our tool directory. Upgrade to Pro for weekly alerts, early access, and tool submissions.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full glass glass-hover border-border/50">
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
                  className="w-full mt-6" 
                  onClick={onSignUp}
                >
                  Get Started Free
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
            <Card className="h-full glass glass-hover border-primary/30 relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Popular
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

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            No credit card required to start • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
