import { motion } from "framer-motion";
import { CheckCircle, X, Crown, Zap, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "@/hooks/use-toast";

interface Feature {
  name: string;
  free: string;
  pro: string;
}

const comparisonFeatures: Feature[] = [
  { name: "Tool directory access", free: "35 tools", pro: "65+ tools (full)" },
  { name: "Category & tag filtering", free: "✓", pro: "✓" },
  { name: "Direct links & GitHub access", free: "✓", pro: "✓" },
  { name: "Personal favorites", free: "✓", pro: "✓" },
  { name: "Weekly new tool updates", free: "✓", pro: "✓" },
  { name: "Fresh Finds (AI-discovered tools)", free: "5 tools", pro: "Unlimited" },
  { name: "Weekly new tool alerts", free: "—", pro: "✓" },
  { name: "Early access to new tools", free: "—", pro: "✓" },
  { name: "Priority support", free: "—", pro: "✓" },
];

const faqItems = [
  {
    question: "What's included in the free plan?",
    answer: "The free plan gives you access to 35 curated developer tools, category filtering, favorites, and weekly updates. It's a great way to explore the directory.",
  },
  {
    question: "What do I get with Pro?",
    answer: "Pro unlocks the full directory of 65+ tools, unlimited Fresh Finds powered by AI discovery, weekly email alerts for new tools, early access to newly added tools, and priority support.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your Pro subscription at any time. You'll continue to have Pro access until the end of your current billing period.",
  },
  {
    question: "Is there a refund policy?",
    answer: "We offer a full refund within the first 7 days if you're not satisfied with Pro. After that, you can cancel and your access continues through the billing period.",
  },
  {
    question: "How are new tools added?",
    answer: "Our team curates new tools weekly. Pro users also get access to Fresh Finds — AI-discovered tools found in real time using web search.",
  },
  {
    question: "Will pricing change?",
    answer: "If we ever adjust pricing, existing subscribers keep their current rate locked in. We believe in rewarding early adopters.",
  },
];

const tierFeatures = [
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

const Pricing = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!user) {
      navigate("/", { state: { openAuth: true } });
      return;
    }
    if (isPro) {
      toast({ title: "You're already on Pro!", description: "You have full access to all features." });
      return;
    }
    toast({ title: "Coming soon", description: "Payment integration is being set up. Check back shortly!" });
  };

  const handleFreeStart = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/", { state: { openAuth: true } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container relative">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Simple Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Start Free, Upgrade When Ready
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Access curated developer tools with no commitment. Upgrade to Pro for the full experience.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
            {/* Free */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-full glass glass-hover border-border/50">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">Free</CardTitle>
                  <CardDescription>Perfect for exploring</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground">/forever</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tierFeatures.map((f) => (
                      <li key={f.name} className="flex items-center gap-3 text-sm">
                        {f.free ? (
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                        )}
                        <span className={f.free ? "text-foreground" : "text-muted-foreground/50"}>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-6" onClick={handleFreeStart}>
                    {user ? "Go to Dashboard" : "Get Started Free"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="h-full glass glass-hover border-primary/30 relative overflow-hidden">
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
                    <span className="text-4xl font-bold text-foreground">$16</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Annual plan coming soon</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tierFeatures.map((f) => (
                      <li key={f.name} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground">{f.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 glow" onClick={handleSubscribe}>
                    {isPro ? "You're on Pro" : "Upgrade to Pro"}
                    {!isPro && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Feature Comparison</h2>
            <div className="glass rounded-2xl overflow-hidden border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-foreground font-semibold">Feature</TableHead>
                    <TableHead className="text-center text-foreground font-semibold">Free</TableHead>
                    <TableHead className="text-center text-primary font-semibold">Pro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonFeatures.map((f) => (
                    <TableRow key={f.name} className="border-border/30">
                      <TableCell className="text-foreground text-sm">{f.name}</TableCell>
                      <TableCell className="text-center text-muted-foreground text-sm">{f.free}</TableCell>
                      <TableCell className="text-center text-foreground text-sm font-medium">{f.pro}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
            <div className="glass rounded-2xl p-6 border border-border/50">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
                    <AccordionTrigger className="text-foreground text-left hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mt-16"
          >
            <p className="text-sm text-muted-foreground">
              No credit card required to start • Cancel anytime • Prices locked for early adopters
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
