# Reinvent Landing Hero — Animated Wireframe Product Showcase

## Goal
Replace the orbital tool nexus visual with a premium, animated **wireframe of the Devus platform** (web + mobile) showing skeletal UI building itself. The hero must immediately communicate *what* Devus is (a personalized developer toolkit dashboard) and *why* it matters (AI assistant, weekly drops, immersive tool cards). Branding (cyan glow, deep slate, Inter, glassmorphism) stays intact.

## Current State
- `src/components/LandingHero.tsx` uses a 2-column grid: copy left, `<HeroNexusAnimation />` right (concentric rings of tool icon orbs).
- Headline: "Your personalized developer toolkit." Three feature chips below CTAs.
- The orbital animation is abstract — users can't tell what the product *does* from looking at it.

## New Hero Concept

```text
┌──────────────────────────────────────────────────────────────┐
│  [activity ticker]                                           │
│                                                              │
│  Your personalized       ┌────────────────────┐  ┌──────┐   │
│  developer toolkit       │ ▢ ▢ ▢   search   │  │ ▢▢▢  │   │
│                          │ ─────────────────  │  │ ──── │   │
│  Tools matched to your   │ ┌──┐ ┌──┐ ┌──┐    │  │ ┌──┐ │   │
│  stack...                │ │▓▓│ │▓▓│ │▓▓│    │  │ │▓▓│ │   │
│                          │ └──┘ └──┘ └──┘    │  │ └──┘ │   │
│  [Get Started] [Explore] │ ─ ─ ─ ─ ─ ─ ─ ─   │  │ ──── │   │
│                          │ Ask Devus...   ⌁  │  │ ▢▢▢▢ │   │
│  [3 feature chips]       └────────────────────┘  └──────┘   │
│                              desktop frame      phone frame  │
└──────────────────────────────────────────────────────────────┘
```

### The Wireframe Visual (right column)
A composed scene: a **desktop browser frame** (larger, back) with a **phone frame** (smaller, overlapping front-right). Both render a stylized, low-fidelity wireframe of the actual Devus dashboard so the product is instantly recognizable.

**Desktop frame contents** (skeletal):
- Browser chrome: 3 traffic-light dots + faux URL pill (`devus.one`)
- Top nav row: logo block + 3 nav pills + avatar circle
- Search bar skeleton with shimmering "Ask Devus..." caret
- Recommended Tools row: 3 tool cards (rounded rects with gradient tops + 2 text bars each)
- Trending row: 4 smaller cards
- Right sidebar sliver: AI assistant chat bubble skeleton

**Phone frame contents** (skeletal):
- Notch/dynamic island
- Compact header with hamburger + logo
- "Tool of the Day" hero card (gradient block)
- 2 stacked tool list rows
- Bottom tab bar with 4 icon dots

### Skeletal UI Animation Sequence (Framer Motion, ~4s loop)
1. **t=0.0s** — Both frames fade/scale in from 0.95 → 1.
2. **t=0.4s** — Browser chrome + phone notch settle.
3. **t=0.6s** — Nav/header bars slide in from top with stagger.
4. **t=0.9s** — Search bar draws in (width 0 → full) on desktop; tab bar slides up on phone.
5. **t=1.2s** — Tool card skeletons cascade in (stagger 0.08s) using a shimmer (`bg-gradient-to-r from-muted via-muted/40 to-muted` animated `bg-position`).
6. **t=2.0s** — A cyan **search query** types into the search bar ("react animation library").
7. **t=2.6s** — Cards re-shimmer/highlight as if filtered; one card on each frame gets a cyan glow ring (the AI recommendation).
8. **t=3.2s** — A small "Ask Devus" chat bubble pops on the desktop sidebar with a typing-dots indicator.
9. **t=4.0s** — Hold for 1s, then loop (subtle re-shimmer rather than full restart to feel alive without being noisy).

A continuous **slow parallax tilt** (±2° on Y axis using `motion` and pointer position on desktop only) gives the scene depth. Respect `prefers-reduced-motion`: skip parallax + typing, keep static composed wireframe.

### Premium Visual Treatment
- Frames: glassmorphism (`bg-card/40 backdrop-blur-xl border border-border/60`) with cyan glow shadow (`shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]`).
- Skeleton blocks: `bg-muted/60` with animated cyan shimmer overlay using existing primary token.
- Behind the scene: soft cyan radial glow + faint dotted grid (`bg-[radial-gradient(circle,hsl(var(--primary)/0.15)_1px,transparent_1px)] bg-[size:24px_24px]`) to read as "developer canvas".
- Phone frame: realistic bezel using nested rounded divs, dynamic island as a black pill.

### Refined Copy (sharpens "what + why")
- Eyebrow chip (above headline): `✦ The developer toolkit, personalized` (replaces ticker on first paint; ticker stays below CTAs).
- Headline: **Discover the right dev tools — without the noise.** with `dev tools` in cyan glow.
- Subhead: **Devus learns your stack and surfaces the tools, libraries, and AI helpers that actually fit your workflow. Curated weekly. Searched conversationally.**
- Keep CTAs: `Get Started →` (primary glow) + `Explore Tools ✦` (outline).
- Replace 3 feature chips with 3 **outcome-led** chips:
  - 🎯 *Matched to your stack* — recommendations from your tools
  - 🤖 *Ask Devus AI* — natural-language tool search
  - 📦 *Weekly drops* — fresh, curated finds every Monday

## Mobile Responsiveness
- `< md`: stack vertically. Wireframe scene scales to ~340px wide, phone frame overlap reduces to a tighter offset. Headline drops to `text-3xl`.
- `md → lg`: 2-column grid kicks in but wireframe scene stays compact (max 480px).
- `lg+`: full split layout, wireframe scene fills right column up to ~580px, parallax enabled.
- Animation timings unchanged across breakpoints; only sizes scale.
- Reduced-motion: static wireframe + still cyan glow.

## File Plan

| File | Change |
|------|--------|
| `src/components/HeroWireframeShowcase.tsx` | **New** — composed desktop + phone wireframe scene with all animations |
| `src/components/hero/WireframeDesktop.tsx` | **New** — desktop browser frame skeleton |
| `src/components/hero/WireframePhone.tsx` | **New** — phone frame skeleton |
| `src/components/hero/WireframeShimmer.tsx` | **New** — reusable shimmering skeleton block |
| `src/components/LandingHero.tsx` | Edit — swap `<HeroNexusAnimation />` → `<HeroWireframeShowcase />`; update headline/subhead/chip copy; tighten grid spacing |
| `src/components/HeroNexusAnimation.tsx` | Keep (unused); can be deleted later if confirmed not used elsewhere |

## Technical Notes
- All animation via existing **Framer Motion** (already in deps). Use `motion`, `useReducedMotion`, `AnimatePresence`, and a single `useEffect` loop for the typing sequence.
- Pure presentational/frontend — no backend, no data fetching, no schema changes.
- Strictly semantic tokens: `bg-card`, `border-border`, `text-primary`, `bg-muted`, `text-muted-foreground` — no raw hex.
- Shimmer keyframe added to `tailwind.config.ts` if needed (`shimmer: 0% { bg-position: -200% 0 } → 100% { bg-position: 200% 0 }`), or done inline via `motion` `animate` on `backgroundPosition`.
- No new dependencies.

## Out of Scope
- Other landing sections (`WhyDevusSection`, `FeaturesSection`, etc.) untouched.
- No copy changes outside the hero block.
- Deletion of `HeroNexusAnimation.tsx` deferred (safe to remove after verification).
