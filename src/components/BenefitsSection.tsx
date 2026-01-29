import { motion } from "framer-motion";
import { 
  User, 
  PlusCircle, 
  Heart, 
  Bell, 
  LayoutDashboard,
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BenefitProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  index: number;
}

function BenefitCard({ icon: Icon, title, description, features, index }: BenefitProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass glass-hover rounded-xl p-6 h-full"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

const benefits = [
  {
    icon: User,
    title: "Personal Profile",
    description: "Your customized developer hub with preferences and activity history.",
    features: ["Track your discoveries", "Build your dev identity", "Connect with community"],
  },
  {
    icon: PlusCircle,
    title: "Tool Submission",
    description: "Found an amazing tool? Share it with the community.",
    features: ["Submit new tools", "Earn contributor badges", "Help fellow developers"],
  },
  {
    icon: Heart,
    title: "Favorites Collection",
    description: "Save and organize the tools you love for quick access.",
    features: ["One-click save", "Organize by project", "Sync across devices"],
  },
  {
    icon: Bell,
    title: "Custom Alerts",
    description: "Get notified when new tools match your interests.",
    features: ["Category alerts", "Trending notifications", "Weekly digests"],
  },
  {
    icon: LayoutDashboard,
    title: "Personal Dashboard",
    description: "Your command center for tool discovery and management.",
    features: ["Activity feed", "Saved searches", "Usage analytics"],
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Be the first to try new features and exclusive tools.",
    features: ["Beta features", "Priority support", "Exclusive content"],
  },
];

interface BenefitsSectionProps {
  onSignUp: () => void;
}

export function BenefitsSection({ onSignUp }: BenefitsSectionProps) {
  return (
    <section className="py-20 relative overflow-hidden border-t border-border/30">
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
            <Zap className="w-4 h-4" />
            Full Experience
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Unlock Everything with a Free Account
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The demo is just the beginning. Sign up to access your personal dashboard, 
            save favorites, submit tools, and receive custom alerts.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.title} {...benefit} index={index} />
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Button size="lg" className="glow" onClick={onSignUp}>
            Create Free Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Takes 30 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}
