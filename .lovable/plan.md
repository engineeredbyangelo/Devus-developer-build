

# Stripe Integration + Free/Pro Tier Gating

## Overview

Wire up Stripe checkout for the Pro plan ($18/month), store subscription status in the database, and gate dashboard features so free users only see 35 tools and cannot access Pro-only tabs.

---

## 1. Enable Stripe

Use the Stripe enablement tool to connect Stripe and create the Pro product/price ($18/month recurring).

## 2. Database Changes

**New table: `subscriptions`**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users, unique, not null)
- `stripe_customer_id` (text)
- `stripe_subscription_id` (text)
- `status` (text — `active`, `canceled`, `past_due`, `trialing`)
- `current_period_end` (timestamptz)
- `created_at` / `updated_at`

**RLS policies:**
- Users can SELECT their own subscription (`auth.uid() = user_id`)
- Service role inserts/updates via Edge Functions (no user INSERT/UPDATE)

## 3. Edge Functions

### `create-checkout` 
- Receives `priceId` from client
- Creates or retrieves Stripe customer (using user email)
- Creates Stripe Checkout Session (mode: subscription, success/cancel URLs)
- Returns session URL

### `stripe-webhook`
- Listens for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Upserts `subscriptions` table with status changes
- `verify_jwt = false` in config.toml (Stripe signs webhooks, not JWT)

### `create-portal`
- Creates Stripe Billing Portal session for managing subscription
- Returns portal URL

## 4. Subscription Hook

**New file: `src/hooks/use-subscription.ts`**
- Queries `subscriptions` table for current user
- Exposes `{ isPro, isLoading, subscription }` 
- `isPro = subscription?.status === 'active'`

## 5. Dashboard Gating (Free Tier = 35 Tools)

**`src/pages/Dashboard.tsx`** changes:
- Import `useSubscription`
- Free users: `filteredTools.slice(0, 35)` — after the 35th tool, show an inline glass banner: "Upgrade to Pro to unlock all 65+ tools" with an upgrade button
- "Submissions" tab: free users see the inline banner instead of the submit CTA — "Tool submissions are a Pro feature"
- Pass `isPro` down where needed

## 6. BenefitsSection Stripe Buttons

**`src/components/BenefitsSection.tsx`** changes:
- "Get Started Free" button → still calls `onSignUp` (unchanged)
- "Upgrade to Pro" button → if user is authenticated, calls `create-checkout` edge function and redirects to Stripe Checkout; if not authenticated, opens sign-up modal first
- Add a `useAuth` + `useSubscription` check; if already Pro, show "Manage Subscription" button that opens the Stripe billing portal

## 7. Pro Badge in Sidebar

**`src/components/dashboard/DashboardSidebar.tsx`**:
- Accept `isPro` prop
- Show a small "Pro" badge next to the user avatar when `isPro` is true

---

## Files to Create
| File | Purpose |
|------|---------|
| `src/hooks/use-subscription.ts` | Subscription status hook |
| `supabase/functions/create-checkout/index.ts` | Stripe Checkout session |
| `supabase/functions/stripe-webhook/index.ts` | Stripe webhook handler |
| `supabase/functions/create-portal/index.ts` | Stripe billing portal |

## Files to Modify
| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Tool cap at 35, inline upgrade banners, Pro gating |
| `src/components/BenefitsSection.tsx` | Stripe checkout integration on Pro CTA |
| `src/components/dashboard/DashboardSidebar.tsx` | Pro badge |
| `supabase/config.toml` | JWT verification settings for new functions |

## Migration
- Create `subscriptions` table with RLS

