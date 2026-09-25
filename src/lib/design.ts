import type { CSSProperties } from "react";
import type { AppearanceConfig, FontDto, MediaDto, SiteThemeConfig } from "./contracts";
import { mediaUrl } from "./media-url";

type Assets = Record<string, MediaDto> | undefined;

function px(value?: number | null) {
  return value == null ? undefined : `${value}px`;
}

function fontFamily(key: string | null | undefined, fonts: FontDto[] | undefined) {
  if (!key) return undefined;
  return fonts?.find(font => font.key === key)?.cssFamily ?? key;
}

function shadow(value: AppearanceConfig["shadow"]) {
  if (!value) return undefined;
  if (value.preset === "none") return "none";
  const hasCustomValue = [value.x, value.y, value.blur, value.spread, value.color, value.inset]
    .some(item => item != null);
  if (value.preset && !hasCustomValue) return `var(--os-shadow-${value.preset}, none)`;
  const x = value.x ?? 0;
  const y = value.y ?? 0;
  const blur = value.blur ?? 0;
  const spread = value.spread ?? 0;
  const color = value.color ?? "#00000033";
  return `${value.inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

function asset(id: number | null | undefined, assets: Assets) {
  if (id == null || !assets) return undefined;
  return assets[String(id)];
}

export function appearanceStyle(
  appearance: AppearanceConfig | null | undefined,
  fonts?: FontDto[],
  assets?: Assets
): CSSProperties {
  if (!appearance) return {};

  const radius = appearance.borderRadius;
  const image = asset(appearance.backgroundImageId, assets);
  const imageSource = image ? mediaUrl(image) : undefined;

  const style: CSSProperties & Record<string, string | number | undefined> = {
    backgroundColor: appearance.backgroundColor ?? undefined,
    backgroundImage: imageSource ? `url("${imageSource.replace(/"/g, "%22")}")` : undefined,
    backgroundSize: imageSource ? "cover" : undefined,
    backgroundPosition: imageSource ? "center" : undefined,
    color: appearance.textColor ?? undefined,
    "--bg": appearance.backgroundColor ?? undefined,
    "--ink": appearance.textColor ?? undefined,
    "--muted": appearance.mutedTextColor ?? undefined,
    "--accent": appearance.accentColor ?? undefined,
    fontFamily: fontFamily(appearance.fontFamily, fonts),
    "--os-base-font-size": px(appearance.fontSize),
    fontWeight: appearance.fontWeight ?? undefined,
    lineHeight: appearance.lineHeight ?? undefined,
    letterSpacing: px(appearance.letterSpacing),
    textAlign: appearance.textAlign as CSSProperties["textAlign"],
    textTransform: appearance.textTransform as CSSProperties["textTransform"],
    width: px(appearance.width),
    maxWidth: px(appearance.maxWidth),
    minHeight: px(appearance.minHeight),
    "--os-base-padding-top": px(appearance.padding?.top),
    "--os-base-padding-right": px(appearance.padding?.right),
    "--os-base-padding-bottom": px(appearance.padding?.bottom),
    "--os-base-padding-left": px(appearance.padding?.left),
    marginTop: px(appearance.margin?.top),
    marginRight: px(appearance.margin?.right),
    marginBottom: px(appearance.margin?.bottom),
    marginLeft: px(appearance.margin?.left),
    borderWidth: px(appearance.border?.width),
    borderStyle: appearance.border?.style as CSSProperties["borderStyle"],
    borderColor: appearance.border?.color ?? undefined,
    borderRadius: px(radius?.all),
    borderTopLeftRadius: px(radius?.topLeft),
    borderTopRightRadius: px(radius?.topRight),
    borderBottomRightRadius: px(radius?.bottomRight),
    borderBottomLeftRadius: px(radius?.bottomLeft),
    boxShadow: shadow(appearance.shadow),
    opacity: appearance.opacity ?? undefined,
    overflow: appearance.overflow as CSSProperties["overflow"],
  };

  return style;
}

