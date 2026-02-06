

# Dashboard Redesign with "Tools of the Week" Feature

## Overview

This plan transforms the user dashboard into a more intuitive experience with a prominent "Tools of the Week" section at the top, powered by Firecrawl's real-time discovery. Users will land directly on this curated weekly selection after the welcome animation.

---

## Architecture Overview

```text
+----------------------------------------------------------+
|                     DASHBOARD LAYOUT                      |
+----------------------------------------------------------+
|  HEADER (existing)                                        |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |           TOOLS OF THE WEEK (Hero Section)         |  |
|  |  Week of [Current Date] - Updated every Monday     |  |
|  |                                                    |  |
|  |  [8-10 Featured Tool Cards - Firecrawl Powered]    |  |
|  |  Full context: useCases, techStackFit, community   |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +----------------+  +--------------------------------+  |
|  |   SIDEBAR      |  |       MAIN CONTENT             |  |
|  |   (Compact)    |  |                                |  |
|  |                |  |  [Explore / Favorites / etc]   |  |
|  |   - Quick Nav  |  |                                |  |
|  |   - Profile    |  |                                |  |
|  +----------------+  +--------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

---

## Key Features

### 1. Tools of the Week Section

- **Auto-refreshes weekly** (cached, updates every Monday)
- **8-10 tools** discovered via Firecrawl from GitHub, Product Hunt, npm
- **Rich context for each tool**:
  - Use cases (what problems it solves)
  - Tech stack compatibility (what it works well with)
  - Community status ("Still in development", "Active", etc.)
  - Learning curve indicator
- **Full-width hero placement** at the top of the dashboard

### 2. Enhanced Tool Discovery via Firecrawl

The edge function will be enhanced to:
- Return richer tool data including use cases and tech stack fit
- Use AI/LLM to extract structured information from scraped pages
- Cache results for the week to avoid repeated API calls
- Target trending/new tools specifically

### 3. Redesigned Dashboard Layout

**Before**: Sidebar + Explore tab as default view
**After**: 
- Tools of the Week hero section (full width)
- Compact sidebar below
- Cleaner tab navigation
- "Your Hub" branding for personal space

---

## Implementation Details

### New Files

| File | Purpose |
|------|---------|
| `src/components/ToolsOfTheWeek.tsx` | Hero section displaying weekly featured tools |
| `src/hooks/use-weekly-tools.ts` | Hook to fetch/cache weekly tool discoveries |
| `supabase/functions/weekly-tools/index.ts` | Edge function for weekly tool discovery with rich context |

### Modified Files

| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Add ToolsOfTheWeek at top, redesign layout |
| `src/components/WelcomeAnimation.tsx` | Ensure smooth scroll to dashboard top |
| `src/components/ToolCard.tsx` | Add support for displaying community/learning curve badges |
| `supabase/functions/search-tools/index.ts` | Enhance to extract richer tool metadata |

---

## Data Flow

```text
User Signs In
      |
      v
Welcome Animation (2.5s)
      |
      v
Navigate to /dashboard (scroll to top)
      |
      v
Dashboard loads ToolsOfTheWeek
      |
      v
use-weekly-tools hook checks:
   - Is cached data < 7 days old? -> Use cache
   - Otherwise -> Call weekly-tools edge function
      |
      v
Edge Function:
   1. Search Firecrawl for trending dev tools
   2. Scrape each result for rich metadata
   3. Use Lovable AI to extract structured data:
      - useCases[]
      - techStackFit[]
      - learningCurve
      - communityActivity
   4. Return 8-10 tools with full context
      |
      v
