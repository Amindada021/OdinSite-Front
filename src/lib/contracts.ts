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

export interface ComponentDto {
  id: number;
  type: string;
  data: Record<string, unknown>;
}

export interface PublicPagePayload {
  website: {
    id: number;
    title: string;
  };
  page: {
    id: number;
    title: string;
    slug: string;
    isHome: boolean;
    allowComments: boolean;
    background?: MediaDto | null;
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
    openGraph: {
      title?: string | null;
      description?: string | null;
      type?: string | null;
      image?: MediaDto | null;
    };
    twitter: {
      title?: string | null;
      description?: string | null;
      type?: string | null;
      image?: MediaDto | null;
    };
    structuredData?: unknown;
  };
  components: ComponentDto[];
}

export interface PublicPageResponse {
  success: boolean;
  version: number;
  data: PublicPagePayload;
}