export function themeStyle(theme: SiteThemeConfig | null | undefined, fonts?: FontDto[]): CSSProperties {
  if (!theme) return {};
  const colors = theme.colors ?? {};
  const typography = theme.typography ?? {};
  const spacing = theme.spacing ?? {};
  const radius = theme.radius ?? {};
  const layout = theme.layout ?? {};
  const borders = theme.borders ?? {};
  const motion = theme.motion ?? {};
  const style: CSSProperties & Record<string, string | number | undefined> = {};

  style["--os-background"] = colors.background ?? undefined;
  style["--os-surface"] = colors.surface ?? undefined;
  style["--os-surface-alt"] = colors.surfaceAlt ?? undefined;
  style["--os-text"] = colors.text ?? undefined;
  style["--os-text-muted"] = colors.textMuted ?? undefined;
  style["--os-primary"] = colors.primary ?? undefined;
  style["--os-secondary"] = colors.secondary ?? undefined;
  style["--os-accent"] = colors.accent ?? undefined;
  style["--os-border"] = colors.border ?? undefined;
  style["--os-success"] = colors.success ?? undefined;
  style["--os-warning"] = colors.warning ?? undefined;
  style["--os-danger"] = colors.danger ?? undefined;
  // Existing sections use these legacy variables. Keep them as aliases so a
  // backend theme immediately affects every registered renderer.
  style["--bg"] = colors.background ?? undefined;
  style["--surface"] = colors.surface ?? undefined;
  style["--ink"] = colors.text ?? undefined;
  style["--muted"] = colors.textMuted ?? undefined;
  style["--line"] = colors.border ?? undefined;
  style["--accent"] = colors.accent ?? undefined;
  style["--os-font-body"] = fontFamily(typography.fontFamilyBody, fonts);
  style["--os-font-heading"] = fontFamily(typography.fontFamilyHeading, fonts);
  style["--os-font-mono"] = fontFamily(typography.fontFamilyMono, fonts);
  style["--os-base-font-size"] = px(typography.baseFontSize);
  style["--os-body-line-height"] = typography.bodyLineHeight ?? undefined;
  style["--os-heading-line-height"] = typography.headingLineHeight ?? undefined;
  style["--os-body-font-weight"] = typography.bodyFontWeight ?? undefined;
  style["--os-heading-font-weight"] = typography.headingFontWeight ?? undefined;
  style["--os-letter-spacing"] = px(typography.letterSpacing);
  style["--os-section-padding-x"] = px(spacing.sectionPaddingX);
  style["--os-section-padding-y"] = px(spacing.sectionPaddingY);
  style["--os-component-gap"] = px(spacing.componentGap);
  style["--os-container-padding"] = px(spacing.containerPadding);
  style["--os-radius"] = px(radius.default);
  for (const [key, value] of Object.entries(radius)) {
    if (typeof value === "number") style[`--os-radius-${key}`] = `${value}px`;
  }
  style["--os-content-max-width"] = px(typeof layout.maxContentWidth === "number" ? layout.maxContentWidth : undefined);
  style["--max"] = px(typeof layout.maxContentWidth === "number" ? layout.maxContentWidth : undefined);
  style["--pad"] = px(spacing.sectionPaddingX ?? spacing.containerPadding);
  style["--os-border-width"] = px(typeof borders.defaultWidth === "number" ? borders.defaultWidth : undefined);
  style["--os-border-style"] = typeof borders.defaultStyle === "string" ? borders.defaultStyle : undefined;
  style["--os-border-color"] = typeof borders.defaultColor === "string" ? borders.defaultColor : undefined;
  style["--os-motion-duration"] = typeof motion.defaultDurationMs === "number" ? `${motion.defaultDurationMs}ms` : undefined;
  style["--os-motion-easing"] = typeof motion.defaultEasing === "string" ? motion.defaultEasing : undefined;
  style["--os-motion-stagger"] = typeof motion.defaultStaggerMs === "number" ? `${motion.defaultStaggerMs}ms` : undefined;
  for (const [key, value] of Object.entries(theme.shadows ?? {})) {
    const rendered = shadow(value);
    if (rendered) style[`--os-shadow-${key}`] = rendered;
  }
  style.direction = (layout.direction === "rtl" || layout.direction === "ltr") ? layout.direction : undefined;
  style.backgroundColor = colors.background ?? undefined;
  style.color = colors.text ?? undefined;
  style.fontFamily = fontFamily(typography.fontFamilyBody, fonts);
  style.fontSize = px(typography.baseFontSize);
  style.lineHeight = typography.bodyLineHeight ?? undefined;
  style.fontWeight = typography.bodyFontWeight ?? undefined;
  style.letterSpacing = px(typography.letterSpacing);
  return style;
}
