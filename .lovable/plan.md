

# Elevate Card Visuals — Abstract Immersive System

## Problem
Current visuals are flat: a simple gradient with a faint repeating SVG pattern and a single watermark letter. They look templated and generic — every card feels the same.

## New Approach: Layered Abstract Compositions

Replace the current single-gradient-plus-pattern with a **multi-layer generative composition** per card. Each visual becomes a unique abstract artwork seeded by the tool name, with category providing the color DNA.

### Visual Layers (bottom to top)
1. **Deep gradient base** — two-tone radial gradient positioned off-center (not the standard top-left-to-bottom-right)
2. **Geometric field** — larger, fewer, more intentional shapes: overlapping circles, intersecting arcs, floating rectangles with rounded corners, or diagonal slashes — not tiny repeating tiles
3. **Accent glow** — a soft radial light bloom at a seeded position, simulating depth/focus
4. **Noise grain texture** — subtle CSS noise overlay for analog warmth
5. **Bottom fade** — blends into the card background

### Category Visual DNA (richer palettes)
Each category gets a **3-color system** and a distinct geometric language:
- **Frontend**: Cyan/Electric Blue/White — intersecting arcs and circles (component trees)
- **Backend**: Deep Purple/Violet/Indigo — stacked rectangles and connecting lines (architecture)
- **AI/ML**: Magenta/Pink/Warm White — concentric rings and scattered dots (neural patterns)
- **Database**: Emerald/Teal/Mint — grid blocks with varying opacity (data tables)
- **DevOps**: Amber/Orange/Gold — flowing curves and arrows (pipelines)
- **Testing**: Coral/Red-Orange/Peach — checkmark-derived angular shapes
- **Mobile**: Sky Blue/Cobalt/Light Blue — rounded rectangles (device frames)
- **Security**: Crimson/Dark Red/Rose — hexagonal tessellation (shields)
- **Productivity**: Lime/Yellow-Green/Chartreuse — lightning-bolt diagonals

### What Makes Each Card Unique
The tool name hash controls:
- Gradient center position (x, y offset)
- Number of geometric shapes (3–7)
- Shape positions, sizes, rotations, and opacity
- Accent glow position and radius
- Overall composition rotation

This means two "frontend" tools will share the cyan palette but have completely different compositions.

## Files to Modify

### `src/lib/tool-visuals.ts` — Complete rewrite
- Replace simple patterns with a `generateComposition(tool)` function that returns an array of SVG elements (circles, rects, arcs, lines) with computed positions/sizes/opacities
- Each shape is larger and more intentional (20–60% of canvas, not tiny 2px dots)
- Add noise texture CSS generation
- Richer 3-color palettes per category

### `src/components/dashboard/ToolCardVisual.tsx` — Richer rendering
- Render the composition as layered absolutely-positioned divs with SVG shapes
- Add radial accent glow (`radial-gradient` at seeded position)
- Add CSS noise grain overlay (using a tiny inline SVG `feTurbulence` filter)
- Keep screenshot path unchanged (real screenshots still win when available)
- Smooth animated shimmer on hover for interactivity

### `src/components/dashboard/DashboardToolCard.tsx` — Minor
- Increase banner height slightly for more visual breathing room: `md` → `h-28 sm:h-32`

### `src/components/ToolCard.tsx` — Minor
- Same height increase for the `ToolCard` banner

## Technical Details

The composition SVG is generated as a single inline `<svg>` with:
- 3–7 shapes per card (mix of `<circle>`, `<rect rx>`, `<path>` arcs)
- Shapes use the category's 3-color palette at varying opacities (0.05–0.25)
- Shapes overlap deliberately for depth
- A `<radialGradient>` for the accent glow baked into the SVG

No external assets needed — everything is procedurally generated from the tool name + category. The result looks like a unique piece of generative art on each card.

## Mobile
No layout changes needed — the visual component is already responsive. The richer compositions work at all sizes since they use relative positioning within the container.

