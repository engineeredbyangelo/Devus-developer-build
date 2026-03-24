

# Add Visual Imagery to All Tool Cards

## Summary

Add a prominent visual banner/thumbnail to every tool card across the dashboard. Each card will feature either the tool's official screenshot (sourced via `screenshotUrl`) or a generated abstract gradient visual tied to the tool's category. This applies to all card surfaces: `DashboardToolCard`, `ToolCard`, `ToolkitStrip`, `WeeklyDigestBanner` mini-cards, Fresh Finds cards, and the Profile "Tool of the Day" card.

## Approach: Category-Themed Abstract Visuals + Real Screenshots

Since we can't dynamically fetch screenshots from 65+ external sites at runtime, we use a **two-tier system**:

1. **Real screenshots** — Populate `screenshotUrl` in `data.ts` for top tools using high-quality public OG images / product screenshots from their official sites (e.g., `https://react.dev/images/og-home.png`)
2. **Abstract gradient fallback** — For tools without a screenshot, generate a unique abstract visual using CSS gradients seeded by the tool's category color + tool name. Each category gets a distinct gradient palette (from the existing `categories[].color` values), combined with geometric SVG patterns for texture.

## Visual Design

```text
┌──────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← Visual banner (screenshot or gradient)
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │     Desktop: ~120px height
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │     Mobile: ~80px height
├──────────────────────────┤
│ [logo] Tool Name    [♥]  │
│ Category • ★ 220k       │
│ Description text...      │
│ [React] [Vite] [TS]     │
└──────────────────────────┘
```

Mobile layout stays horizontal but adds a smaller thumbnail on the left side instead of a top banner for compactness.

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/dashboard/ToolCardVisual.tsx` | Shared component that renders either a `screenshotUrl` image or an abstract category gradient with subtle geometric pattern overlay. Accepts `tool` prop, renders responsive banner. |
| `src/lib/tool-visuals.ts` | Utility: maps each category to a unique gradient palette + pattern style. Generates a deterministic "visual seed" from tool name for subtle variation within categories. |

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/data.ts` | Add `screenshotUrl` and `logoUrl` values for ~20 top tools using their official OG/product images (publicly available URLs from react.dev, vuejs.org, svelte.dev, tailwindcss.com, etc.) |
| `src/components/dashboard/DashboardToolCard.tsx` | Add `ToolCardVisual` banner above the text content on desktop (vertical layout). On mobile, show a small square thumbnail on the left alongside the existing horizontal layout. |
| `src/components/ToolCard.tsx` | Add `ToolCardVisual` banner between the glow effect and the header section. |
| `src/components/dashboard/ToolkitStrip.tsx` | Replace the letter-initial circle with a small `ToolCardVisual` thumbnail (32x32 rounded). |
| `src/components/dashboard/WeeklyDigestBanner.tsx` | Add a small visual thumbnail to each mini tool card in the carousel. |
| `src/components/dashboard/ToolHeroView.tsx` | Add a large `ToolCardVisual` banner behind/above the hero content as a background visual accent. |
| `src/pages/Dashboard.tsx` | Add `ToolCardVisual` to the "Tool of the Day" card and the Fresh Finds inline cards. |

## Technical Details

### `tool-visuals.ts` — Category Gradient System

Each category gets a unique 2-3 color gradient derived from its existing `color` value in `categories[]`:

- **Frontend**: Cyan → Blue tones with circuit-line pattern
- **Backend**: Purple → Indigo with node-graph pattern  
- **AI/ML**: Pink → Magenta with neural-net dots
- **Database**: Green → Teal with grid pattern
- **DevOps**: Yellow → Amber with pipeline-flow pattern
- **Testing**: Orange → Coral with checkmark pattern
- **Mobile**: Blue → Sky with device-frame accent
- **Security**: Red → Crimson with shield pattern
- **Productivity**: Yellow → Lime with lightning pattern

A deterministic hash of the tool name shifts the gradient angle and pattern offset so no two tools in the same category look identical.

### `ToolCardVisual.tsx` — The Shared Visual Component

Props: `tool: Tool`, `size: "sm" | "md" | "lg"` (controls height), `className?: string`

Rendering logic:
1. If `tool.screenshotUrl` exists → render `<img>` with `object-cover`, rounded top corners, subtle overlay gradient at bottom for text readability
2. Else → render a `<div>` with the category gradient background + SVG pattern overlay + tool initial letter as a large watermark accent

### Screenshot URLs

Add real OG image URLs for popular tools. These are publicly accessible images from each tool's website (used for social sharing). Examples:
- React: `https://react.dev/images/og-home.png`
- Vue: official OG image
- Tailwind, Next.js, Svelte, etc.

For tools without good OG images, the gradient fallback handles it beautifully.

### Mobile Responsiveness

- **DashboardToolCard mobile**: The visual appears as a 48x48 rounded thumbnail on the left (replacing the plain logo square), keeping the compact horizontal layout
- **DashboardToolCard desktop**: Full-width banner above the content area (~120px)
- **ToolCard**: Always shows a top banner regardless of viewport
- **ToolkitStrip**: Small 36x36 rounded thumbnail replaces the letter initial
- **WeeklyDigestBanner mini-cards**: 32x32 thumbnails replace the letter initial

