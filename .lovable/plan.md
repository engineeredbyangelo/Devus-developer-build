
# Hero Redesign: Split Layout with Animated Tool Nexus

## Overview
Transform the hero section from a centered layout to a **split layout** with:
- **Left side**: Title, description, CTAs, and feature highlights
- **Right side**: Animated visualization of developer tools flowing into a central nexus

---

## Visual Concept

```text
+-----------------------------------------------------------+
|  [Left Side - 50%]          |     [Right Side - 50%]      |
|                             |                              |
|  Activity Ticker            |     ○ React                  |
|                             |         ↘                    |
|  Discover the best          |    ○ Vue   → [NEXUS] ← ○ Node|
|  developer tools            |         ↗       ↑            |
|                             |     ○ Svelte    ○ Docker     |
|  Curated collection...      |                              |
|                             |     Orbital animation with   |
|  [Get Started] [Explore]    |     glowing orbs flowing     |
|                             |     toward center            |
|  [Feature Cards x3]         |                              |
+-----------------------------------------------------------+
```

---

## Animation Design

### Orbital Tool Orbs
- **12-16 tool orbs** positioned in 3 orbital rings around the central nexus
- Each orb displays a tool icon (React, Vue, Node, Docker, etc.)
- Orbs rotate continuously with different speeds per ring
- Soft cyan/white glow effect on each orb

### Flow Lines (Connection Beams)
- Animated dashed/gradient lines from orbs toward the center
- Pulsing glow effect on the lines
- Creates visual "flow" of tools converging

### Central Nexus
- Glowing sphere at the center representing Devus
- Pulsing animation (scale + glow intensity)
- Subtle ring animations radiating outward
- Devus "D" or spark icon in the center

### Hover Interactions
- Orbs scale up slightly on hover
- Connection beam brightens
- Tool name tooltip appears

---

## Technical Implementation

### New Component: `HeroNexusAnimation.tsx`
A dedicated component for the animated visualization:

```text
Structure:
- Outer container (relative, aspect-square)
- 3 orbital rings with different radii
- Tool orbs positioned on rings using CSS transforms
- SVG or CSS for connection lines
- Central nexus element with animations
```

### Tool Icons to Display
Using Lucide icons for consistent style:
- React, Vue, Svelte (Code2)
- Node.js, Deno (Server)
- Docker (Container)
- Supabase (Database)
- Tailwind (Paintbrush)
- TypeScript (FileCode)
- Prisma (Database)
- Vercel (Triangle)
- GitHub (Github)

### Framer Motion Animations
- `animate` with `rotate: 360` for orbital motion
- Staggered delays for each ring
- Spring physics for hover interactions
- `repeat: Infinity` for continuous motion

### CSS Additions
- New glow utilities for the orbs
- Orbital ring positioning classes
- Connection line gradient animations

---

## Updated LandingHero Layout

```text
<section>
  <div className="container grid lg:grid-cols-2 gap-12">
    
    <!-- Left Column -->
    <div className="flex flex-col justify-center">
      <ActivityTicker />
      <h1>Discover the best developer tools</h1>
      <p>Curated collection...</p>
      <div>[CTA Buttons]</div>
      <div>[Feature Cards Grid]</div>
    </div>
    
    <!-- Right Column -->
    <div className="flex items-center justify-center">
      <HeroNexusAnimation />
    </div>
    
  </div>
</section>
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/HeroNexusAnimation.tsx` | Create | New animated nexus component |
| `src/components/LandingHero.tsx` | Modify | Split layout, integrate animation |
| `src/index.css` | Modify | Add orbital animation keyframes |

---

## Color Scheme (Blue/White)
- **Orbs**: White/light gray with cyan glow border
- **Connection lines**: Cyan gradient with opacity
- **Nexus center**: Bright cyan glow with white core
- **Background rings**: Subtle cyan/white dashed circles

---

## Responsive Behavior
- **Desktop (lg+)**: Side-by-side layout, full animation
- **Tablet (md)**: Stacked layout, smaller animation
- **Mobile**: Animation hidden or simplified, text-only hero
