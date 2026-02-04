

# Devus UX Improvements & AI Curation Tool

## Overview
This plan addresses four key improvements:
1. Remove the broad AI discovery feature and add more developer tools to the stack of 35 tools already there. (Goal is to push for 50+ new developer tools) Perplexity can help add real time tools/data (while the info cards stays consistent 
2. Add a new "Features" section between "Why Devus" and "Demo" sections
3. Fix mobile sign-in card scrollability
4. Add welcome animation + redirect to dashboard after sign-in

---

## Part 1: Replace AI Discovery with Curator AI Assistant

### What Changes

**Remove:**
- The "Discover" tab from the dashboard sidebar
- The `AIToolDiscovery` component
- The `discover-tools` edge function
- The `use-discovered-tools` hook
- The `discovered_tools` database table (optional - can keep for future use)

**Do NOT do This part below - Refer to overview:**
- A simple curator interface (admin-only or internal use) where you can:
  - Ask AI to suggest tools to add to the curated 35-tool list
  - AI returns suggestions with full metadata matching the Tool type
  - You review and manually add approved tools to `data.ts`

This is a more focused approach - the AI helps curate, but the final list stays manually controlled in code.

### Files to Modify/Remove

| File | Action |
|------|--------|
| `src/pages/Dashboard.tsx` | Remove "Discover" tab and AIToolDiscovery import |
| `src/components/AIToolDiscovery.tsx` | Delete file |
| `src/hooks/use-discovered-tools.ts` | Delete file |
| `supabase/functions/discover-tools/` | Delete folder |

---

## Part 2: New Features Section for Homepage

### Design Concept
A minimal, on-brand section showcasing Devus features with direct links to tools' websites and GitHub repos. Uses the existing glassmorphism design system.

### Section Layout

```text
+---------------------------------------------------------------+
|                                                               |
|                    [Zap icon] Core Features                   |
|                                                               |
|           What makes Devus your go-to developer hub           |
|                                                               |
+---------------------------------------------------------------+
|                                                               |
|  +-------------------+  +-------------------+  +-------------+|
|  | [Link icon]       |  | [Github icon]     |  | [Filter]    ||
|  | Direct Links      |  | GitHub Access     |  | Smart       ||
|  | Jump straight to  |  | Explore source    |  | Filtering   ||
|  | any tool's site   |  | code instantly    |  | Find tools  ||
|  |                   |  |                   |  | by category ||
|  +-------------------+  +-------------------+  +-------------+|
|                                                               |
|  +-------------------+  +-------------------+  +-------------+|
|  | [Star icon]       |  | [CheckCircle]     |  | [Lightbulb] ||
|  | Community Rated   |  | Verified Info     |  | Use Cases   ||
|  | See what devs     |  | Accurate pros,    |  | See real    ||
|  | love most         |  | cons & details    |  | examples    ||
|  +-------------------+  +-------------------+  +-------------+|
|                                                               |
+---------------------------------------------------------------+
```

### Responsive Behavior
- **Desktop (lg+)**: 3-column grid
- **Tablet (md)**: 2-column grid
- **Mobile (sm)**: 1-column stacked cards

### New File
| File | Action |
|------|--------|
| `src/components/FeaturesSection.tsx` | Create new component |
| `src/pages/Index.tsx` | Import and add between ComparisonChart and DemoPreview |

---

## Part 3: Fix Mobile Sign-in Card Scrollability

### Problem
On mobile, when the keyboard opens, the auth card gets pushed up and hidden. Users can't see the email/password fields.

### Solution
Update the Dialog content to:
1. Add `max-h-[90vh]` to limit height
2. Add `overflow-y-auto` for scrolling when content overflows
3. Ensure proper padding at bottom for keyboard clearance

### File to Modify
| File | Action |
|------|--------|
| `src/components/AuthModal.tsx` | Update DialogContent classes for mobile scrollability |

### Changes
```typescript
// Current
<DialogContent className="sm:max-w-md p-0 gap-0 bg-card border-border overflow-hidden">

// Updated
<DialogContent className="sm:max-w-md p-0 gap-0 bg-card border-border max-h-[90vh] overflow-y-auto">
```

---

## Part 4: Welcome Animation + Dashboard Redirect

### Current Flow
1. User signs in
2. Toast appears: "Welcome back!"
3. User stays on homepage

### New Flow
1. User signs in successfully
2. Modal closes
3. Full-screen welcome animation appears (1.5-2 seconds)
4. Auto-redirect to `/dashboard`

### Animation Design
```text
+----------------------------------------+
|                                        |
|                                        |
|       [Sparkles icon animating]        |
|                                        |
|          Welcome, {name}!              |
|                                        |
|    Taking you to your dashboard...     |
|         [Loading indicator]            |
|                                        |
|                                        |
+----------------------------------------+
```

### Implementation
1. Create a `WelcomeAnimation` component with Framer Motion animations
2. Add state in `AuthModal` or `AuthContext` to trigger animation on successful sign-in
3. After animation completes, navigate to `/dashboard`

### Files to Modify/Create

| File | Action |
|------|--------|
| `src/components/WelcomeAnimation.tsx` | Create new animated overlay component |
| `src/components/AuthModal.tsx` | Trigger welcome animation on successful sign-in |
| `src/pages/Index.tsx` | Render WelcomeAnimation when triggered |

---

## Technical Details

### FeaturesSection Component Structure

```typescript
// Feature card data structure
const features = [
  {
    icon: ExternalLink,
    title: "Direct Links",
    description: "Jump straight to any tool's official website with one click",
  },
  {
    icon: Github,
    title: "GitHub Access", 
    description: "Explore source code and contribute to open-source projects",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description: "Find tools by category, tags, or tech stack compatibility",
  },
  {
    icon: Star,
    title: "Community Rated",
    description: "See upvotes and discover what developers love most",
  },
  {
    icon: CheckCircle,
    title: "Verified Details",
    description: "Accurate pros, cons, and learning curve for each tool",
  },
  {
    icon: Lightbulb,
    title: "Real Use Cases",
    description: "Understand exactly when and how to use each tool",
  },
];
```

### Welcome Animation Timing

```typescript
// Animation sequence
1. Fade in overlay (0.3s)
2. Scale up icon with spring (0.5s)
3. Fade in text (0.3s, staggered)
4. Hold visible (1s)
5. Fade out and redirect (0.4s)
// Total: ~2.5 seconds
```

### Index.tsx Section Order (After Changes)

```typescript
<Header />
<LandingHero />
<NewThisWeek />
<ComparisonChart />      // "Why Devus"
<FeaturesSection />      // NEW - Features elaboration
<DemoPreview />          // "Experience the Demo"
<BenefitsSection />      // "Unlock Everything"
<Footer />
<AuthModal />
<WelcomeAnimation />     // NEW - Overlay when triggered
```

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/FeaturesSection.tsx` | Create | New minimal features section |
| `src/components/WelcomeAnimation.tsx` | Create | Animated welcome overlay |
| `src/pages/Index.tsx` | Modify | Add FeaturesSection, integrate WelcomeAnimation |
| `src/components/AuthModal.tsx` | Modify | Add scrollability, trigger welcome on sign-in |
| `src/pages/Dashboard.tsx` | Modify | Remove Discover tab |
| `src/components/AIToolDiscovery.tsx` | Delete | Remove AI discovery component |
| `src/hooks/use-discovered-tools.ts` | Delete | Remove discovery hook |
| `supabase/functions/discover-tools/` | Delete | Remove edge function |

---

## Summary

1. **Clean up AI Discovery**: Remove the broad discovery feature from dashboard (the edge function and components)
2. **New Features Section**: Minimal, responsive section between "Why Devus" and "Demo" that highlights direct links, GitHub access, filtering, etc.
3. **Mobile Auth Fix**: Make the sign-in card scrollable so users can see input fields when keyboard is open
4. **Welcome Flow**: Add animated welcome screen after sign-in that redirects to dashboard

