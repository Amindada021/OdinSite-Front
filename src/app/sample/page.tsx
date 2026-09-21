import type { Metadata } from "next";
import { ComponentRenderer } from "@/components/renderer/ComponentRenderer";
import { loehxSample } from "@/data/loehx-sample";

export const metadata: Metadata = {
  title: "OdinSite — Creative portfolio sample",
  description: "Eight dynamic OdinSite components rendered as a sample page.",
  robots: { index: false, follow: false }
};

export default function SamplePage() {
  return (
    <main id="main" className="site-shell">
      {loehxSample.map(component => (
        <ComponentRenderer component={component} key={component.id} />
      ))}
    </main>
  );
}
