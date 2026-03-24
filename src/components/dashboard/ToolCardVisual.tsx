import { useState, useMemo } from "react";
import { Tool } from "@/lib/types";
import { getCategoryVisual, generateCompositionSvg } from "@/lib/tool-visuals";
import { cn } from "@/lib/utils";

interface ToolCardVisualProps {
  tool: Tool;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ToolCardVisual({ tool, size = "md", className }: ToolCardVisualProps) {
  const [imgError, setImgError] = useState(false);
  const visual = getCategoryVisual(tool.category);

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-28 sm:h-32 w-full rounded-t-2xl",
    lg: "h-36 sm:h-44 w-full rounded-t-2xl",
  };

  const svgDimensions = {
    sm: { w: 64, h: 64 },
    md: { w: 400, h: 200 },
    lg: { w: 500, h: 280 },
  };

  const compositionSvg = useMemo(() => {
    const dims = svgDimensions[size];
    return generateCompositionSvg(tool.name, tool.category, dims.w, dims.h);
  }, [tool.name, tool.category, size]);

  const encodedSvg = useMemo(
    () => `url("data:image/svg+xml,${encodeURIComponent(compositionSvg)}")`,
    [compositionSvg]
  );

  // Thumbnail mode (sm)
  if (size === "sm") {
    if (tool.screenshotUrl && !imgError) {
      return (
        <div className={cn("overflow-hidden shrink-0", sizeClasses.sm, className)}>
          <img
            src={tool.screenshotUrl}
            alt={tool.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      );
    }
    return (
      <div
        className={cn("overflow-hidden shrink-0 relative", sizeClasses.sm, className)}
        style={{
          background: `radial-gradient(circle at 40% 40%, hsl(${visual.colors[0]} / 0.4), hsl(${visual.colors[1]} / 0.2), transparent)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: encodedSvg, backgroundSize: "cover" }}
        />
      </div>
    );
  }

  // Banner mode (md/lg) — screenshot path
  if (tool.screenshotUrl && !imgError) {
    return (
      <div className={cn("overflow-hidden relative", sizeClasses[size], className)}>
        <img
          src={tool.screenshotUrl}
          alt={tool.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Generative abstract composition fallback
  return (
    <div
      className={cn(
        "overflow-hidden relative group/visual",
        sizeClasses[size],
        className
      )}
      style={{
        background: `radial-gradient(ellipse at ${30 + (tool.name.length % 40)}% ${20 + (tool.name.length % 30)}%, hsl(${visual.colors[0]} / 0.35), hsl(${visual.colors[1]} / 0.15) 50%, hsl(${visual.colors[2]} / 0.05) 100%)`,
      }}
    >
      {/* Composition SVG overlay */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover/visual:scale-105"
        style={{ backgroundImage: encodedSvg, backgroundSize: "cover" }}
      />

      {/* Accent glow bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + (tool.name.charCodeAt(0) % 30)}% ${40 + (tool.name.charCodeAt(1) % 30 || 0)}%, hsl(${visual.colors[0]} / 0.15), transparent 60%)`,
        }}
      />

      {/* Bottom fade into card */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/70 to-transparent pointer-events-none" />

      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover/visual:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 40%, hsl(${visual.colors[0]} / 0.08) 50%, transparent 60%)`,
        }}
      />
    </div>
  );
}
