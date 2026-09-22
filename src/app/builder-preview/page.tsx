import type { Metadata } from "next";
import { PreviewClient } from "./preview-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "پیش‌نمایش صفحه",
  robots: { index: false, follow: false }
};

export default async function BuilderPreview({ searchParams }: {
  searchParams: Promise<{ parentOrigin?: string; channel?: string }>
}) {
  const { parentOrigin, channel } = await searchParams;
  const allowed = (process.env.ODINSITE_PREVIEW_PARENT_ORIGINS || "")
    .split(",").map(value => value.trim()).filter(Boolean);
  if (typeof parentOrigin !== "string" || !allowed.includes(parentOrigin) ||
      typeof channel !== "string" || !/^[a-zA-Z0-9-]{16,80}$/.test(channel))
    return <p dir="rtl">پیش‌نمایش را از پنل سایت‌ساز باز کنید. آدرس پنل باید در تنظیمات فرانت مجاز باشد.</p>;

  return <PreviewClient parentOrigin={parentOrigin} channel={channel} />;
}
