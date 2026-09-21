import type { MediaDto } from "@/lib/contracts";

export function text(data: Record<string, unknown>, key: string, fallback = "") {
  const value = data[key];
  return typeof value === "string" ? value : fallback;
}

export function numberValue(data: Record<string, unknown>, key: string, fallback = 0) {
  const value = data[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function booleanValue(data: Record<string, unknown>, key: string, fallback = false) {
  const value = data[key];
  return typeof value === "boolean" ? value : fallback;
}

export function list<T = Record<string, unknown>>(data: Record<string, unknown>, key: string): T[] {
  const value = data[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

export function media(data: Record<string, unknown>, key: string): MediaDto | null {
  const value = data[key];
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<MediaDto>;
  return typeof candidate.url === "string" && typeof candidate.id === "number"
    ? (candidate as MediaDto)
    : null;
}
