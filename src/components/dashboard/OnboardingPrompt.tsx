import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingPromptProps {
  onComplete: (categories: string[]) => void;
}

const stackOptions = [
  { id: "frontend", label: "React / Frontend", categories: ["frontend"] },
  { id: "backend", label: "Backend / APIs", categories: ["backend"] },
  { id: "ai-ml", label: "AI / ML", categories: ["ai-ml"] },
  { id: "mobile", label: "Mobile", categories: ["mobile"] },
  { id: "devops", label: "DevOps / Infra", categories: ["devops"] },
  { id: "fullstack", label: "Full-Stack", categories: ["frontend", "backend", "database"] },
];

const focusOptions = [
  { id: "saas", label: "SaaS Product", categories: ["frontend", "backend", "database"] },
  { id: "ai-apps", label: "AI-Powered Apps", categories: ["ai-ml", "backend"] },
  { id: "mobile-apps", label: "Mobile Apps", categories: ["mobile", "frontend"] },
  { id: "tooling", label: "Developer Tooling", categories: ["productivity", "testing"] },
];

export function OnboardingPrompt({ onComplete }: OnboardingPromptProps) {
  const [step, setStep] = useState(0);
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);

  const handleFinish = () => {
    const allCategories = new Set<string>();

    selectedStack.forEach((id) => {
      const opt = stackOptions.find((o) => o.id === id);
      opt?.categories.forEach((c) => allCategories.add(c));
    });

    selectedFocus.forEach((id) => {
      const opt = focusOptions.find((o) => o.id === id);
      opt?.categories.forEach((c) => allCategories.add(c));
    });

    onComplete(Array.from(allCategories));
  };

  const toggleItem = (id: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-8 max-w-lg mx-auto text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
        <Rocket className="w-7 h-7 text-primary" />
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2">Build Your First Stack</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Answer two quick questions and we'll personalize your feed instantly.
      </p>

      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">What's your main stack?</p>
          <div className="grid grid-cols-2 gap-3">
            {stackOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleItem(opt.id, selectedStack, setSelectedStack)}
                className={cn(
                  "glass rounded-xl p-3 text-sm font-medium text-left transition-all",
                  selectedStack.includes(opt.id)
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center justify-between">
                  {opt.label}
                  {selectedStack.includes(opt.id) && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={() => setStep(1)}
            disabled={selectedStack.length === 0}
            className="w-full mt-4 glow-sm"
          >
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">What are you building?</p>
          <div className="grid grid-cols-2 gap-3">
            {focusOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleItem(opt.id, selectedFocus, setSelectedFocus)}
                className={cn(
                  "glass rounded-xl p-3 text-sm font-medium text-left transition-all",
                  selectedFocus.includes(opt.id)
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center justify-between">
                  {opt.label}
                  {selectedFocus.includes(opt.id) && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={handleFinish}
            disabled={selectedFocus.length === 0}
            className="w-full mt-4 glow-sm"
          >
            Show My Personalized Feed <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
