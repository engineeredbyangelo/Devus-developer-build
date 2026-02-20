

# Landing Page Section Refinement

## Problems Identified

1. **No spacing** between the "Why Devus Exists" stat cards and the "Your toolkit, anywhere" mobile preview -- they sit in the same component with only `mb-20` gap
2. **Two sections feel identical**: "Designed for Mobile" (inside WhyDevusSection) and "Why Developers Choose Devus" (FeaturesSection header) overlap in purpose and messaging
3. **"AI-Powered Discovery"** feature row in FeaturesSection is outdated -- the app now uses weekly tool refreshes, not AI search
4. The staggering alternating feature rows are great and should stay, but need clearer differentiation from the mobile showcase

## Changes

### 1. Split WhyDevusSection into two distinct halves

- **Top half** stays as-is: "Why Devus Exists" with the three stat cards (Tool Overload, Consolidation, Augment). Add more vertical padding at the bottom (`mb-28 md:mb-36`) for breathing room.
- **Bottom half** (the mobile preview + features list) gets pulled out into a **standalone section** with its own identity. Rename it from "Designed for Mobile" to something like **"Built for Your Workflow"** -- emphasizing it's about the product experience, not just mobile support.

### 2. Update FeaturesSection to remove overlap

- Change the heading from "Why Developers Choose Devus" to **"How It Works"** or **"Core Features"** to differentiate it from the WhyDevus narrative
- **Replace "AI-Powered Discovery"** with a new feature: **"Weekly Tool Drops"** -- describing how freshly released tools land on your dashboard every week with optional notifications
- Update the visual from the AI orbs animation to a calendar/notification-themed animation (e.g., a pulsing bell icon with floating tool cards dropping in)
- Keep the three other staggering rows (Direct Links, GitHub Access, Smart Filtering) unchanged

### 3. Update feature descriptions and benefits

The "Weekly Tool Drops" feature row will have:
- Title: "Weekly Tool Drops"
- Icon: `Bell` or `CalendarDays` from lucide
- Description: "Never miss the latest releases. Every week, freshly launched developer tools are curated and delivered straight to your dashboard."
- Benefits: "Curated weekly", "New release alerts", "Stay ahead of the curve"
- Visual: New `DropsVisual` animation with a bell icon center and floating tool cards dropping in

### 4. Update BenefitsSection pricing table

- Change "AI-powered search" to "Weekly new tool alerts" in the feature list
- Change "Daily new tool updates" to "Priority early access" or similar

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/WhyDevusSection.tsx` | Increase spacing between stat cards and mobile showcase; rename "Designed for Mobile" badge to "Built for Your Workflow" |
| `src/components/FeaturesSection.tsx` | Change section heading to "How It Works"; replace AI-Powered Discovery with Weekly Tool Drops; add new `DropsVisual` animation component |
| `src/components/BenefitsSection.tsx` | Update pricing feature list to reflect weekly drops instead of AI search |

## Section Flow (Top to Bottom)

```text
Hero
  |
"Why Devus Exists" -- stat cards (problem, consolidation, augment)
  |  <-- generous spacing
"Built for Your Workflow" -- mobile mockup + feature bullets
  |
"How It Works" -- staggering alternating rows (Weekly Drops, Direct Links, GitHub, Filtering)
  |
Demo Preview
  |
Pricing / Benefits
  |
Footer
```