Display in ToolsOfTheWeek grid
```

---

## Tools of the Week Component Design

```text
+------------------------------------------------------------------+
|  [Sparkles Icon]  TOOLS OF THE WEEK                              |
|  Week of February 3, 2026                                        |
|  Fresh developer tools discovered across GitHub, ProductHunt & npm|
+------------------------------------------------------------------+
|                                                                  |
|  +----------------+  +----------------+  +----------------+      |
|  |  [Tool Card]   |  |  [Tool Card]   |  |  [Tool Card]   |      |
|  |  Name          |  |  Name          |  |  Name          |      |
|  |  Description   |  |  Description   |  |  Description   |      |
|  |                |  |                |  |                |      |
|  |  Use Cases:    |  |  Use Cases:    |  |  Use Cases:    |      |
|  |  - Case 1      |  |  - Case 1      |  |  - Case 1      |      |
|  |  - Case 2      |  |  - Case 2      |  |  - Case 2      |      |
|  |                |  |                |  |                |      |
|  |  Works with:   |  |  Works with:   |  |  Works with:   |      |
|  |  [React] [TS]  |  |  [Node] [API]  |  |  [Docker]      |      |
|  |                |  |                |  |                |      |
|  |  [Still Bldg]  |  |  [Active]      |  |  [Very Active] |      |
|  |  [Easy Learn]  |  |  [Moderate]    |  |  [Easy Learn]  |      |
|  +----------------+  +----------------+  +----------------+      |
|                                                                  |
|  +----------------+  +----------------+  +----------------+  ... |
|  |  [Tool Card]   |  |  [Tool Card]   |  |  [Tool Card]   |      |
|  +----------------+  +----------------+  +----------------+      |
|                                                                  |
+------------------------------------------------------------------+
```

### Mobile Layout

- 1 column grid
- Swipeable carousel option
- Condensed card format

---

## Enhanced Edge Function Logic

The `weekly-tools` edge function will:

1. **Build a trending-focused query**:
   ```
   (site:github.com OR site:producthunt.com) 
   new developer tool 2026 trending
   ```

2. **Scrape each result** for markdown content

3. **Use Lovable AI** (google/gemini-2.5-flash) to extract:
   ```json
   {
     "name": "Tool Name",
     "description": "What it does",
     "useCases": ["Building APIs", "Rapid prototyping"],
     "techStackFit": ["React", "TypeScript", "Node.js"],
     "learningCurve": "low",
     "communityActivity": "active | still-building"
   }
   ```

4. **Handle "still building" cases**:
   - New tools with < 1000 stars: "Still in development"
   - Explicitly mentioned in README: "Beta" or "Alpha"
   - No recent releases: "Early stage"

---

## Dashboard Layout Redesign

### New Structure

```tsx
<Dashboard>
  <Header />
  
  {/* HERO: Tools of the Week - Full Width */}
  <ToolsOfTheWeek />
  
  {/* MAIN CONTENT: Sidebar + Content */}
  <div className="grid lg:grid-cols-[280px,1fr]">
    <Sidebar>
      {/* Compact user info */}
      {/* Quick nav: Explore, Favorites, Categories, Submissions */}
    </Sidebar>
    
    <Content>
      {/* Tab content based on selection */}
    </Content>
  </div>
</Dashboard>
```

### Visual Improvements

- **Glassmorphism cards** for Tools of the Week
- **Gradient header** for the hero section
- **Staggered animations** for tool cards
- **Quick action buttons** on each card (favorite, visit, GitHub)

---

## Caching Strategy

To avoid calling Firecrawl on every dashboard load:

1. **Database table**: `weekly_tools_cache`
   - `id`, `week_start_date`, `tools_data` (JSONB), `created_at`

2. **Hook logic**:
   ```typescript
   // Check if we have valid cache for current week
   const weekStart = getStartOfWeek(new Date());
   const cached = await supabase
     .from('weekly_tools_cache')
     .select('tools_data')
     .eq('week_start_date', weekStart)
     .single();
   
   if (cached.data) {
     return cached.data.tools_data;
   }
   
   // Otherwise fetch fresh and cache
   const fresh = await fetchWeeklyTools();
   await supabase
     .from('weekly_tools_cache')
     .upsert({ week_start_date: weekStart, tools_data: fresh });
   return fresh;
   ```

---

## Post-Login Flow Update

Currently the `WelcomeAnimation` navigates to `/dashboard`. We will:

1. Keep the navigation as-is
2. Ensure the dashboard scrolls to top on mount
3. The `ToolsOfTheWeek` section is the first thing users see

```tsx
// In Dashboard.tsx
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);
```

---

## Summary of Changes

1. **Create `ToolsOfTheWeek` component** - Hero section with weekly curated tools
2. **Create `use-weekly-tools` hook** - Manages fetching and caching
3. **Create `weekly-tools` edge function** - Firecrawl + Lovable AI for rich metadata
4. **Create `weekly_tools_cache` table** - Database caching for weekly results
5. **Enhance `ToolCard`** - Display community status and learning curve badges
6. **Redesign `Dashboard`** - Tools of the Week hero at top, cleaner layout
7. **Update scroll behavior** - Ensure users land at top after welcome animation

---

## Database Migration

```sql
CREATE TABLE weekly_tools_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE UNIQUE NOT NULL,
  tools_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Allow read access for authenticated users
ALTER TABLE weekly_tools_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read weekly tools cache"
  ON weekly_tools_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert/update cache"
  ON weekly_tools_cache FOR ALL
  USING (auth.role() = 'service_role');
```

