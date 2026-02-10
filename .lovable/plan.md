

# Dashboard Redesign Plan

## Overview

Transform the current dark-themed, sidebar-and-grid dashboard into a modern, immersive "tool gallery" experience with a light-on-dark hybrid aesthetic, a full-screen hero showcase, information cards, an AI assistant widget, and tool-by-tool navigation.

---

## What Changes

### 1. New Color System and Typography

- Introduce a dashboard-specific color palette that layers light cards on the existing dark sidebar
- Primary action color shifts from cyan (#00BCD4) to teal-green (#00C896)
- Cards become white (#FFFFFF) on a light gray (#F5F5F5) content background
- Sidebar stays dark (#2C2C2C)
- Typography switches to Inter font with the specified size hierarchy (48px tool name, 20px headings, 16px body, 14px small)

### 2. Layout Overhaul (Dashboard.tsx)

Replace the current `Header + ToolsOfTheWeek + [Sidebar | Content]` layout with:

- **Dark icon-only sidebar** (60px wide, left edge) with navigation icons: Explore, Favorites, Categories, Submissions, Settings, Sign Out
- **Light gray main content area** filling the remaining width
- **No top Header** on the dashboard (remove `<Header />` from this page) -- the sidebar handles navigation
- **Full-screen hero view** as the primary content when a tool is selected
- **Tool grid** as default view when browsing/exploring

### 3. Tool Hero Section (New Component: `ToolHeroView.tsx`)

When a tool is selected, the main content area transforms into an immersive hero display:

- **Left panel (60%)**: Large tool logo (120x120), tool name (48px bold), category badge with icon, star count, description (18px), version/date metadata
- **Right panel (40%)**: Stacked information cards:
  - Use Cases card (white, bullet points with teal dots)
  - Works Great With card (tech pills with dark backgrounds)
  - Learning Curve + Community cards (side by side)
  - Pros + Cons cards (side by side, green checks / red alerts)
- **Bottom action bar**: Full-width "Visit [Tool]" (teal) and "View on GitHub" (dark outline) buttons
- **Top-right actions**: Bookmark and Share icons
- **Navigation**: Left/right arrows to browse tools, "1 of 247 tools" counter

### 4. Dashboard Sidebar (New Component: `DashboardSidebar.tsx`)

- 60px wide, dark background (#2C2C2C)
- Icon-only navigation with tooltips
- Icons: Compass (Explore), Heart (Favorites), Folder (Categories), Clock (Submissions), Settings, LogOut
- Active state: teal highlight on icon
- User avatar at top

### 5. Explore View Updates

- Filter chips at top of content area: "All", "Frontend", "Backend", "DevOps", "AI/ML", etc.
- Search bar with "Search developer tools..." placeholder
- Tool cards redesigned with white backgrounds, 16px border-radius, subtle shadows
- Hover effect: `translateY(-2px)` with elevation increase
- Click a card to enter the hero view

### 6. AI Assistant Widget (New Component: `AIAssistantWidget.tsx`)

- Floating card in bottom-right corner of the dashboard
- White background with shadow
- "AI Assistant" title, "Get recommendations based on your stack" subtitle
- Quick action buttons: Compare Tools, Find Alternatives, Check Compatibility, Learning Resources
- Text input with "Ask about this tool..." placeholder and teal send button
- Collapsible (minimize to a small FAB icon)

### 7. Card Design System Updates

- All info cards: white background, 16px border-radius, `box-shadow: 0 2px 12px rgba(0,0,0,0.08)`, 24px padding, 16px gap
- Hover: slight elevation increase (shadow deepens)
- Smooth transitions (300ms ease-in-out)

### 8. Responsive Behavior

- Desktop: Sidebar (60px) + Hero left 60% + Info cards right 40%
- Tablet: Sidebar collapses to hidden (hamburger), content stacks vertically
- Mobile: Single column, collapsible sections, bottom sheet for AI assistant

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/dashboard/DashboardSidebar.tsx` | 60px icon-only sidebar |
| `src/components/dashboard/ToolHeroView.tsx` | Full-screen hero tool showcase |
| `src/components/dashboard/ToolInfoCards.tsx` | Use cases, tech stack, learning, pros/cons cards |
| `src/components/dashboard/AIAssistantWidget.tsx` | Floating AI assistant |
| `src/components/dashboard/DashboardToolCard.tsx` | Redesigned white tool card for grid |
| `src/components/dashboard/DashboardLayout.tsx` | Layout wrapper with sidebar + content |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Complete rewrite using new layout components |
| `src/index.css` | Add dashboard-specific CSS variables and card styles |
| `tailwind.config.ts` | Add Inter font family, dashboard color tokens |

## Implementation Sequence

1. Add Inter font and dashboard CSS variables/tokens
2. Build `DashboardSidebar` (icon-only nav)
3. Build `DashboardLayout` (sidebar + content wrapper)
4. Build `DashboardToolCard` (white card redesign)
5. Build `ToolHeroView` + `ToolInfoCards` (hero showcase)
6. Build `AIAssistantWidget` (floating assistant)
7. Rewrite `Dashboard.tsx` to compose all new components
8. Add responsive breakpoints and mobile behavior

---

## Technical Notes

- Framer Motion remains the animation library for all transitions, hover effects, and view changes
- The existing `Tool` type already has all needed fields: `useCases`, `techStackFit`, `learningCurve`, `communityActivity`, `pros`, `cons`
- The existing hooks (`useFavoritesDb`, `useFollowedCategoriesDb`, `useAISearch`) are reused unchanged
- The `DemoToolModal` is replaced by the inline `ToolHeroView` -- clicking a tool navigates to the hero view instead of opening a modal
- `tools` array from `src/lib/data.ts` provides the "1 of 247 tools" navigation data
- The AI Assistant widget is UI-only initially (quick actions will use the existing `useAISearch` hook for "Find Alternatives")

