

# Dashboard Overhaul: Pricing, Payments, Immersive UX, and Firecrawl Integration

## Summary

This is a multi-part update: add a dedicated `/pricing` page, remove the submissions feature, update pricing to $16/month, improve dashboard immersion and mobile responsiveness, unify tool card open behavior, and integrate Firecrawl for fresh tool discovery.

---

## 1. Create `/pricing` Page

**New file: `src/pages/Pricing.tsx`**
- Replicates the `BenefitsSection` pricing cards but as a full standalone page
- Updated price: **$16/month** (down from $18)
- Includes a detailed feature comparison table (using existing `Table` UI components)
- FAQ section using `Accordion` component with common questions (cancellation, refunds, what's included, etc.)
- Header + footer consistent with landing page
- Remove "Tool submission" from feature list (per removal request)

**Route addition in `App.tsx`**: `/pricing`

## 2. Remove Submissions Feature

- **Delete** `src/pages/Submit.tsx`
- **Remove** `/submit` route from `App.tsx`
- **Remove** `"submissions"` tab from `DashboardSidebar` nav items and `DashboardTab` type
- **Remove** submissions tab content from `Dashboard.tsx`
- Update `BenefitsSection` features list to remove "Tool submission" line item

## 3. Update Pricing to $16/month

- `BenefitsSection.tsx`: Change `$18` to `$16`
- `UpgradeBanner.tsx`: Update messaging if it references price
- New `Pricing.tsx` page uses `$16`

## 4. Payment Processor — Alternatives to Stripe

Since no Stripe key is available, we will explore alternatives. Present the user with options:

- **Lemon Squeezy** — merchant of record, handles tax/compliance, simple API, popular with indie devs
- **Paddle** — similar MOR model, handles global payments
- **Polar** — built for developer tools, supports subscriptions

This requires a follow-up decision from the user before implementation. For now, the pricing page will have a "Subscribe" button that shows a toast indicating payment integration is pending.

## 5. Dashboard Immersion Improvements

### Unified Tool Card Open Behavior
- **Problem**: `DemoToolModal` (landing page) and `ToolHeroView` (dashboard) are different experiences
- **Solution**: When a tool card opens in the dashboard, it already uses `ToolHeroView` (the immersive hero layout). Ensure the `DemoToolModal` on the landing page also provides the same level of detail and smooth transitions — or redirect tool clicks to `/tool/:id` for a unified experience
- Review both components to ensure identical information architecture (description, use cases, tech stack, learning curve, links)

### Mobile Responsiveness
- `ToolHeroView`: Improve stacking on small screens — logo/name/description stack vertically, action buttons full-width, info cards collapsible
- Dashboard grid: Already uses `grid-cols-1 sm:grid-cols-2`, verify bottom nav doesn't overlap content
- Add `safe-area-inset-bottom` padding to main content area for iOS devices

## 6. Firecrawl Integration for Fresh Tools

Firecrawl is already connected (`std_01kgn3h69wfakb1wjchyqt6bky`).

### New Edge Function: `discover-fresh-tools`
- Uses Firecrawl search API to find newly released developer tools
- Searches queries like "new developer tools released this week", "trending GitHub repositories"
- Returns structured tool data (name, description, URL, category, tags)

### New Dashboard Tab: "Fresh Finds" (replaces Submissions tab slot)
- Shows Firecrawl-discovered tools with a "Discovered just now" badge
- Users can trigger a refresh to search for new tools
- Results cached in a new `fresh_tools_cache` table (similar pattern to `weekly_tools_cache`)
- Free users see up to 5 fresh tools; Pro users get unlimited

### Database Migration
- Create `fresh_tools_cache` table: `id`, `search_query`, `tools_data` (jsonb), `created_at`, `expires_at`
- RLS: public SELECT, authenticated INSERT/UPDATE

---

## Files to Create
| File | Purpose |
|------|---------|
| `src/pages/Pricing.tsx` | Dedicated pricing page with FAQ and comparison |
| `supabase/functions/discover-fresh-tools/index.ts` | Firecrawl-powered tool discovery |

## Files to Modify
| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/pricing` route, remove `/submit` route |
| `src/components/BenefitsSection.tsx` | Price to $16, remove submissions feature, link to `/pricing` |
| `src/components/dashboard/DashboardSidebar.tsx` | Replace "submissions" with "fresh" tab |
| `src/pages/Dashboard.tsx` | Remove submissions tab, add Fresh Finds tab, mobile improvements |
| `src/components/dashboard/ToolHeroView.tsx` | Mobile responsiveness polish |
| `src/components/UpgradeBanner.tsx` | Link to `/pricing` instead of `#pricing` anchor |

## Files to Delete
| File | Reason |
|------|--------|
| `src/pages/Submit.tsx` | Feature removed |

## Migration
- Create `fresh_tools_cache` table with RLS policies

---

## Technical Details

- The Firecrawl edge function will use `FIRECRAWL_API_KEY` (already configured as a secret) to call the search endpoint
- The pricing page FAQ uses the existing `Accordion` UI component
- Payment processor integration is deferred until the user selects a provider — the Subscribe button will be wired to a placeholder that can be swapped in later
- The `DashboardTab` type changes from `"explore" | "favorites" | "categories" | "submissions"` to `"explore" | "favorites" | "categories" | "fresh"`

