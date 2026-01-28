import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Upload, Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, tags } from "@/lib/data";
import { Category, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Submit = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    category: "" as Category | "",
    selectedTags: [] as Tag[],
  });

  const handleTagToggle = (tag: Tag) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || !formData.description || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
    toast({
      title: "Tool submitted!",
      description: "Your submission will be reviewed soon.",
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      url: "",
      description: "",
      category: "",
      selectedTags: [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Header />

      <main className="container py-8 md:py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Submit a Tool</h1>
          </div>
          <p className="text-muted-foreground">
            Know a great developer tool? Share it with the community!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-8 h-8 text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
              <p className="text-muted-foreground mb-6">
                Thanks for contributing to Devus. We'll review your submission soon.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Submit Another
                </Button>
                <Link to="/">
                  <Button className="glow-sm">Back to Discover</Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 space-y-6"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Tool Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., React, Tailwind CSS, Supabase"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-secondary/50"
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="url">Website URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="bg-secondary/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of what this tool does..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="bg-secondary/50 min-h-[100px]"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value as Category }))
                  }
                >
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                        formData.selectedTags.includes(tag.id)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screenshot upload placeholder */}
              <div className="space-y-2">
                <Label>Screenshot (optional)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-muted-foreground transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" className="w-full glow-sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Submit Tool
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Submit;
