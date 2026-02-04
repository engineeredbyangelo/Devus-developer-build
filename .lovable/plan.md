
# Fix Welcome Animation After Sign-In

## Problem Identified

There are **two AuthModal instances** in the app:
1. **Index.tsx AuthModal** - Has `onSignInSuccess` callback ✅
2. **Header.tsx AuthModal** - Missing `onSignInSuccess` callback ❌

When users sign in from the Header (which is the primary way users sign in), the welcome animation doesn't trigger because the Header's AuthModal doesn't have the callback connected.

Additionally, for sign-in (not sign-up), the `name` field is empty since it's only filled during registration, so the welcome message shows the email prefix instead of the user's actual name.

---

## Solution

### Approach: Centralize Welcome Animation Logic

Move the welcome animation trigger to the `AuthContext` so it works regardless of which AuthModal instance is used.

### Changes Required

| File | Action | Description |
|------|--------|-------------|
| `src/contexts/AuthContext.tsx` | Modify | Add welcome animation state and callback to context |
| `src/components/Header.tsx` | Modify | Add `onSignInSuccess` to Header's AuthModal + use centralized state |
| `src/pages/Index.tsx` | Modify | Use welcome state from context instead of local state |
| `src/components/WelcomeAnimation.tsx` | Modify | Optionally fetch user's actual name from profile |

---

## Implementation Details

### 1. Update AuthContext

Add welcome animation state to the auth context so any component can trigger/listen:

```typescript
// Add to AuthContext
interface AuthContextType {
  // ...existing fields
  showWelcome: boolean;
  welcomeUserName: string;
  triggerWelcome: (name: string) => void;
  completeWelcome: () => void;
}
```

### 2. Update Header.tsx

Pass the `onSignInSuccess` callback to the Header's AuthModal:

```typescript
<AuthModal
  isOpen={authModal.open}
  onClose={closeAuth}
  initialMode={authModal.mode}
  onSignInSuccess={(userName) => {
    triggerWelcome(userName);
  }}
/>
```

### 3. Update Index.tsx

Instead of local state, use the context's welcome state:

```typescript
const { showWelcome, welcomeUserName, completeWelcome } = useAuth();

// Remove local useState for showWelcome/welcomeUserName
// Keep the handleSignInSuccess for the modal, but have it use context
```

### 4. Better Name Handling in AuthModal

For sign-in, fetch the user's profile name after successful authentication:

```typescript
// In handleSubmit for sign-in
const { error, data } = await signIn(email, password);
if (!error && data?.user) {
  onClose();
  // Use profile name or email prefix
  const userName = profile?.full_name || email.split("@")[0];
  onSignInSuccess?.(userName);
}
```

---

## Alternative Simpler Fix

If you prefer minimal changes, we can simply:

1. Add `onSignInSuccess` to the Header's AuthModal
2. Have Header render the WelcomeAnimation component when triggered
3. Share state via a simple callback

This keeps changes localized but means WelcomeAnimation could render from multiple places.

---

## Recommended Approach

**Centralize in AuthContext** - This is cleaner because:
- Single source of truth for welcome state
- Works regardless of which component triggers sign-in
- Can access profile data to get the actual user name
- WelcomeAnimation only needs to render in one place (App.tsx or Index.tsx)

---

## File Summary

| File | Changes |
|------|---------|
| `src/contexts/AuthContext.tsx` | Add `showWelcome`, `welcomeUserName`, `triggerWelcome`, `completeWelcome` to context |
| `src/components/Header.tsx` | Pass `onSignInSuccess` callback to AuthModal, use context trigger |
| `src/pages/Index.tsx` | Use welcome state from AuthContext, remove local state |
| `src/App.tsx` | Move WelcomeAnimation to App level so it works on all routes |
