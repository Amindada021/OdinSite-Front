export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface MediaDto {
  id: number;
  url: string;
  thumbnailUrl?: string | null;
  alt?: string | null;
  title?: string | null;
  caption?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
  isDecorative: boolean;
}

export interface FontDto {
  key: string;
  title: string;
  cssFamily: string;
}

export interface BoxSpacing { top?: number | null; right?: number | null; bottom?: number | null; left?: number | null; }
export interface BorderConfig { width?: number | null; style?: string | null; color?: string | null; }
export interface BorderRadiusConfig { all?: number | null; topLeft?: number | null; topRight?: number | null; bottomRight?: number | null; bottomLeft?: number | null; }
export interface ShadowConfig { preset?: string | null; x?: number | null; y?: number | null; blur?: number | null; spread?: number | null; color?: string | null; inset?: boolean | null; }

export interface AppearanceConfig {
  backgroundColor?: string | null;
  backgroundImageId?: number | null;
  textColor?: string | null;
  mutedTextColor?: string | null;
  accentColor?: string | null;
  fontFamily?: string | null;
  fontSize?: number | null;
  fontWeight?: number | null;
  lineHeight?: number | null;
  letterSpacing?: number | null;
  textAlign?: string | null;
  textTransform?: string | null;
  width?: number | null;
  maxWidth?: number | null;
  minHeight?: number | null;
  padding?: BoxSpacing | null;
  margin?: BoxSpacing | null;
  border?: BorderConfig | null;
  borderRadius?: BorderRadiusConfig | null;
  shadow?: ShadowConfig | null;
  opacity?: number | null;
  overflow?: string | null;
  responsive?: {
    mobile?: AppearanceConfig | null;
    tablet?: AppearanceConfig | null;
    desktop?: AppearanceConfig | null;
  } | null;
}

export interface AnimationConfig {
  enabled?: boolean | null;
  preset?: string | null;
  intensity?: string | null;
  durationMs?: number | null;
  delayMs?: number | null;
  easing?: string | null;
  trigger?: string | null;
  respectReducedMotion?: boolean | null;
  once?: boolean | null;
  staggerMs?: number | null;
  threshold?: number | null;
  transform?: Record<string, number | null | undefined> | null;
  options?: {
    scene?: string | null;
    scrollLength?: number | null;
    cameraMotion?: string | null;
    depth?: number | null;
    perspective?: number | null;
    backgroundInteraction?: boolean | null;
    pointerInteraction?: boolean | null;
    mobileFallbackPreset?: string | null;
  } | null;
  responsive?: {
    mobile?: AnimationConfig | null;
    tablet?: AnimationConfig | null;
    desktop?: AnimationConfig | null;
  } | null;
}

export interface SiteThemeConfig {
  schemaVersion?: number;
  colors?: Record<string, string | null | undefined> | null;
  typography?: {
    fontFamilyBody?: string | null;
    fontFamilyHeading?: string | null;
    fontFamilyMono?: string | null;
    baseFontSize?: number | null;
    bodyLineHeight?: number | null;
    headingLineHeight?: number | null;
    bodyFontWeight?: number | null;
    headingFontWeight?: number | null;
    letterSpacing?: number | null;
  } | null;
  spacing?: Record<string, number | null | undefined> | null;
  radius?: Record<string, number | null | undefined> | null;
  borders?: Record<string, string | number | null | undefined> | null;
  shadows?: Record<string, ShadowConfig | null | undefined> | null;
  layout?: Record<string, string | number | null | undefined> | null;
  motion?: Record<string, string | number | null | undefined> | null;
  breakpoints?: { mobileMax?: number; tabletMax?: number } | null;
}

export interface ComponentDto {
  id: number;
  type: string;
  data: Record<string, unknown>;
  appearance?: AppearanceConfig | null;
  resolvedAppearance?: AppearanceConfig | null;
  animation?: AnimationConfig | null;
}

export interface PublicPagePayload {
  website: {
    id: number;
    title: string;
    theme?: SiteThemeConfig | null;
  };
  page: {
    id: number;
    title: string;
    slug: string;
    isHome: boolean;
    allowComments: boolean;
    background?: MediaDto | null;
    appearance?: AppearanceConfig | null;
    resolvedAppearance?: AppearanceConfig | null;
    animation?: AnimationConfig | null;
    publishedAt?: string | null;
    updatedAt: string;
  };
  seo: {
    title: string;
    description?: string | null;
    canonicalUrl?: string | null;
    noIndex: boolean;
    noFollow: boolean;
    excludeFromSitemap: boolean;
    openGraph: { title?: string | null; description?: string | null; type?: string | null; image?: MediaDto | null; };
    twitter: { title?: string | null; description?: string | null; type?: string | null; image?: MediaDto | null; };
    structuredData?: unknown;
  };
  components: ComponentDto[];
  fonts?: FontDto[];
  designAssets?: Record<string, MediaDto> | Record<number, MediaDto>;
}

export interface PublicPageResponse {
  success: boolean;
  version: number;
  data: PublicPagePayload;
}
