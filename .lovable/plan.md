# Simplify Dashboard: Remove Explore, Transform My Toolkit into Profile

## What Changes

1. **Remove the Explore tab entirely** — the Home feed already surfaces tools effectively
2. **Transform "My Toolkit" into a personalized profile page** with:
  - User profile header (avatar, name, PRO badge, their chosen stack categories)
  - "Tool of the Day" recommendation card (one highlighted tool based on their stack)
  - Favorites grid below
  - Inline "Ask Devus" chat input (moves from right sidebar into this tab on all devices)
3. **Navigation reduces to 3 tabs**: Home | My Toolkit(Change to Profile) | Categories | Settings (for users to log out or adjust their info/billings, profile pic..etc)
4. **Right sidebar**: remains on Home tab (desktop), Ask Devus also available inline on My Toolkit tab
5. **Fully mobile responsive**: profile header stacks vertically, tool of the day is full-width, favorites in single column

## Files to Modify

### `src/components/dashboard/DashboardTopNav.tsx`

- Change `DashboardTab` type to `"home" | "toolkit" | "categories"` (remove `"explore"`)
- Remove `Compass`/Explore from `navItems` array
- Update mobile bottom nav accordingly (3 items + sign out = cleaner fit)

### `src/pages/Dashboard.tsx`

- Delete the entire Explore tab section (lines 278-360)
- Replace the Toolkit tab (lines 362-390) with a new profile-style layout:
  - Profile header: avatar, name, PRO badge, followed category pills
  - "Tool of the Day" card: pick the top recommendation from `useRecommendations` with a "Why this?" reason
  - Favorites grid below (existing `favoriteTools`)
  - Inline "Ask Devus" input at the bottom (reuse the same `handleAskDevus` logic)
- Update all `setActiveTab("explore")` references (in WeeklyDigestBanner onBrowse, RecommendedSection onSeeAll, TrendingSection onSeeAll, empty toolkit state) to navigate to Home or remove the "See all" links
- Default tab stays `"home"`

### `src/components/dashboard/WeeklyDigestBanner.tsx`

- Change the "Browse This Week's Picks" button behavior — instead of switching to explore, scroll to recommendations or just dismiss

### `src/components/dashboard/RecommendedSection.tsx`

- Remove or repurpose the "See all" link (no explore tab to link to)

### `src/components/dashboard/TrendingSection.tsx`

- Remove or repurpose the "See all" link

## New: My Toolkit Profile Layout (inside Dashboard.tsx)

```text
┌─────────────────────────────────┐
│ Avatar  Name       PRO badge   │
│ [React] [AI/ML] [Backend] ...  │  ← followed categories as pills
├─────────────────────────────────┤
│ ⭐ Tool of the Day             │
│ ┌─────────────────────────────┐ │
│ │ Large featured card with    │ │
│ │ name, description, reason,  │ │
│ │ "View Details" button       │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 💬 Ask Devus                   │
│ [input field] [send]           │
├─────────────────────────────────┤
│ ❤️ My Favorites (grid)         │
│ ┌────┐ ┌────┐ ┌────┐          │
│ │card│ │card│ │card│          │
│ └────┘ └────┘ └────┘          │
└─────────────────────────────────┘
```

Mobile: everything stacks single-column, Tool of the Day is full-width, favorites are 1-col grid.

## Technical Notes

- "Tool of the Day" uses `recommendations[0]` from `useRecommendations` — deterministic per day by seeding with date
- No new components needed — the profile layout is built inline in Dashboard.tsx's toolkit tab section
- No database changes required