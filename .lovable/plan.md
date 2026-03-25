

# Revamp Landing Page to Reflect New Product Direction

## What's Changing

The landing page currently describes a generic "discover dev tools" pitch. The product has evolved into a personalized dashboard with a Profile tab, Tool of the Day, AI assistant, abstract immersive visuals, and a streamlined 4-tab navigation (Home / Profile / Categories / Settings). The landing page needs to reflect this.

## Section-by-Section Changes

### 1. Hero — `src/components/LandingHero.tsx`
- Update headline: "Your personalized developer toolkit" (not just "discover tools")
- Update subtitle to emphasize personalization, AI assistant, curated weekly drops
- Update the 3 feature highlight cards:
  - "Personalized Feed" — tools matched to your stack
  - "AI-Powered Search" — Ask Devus anything
  - "Weekly Drops" — fresh tools delivered weekly
- Keep the HeroNexusAnimation on the right (it still fits)

### 2. Why Devus Section — `src/components/WhyDevusSection.tsx`
- Keep the 3 stat cards (tool overload, consolidation, augment) — still relevant
- **Rebuild the MobileAppPreview** to accurately mirror the current dashboard:
  - Show the actual tab bar: Home / Profile / Categories / Settings icons
  - Show a "Tool of the Day" card with an abstract gradient visual (using the immersive system colors)
  - Show a "Recommended" section with 2 mini tool cards featuring gradient thumbnails
  - Show the "Ask Devus" input bar
  - Remove the old generic search + category pills + plain tool cards
- Update the feature list text to match current features:
  - "Personalized Feed" (replaces Smart Discovery)
  - "Tool of the Day" (replaces Save & Organize)
  - "Ask Devus AI" (replaces Deep Insights)
  - "Category Following" (replaces Smart Filters)
  - "Profile & Favorites" (replaces Instant Access)

### 3. Features Section — `src/components/FeaturesSection.tsx`
- Update the 4 feature rows to reflect actual product capabilities:
  1. **Personalized Recommendations** — tools matched to your followed categories (replaces Weekly Tool Drops as the lead feature)
  2. **Ask Devus AI** — inline AI assistant for tool comparisons and discovery (replaces Direct Links)
  3. **Immersive Tool Cards** — unique generative artwork for every tool (replaces GitHub Access)
  4. **Smart Filtering** — stays, but update copy to mention category following
- Update the visual animations for each row to better represent the new features

### 4. Tool Stack Showcase — `src/components/ToolStackShowcase.tsx`
- Minor copy updates only: mention "personalized" experience
- The interactive category explorer is still relevant

### 5. Demo Preview — `src/components/DemoPreview.tsx`
- Update header copy: "Preview Your Dashboard" instead of "Try It Out"
- The ToolCard grid already uses the immersive visuals, so this stays mostly the same

### 6. Benefits/Pricing — `src/components/BenefitsSection.tsx`
- Update feature list to include: Tool of the Day, Ask Devus AI, Immersive Visuals, Profile page
- Remove or update any features that no longer exist (e.g., "Community voting" if removed)

### 7. Footer — `src/pages/Index.tsx`
- No changes needed

## Files to Modify

| File | Scope |
|------|-------|
| `src/components/LandingHero.tsx` | Update headline, subtitle, feature cards |
| `src/components/WhyDevusSection.tsx` | Rebuild `MobileAppPreview` to mirror actual dashboard; update feature list |
| `src/components/FeaturesSection.tsx` | Update 4 feature rows with new titles, descriptions, benefits, and visuals |
| `src/components/DemoPreview.tsx` | Update header copy |
| `src/components/BenefitsSection.tsx` | Update tier feature lists |

## MobileAppPreview Rebuild Detail

The phone mockup is the most important visual change. New layout inside the phone frame:

```text
┌─────────────────────┐
│  Devus        [avatar]│  ← header with logo + user
├─────────────────────┤
│ ⭐ Tool of the Day   │
│ ┌─────────────────┐ │
│ │▓▓▓gradient▓▓▓▓▓│ │  ← abstract visual banner
│ │ Tool Name       │ │
│ │ "Matched to you"│ │
│ └─────────────────┘ │
│                     │
│ 💡 Recommended      │
│ ┌────┐ ┌────┐      │
│ │grad│ │grad│      │  ← mini cards with gradient thumbs
│ │name│ │name│      │
│ └────┘ └────┘      │
│                     │
│ 💬 Ask Devus...     │  ← input bar
├─────────────────────┤
│ 🏠  👤  📁  ⚙️     │  ← 4-tab bottom nav
└─────────────────────┘
```

The gradient visuals inside the phone use the same category color palettes from `tool-visuals.ts` (cyan for frontend, purple for backend, etc.) rendered as simple CSS gradients to suggest the immersive system.

## Technical Notes

- No new files or components needed
- No database changes
- All changes are copy + layout updates to existing components
- The MobileAppPreview uses hardcoded mini-gradients (not the full SVG generator) to keep the phone mockup lightweight

