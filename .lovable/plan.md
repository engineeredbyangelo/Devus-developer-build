

# Demo Modal Fix & Supabase Authentication Integration

## Overview
This plan addresses two main requirements:
1. **Fix the Demo Modal** - Ensure the tool info card is fully visible on all screen sizes. The main dashboard should also have this fix IF showcasing the same issue. If it works fine do not touch it. 
2. **Add Supabase Authentication** - Integrate Supabase with email, Google, and GitHub sign-in options, plus user profile storage

---

## Part 1: Demo Modal Responsiveness Fix

### Current Problem
The `DemoToolModal` is veering off-screen on mobile devices due to positioning issues with the fixed positioning and transform calculations.

### Solution
Update the modal positioning to use a more reliable centered approach with proper overflow handling:

- Change from `fixed inset-4` to `fixed left-0 right-0 top-0 bottom-0` with proper padding
- Use flexbox centering instead of transform-based centering
- Add `overflow-y-auto` to the wrapper to allow scrolling the entire modal on small screens
- Reduce modal max-height on mobile to account for viewport constraints

### File Changes
| File | Action |
|------|--------|
| `src/components/DemoToolModal.tsx` | Modify positioning and overflow handling |

---

## Part 2: Supabase Authentication Integration

### Architecture Overview

```text
+------------------+     +------------------+     +------------------+
|   AuthModal.tsx  | --> |  Supabase Auth   | --> |  profiles table  |
|  (UI Component)  |     |  (Google/GitHub) |     |  (User Data)     |
+------------------+     +------------------+     +------------------+
         |                        |
         v                        v
+------------------+     +------------------+
|  AuthContext.tsx |     |  Database Trigger|
|  (State Mgmt)    |     |  (Auto-create)   |
+------------------+     +------------------+
```

### Database Schema

**profiles table:**
- `id` (uuid, FK to auth.users)
- `email` (text)
- `full_name` (text, nullable)
- `avatar_url` (text, nullable)
- `favorites` (text[], default empty)
- `followed_categories` (text[], default empty)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**RLS Policies:**
- Users can read their own profile
- Users can update their own profile
- Profile auto-created on signup via trigger

### New Files to Create

| File | Purpose |
|------|---------|
| `src/integrations/supabase/client.ts` | Supabase client initialization |
| `src/contexts/AuthContext.tsx` | React context for auth state management |
| `src/hooks/useAuth.ts` | Hook for accessing auth context |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/AuthModal.tsx` | Connect OAuth buttons to Supabase, handle email auth |
| `src/components/Header.tsx` | Show user avatar/logout when authenticated |
| `src/App.tsx` | Wrap with AuthProvider |

### Supabase Migrations

**Migration 1: Create profiles table and trigger**
```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  favorites TEXT[] DEFAULT '{}',
  followed_categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Implementation Details

### Supabase Client Setup
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://padjgqxxsveufrattcet.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY' // Will need to be provided (ANON Keye is - sb_publishable_BT7T80SXdIQf8j-IHv9QlQ_klfq0Wqz)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Auth Context Pattern
- Use `onAuthStateChange` listener for reactive auth state
- Set up listener BEFORE calling `getSession()` (prevents race conditions)
- Store user and session in React context
- Expose `signIn`, `signUp`, `signOut`, `signInWithGoogle`, `signInWithGithub` methods

### OAuth Flow
1. User clicks "Continue with Google/GitHub"
2. Redirect to OAuth provider
3. Return to app with `emailRedirectTo: window.location.origin`
4. Auth state updates via listener
5. Profile auto-created by database trigger

### Updated Header Behavior
- **Not signed in**: Show "Sign In" button
- **Signed in**: Show user avatar, name, and dropdown with Favorites, Dashboard, Sign Out

---

## User Setup Requirements (OAuth Providers)

After implementation, the user will need to configure OAuth providers in their Supabase dashboard:

### Google OAuth Setup
1. Go to Google Cloud Console → Create OAuth credentials
2. Add authorized redirect URL: `https://padjgqxxsveufrattcet.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret to Supabase Dashboard → Authentication → Providers → Google

### GitHub OAuth Setup
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Add callback URL: `https://padjgqxxsveufrattcet.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret to Supabase Dashboard → Authentication → Providers → GitHub

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/DemoToolModal.tsx` | Modify | Fix modal positioning and overflow |
| `src/integrations/supabase/client.ts` | Create | Supabase client setup |
| `src/contexts/AuthContext.tsx` | Create | Auth state management context |
| `src/hooks/useAuth.ts` | Create | Hook for auth access |
| `src/components/AuthModal.tsx` | Modify | Connect to Supabase auth |
| `src/components/Header.tsx` | Modify | Show authenticated user UI |
| `src/App.tsx` | Modify | Wrap with AuthProvider |
| Supabase Migration | Create | profiles table + trigger |

---

## Next Steps After Implementation

1. **Obtain Supabase Anon Key** - Need the public anon key from Supabase project settings
2. **Configure OAuth Providers** - Set up Google and GitHub in Supabase Dashboard
3. **Test Auth Flow** - Verify sign up, sign in, and OAuth work correctly
4. **Connect Favorites** - Wire up favorites functionality to use profiles table

