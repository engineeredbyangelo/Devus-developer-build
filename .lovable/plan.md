

# 3D Hero Nexus with Three.js (React Three Fiber)

## Summary

Replace the current 2D Framer Motion orbital animation in `HeroNexusAnimation.tsx` with an interactive 3D scene using `@react-three/fiber` and `@react-three/drei`. The nexus becomes a slowly rotating 3D sphere of tool orbs with depth, lighting, and a glowing central core — creating an immersive, modern hero visual.

## Visual Concept

```text
        ·  ·  React  ·
      ·    ╱    ╲     ·
   Vue ──── [D] ──── Svelte
      ·    ╲    ╱     ·
        ·  Node  Bun  ·
           ·  ·  ·
```

- 15 tool orbs distributed on the surface of a sphere (Fibonacci spacing for even distribution)
- 3 concentric orbital ring groups at different radii, tilted at different angles
- Central glowing "D" core with volumetric bloom
- Subtle mouse-follow camera movement (parallax)
- Slow auto-rotation of the entire scene
- Tool labels appear on hover via HTML overlay (`drei`'s `Html` component)
- Mobile: smaller canvas, fewer particles, no mouse interaction

## Packages to Install

- `@react-three/fiber@^8.18` — React renderer for Three.js
- `@react-three/drei@^9.122.0` — Helpers (Float, Html, Stars, MeshDistortMaterial)
- `three@^0.170` — Three.js core

## Files to Modify

### `src/components/HeroNexusAnimation.tsx` — Full rewrite

Replace the Framer Motion implementation with a `<Canvas>` scene containing:

1. **Scene setup**: `<Canvas>` with transparent background, camera at `z=8`, soft ambient + point lights in the primary blue/cyan palette
2. **Tool orbs**: Each tool rendered as a `<mesh>` (sphere geometry) with a glassy/emissive material in primary color tones. Positioned on 3 orbital rings at radii matching current config (inner/mid/outer). Each ring group auto-rotates at different speeds/directions (matching existing behavior)
3. **Central core**: A larger sphere with `MeshDistortMaterial` (from drei) for an organic pulsing effect, emitting primary color glow
4. **Orbital rings**: Thin `<mesh>` torus geometries at each ring radius, semi-transparent
5. **Labels**: `drei`'s `<Html>` component for tool name tooltips on hover — replaces the current Radix tooltips
6. **Mouse parallax**: Subtle camera offset based on pointer position using `useFrame` — gives depth perception on desktop
7. **Ambient particles**: `drei`'s `<Stars>` or custom particle field for background depth
8. **Mobile handling**: Detect `isMobile` — reduce particle count, disable mouse parallax, smaller canvas

### `src/components/LandingHero.tsx` — Minor

- No changes needed; it already renders `<HeroNexusAnimation />` in the right column

## Technical Details

- Canvas uses `style={{ background: 'transparent' }}` so the existing page gradient shows through
- `frameloop="demand"` or throttled `useFrame` on mobile for performance
- All colors derived from CSS `--primary` / `--accent` values converted to Three.js color objects
- The component stays self-contained — no new files needed beyond the rewrite
- Fallback: if WebGL fails, show a simple static SVG version

