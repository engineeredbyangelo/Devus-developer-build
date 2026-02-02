export type Category = 
  | "frontend"
  | "backend"
  | "devops"
  | "ai-ml"
  | "database"
  | "testing"
  | "mobile"
  | "security"
  | "productivity";

export type Tag = 
  | "open-source"
  | "free"
  | "freemium"
  | "paid"
  | "self-hosted"
  | "cloud"
  | "cli"
  | "gui"
  | "api"
  | "new";

export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: Category;
  tags: Tag[];
  url: string;
  githubUrl?: string;
  logoUrl?: string;
  screenshotUrl?: string;
  stars?: number;
  upvotes: number;
  isNew?: boolean;
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  createdAt: string;
  // Developer-specific insights
  useCases?: string[];
  techStackFit?: string[];
  learningCurve?: "low" | "medium" | "high";
  communityActivity?: "low" | "moderate" | "active" | "very-active";
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  favorites: string[];
  followedCategories: Category[];
  submittedTools: string[];
}

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface TagInfo {
  id: Tag;
  name: string;
  color: string;
}
