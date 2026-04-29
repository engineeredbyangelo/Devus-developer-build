import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { WireframeDesktop } from "./hero/WireframeDesktop";
import { WireframePhone } from "./hero/WireframePhone";

export function HeroWireframeShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useTransform(mx, [-1, 1], [2, -2]);
  const rotateX = useTransform(my, [-1, 1], [-2, 2]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[580px] mx-auto"
      style={{ perspective: 1200 }}
    >
      {/* Background glow + dotted grid */}
      <div className="absolute -inset-8 bg-gradient-radial from-primary/15 via-transparent to-transparent blur-2xl" />
      <div
        className="absolute -inset-6 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Desktop frame (back) */}
        <div className="relative pr-10 sm:pr-14 lg:pr-20">
          <WireframeDesktop />
        </div>

        {/* Phone frame (front, overlapping right) */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="absolute -bottom-6 right-0 sm:-bottom-8 w-[34%] sm:w-[32%] lg:w-[30%] min-w-[110px]"
          style={{ translateZ: 40 }}
        >
          <WireframePhone />
        </motion.div>
      </motion.div>
    </div>
  );
}