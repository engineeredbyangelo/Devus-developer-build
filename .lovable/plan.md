

# Landing Page Alignment and Tool Stack Showcase

## 1. Fix All Stale References

Several places still mention AI-powered features or outdated tool counts.

| File | Line | Current | Updated |
|------|------|---------|---------|
| `WhyDevusSection.tsx` | 48 | "AI-powered search finds the perfect tools for your stack" | "Curated weekly drops deliver the latest tools to your dashboard" |
| `BenefitsSection.tsx` | 59 | "Upgrade to Pro for AI-powered features and daily updates." | "Upgrade to Pro for weekly alerts, early access, and tool submissions." |
| `AIDiscoveredTools.tsx` | 58 | "Find additional tools matching your filters using AI-powered search" | "Discover more tools matching your filters" |
| `AIDiscoveredTools.tsx` | 96 | "AI-Discovered (X)" | "Discovered (X)" |
| `AIDiscoveredTools.tsx` | 125 | "Powered by Firecrawl - Real-time web search" | "Curated developer tools" |
| `LandingHero.tsx` | 91 | "35+ Curated Tools" | "65+ Curated Tools" |
| `DemoPreview.tsx` | 126 | "Want to see all 35+ tools?" | "Want to see all 65+ tools?" |

## 2. New Section: Tool Stack Showcase

A vibrant, interactive section placed **after "How It Works"** and **before "Demo Preview"**. It lets users visually explore tool categories with animated cards -- giving a taste of the dashboard without signing up.

### Design

- Badge: "Explore the Stack"
- Title: "65+ Tools Across 12 Categories"
- Subtitle: "From AI models to deployment platforms -- handpicked for quality"
- Interactive category pills that filter a mini card grid below
- 6 animated tool preview cards showing real tools from the selected category
- Each card shows: tool initial logo, name, category badge, "New" tag if applicable
- Glassmorphism card styling matching the rest of the landing page
- Horizontal scroll on mobile for category pills, 3-column grid on desktop for cards
- Staggered entrance animations with framer-motion
- A subtle CTA at the bottom: "Sign up to explore the full collection"

### Component Structure

```text
ToolStackShowcase
  +-- Badge + Title + Subtitle
  +-- Category pills (scrollable row)
  +-- Tool preview cards (3-col grid / stacked on mobile)
  +-- CTA button
```

### New File

`src/components/ToolStackShowcase.tsx`

- Imports categories and tools from `src/lib/data.ts`
- Uses `useState` to track selected category
- Filters tools by category and shows up to 6
- Uses framer-motion for scroll-triggered animations
- Glassmorphism cards with hover effects
- Fully responsive: horizontal scroll pills on mobile, grid adapts from 1 to 3 columns

## 3. Updated Index.tsx Section Flow

```text
Hero (65+ Curated Tools)
  |
"Why Devus Exists" -- stat cards
  |  <-- generous spacing
"Built for Your Workflow" -- mobile mockup + updated feature bullets
  |
"How It Works" -- Weekly Drops, Direct Links, GitHub, Filtering
  |
"Explore the Stack" -- NEW interactive category showcase
  |
Demo Preview (65+ tools)
  |
Pricing / Benefits (updated copy)
  |
Footer
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/WhyDevusSection.tsx` | Update Smart Discovery description (line 48) |
| `src/components/BenefitsSection.tsx` | Update subtitle copy (line 59) |
| `src/components/AIDiscoveredTools.tsx` | Remove AI/Firecrawl references (lines 58, 96, 125) |
| `src/components/LandingHero.tsx` | Change "35+" to "65+" (line 91) |
| `src/components/DemoPreview.tsx` | Change "35+" to "65+" (line 126) |
| `src/pages/Index.tsx` | Import and add ToolStackShowcase between FeaturesSection and DemoPreview |

## New File to Create

| File | Description |
|------|-------------|
| `src/components/ToolStackShowcase.tsx` | Interactive category explorer with animated tool cards, glassmorphism styling, horizontal scroll on mobile, framer-motion entrance animations, and sign-up CTA |

