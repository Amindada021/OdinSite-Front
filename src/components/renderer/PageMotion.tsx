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

function sceneOpacity(distance: number) {
  // Smoothstep cross-fade: adjacent scenes are completely hidden at rest,
  // while both remain visible only during the actual transition.
  const visible = clamp(1 - distance, 0, 1);
  return visible * visible * (3 - 2 * visible);
}

function sceneTransform(
  delta: number,
  depth: number,
  cameraMotion: string | null | undefined
) {
  const distance = Math.abs(delta);
  // Upcoming scenes wait deep inside the tunnel; completed scenes pass the
  // camera and continue forward instead of merely sliding off the viewport.
  const z = delta >= 0 ? -delta * depth * 14 : -delta * depth * 10;
  const y = delta * (cameraMotion === "vertical" ? 14 : 7);
  const x = cameraMotion === "orbit" ? Math.sin(delta * 1.15) * 13 : 0;
  const rotateX = cameraMotion === "vertical" ? delta * -7 : delta * 2.5;
  const rotateY = cameraMotion === "orbit" ? delta * 11 : delta * -1.5;
  const scale = delta >= 0
    ? 1 - Math.min(distance * 0.1, 0.32)
    : 1 + Math.min(distance * 0.12, 0.22);
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
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const scenes = useMemo(() => Children.toArray(children), [children]);
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
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
    let motionFrame = 0;
    let lastTime = performance.now();

    const readTarget = () => {
      const root = rootRef.current;
      if (!root) return currentProgressRef.current;
      const rect = root.getBoundingClientRect();
      const scrollable = Math.max(root.offsetHeight - window.innerHeight, 1);
      const ratio = clamp(-rect.top / scrollable, 0, 1);
      return ratio * (scenes.length - 1);
    };

    const animate = (time: number) => {
      const elapsed = Math.min(time - lastTime, 64);
      lastTime = time;
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;
      const difference = target - current;

      // Time-based damping keeps the same feel on 60/120 Hz displays and
      // absorbs trackpad spikes without creating a long, floaty delay.
      const damping = 1 - Math.exp(-elapsed / 145);
      const next = Math.abs(difference) < 0.0005
        ? target
        : current + difference * damping;
      currentProgressRef.current = next;
      setProgress(next);
      setVelocity(clamp((next - current) * 34, -2.6, 2.6));

      if (next === target) {
        motionFrame = 0;
        setVelocity(0);
        return;
      }
      motionFrame = window.requestAnimationFrame(animate);
    };

    const scheduleMotion = () => {
      targetProgressRef.current = readTarget();
      if (!motionFrame) {
        lastTime = performance.now();
        motionFrame = window.requestAnimationFrame(animate);
      }
    };

    // Start at the real scroll position. This prevents a fly-through when the
    // page is restored/reloaded halfway through the experience.
    const initial = readTarget();
    targetProgressRef.current = initial;
    currentProgressRef.current = initial;
    setProgress(initial);
    window.addEventListener("scroll", scheduleMotion, { passive: true });
    window.addEventListener("resize", scheduleMotion, { passive: true });
    return () => {
      if (motionFrame) window.cancelAnimationFrame(motionFrame);
      window.removeEventListener("scroll", scheduleMotion);
      window.removeEventListener("resize", scheduleMotion);
    };
  }, [compact, isFullScroll, reducedMotion, scenes.length]);

  const activeIndex = clamp(Math.round(progress), 0, Math.max(scenes.length - 1, 0));
  currentProgressRef.current = progress;
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    if (!isFullScroll || compact || reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const consumeInnerScroll = (event: WheelEvent) => {
      const currentIndex = activeIndexRef.current;
      const panel = sceneRefs.current[currentIndex];
      if (!panel || !(event.target instanceof Node) || !panel.contains(event.target)) return;

      // Do not capture the transition itself. Once the scene is centered, its
      // own overflow gets exclusive wheel control until it reaches a boundary.
      if (Math.abs(currentProgressRef.current - currentIndex) > 0.08) return;
      const maxScroll = panel.scrollHeight - panel.clientHeight;
      if (maxScroll <= 1 || event.deltaY === 0) return;

      const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? event.deltaY * 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? event.deltaY * window.innerHeight
          : event.deltaY;
      const atStart = panel.scrollTop <= 1;
      const atEnd = panel.scrollTop >= maxScroll - 1;
      const canConsume = (delta > 0 && !atEnd) || (delta < 0 && !atStart);
      if (!canConsume) return;

      event.preventDefault();
      event.stopPropagation();
      // Slightly tame high-resolution trackpads and mouse wheels. Keeping this
      // synchronous avoids queued smooth-scroll animations at the boundary.
      panel.scrollTop = clamp(panel.scrollTop + delta * 0.72, 0, maxScroll);
    };

    root.addEventListener("wheel", consumeInnerScroll, { passive: false });
    return () => root.removeEventListener("wheel", consumeInnerScroll);
  }, [compact, isFullScroll, reducedMotion]);

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

  // Keep enough physical scroll distance between scenes that one wheel notch
  // cannot skip the viewer straight to the next component. scrollLength still
  // acts as a minimum total journey, while 2.35 viewports is the default pace
  // for each scene-to-scene transition.
  const transitionCount = Math.max(scenes.length - 1, 1);
  const requestedJourney = animation?.options?.scrollLength ?? scenes.length;
  const screensPerTransition = Math.max(2.35, requestedJourney / transitionCount);
  const scrollScreens = 1 + transitionCount * screensPerTransition;
  const perspective = animation?.options?.perspective ?? 1200;
  const depth = animation?.options?.depth ?? 40;
  const cameraMotion = animation?.options?.cameraMotion ?? "depth";
  const style = appearanceStyle(appearance, fonts, assets) as CSSProperties & Record<string, string | number>;
  style.height = `${scrollScreens * 100}svh`;
  style["--os-scene-perspective"] = `${perspective}px`;
  style["--os-scene-progress"] = progress;
  style["--os-scene-turn"] = `${progress * 3}deg`;
  style["--os-camera-x"] = `${pointer.x * 1.8}deg`;
  style["--os-camera-y"] = `${pointer.y * -1.3 + velocity}deg`;
  style["--os-pointer-x"] = pointer.x;
  style["--os-pointer-y"] = pointer.y;
  style["--os-pointer-shift-x"] = `${pointer.x * 5}%`;
  style["--os-pointer-shift-y"] = `${pointer.y * 4}%`;
  style["--os-pointer-grid-x"] = `${pointer.x * -12}px`;
  style["--os-pointer-ambient-x"] = `${pointer.x * 2}vw`;
  style["--os-pointer-ambient-y"] = `${pointer.y * 2}vh`;

  return (
    <div
      ref={rootRef}
      className="os-full-scroll-3d"
      data-scene={activeIndex + 1}
      data-scene-count={scenes.length}
      style={style}
      onPointerMove={event => {
        if (animation?.options?.pointerInteraction === false) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
          y: clamp(((event.clientY - rect.top) / window.innerHeight - 0.5) * 2, -1, 1),
        });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
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
            const opacity = sceneOpacity(distance);
            const blur = Math.min(distance * 7, 12);
            const brightness = clamp(1 - distance * 0.28, 0.62, 1);
            const isInteractive = Math.abs(index - activeIndex) < 0.5;
            return (
              <div
                ref={node => { sceneRefs.current[index] = node; }}
                className="os-full-scroll-3d__scene"
                data-active={index === activeIndex ? "true" : "false"}
                aria-hidden={distance > 0.85}
                key={index}
                style={{
                  opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
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
