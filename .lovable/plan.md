

# Fix Card Overlap and Mobile Card Sizing

## Problems

1. **"Why this?" tag overlaps favorite button** in `RecommendedSection.tsx` — absolute positioned at `top-2 right-12` collides with the heart button at `top-4 right-4`
2. **Cards too large on mobile** — `DashboardToolCard` uses `p-6`, large logo (`w-14 h-14`), and 2-line description, overwhelming small screens
3. **Grid gaps tight** across sections

## Changes

### 1. `DashboardToolCard.tsx` — Compact mobile layout
- Reduce padding: `p-6` → `p-4 sm:p-6`
- Use horizontal layout on mobile: logo on left, text on right (flexbox row on mobile, column on sm+)
- Shrink logo: `w-10 h-10` on mobile, `w-14 h-14` on sm+
- Clamp description: `line-clamp-1` on mobile, `line-clamp-2` on sm+
- Reduce tag margin: `mt-4` → `mt-3 sm:mt-4`

### 2. `RecommendedSection.tsx` — Fix "Why this?" overlap
- Move the "Why this?" tag from absolute positioning into the card's content flow — render it as an inline badge above the card name inside `DashboardToolCard` (pass as a prop) or below it inside `RecommendedSection` after the card
- Simplest approach: move the tag inside the `motion.div` wrapper but below the card, as a small inline badge strip, removing the `absolute` positioning entirely

### 3. `TrendingSection.tsx` — Responsive grid gap
- Change `gap-4` to `gap-3 sm:gap-4`

### 4. `Dashboard.tsx` — Home feed spacing
- Change `space-y-8` to `space-y-6 sm:space-y-8` on the home feed container
- Fresh Finds inline cards: reduce padding `p-4` → `p-3 sm:p-4`

### Files modified
| File | Change |
|------|--------|
| `src/components/dashboard/DashboardToolCard.tsx` | Responsive padding, horizontal mobile layout, smaller logo, shorter description |
| `src/components/dashboard/RecommendedSection.tsx` | Move "Why this?" tag out of absolute positioning into card flow |
| `src/components/dashboard/TrendingSection.tsx` | Responsive grid gap |
| `src/pages/Dashboard.tsx` | Responsive section spacing |

