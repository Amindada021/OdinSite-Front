import type { PublicPagePayload } from "@/lib/contracts";
import { mediaUrl } from "@/lib/media-url";
import { resolveAppearance, themeStyle } from "@/lib/design";
import { ComponentRenderer } from "./ComponentRenderer";
import { PageMotion } from "./PageMotion";

// Shared by the public server-rendered page and the live editor preview.
export function PageContent({ payload, preview = false }: { payload: PublicPagePayload; preview?: boolean }) {
  const background = mediaUrl(payload.page.background);
  const pageAppearance = resolveAppearance(payload.page.resolvedAppearance, payload.page.appearance);
  const shellStyle = themeStyle(payload.website.theme, payload.fonts);

  return (
    <main id="main" className="site-shell os-design-surface" style={shellStyle}>
      {background && <>
        <img className="site-background" src={background} alt="" aria-hidden />
        <div className="site-background-overlay" aria-hidden />
      </>}
      {!preview && payload.seo.structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(payload.seo.structuredData).replace(/</g, "\\u003c")
        }} />
      ) : null}

      <PageMotion
        appearance={pageAppearance}
        animation={payload.page.animation}
        fonts={payload.fonts}
        assets={payload.designAssets}
        breakpoints={payload.website.theme?.breakpoints}
      >
        {payload.components.map(component => (
          <ComponentRenderer
            component={component}
            key={component.id}
            preview={preview}
            fonts={payload.fonts}
            assets={payload.designAssets}
            breakpoints={payload.website.theme?.breakpoints}
          />
        ))}
      </PageMotion>
    </main>
  );
}
