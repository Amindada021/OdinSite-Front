"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { AnimationConfig, AppearanceConfig, FontDto, MediaDto, SiteThemeConfig } from "@/lib/contracts";
import { appearanceStyle } from "@/lib/design";

type Breakpoint = "mobile" | "tablet" | "desktop";
type Breakpoints = SiteThemeConfig["breakpoints"];

function mergeAppearance(base: AppearanceConfig | null | undefined, breakpoint: Breakpoint) {
  if (!base) return base;
  const override = base.responsive?.[breakpoint];
  if (!override) return base;
  return {
    ...base,
    ...override,
    padding: { ...(base.padding ?? {}), ...(override.padding ?? {}) },
    margin: { ...(base.margin ?? {}), ...(override.margin ?? {}) },
    border: { ...(base.border ?? {}), ...(override.border ?? {}) },
    borderRadius: { ...(base.borderRadius ?? {}), ...(override.borderRadius ?? {}) },
    shadow: { ...(base.shadow ?? {}), ...(override.shadow ?? {}) },
    responsive: base.responsive,
  };
}

function mergeAnimation(base: AnimationConfig | null | undefined, breakpoint: Breakpoint): AnimationConfig | null | undefined {
  if (!base) return base;
  const override = base.responsive?.[breakpoint];
  if (!override) {
    if (breakpoint === "mobile" && base.preset === "full-scroll-3d" && base.options?.mobileFallbackPreset) {
      return { ...base, preset: base.options.mobileFallbackPreset };
    }
    return base;
  }
  return {
    ...base,
    ...override,
    transform: { ...(base.transform ?? {}), ...(override.transform ?? {}) },
    options: { ...(base.options ?? {}), ...(override.options ?? {}) },
    responsive: base.responsive,
  };
}

function presetTransform(animation: AnimationConfig | null | undefined) {
  const preset = animation?.preset;
  const intensity = animation?.intensity === "strong" ? 1.5 : animation?.intensity === "subtle" ? 0.6 : 1;
  const distance = 24 * intensity;
  const depth = animation?.options?.depth ?? 40;
  const perspective = animation?.options?.perspective ?? 1200;
  const transform = animation?.transform ?? {};
  const custom = [
    transform.translateX != null ? `translateX(${transform.translateX}px)` : "",
    transform.translateY != null ? `translateY(${transform.translateY}px)` : "",
    transform.translateZ != null ? `translateZ(${transform.translateZ}px)` : "",
    transform.rotateX != null ? `rotateX(${transform.rotateX}deg)` : "",
    transform.rotateY != null ? `rotateY(${transform.rotateY}deg)` : "",
    transform.rotateZ != null ? `rotateZ(${transform.rotateZ}deg)` : "",
    transform.scaleFrom != null ? `scale(${transform.scaleFrom})` : "",
  ].filter(Boolean).join(" ");
  if (custom) return custom;

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
  breakpoints,
  children,
}: {
  appearance?: AppearanceConfig | null;
  animation?: AnimationConfig | null;
  fonts?: FontDto[];
  assets?: Record<string, MediaDto>;
  breakpoints?: Breakpoints;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const mobileMax = breakpoints?.mobileMax ?? 767;
      const tabletMax = breakpoints?.tabletMax ?? 1023;
      setBreakpoint(width <= mobileMax ? "mobile" : width <= tabletMax ? "tablet" : "desktop");
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [breakpoints?.mobileMax, breakpoints?.tabletMax]);

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
  const effectiveAppearance = useMemo(() => mergeAppearance(appearance, breakpoint), [appearance, breakpoint]);
  const base = useMemo(() => appearanceStyle(effectiveAppearance, fonts, assets), [effectiveAppearance, fonts, assets]);
  const stagger = effective?.staggerMs ?? 90;
  const customOpacity = effective?.transform?.opacityFrom;
  const blurFrom = effective?.transform?.blurFromPx ?? 12;
  const isStagger = effective?.preset === "stagger-children";
  const isReveal = effective?.preset === "reveal-mask";

  const motionStyle: CSSProperties & Record<string, string | number | undefined> = enabled ? {
    transitionProperty: "opacity, transform, filter, clip-path",
    transitionDuration: effective?.durationMs == null ? "var(--os-motion-duration, 700ms)" : `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: effective?.easing == null ? "var(--os-motion-easing, ease-out)" : easing(effective.easing),
    opacity: isStagger ? (effectiveAppearance?.opacity ?? 1) : shown ? (effectiveAppearance?.opacity ?? 1) : (customOpacity ?? (effective?.preset === "blur-in" ? 0.3 : 0)),
    transform: isStagger || shown ? "none" : presetTransform(effective),
    filter: !shown && effective?.preset === "blur-in" ? `blur(${blurFrom}px)` : "none",
    clipPath: isReveal ? (shown ? "inset(0 0 0 0)" : "inset(0 0 100% 0)") : undefined,
    transformStyle: effective?.preset === "full-scroll-3d" ? "preserve-3d" : undefined,
    perspective: effective?.preset === "full-scroll-3d" ? `${effective.options?.perspective ?? 1200}px` : undefined,
    "--os-stagger-duration": `${duration}ms`,
    "--os-stagger-step": `${stagger}ms`,
  } : {};

  return (
    <div
      ref={ref}
      className="os-design-node"
      data-animation-preset={effective?.preset ?? "none"}
      data-animation-breakpoint={breakpoint}
      data-animation-state={shown ? "visible" : "hidden"}
      data-reduced-motion={reduce ? "respect" : "ignore"}
      style={{ ...base, ...motionStyle }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}
