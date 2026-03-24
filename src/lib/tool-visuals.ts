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

// Seeded pseudo-random number generator (deterministic from seed)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export interface CategoryVisual {
  colors: [string, string, string]; // 3-color HSL system
  shapeType: "arcs" | "rects" | "rings" | "blocks" | "curves" | "angles" | "frames" | "hexes" | "bolts";
  accentHsl: string;
}

const categoryVisuals: Record<Category, CategoryVisual> = {
  frontend: {
    colors: ["186 100% 50%", "220 90% 55%", "200 30% 90%"],
    shapeType: "arcs",
    accentHsl: "186 100% 50%",
  },
  backend: {
    colors: ["270 80% 55%", "240 70% 50%", "260 60% 70%"],
    shapeType: "rects",
    accentHsl: "270 80% 55%",
  },
  "ai-ml": {
    colors: ["320 90% 55%", "290 80% 60%", "340 40% 85%"],
    shapeType: "rings",
    accentHsl: "320 90% 55%",
  },
  database: {
    colors: ["155 80% 40%", "175 70% 45%", "140 50% 75%"],
    shapeType: "blocks",
    accentHsl: "155 80% 40%",
  },
  devops: {
    colors: ["40 95% 55%", "25 90% 50%", "45 80% 70%"],
    shapeType: "curves",
    accentHsl: "40 95% 55%",
  },
  testing: {
    colors: ["15 90% 55%", "0 80% 55%", "25 70% 75%"],
    shapeType: "angles",
    accentHsl: "15 90% 55%",
  },
  mobile: {
    colors: ["200 90% 55%", "220 80% 50%", "195 50% 80%"],
    shapeType: "frames",
    accentHsl: "200 90% 55%",
  },
  security: {
    colors: ["0 75% 50%", "345 70% 40%", "10 50% 70%"],
    shapeType: "hexes",
    accentHsl: "0 75% 50%",
  },
  productivity: {
    colors: ["80 80% 45%", "60 90% 50%", "100 50% 70%"],
    shapeType: "bolts",
    accentHsl: "80 80% 45%",
  },
};

export function getCategoryVisual(category: Category): CategoryVisual {
  return categoryVisuals[category] || categoryVisuals.frontend;
}

export function getToolVisualAngle(toolName: string): number {
  return hashString(toolName) % 360;
}

export function getToolVisualScale(toolName: string): number {
  const hash = hashString(toolName);
  return 0.8 + (hash % 40) / 100;
}

export interface CompositionShape {
  type: "circle" | "rect" | "arc" | "line";
  cx: number; // % of canvas
  cy: number;
  size: number; // % of canvas
  rotation: number;
  opacity: number;
  colorIndex: 0 | 1 | 2;
  rx?: number; // for rounded rects
}

export interface Composition {
  gradientCenter: { x: number; y: number };
  gradientAngle: number;
  shapes: CompositionShape[];
  glowX: number;
  glowY: number;
  glowRadius: number;
}

// Generates a unique abstract composition from a tool
export function generateComposition(toolName: string, category: Category): Composition {
  const hash = hashString(toolName);
  const rand = seededRandom(hash);
  const visual = getCategoryVisual(category);

  const shapeCount = 3 + Math.floor(rand() * 5); // 3-7 shapes
  const shapes: CompositionShape[] = [];

  const shapeGenerators: Record<CategoryVisual["shapeType"], () => CompositionShape> = {
    arcs: () => ({
      type: "arc" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 20 + rand() * 45,
      rotation: rand() * 360,
      opacity: 0.06 + rand() * 0.18,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
    }),
    rects: () => ({
      type: "rect" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 15 + rand() * 40,
      rotation: rand() * 90 - 45,
      opacity: 0.05 + rand() * 0.15,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
      rx: 4 + rand() * 12,
    }),
    rings: () => ({
      type: "circle" as const,
      cx: 30 + rand() * 40,
      cy: 30 + rand() * 40,
      size: 15 + rand() * 50,
      rotation: 0,
      opacity: 0.06 + rand() * 0.14,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
    }),
    blocks: () => ({
      type: "rect" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 10 + rand() * 30,
      rotation: rand() * 10 - 5,
      opacity: 0.05 + rand() * 0.15,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
      rx: 2,
    }),
    curves: () => ({
      type: "arc" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 25 + rand() * 40,
      rotation: rand() * 360,
      opacity: 0.06 + rand() * 0.16,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
    }),
    angles: () => ({
      type: "line" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 20 + rand() * 40,
      rotation: rand() * 180,
      opacity: 0.08 + rand() * 0.14,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
    }),
    frames: () => ({
      type: "rect" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 15 + rand() * 35,
      rotation: rand() * 20 - 10,
      opacity: 0.05 + rand() * 0.15,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
      rx: 8 + rand() * 10,
    }),
    hexes: () => ({
      type: "circle" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 12 + rand() * 35,
      rotation: rand() * 60,
      opacity: 0.06 + rand() * 0.14,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
    }),
    bolts: () => ({
      type: "line" as const,
      cx: rand() * 100,
      cy: rand() * 100,
      size: 15 + rand() * 35,
      rotation: 60 + rand() * 60,
      opacity: 0.08 + rand() * 0.16,
      colorIndex: (Math.floor(rand() * 3) as 0 | 1 | 2),
    }),
  };

  const gen = shapeGenerators[visual.shapeType];
  for (let i = 0; i < shapeCount; i++) {
    shapes.push(gen());
  }

  return {
    gradientCenter: { x: 20 + rand() * 60, y: 20 + rand() * 60 },
    gradientAngle: rand() * 360,
    shapes,
    glowX: 20 + rand() * 60,
    glowY: 20 + rand() * 60,
    glowRadius: 30 + rand() * 40,
  };
}

