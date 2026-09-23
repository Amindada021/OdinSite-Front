"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { AnimationConfig, AppearanceConfig, FontDto, MediaDto } from "@/lib/contracts";
import { appearanceStyle } from "@/lib/design";

type Breakpoint = "mobile" | "tablet" | "desktop";

function mergeAnimation(base: AnimationConfig | null | undefined, breakpoint: Breakpoint): AnimationConfig | null | undefined {
  if (!base) return base;
  const override = base.responsive?.[breakpoint];
  if (!override) return base;
  return {
    ...base,
    ...override,
    transform: { ...(base.transform ?? {}), ...(override.transform ?? {}) },
    options: { ...(base.options ?? {}), ...(override.options ?? {}) },
    responsive: base.responsive,
  };
}

function presetTransform(animation: AnimationConfig | null | undefined, strong: boolean) {
  const preset = animation?.preset;
  const distance = strong ? 48 : 24;
  const depth = animation?.options?.depth ?? 40;
  const perspective = animation?.options?.perspective ?? 1200;

  switch (preset) {
    case "section-reveal":
    case "fade-up":
      return `translate3d(0,${distance}px,0)`;
    case "fade-down":
      return `translate3d(0,-${distance}px,0)`;
    case "slide-left":
      return `translate3d(${distance}px,0,0)`;
    case "slide-right":
      return `translate3d(-${distance}px,0,0)`;
    case "scale-in":
      return "scale(.92)";
    case "parallax":
    case "parallax-depth":
      return `perspective(${perspective}px) translate3d(0,${distance}px,-${depth}px)`;
    case "smooth-scroll":
      return "translate3d(0,12px,0)";
    case "full-scroll-3d":
      return `perspective(${perspective}px) translate3d(0,${distance}px,-${depth}px) rotateX(4deg)`;
    default:
      return undefined;
  }
}

function easing(value?: string | null) {
  if (value?.startsWith("spring")) return "cubic-bezier(.2,.8,.2,1)";
  return value ?? "ease-out";
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
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setBreakpoint(width <= 767 ? "mobile" : width <= 1023 ? "tablet" : "desktop");
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const effective = useMemo(() => mergeAnimation(animation, breakpoint), [animation, breakpoint]);
  const enabled = effective?.enabled !== false && !!effective?.preset && effective.preset !== "none";

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }

    if (effective?.trigger === "page-load") {
      setVisible(true);
      return;
    }

    if (effective?.trigger === "hover") {
      setVisible(false);
      return;
    }

    setVisible(false);
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        setVisible(true);
        if (effective?.once !== false) observer.disconnect();
      } else if (effective?.once === false) {
        setVisible(false);
      }
    }, { threshold: effective?.threshold ?? 0.2 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, effective?.trigger, effective?.once, effective?.threshold, breakpoint]);

  const shown = effective?.trigger === "hover" ? hovered : visible;
  const reduce = effective?.respectReducedMotion !== false;
  const duration = effective?.durationMs ?? 700;
  const delay = effective?.delayMs ?? 0;
  const strong = effective?.intensity === "strong";
  const base = useMemo(() => appearanceStyle(appearance, fonts, assets), [appearance, fonts, assets]);

  const motionStyle: CSSProperties = enabled ? {
    transitionProperty: "opacity, transform, filter",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: easing(effective?.easing),
    opacity: shown ? (appearance?.opacity ?? 1) : (effective?.preset === "blur-in" ? 0.3 : 0),
    transform: shown ? "none" : presetTransform(effective, strong),
    filter: !shown && effective?.preset === "blur-in" ? "blur(12px)" : "none",
    transformStyle: effective?.preset === "full-scroll-3d" ? "preserve-3d" : undefined,
    perspective: effective?.preset === "full-scroll-3d" ? `${effective.options?.perspective ?? 1200}px` : undefined,
  } : {};

  return (
    <div
      ref={ref}
      className="os-design-node"
      data-animation-preset={effective?.preset ?? "none"}
      data-animation-breakpoint={breakpoint}
      data-reduced-motion={reduce ? "respect" : "ignore"}
      style={{ ...base, ...motionStyle }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}
