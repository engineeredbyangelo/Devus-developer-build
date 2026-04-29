# Reinvent Landing Page — Premium Flow

Goal: tighten the user journey, elevate visual aesthetic to match the new hero (glassmorphism, cyan glow, subtle motion), remove the demo section, and auto-route users to the dashboard after login.

## New Section Order

```
Hero (existing — keep as-is)
   ↓
The Problem & Promise   ← merges WhyDevus stats + outcome promise
   ↓
How Devus Works         ← reinvented FeaturesSection (interactive showcase)
   ↓
Explore the Stack       ← keep ToolStackShowcase, restyled to match hero
   ↓
Pricing / Get Started   ← restyled BenefitsSection
   ↓
Footer
```

Removed: `DemoPreview` section (per request — too much, redundant with ToolStackShowcase).

## Section Designs

### 1. The Problem & Promise (replaces WhyDevusSection)
A single, focused two-column section instead of stats grid + mobile mockup. Combines the "why" with an immediate visual answer.

- **Left**: Tight narrative — "14 tools. 62% want to consolidate. We help you do it." Three compact stat chips (14 / 62% / 69%) with glow accents instead of three full cards.
- **Right**: A premium animated "before vs after" — chaotic floating tool icons collapsing into an organized stack/feed (Framer Motion). Glass panel, cyan glow, matches hero aesthetic.
- Removes the bulky mobile phone mockup (already shown in hero).

### 2. How Devus Works (reinvented FeaturesSection)
Replace the 4 alternating zig-zag rows with an **interactive feature switcher** — a single premium showcase panel.

- **Left column**: 4 vertical pill-tabs (Personalized Feed / Ask Devus AI / Immersive Cards / Smart Filtering). Active tab has cyan glow + slide indicator.
- **Right column**: Single large glass panel that crossfades between 4 mini animated previews when a tab is selected (auto-cycles every 4s, pauses on hover).
- Each preview reuses upgraded versions of the existing visual components (RecommendationsVisual, AIVisual, etc.) wrapped in a browser-chrome frame consistent with the hero wireframe.
- Outcome: same 4 features, ~70% less vertical space, far more premium and engaging.

### 3. Explore the Stack (ToolStackShowcase — light restyle)
Keep functionality. Apply hero-consistent polish:
- Category pills get glassmorphism + cyan active glow.
- Tool cards get subtle border-gradient on hover (like hero feature cards).
- CTA copy: "Sign up free to unlock all 65+ tools" (reinforces free signup).

### 4. Pricing (BenefitsSection restyle)
- Eyebrow + heading already good. Restyle the two cards:
  - Free card: glass panel, "Start free" badge top-left.
  - Pro card: gradient border with cyan glow (matches hero CTA glow), "Most popular" floating chip.
- Update Free CTA copy: "Sign up free — explore the product".
- Add a small reassurance row: "No card required · Free forever tier · Cancel anytime".

## Auto-route to Dashboard After Login

Currently `/dashboard` redirect only happens via `WelcomeAnimation` after a fresh signin. Users who sign in via OAuth redirect, or already-logged-in users landing on `/`, are not auto-routed.

Add to `src/pages/Index.tsx`:
- `useEffect` watching `useAuth()`'s `user` and `isLoading`. When `!isLoading && user && !showWelcome`, `navigate('/dashboard', { replace: true })`.
- This covers: OAuth callback, returning logged-in users hitting `/`, and email-confirm redirects. Welcome animation continues to handle the fresh-signin celebratory path.

## Files

**Modified**
- `src/pages/Index.tsx` — remove `DemoPreview`, add auto-redirect effect.
- `src/components/WhyDevusSection.tsx` — rewrite as "Problem & Promise" two-column.
- `src/components/FeaturesSection.tsx` — rewrite as interactive tab switcher.
- `src/components/ToolStackShowcase.tsx` — restyle pills + cards (no logic change).
- `src/components/BenefitsSection.tsx` — restyle cards, update CTA copy.

**New**
- `src/components/landing/ChaosToOrderVisual.tsx` — animated visual for Problem & Promise.
- `src/components/landing/FeatureSwitcher.tsx` — interactive feature tab component.

**Unchanged but referenced**
- `src/components/HeroWireframeShowcase.tsx`, `src/components/LandingHero.tsx` — hero stays as approved.

## Technical Notes

- Continue using `framer-motion` (already in deps) — no new libraries.
- Reuse existing semantic tokens (`primary`, `glow`, `glass`, `glass-hover`) from `index.css` — no new color additions needed.
- All animations respect `prefers-reduced-motion` (Framer Motion handles this when motion components are configured; verify on key loops).
- Mobile: feature switcher collapses to stacked accordion below `md`. Problem & Promise stacks vertically with visual on top.
- Auto-redirect uses `replace: true` so back button doesn't return to `/`.