// Generate composition SVG string
export function generateCompositionSvg(
  toolName: string,
  category: Category,
  width = 400,
  height = 200
): string {
  const visual = getCategoryVisual(category);
  const comp = generateComposition(toolName, category);
  const colors = visual.colors;

  let shapesStr = "";

  for (const shape of comp.shapes) {
    const x = (shape.cx / 100) * width;
    const y = (shape.cy / 100) * height;
    const s = (shape.size / 100) * Math.max(width, height);
    const color = `hsl(${colors[shape.colorIndex]})`;

    switch (shape.type) {
      case "circle":
        shapesStr += `<circle cx="${x}" cy="${y}" r="${s / 2}" fill="none" stroke="${color}" stroke-width="${1 + s * 0.02}" opacity="${shape.opacity}" />`;
        shapesStr += `<circle cx="${x}" cy="${y}" r="${s / 3}" fill="${color}" opacity="${shape.opacity * 0.3}" />`;
        break;
      case "rect":
        shapesStr += `<rect x="${x - s / 2}" y="${y - s / 3}" width="${s}" height="${s * 0.66}" rx="${shape.rx || 4}" fill="none" stroke="${color}" stroke-width="${1 + s * 0.015}" opacity="${shape.opacity}" transform="rotate(${shape.rotation} ${x} ${y})" />`;
        break;
      case "arc": {
        const r = s / 2;
        const startAngle = shape.rotation * (Math.PI / 180);
        const endAngle = startAngle + Math.PI * (0.6 + (shape.opacity * 3));
        const x1 = x + r * Math.cos(startAngle);
        const y1 = y + r * Math.sin(startAngle);
        const x2 = x + r * Math.cos(endAngle);
        const y2 = y + r * Math.sin(endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        shapesStr += `<path d="M${x1} ${y1} A${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${1.5 + s * 0.02}" stroke-linecap="round" opacity="${shape.opacity}" />`;
        break;
      }
      case "line": {
        const angle = shape.rotation * (Math.PI / 180);
        const dx = Math.cos(angle) * s / 2;
        const dy = Math.sin(angle) * s / 2;
        shapesStr += `<line x1="${x - dx}" y1="${y - dy}" x2="${x + dx}" y2="${y + dy}" stroke="${color}" stroke-width="${2 + s * 0.02}" stroke-linecap="round" opacity="${shape.opacity}" />`;
        // Add a shorter cross stroke for visual interest
        const perpAngle = angle + Math.PI / 2;
        const pdx = Math.cos(perpAngle) * s * 0.2;
        const pdy = Math.sin(perpAngle) * s * 0.2;
        shapesStr += `<line x1="${x - pdx}" y1="${y - pdy}" x2="${x + pdx}" y2="${y + pdy}" stroke="${color}" stroke-width="${1.5}" stroke-linecap="round" opacity="${shape.opacity * 0.6}" />`;
        break;
      }
    }
  }

  // Accent glow
  const glowColor = colors[0];
  const glowId = `glow-${hashString(toolName) % 10000}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="${glowId}" cx="${comp.glowX}%" cy="${comp.glowY}%" r="${comp.glowRadius}%">
        <stop offset="0%" stop-color="hsl(${glowColor})" stop-opacity="0.2" />
        <stop offset="100%" stop-color="hsl(${glowColor})" stop-opacity="0" />
      </radialGradient>
      <filter id="grain-${glowId}">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.08"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" mode="overlay"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#${glowId})" />
    ${shapesStr}
    <rect width="${width}" height="${height}" filter="url(#grain-${glowId})" opacity="0.4" />
  </svg>`;
}
