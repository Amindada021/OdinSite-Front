import type { MediaDto } from "@/lib/contracts";

const ASSET_BASE = (
  process.env.ODINSITE_ASSET_URL ||
  process.env.ODINSITE_API_URL ||
  ""
).replace(/\/$/, "");

export function mediaUrl(media: MediaDto | null | undefined, thumbnail = false) {
  if (!media) return null;
  const raw = thumbnail && media.thumbnailUrl ? media.thumbnailUrl : media.url;
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return ASSET_BASE ? `${ASSET_BASE}${raw.startsWith("/") ? "" : "/"}${raw}` : raw;
}
