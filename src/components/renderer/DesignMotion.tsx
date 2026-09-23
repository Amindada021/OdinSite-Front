"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AnimationConfig, AppearanceConfig, FontDto, MediaDto } from "@/lib/contracts";
import { appearanceStyle } from "@/lib/design";

function presetTransform(preset: string | null | undefined, strong: boolean) {
  const distance = strong ? 48 : 24;
  switch (preset) {
    case "fade-up": return `translate3d(0,${distance}px,0)`;
    case "fade-down": return `translate3d(0,-${distance}px,0)`;
    case "slide-left": return `translate3d(${distance}px,0,0)`;
    case "slide-right": return `translate3d(-${distance}px,0,0)`;
    case "scale-in": return "scale(.92)";
    case "parallax": return `translate3d(0,${distance}px,0)`;
    default: return undefined;
  }
}

export function DesignMotion({
  appearance,
  animation,
  fonts,
  assets,
  children,
}: {
  appearance?: AppearanceConfig | null;
  animation?: AnimationConfig | null;
  fonts?: FontDto[];
  assets?: Record<string, MediaDto>;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = animation?.enabled !== false && animation?.preset && animation.preset !== "none";
  const [visible, setVisible] = useState(!enabled || animation?.trigger === "page-load");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!enabled || animation?.trigger === "page-load" || animation?.trigger === "hover") return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        setVisible(true);
        if (animation?.once !== false) observer.disconnect();
      } else if (animation?.once === false) {
        setVisible(false);
      }
    }, { threshold: animation?.threshold ?? 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, animation?.trigger, animation?.once, animation?.threshold]);

  const shown = animation?.trigger === "hover" ? hovered : visible;
  const reduce = animation?.respectReducedMotion !== false;
  const duration = animation?.durationMs ?? 700;
  const delay = animation?.delayMs ?? 0;
  const strong = animation?.intensity === "strong";
  const base = useMemo(() => appearanceStyle(appearance, fonts, assets), [appearance, fonts, assets]);

  const motionStyle = enabled ? {
    transitionProperty: "opacity, transform, filter",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: animation?.easing?.startsWith("spring") ? "cubic-bezier(.2,.8,.2,1)" : (animation?.easing ?? "ease-out"),
    opacity: shown ? (appearance?.opacity ?? 1) : (animation?.preset === "blur-in" ? 0.3 : 0),
    transform: shown ? "none" : presetTransform(animation?.preset, strong),
    filter: !shown && animation?.preset === "blur-in" ? "blur(12px)" : "none",
  } : {};

  return (
    <div
      ref={ref}
      className="os-design-node"
      data-reduced-motion={reduce ? "respect" : "ignore"}
      style={{ ...base, ...motionStyle }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}
