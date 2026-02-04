

# Dashboard UX & AI-Powered Intelligence Hub

## Overview
This plan addresses two key improvements:
1. **Remove duplicate navigation in Header** when users are on the Dashboard - since the dashboard already has its own sidebar navigation with Favorites, Categories, etc.
2. **Add Perplexity-powered real-time tool discovery** when users combine filters (e.g., DevOps + Open Source), making the Intelligence Hub truly "intelligent"

---

## Part 1: Clean Up Header Navigation on Dashboard

### Current Problem
When users are on `/dashboard`, the Header shows:
- **Main nav**: Home, Favorites, Dashboard 
- **Dropdown menu**: Favorites, Dashboard, Sign Out

But the Dashboard sidebar already has:
- Explore, Favorites, Categories, Submissions tabs
- Settings and Sign Out buttons

This creates redundant navigation (e.g., "Favorites" appears twice).

### Solution
Conditionally hide the authenticated nav links (Favorites, Dashboard) when the user is already on the `/dashboard` route. Keep only "Home" in the header when on Dashboard.

### Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/Header.tsx` | Modify | Hide `authNavLinks` when `location.pathname === "/dashboard"` |

### Implementation
```typescript
// In Header.tsx, check if on dashboard
const isDashboard = location.pathname === "/dashboard";

// Only show authNavLinks when NOT on dashboard
{user && !isDashboard && authNavLinks.map((link) => {
  // ... existing code
})}
```

Also update the dropdown menu to hide redundant links when on dashboard.

---

## Part 2: AI-Powered Real-Time Tool Discovery

### Concept
When users combine filters in the Explore tab (e.g., "DevOps" + "Open Source" + "Self-Hosted"), the Intelligence Hub will:
1. Show the curated tools matching those filters (current behavior)
2. **NEW**: If filters are active, offer to discover additional real-time tools using Perplexity
3. Display AI-discovered tools in a separate "Discovered" section below the curated results

### User Flow
```text
1. User selects: DevOps + Open Source + Self-Hosted
2. Dashboard shows: 3 curated tools matching filters
3. NEW: "Discover More" button appears
4. User clicks button
5. Perplexity searches: "best open source self-hosted DevOps tools 2024"
6. Results display in "AI-Discovered Tools" section with metadata
7. User can save discovered tools to their favorites
```

### Connector Setup
Perplexity is available as a connector. We'll need to:
1. Connect the Perplexity connector to the project
2. Create an edge function to call Perplexity's search API
3. Build a frontend component to display AI-discovered tools

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/search-tools/index.ts` | Create | Edge function that calls Perplexity API |
| `src/hooks/use-ai-search.ts` | Create | Hook to manage AI search state and calls |
| `src/components/AIDiscoveredTools.tsx` | Create | Component to display AI-discovered tools |
| `src/pages/Dashboard.tsx` | Modify | Integrate AI discovery into Explore tab |

### Edge Function Logic
```typescript
// supabase/functions/search-tools/index.ts
// When filters are active, build a search query like:
// "best [open-source] [self-hosted] [DevOps] developer tools 2024"

// Use Perplexity's search API to get real-time results
// Parse results into Tool-like structure with:
// - name, description, url, githubUrl (if found)
// - category (inferred from filter)
// - tags (from active filters)
```

### Response Structure
AI-discovered tools will follow a simplified version of the Tool type:
```typescript
interface DiscoveredTool {
  id: string;           // Generated UUID
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  category: Category;   // From active filter
  tags: Tag[];          // From active filters
  source: "perplexity"; // Mark as AI-discovered
  citations: string[];  // Perplexity provides source URLs
}
```

### UI Design
```text
+------------------------------------------+
| Search: [____________]                    |
|                                           |
| Category: [DevOps (selected)]             |
| Tags: [Open Source] [Self-Hosted]         |
+------------------------------------------+
| 3 curated tools found                     |
|                                           |
| [Tool Card] [Tool Card] [Tool Card]       |
+------------------------------------------+
| ✨ Discover More Tools                    |
| [Discover with AI] button                 |
+------------------------------------------+
| AI-Discovered (5 results)                 |
| Powered by Perplexity Search              |
|                                           |
| [Discovered Tool] [Discovered Tool] ...   |
+------------------------------------------+
```

---

## Part 3: Delete Standalone Favorites Page (Yes do this)

Since the Dashboard now handles Favorites in its sidebar, the standalone `/favorites` page and `/favorites` route in Header could be removed to avoid confusion. However, I'll leave this optional - let me know if you'd like to remove it entirely.

---

## Implementation Order

1. **First**: Connect Perplexity connector (requires your approval)
2. **Second**: Remove duplicate nav items in Header when on Dashboard
3. **Third**: Create the `search-tools` edge function 
4. **Fourth**: Create the AI search hook and UI components
5. **Fifth**: Integrate into Dashboard's Explore tab

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/Header.tsx` | Modify | Hide nav links when on `/dashboard` |
| `supabase/functions/search-tools/index.ts` | Create | Perplexity-powered tool search |
| `src/hooks/use-ai-search.ts` | Create | AI search state management |
| `src/components/AIDiscoveredTools.tsx` | Create | Display AI-discovered tools |
| `src/pages/Dashboard.tsx` | Modify | Add "Discover More" feature to Explore tab |

---

## Summary

1. **Clean Header**: Remove duplicate nav links (Favorites, Dashboard) when user is on the Dashboard page
2. **AI Intelligence**: Add Perplexity-powered real-time tool discovery when filters are active, expanding beyond the curated 35 tools
3. **Persistent Curation**: Curated tools in `data.ts` remain the primary source; AI discovery supplements them with real-time data

