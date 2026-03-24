import { useState } from "react";
import { Tool } from "@/lib/types";
import { getCategoryVisual, getToolVisualAngle, getToolVisualScale, getPatternSvg } from "@/lib/tool-visuals";
import { cn } from "@/lib/utils";

interface ToolCardVisualProps {
  tool: Tool;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ToolCardVisual({ tool, size = "md", className }: ToolCardVisualProps) {
  const [imgError, setImgError] = useState(false);
  const visual = getCategoryVisual(tool.category);
  const angle = getToolVisualAngle(tool.name);
  const scale = getToolVisualScale(tool.name);

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-24 sm:h-28 w-full rounded-t-2xl",
    lg: "h-32 sm:h-40 w-full rounded-t-2xl",
  };

  // Thumbnail mode (sm) — square with gradient
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
        className={cn(
          "overflow-hidden shrink-0 bg-gradient-to-br flex items-center justify-center",
          visual.gradient,
          sizeClasses.sm,
          className
        )}
        style={{ transform: `rotate(${angle % 8}deg)` }}
      >
        <span className="text-xs font-bold" style={{ color: `hsl(${visual.accentHsl})`, opacity: 0.7 }}>
          {tool.name.charAt(0)}
        </span>
      </div>
    );
  }

  // Banner mode (md/lg)
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
        {/* Bottom gradient overlay for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Abstract gradient fallback
  const patternSvg = getPatternSvg(visual.pattern, angle);
  const encodedPattern = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;

  return (
    <div
      className={cn(
        "overflow-hidden relative bg-gradient-to-br",
        visual.gradient,
        sizeClasses[size],
        className
      )}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, var(--tw-gradient-stops))`,
      }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 text-foreground"
        style={{
          backgroundImage: encodedPattern,
          backgroundRepeat: "repeat",
          transform: `scale(${scale})`,
        }}
      />
      {/* Large watermark letter */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-bold select-none"
          style={{
            fontSize: size === "lg" ? "5rem" : "3.5rem",
            color: `hsl(${visual.accentHsl})`,
            opacity: 0.08,
            transform: `rotate(${(angle % 20) - 10}deg)`,
          }}
        >
          {tool.name.charAt(0)}
        </span>
      </div>
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
    </div>
  );
}
