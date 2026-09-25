"use client";

import {
  Children,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type {
  AnimationConfig,
  AppearanceConfig,
  FontDto,
  MediaDto,
  SiteThemeConfig,
} from "@/lib/contracts";
import { appearanceStyle } from "@/lib/design";
import { DesignMotion } from "./DesignMotion";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sceneTransform(
  delta: number,
  depth: number,
  cameraMotion: string | null | undefined
) {
  const distance = Math.abs(delta);
  const z = -distance * depth * 9;
  const y = delta * 18;
  const x = cameraMotion === "orbit" ? Math.sin(delta * 1.2) * 10 : 0;
  const rotateX = cameraMotion === "vertical" ? delta * -5 : delta * 4;
  const rotateY = cameraMotion === "orbit" ? delta * 8 : 0;
  const scale = 1 - Math.min(distance * 0.08, 0.28);
  return `translate3d(${x}vw, ${y}vh, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
}

export function PageMotion({
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
  breakpoints?: SiteThemeConfig["breakpoints"];
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scenes = useMemo(() => Children.toArray(children), [children]);
  const [progress, setProgress] = useState(0);
  const [compact, setCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isFullScroll = animation?.enabled !== false && animation?.preset === "full-scroll-3d";

  useEffect(() => {
    const mobileMax = breakpoints?.mobileMax ?? 767;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => {
      setCompact(window.innerWidth <= mobileMax);
      setReducedMotion(media.matches && animation?.respectReducedMotion !== false);
    };
    updateMode();
    window.addEventListener("resize", updateMode, { passive: true });
    media.addEventListener("change", updateMode);
    return () => {
      window.removeEventListener("resize", updateMode);
      media.removeEventListener("change", updateMode);
    };
  }, [animation?.respectReducedMotion, breakpoints?.mobileMax]);

  useEffect(() => {
    if (!isFullScroll || compact || reducedMotion || scenes.length < 2) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const scrollable = Math.max(root.offsetHeight - window.innerHeight, 1);
      const ratio = clamp(-rect.top / scrollable, 0, 1);
      setProgress(ratio * (scenes.length - 1));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [compact, isFullScroll, reducedMotion, scenes.length]);

  if (!isFullScroll || compact || reducedMotion || scenes.length < 2) {
    const fallback = compact && animation?.options?.mobileFallbackPreset
      ? { ...animation, preset: animation.options.mobileFallbackPreset }
      : animation;
    return (
      <DesignMotion
        appearance={appearance}
        animation={fallback}
        fonts={fonts}
        assets={assets}
        breakpoints={breakpoints}
      >
        {children}
      </DesignMotion>
    );
  }

  const scrollScreens = Math.max(scenes.length, animation?.options?.scrollLength ?? scenes.length);
  const perspective = animation?.options?.perspective ?? 1200;
  const depth = animation?.options?.depth ?? 40;
  const cameraMotion = animation?.options?.cameraMotion ?? "depth";
  const activeIndex = clamp(Math.round(progress), 0, scenes.length - 1);
  const style = appearanceStyle(appearance, fonts, assets) as CSSProperties & Record<string, string | number>;
  style.height = `${scrollScreens * 100}svh`;
  style["--os-scene-perspective"] = `${perspective}px`;
  style["--os-scene-progress"] = progress;
  style["--os-scene-turn"] = `${progress * 3}deg`;

  return (
    <div
      ref={rootRef}
      className="os-full-scroll-3d"
      data-scene={activeIndex + 1}
      data-scene-count={scenes.length}
      style={style}
    >
      <div className="os-full-scroll-3d__stage">
        <div className="os-full-scroll-3d__ambient" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="os-full-scroll-3d__camera">
          {scenes.map((scene, index) => {
            const delta = index - progress;
            const distance = Math.abs(delta);
            const opacity = clamp(1 - distance * 0.78, 0, 1);
            const isInteractive = Math.abs(index - activeIndex) < 0.5;
            return (
              <div
                className="os-full-scroll-3d__scene"
                data-active={index === activeIndex ? "true" : "false"}
                aria-hidden={distance > 0.85}
                key={index}
                style={{
                  opacity,
                  pointerEvents: isInteractive ? "auto" : "none",
                  transform: sceneTransform(delta, depth, cameraMotion),
                  zIndex: scenes.length - Math.round(distance * 10),
                }}
              >
                {scene}
              </div>
            );
          })}
        </div>
        <div className="os-full-scroll-3d__status" aria-hidden>
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i><b style={{ transform: `scaleX(${scenes.length > 1 ? progress / (scenes.length - 1) : 1})` }} /></i>
          <span>{String(scenes.length).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}
