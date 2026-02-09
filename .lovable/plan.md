

# Refine Tools of the Week: Better Sources + Expanded Card Layout

## Problem
1. The current edge function uses generic Firecrawl search queries that return low-quality, irrelevant results
2. Weekly tool cards use a simplified inline layout instead of the expandable modal that the main 35 tools use

## Changes

### 1. Rewrite the `weekly-tools` Edge Function

Replace the current generic search approach with **targeted scraping of curated sources** using Firecrawl's `extract` format.

**File**: `supabase/functions/weekly-tools/index.ts`

- Scrape 7 high-quality sources in parallel:
  - Hacker News (newest + Show HN)
  - OpenAI Blog
  - Anthropic News
  - Vercel Blog
  - GitHub Engineering Blog
  - Console.dev (aggregator)
- Use Firecrawl's **extract** format with a strict JSON schema and source-type-specific prompts (blog vs listing vs aggregator)
- Deduplicate and filter out generic/vague tool names
- Then use Lovable AI (Gemini) to enrich the top 5 unique tools with `useCases`, `techStackFit`, `learningCurve`, `communityActivity`, and other metadata
- Keep the same response format so the hook and cache remain compatible

### 2. Make Weekly Tool Cards Open the Same Expanded Modal

**File**: `src/components/ToolsOfTheWeek.tsx`

- Import and reuse the existing `DemoToolModal` component
- Convert `WeeklyTool` data to the `Tool` type expected by the modal
- Add click handler on each `WeeklyToolCard` to open the modal
- The modal already displays: long description, use cases, tech stack fit, learning curve, community activity, tags, Visit/GitHub buttons

### 3. Clear Cache After Deploy

Since the edge function logic is changing significantly, the `weekly_tools_cache` table will need to be cleared so fresh results are fetched using the new sources.

---

## Technical Details

### Edge Function Source Configuration

```text
Source              URL                                        Type
---------           ---                                        ----
Hacker News         news.ycombinator.com/newest                listing
Show HN             news.ycombinator.com/show                  listing
OpenAI Blog         openai.com/blog                            blog
Anthropic News      anthropic.com/news                          blog
Vercel Blog         vercel.com/blog                            blog
GitHub Blog         github.blog/category/engineering/          blog
Console.dev         console.dev                                aggregator
```

Each source type gets a tailored prompt:
- **blog**: Extract only newly announced/released tools, skip tutorials and opinions
- **listing**: Look for launch announcements ("Introducing X", "Launching X"), skip "Ask HN" and discussions
- **aggregator**: Extract tool names from curated directories

### WeeklyTool to Tool Conversion

The `WeeklyTool` interface maps cleanly to `Tool`:
- `category` string mapped to nearest `Category` type
- `communityActivity` values ("still-building", "early-stage") mapped to Tool's format ("low", "moderate", "active", "very-active")
- Missing fields (`stars`, `pros`, `cons`, `upvotes`) set to sensible defaults

### Files Changed

| File | Change |
|------|--------|
| `supabase/functions/weekly-tools/index.ts` | Full rewrite with curated sources + extract format |
| `src/components/ToolsOfTheWeek.tsx` | Add DemoToolModal integration for expanded card view |

