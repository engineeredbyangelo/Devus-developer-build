

# OAuth "Coming Soon" Tags & AI-Powered Tool Discovery

## Overview
This plan covers two main features:
1. **Coming Soon Tags**: Add visual badges to Google and GitHub OAuth buttons indicating they're not yet configured
2. **AI Tool Discovery**: Integrate Lovable AI to enable real-time discovery of new developer tools that can be added to the dashboard

---

## Part 1: Coming Soon Tags for OAuth Buttons

### Current State
The Google and GitHub OAuth buttons in `AuthModal.tsx` call `signInWithGoogle` and `signInWithGithub`, but these providers aren't configured yet in the backend.

### Solution
- Add a "Coming Soon" badge to both OAuth buttons
- Disable the buttons to prevent clicks
- Update styling to indicate inactive state
- Keep email/password authentication fully functional

### File Changes
| File | Action |
|------|--------|
| `src/components/AuthModal.tsx` | Modify - Add badges and disable OAuth buttons |

### Implementation
```text
+------------------------------------------+
|  [GitHub icon] Continue with GitHub      |
|                         [Coming Soon]    |
+------------------------------------------+
|  [Chrome icon] Continue with Google      |
|                         [Coming Soon]    |
+------------------------------------------+
```

---

## Part 2: AI-Powered Real-Time Tool Discovery

### Architecture Overview

```text
User Dashboard                Edge Function               Lovable AI
    |                              |                          |
    |-- "Discover Tools" --------->|                          |
    |                              |-- Search query --------->|
    |                              |<-- Structured tools -----|
    |<-- New tool cards -----------|                          |
    |                              |                          |
    v                              v                          v
+----------------+     +-------------------+     +------------------+
|  AI Discovery  |     | discover-tools    |     | Gemini 3 Flash   |
|  Component     | --> | Edge Function     | --> | (Tool Calling)   |
+----------------+     +-------------------+     +------------------+
```

### Database Changes
Create a `discovered_tools` table to cache AI-discovered tools:
- `id` (uuid, primary key)
- `name`, `description`, `long_description`
- `category`, `tags`, `url`, `github_url`
- `use_cases`, `tech_stack_fit`, `learning_curve`, `community_activity`
- `ai_generated` (boolean, default true)
- `approved` (boolean, default false) - for moderation
- `discovered_by` (uuid, FK to auth.users)
- `created_at`, `updated_at`

RLS Policies:
- Authenticated users can insert discovered tools
- All users can read approved tools
- Only tool discoverers can update their submissions

### New Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/discover-tools/index.ts` | Edge function using Lovable AI for tool discovery |
| `src/components/AIToolDiscovery.tsx` | UI component for AI discovery feature in dashboard |
| `src/hooks/use-discovered-tools.ts` | Hook for managing discovered tools state |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Add AI Discovery section/tab |
| `supabase/config.toml` | Register new edge function |

---

## Technical Implementation

### Edge Function: discover-tools

The edge function will:
1. Accept a search query or category for tool discovery
2. Call Lovable AI (Gemini 3 Flash) with tool calling to get structured output
3. Return tools in the exact format matching the existing Tool type
4. Support both general discovery and category-specific searches

**Tool Calling Schema:**
```typescript
{
  type: "function",
  function: {
    name: "discover_developer_tools",
    description: "Discover and return developer tools matching the query",
    parameters: {
      type: "object",
      properties: {
        tools: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              longDescription: { type: "string" },
              category: { type: "string", enum: ["frontend", "backend", "devops", "ai-ml", "database", "testing", "mobile", "security", "productivity"] },
              tags: { type: "array", items: { type: "string" } },
              url: { type: "string" },
              githubUrl: { type: "string" },
              useCases: { type: "array", items: { type: "string" } },
              techStackFit: { type: "array", items: { type: "string" } },
              learningCurve: { type: "string", enum: ["low", "medium", "high"] },
              communityActivity: { type: "string", enum: ["low", "moderate", "active", "very-active"] }
            },
            required: ["name", "description", "category", "url"]
          }
        }
      },
      required: ["tools"]
    }
  }
}
```

### AI Discovery Component

Features:
- Search input for specific tool queries
- Category dropdown for focused discovery
- "Discover" button to trigger AI search
- Results display as tool cards (matching existing design)
- "Add to Collection" button to save to database
- Loading and error states

### Dashboard Integration

Add new "Discover" tab in Dashboard:
```text
[Explore] [Favorites] [Categories] [Discover ✨] [Submissions]
```

The Discover tab will show:
- AI search interface
- Recently discovered tools by community
- Quick category discovery buttons

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/AuthModal.tsx` | Modify | Add "Coming Soon" badges to OAuth buttons |
| `supabase/functions/discover-tools/index.ts` | Create | AI-powered tool discovery edge function |
| `src/components/AIToolDiscovery.tsx` | Create | UI for AI tool discovery |
| `src/hooks/use-discovered-tools.ts` | Create | Hook for discovered tools management |
| `src/pages/Dashboard.tsx` | Modify | Add Discover tab |
| `supabase/config.toml` | Modify | Register edge function |
| Database Migration | Create | `discovered_tools` table |

---

## User Experience Flow

1. **Authenticated user** navigates to Dashboard
2. Clicks **"Discover"** tab
3. Enters search query like "code review tools" or selects a category
4. AI returns 3-5 relevant tools with complete metadata
5. User can:
   - View tool details in the same modal format
   - Add tools to favorites
   - Submit tools for community approval
6. Approved tools appear in the main Explore tab

---

## Error Handling

- **Rate limits (429)**: Show friendly message, suggest retry later
- **Payment required (402)**: Inform user to add credits
- **AI failures**: Graceful fallback with manual submission link
- **Invalid responses**: Validate tool structure before display

---

## Next Steps After Implementation

1. Test the "Coming Soon" badges appear correctly on OAuth buttons
2. Verify email authentication still works without issues
3. Test AI discovery with various queries
4. Validate discovered tools match the Tool type schema
5. Check that favorites work with AI-discovered tools

