

# Dashboard Overhaul: "Devus Home" — Personalized Developer Feed

## Summary

Transform the current tab-based dashboard into a personalized "Developer Home" experience with a smart feed, top navigation bar, weekly digest banner, and contextual sidebar. The goal is to make every visit feel fresh and relevant, driving daily return visits.

---

## Architecture Change

```text
CURRENT                          NEW
┌──────────────────────┐        ┌────────────────────────────────┐
│ 60px   │             │        │  Top Nav: Home|Explore|Toolkit │
│ Side   │  Tab Content│        ├────────────────────┬───────────┤
│ bar    │  (one at    │        │                    │ Right     │
│        │   a time)   │        │  Smart Feed        │ Sidebar   │
│        │             │        │  (vertical stack)  │ (stats,   │
│        │             │        │                    │  AI chat) │
└──────────────────────┘        └────────────────────┴───────────┘
```

## Navigation Redesign

**Replace**: 60px icon sidebar + bottom mobile nav
**With**: Horizontal top navigation bar

- Tabs: **Home** (default, new) | **Explore** (current grid) | **My Toolkit** (favorites) | **Categories**
- Embedded global search bar with AI hint placeholder: *"Search or ask anything… e.g., 'lightweight React alternatives'"*
- User avatar + sign-out dropdown on the right
- Mobile: collapses to hamburger or bottom tab bar with same items

**Files**: Rewrite `DashboardSidebar.tsx` → new `DashboardTopNav.tsx`. Update `DashboardTab` type to `"home" | "explore" | "toolkit" | "categories"`.

## Home Tab — Smart Personalized Feed

The new default tab. A vertical stack of curated sections, each with a "See all" link.

### Section 1: Weekly Digest Banner (dismissible)
- Glassmorphism card at top: "Fresh This Week • N new high-signal tools"
- Subtitle: "Curated for developers who follow [user's categories]"
- "Browse This Week's Picks" button + inline carousel of 3-4 tool cards
- Dismissible via X button (state stored in localStorage)
- **New component**: `WeeklyDigestBanner.tsx`

### Section 2: Recommended for You
- 4-6 tool cards selected from the user's followed categories + favorites similarity
- Algorithm (simple, no AI needed initially): tools in followed categories that aren't already favorited, sorted by `isNew` and `stars`
- Each card has a "Why this?" tag: *"Matches your React + Tailwind stack"* or *"New in AI/ML"*
- **New component**: `RecommendedSection.tsx`
- **New hook**: `use-recommendations.ts` — computes recommendations from `profile.favorites`, `profile.followed_categories`, and `tools` data

### Section 3: Fresh Finds
- Reuses existing `useFreshTools` hook and fresh tools UI
- Shows 5-8 newest tools with "Just discovered" badge and curator note (tool description)
- Pro gate: free users see 5, Pro users unlimited

### Section 4: Trending in Your Ecosystem
- Dynamic header: "Popular with [category] devs this month"
- Tools sorted by `stars` descending within user's followed categories
- Falls back to overall top tools if no categories followed
- **New component**: `TrendingSection.tsx`

### Section 5: My Toolkit (compact row)
- Horizontal scroll of favorited tools — name, category badge, quick "View" button
- Subtle badge if tool has `isNew` flag
- **New component**: `ToolkitStrip.tsx`

## Right Sidebar (desktop only, collapsible)

- **Stack coverage**: Simple stat based on how many categories the user follows out of total (e.g., "4/9 categories covered")
- **Quick Add**: Mini search input that filters tools and lets user favorite directly
- **Ask Devus**: Small AI chat input that triggers existing `useAISearch` hook
- Hidden on mobile; content accessible via Home tab sections instead
- **New component**: `DashboardRightSidebar.tsx`

## Empty / New User State

When user has no favorites and no followed categories:
- Replace the feed with a "Build Your First Stack" onboarding card
- 2 quick questions: "What's your main stack?" (React/Vue/Svelte/Other) + "What are you building?" (SaaS/Mobile/AI apps/Other)
- On submit: auto-follow relevant categories and show instant personalized feed
- **New component**: `OnboardingPrompt.tsx`
- Answers stored via existing `useFollowedCategoriesDb` hook

## Explore Tab

Unchanged — current grid with search, category chips, and AI discovery. Power users browse everything here.

## My Toolkit Tab

Replaces "Favorites" tab. Same content, renamed for clarity. Shows favorited tools in a grid with last-visited context.

## Categories Tab

Unchanged — follow/unfollow categories, see tools from followed categories.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/dashboard/DashboardTopNav.tsx` | Horizontal top nav replacing sidebar |
| `src/components/dashboard/WeeklyDigestBanner.tsx` | Dismissible weekly picks banner |
| `src/components/dashboard/RecommendedSection.tsx` | "Recommended for You" section |
| `src/components/dashboard/TrendingSection.tsx` | "Trending in Your Ecosystem" section |
| `src/components/dashboard/ToolkitStrip.tsx` | Compact horizontal favorites row |
| `src/components/dashboard/DashboardRightSidebar.tsx` | Right sidebar with stats + AI input |
| `src/components/dashboard/OnboardingPrompt.tsx` | New user onboarding flow |
| `src/hooks/use-recommendations.ts` | Recommendation logic hook |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Major rewrite — new layout with top nav, home tab with feed sections, right sidebar, onboarding state |
| `src/components/dashboard/DashboardSidebar.tsx` | Replace with `DashboardTopNav` (may delete or keep for reference) |
| `src/lib/types.ts` | Remove `submittedTools` from `User` interface |

## Files to Delete

| File | Reason |
|------|---------|
| `src/components/dashboard/DashboardSidebar.tsx` | Replaced by `DashboardTopNav.tsx` |

---

## Technical Notes

- **Recommendation algorithm**: Start simple — tools from followed categories not yet favorited, weighted by `isNew` + `stars`. No database changes needed; all computed client-side from existing `tools` array and `profile` data.
- **"Why this?" tags**: Generated from matching logic — if tool.category matches a followed category, show "Matches your [category] stack"; if `isNew`, show "New this week".
- **Weekly digest**: Reuses `useFreshTools` or filters `tools` by `isNew` flag. No new edge function needed.
- **Right sidebar AI input**: Wired to existing `useAISearch` hook with `discoverTools()`.
- **Mobile**: Top nav collapses to a bottom tab bar (similar pattern to current but with new tab set). Right sidebar hidden; its features accessible inline in the Home feed.
- **No database migrations required** — all personalization is derived from existing `profiles.favorites` and `profiles.followed_categories`.

