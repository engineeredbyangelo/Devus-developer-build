

# Devus — Developer Tool Discovery Platform

## Overview
A stunning, immersive dashboard for discovering and curating developer tools. Dark mode with subtle glows, fluid animations, and a calming anti-scroll experience.

---

## Core Pages & Features

### 1. Landing / Tool Feed
- **Masonry grid** of tool cards with staggered fade-in animations
- **Search bar** with live filtering (by name, description)
- **Category filters**: Frontend, Backend, DevOps, AI/ML, Database, Testing, etc.
- **Tag chips** for quick filtering (Open Source, Free, Paid, etc.)
- **"New this week" indicator** with subtle pulse animation
- **Activity ticker**: "12 new tools added today" (static for now, realtime-ready)

### 2. Tool Cards
- Tool logo/icon with soft glow on hover
- Name, short description, primary category
- Star count badge (GitHub-style)
- Quick-action buttons: Upvote, Save to favorites
- Smooth hover states: scale up + shadow bloom

### 3. Tool Detail Page
- Full-width hero with tool screenshot/preview
- Rich description, pros/cons sections
- Tags, categories, official links
- "Similar Tools" recommendations
- Upvote count with animated increment
- Save to favorites toggle

### 4. Authentication (UI-ready)
- Sign in / Sign up modals
- OAuth buttons (GitHub, Google) - styled but non-functional until backend
- User dropdown with avatar

### 5. User Dashboard
- **Saved Tools**: Personal favorites collection
- **Followed Categories**: Customize your feed
- **Submission History**: Tools you've submitted

### 6. Tool Submission Form
- Name, URL, description, category, tags
- Screenshot upload area
- Preview before submit
- Success confirmation with animation

---

## Design System

### Visual Identity
- **Background**: Deep slate/charcoal (#0f0f14) with subtle gradient noise
- **Accent colors**: Soft cyan/teal glow for interactive elements
- **Cards**: Dark glass effect (backdrop blur + subtle border glow)
- **Typography**: Clean sans-serif, high contrast white text
- **Micro-interactions**: Spring animations on all interactions

### Animation Philosophy
- Cards fade + scale in on scroll (Framer Motion)
- Hover: gentle lift + glow expansion
- Button clicks: satisfying spring bounce
- Page transitions: smooth crossfade
- Reduced motion: respect prefers-reduced-motion

---

## Technical Architecture (Frontend)

### Data Layer
- Mock data service with 30+ sample tools
- Category and tag definitions
- User state (favorites, followed categories)
- Structured for easy Supabase migration later

### State Management
- React Query for data fetching patterns
- Local state for UI (modals, filters, search)

### Components
- Reusable ToolCard, CategoryBadge, GlowButton
- Responsive grid system
- Accessible modals and dropdowns

---

## Sample Tool Categories
- **Frontend**: React, Vue, Svelte, Tailwind
- **Backend**: Node.js, Deno, tRPC, Prisma
- **AI/ML**: LangChain, Ollama, Hugging Face
- **DevOps**: Docker, K8s, Terraform
- **Database**: Supabase, PlanetScale, Neon
- **Testing**: Vitest, Playwright, Cypress

---

## What You'll Get

1. **Fully interactive UI** with beautiful dark mode design
2. **30+ sample dev tools** pre-populated across categories
3. **Complete navigation** between feed, detail, and dashboard pages
4. **Working search & filters** on the frontend
5. **Upvote & favorites** functionality (local storage for now)
6. **Submission form** with validation
7. **Responsive design** for all screen sizes
8. **Smooth Framer Motion animations** throughout
9. **Backend-ready architecture** - swap mock services for real APIs easily

---

## Future Backend Integration Points
When you add Supabase/Firebase later:
- Replace mock data service → Supabase queries
- Add realtime subscriptions for live updates
- Connect auth flows to actual providers
- Enable image uploads for submissions
- Add row-level security for user data

