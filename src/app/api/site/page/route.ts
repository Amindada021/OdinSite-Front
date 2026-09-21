import { NextRequest, NextResponse } from "next/server";
import { getPublishedPage } from "@/lib/api";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "localhost";

  const result = await getPublishedPage(path, host);

  if (!result) {
    return NextResponse.json(
      { success: false, message: "Published page not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      ETag: `"page-${result.version}"`
    }
  });
}
