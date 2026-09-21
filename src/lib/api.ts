import type { PublicPageResponse } from "@/lib/contracts";

const API_URL = process.env.ODINSITE_API_URL?.replace(/\/$/, "");

function effectiveHost(host: string) {
  return process.env.ODINSITE_PREVIEW_HOST?.trim() || host.split(":")[0];
}

export async function getPublishedPage(path: string, host: string) {
  if (!API_URL) {
    throw new Error("ODINSITE_API_URL is not configured.");
  }

  const response = await fetch(
    `${API_URL}/api/public/page?path=${encodeURIComponent(path || "/")}`,
    {
      headers: {
        Accept: "application/json",
        Host: effectiveHost(host)
      },
      next: {
        revalidate: 60,
        tags: [`site:${effectiveHost(host)}:${path || "/"}`]
      }
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`OdinSite API returned ${response.status}`);

  return (await response.json()) as PublicPageResponse;
}
