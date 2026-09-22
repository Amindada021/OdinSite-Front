"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import { PageContent } from "@/components/renderer/PageContent";
import type { PublicPagePayload } from "@/lib/contracts";

class PreviewBoundary extends Component<{
  children: ReactNode; onError: () => void; revision: number;
}, { failed: boolean; revision: number }> {
  state = { failed: false, revision: this.props.revision };
  static getDerivedStateFromError() { return { failed: true }; }
  static getDerivedStateFromProps(props: { revision: number }, state: { revision: number }) {
    return props.revision !== state.revision ? { failed: false, revision: props.revision } : null;
  }
  componentDidCatch() { this.props.onError(); }
  render() {
    return this.state.failed
      ? <p dir="rtl" role="alert">نمایش کامپوننت با خطا مواجه شد. با اصلاح داده، پیش‌نمایش دوباره ساخته می‌شود.</p>
      : this.props.children;
  }
}

export function PreviewClient({ parentOrigin, channel }: { parentOrigin: string; channel: string }) {
  const [state, setState] = useState<{ payload: PublicPagePayload; revision: number } | null>(null);
  useEffect(() => {
    if (window.parent === window) return;
    const ready = () => window.parent.postMessage({ type: "odinsite:preview:ready", channel }, parentOrigin);
    const receive = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== parentOrigin || event.data?.channel !== channel) return;
      if (event.data.type === "odinsite:preview:hello") ready();
      if (event.data.type !== "odinsite:preview:update") return;
      const payload = event.data.payload;
      if (!payload?.page || !payload?.website || !payload?.seo || !Array.isArray(payload.components)) return;
      setState(previous => ({ payload, revision: (previous?.revision || 0) + 1 }));
    };
    window.addEventListener("message", receive);
    ready();
    return () => window.removeEventListener("message", receive);
  }, [parentOrigin, channel]);

  return <div onClickCapture={event => {
    // Keep editing in the preview; accordions still work, navigation does not.
    const link = (event.target as Element).closest("a");
    if (link && !link.getAttribute("href")?.startsWith("#")) event.preventDefault();
  }} onSubmitCapture={event => event.preventDefault()}>
    {state ? <PreviewBoundary revision={state.revision} onError={() =>
      window.parent.postMessage({ type: "odinsite:preview:error", channel }, parentOrigin)
    }>
      <PageContent payload={state.payload} preview />
    </PreviewBoundary> : <p dir="rtl" role="status">در انتظار اطلاعات صفحه از پنل…</p>}
  </div>;
}
