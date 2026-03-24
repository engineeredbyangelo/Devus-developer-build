import { Category } from "./types";

// Deterministic hash from tool name for visual variation
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

interface CategoryVisual {
  gradient: string;
  pattern: "circuits" | "nodes" | "dots" | "grid" | "flow" | "checks" | "frames" | "shield" | "bolts";
  accentHsl: string;
}

const categoryVisuals: Record<Category, CategoryVisual> = {
  frontend: {
    gradient: "from-cyan-500/30 via-blue-600/20 to-cyan-400/10",
    pattern: "circuits",
    accentHsl: "186 100% 50%",
  },
  backend: {
    gradient: "from-purple-600/30 via-indigo-500/20 to-violet-400/10",
    pattern: "nodes",
    accentHsl: "280 100% 60%",
  },
  "ai-ml": {
    gradient: "from-pink-500/30 via-fuchsia-600/20 to-rose-400/10",
    pattern: "dots",
    accentHsl: "320 100% 60%",
  },
  database: {
    gradient: "from-emerald-500/30 via-teal-600/20 to-green-400/10",
    pattern: "grid",
    accentHsl: "150 80% 45%",
  },
  devops: {
    gradient: "from-amber-500/30 via-yellow-600/20 to-orange-400/10",
    pattern: "flow",
    accentHsl: "45 100% 50%",
  },
  testing: {
    gradient: "from-orange-500/30 via-red-400/20 to-amber-400/10",
    pattern: "checks",
    accentHsl: "30 100% 55%",
  },
  mobile: {
    gradient: "from-sky-500/30 via-blue-400/20 to-indigo-400/10",
    pattern: "frames",
    accentHsl: "200 100% 55%",
  },
  security: {
    gradient: "from-red-600/30 via-rose-500/20 to-red-400/10",
    pattern: "shield",
    accentHsl: "0 80% 55%",
  },
  productivity: {
    gradient: "from-lime-500/30 via-yellow-500/20 to-emerald-400/10",
    pattern: "bolts",
    accentHsl: "60 100% 50%",
  },
};

export function getCategoryVisual(category: Category): CategoryVisual {
  return categoryVisuals[category] || categoryVisuals.frontend;
}

export function getToolVisualAngle(toolName: string): number {
  const hash = hashString(toolName);
  return (hash % 360);
}

export function getToolVisualScale(toolName: string): number {
  const hash = hashString(toolName);
  return 0.8 + (hash % 40) / 100; // 0.8 - 1.2
}

// SVG pattern generators per category
export function getPatternSvg(pattern: CategoryVisual["pattern"], seed: number): string {
  const offset = seed % 20;
  
  switch (pattern) {
    case "circuits":
      return `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M${10 + offset} 0 v20 h20 v20" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.15"/><circle cx="${30 + offset}" cy="20" r="2" fill="currentColor" opacity="0.1"/></svg>`;
    case "nodes":
      return `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="${15 + offset}" cy="15" r="3" fill="currentColor" opacity="0.1"/><circle cx="${45 - offset}" cy="45" r="2" fill="currentColor" opacity="0.08"/><line x1="${15 + offset}" y1="15" x2="${45 - offset}" y2="45" stroke="currentColor" stroke-width="0.5" opacity="0.08"/></svg>`;
    case "dots":
      return `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="${10 + offset}" cy="${10 + offset}" r="1.5" fill="currentColor" opacity="0.12"/><circle cx="${30 - offset}" cy="${30 - offset}" r="1" fill="currentColor" opacity="0.08"/></svg>`;
    case "grid":
      return `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="${5 + offset}" y="5" width="12" height="12" rx="2" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.1"/></svg>`;
    case "flow":
      return `<svg width="60" height="30" xmlns="http://www.w3.org/2000/svg"><path d="M0 15 Q15 ${5 + offset}, 30 15 T60 15" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.1"/></svg>`;
    case "checks":
      return `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M${10 + offset} 20 l5 5 l10 -10" stroke="currentColor" stroke-width="1" fill="none" opacity="0.1"/></svg>`;
    case "frames":
      return `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><rect x="${10 + offset}" y="8" width="18" height="30" rx="3" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.1"/></svg>`;
    case "shield":
      return `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M20 ${5 + offset} l12 5 v10 l-12 10 l-12 -10 v-10 z" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.1"/></svg>`;
    case "bolts":
      return `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M${18 + offset} 5 l-5 15 h8 l-5 15" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.12"/></svg>`;
  }
}
