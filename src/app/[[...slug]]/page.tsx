import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ComponentRenderer } from "@/components/renderer/ComponentRenderer";
import { getPublishedPage } from "@/lib/api";
import { mediaUrl } from "@/lib/media-url";

type Props = { params: Promise<{ slug?: string[] }> };

function pathFromSlug(slug?: string[]) {
  return slug?.length ? `/${slug.map(encodeURIComponent).join("/")}` : "/";
}

async function requestContext(params: Props["params"]) {
  const [{ slug }, requestHeaders] = await Promise.all([params, headers()]);
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost";
  return { path: pathFromSlug(slug), host };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path, host } = await requestContext(params);
  const result = await getPublishedPage(path, host);
  if (!result) return { title: "Page not found", robots: { index: false, follow: false } };

  const seo = result.data.seo;
  const ogImage = mediaUrl(seo.openGraph.image);
  const twitterImage = mediaUrl(seo.twitter.image);

  return {
    title: seo.title,
    description: seo.description || undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow
    },
    openGraph: {
      title: seo.openGraph.title || seo.title,
      description: seo.openGraph.description || seo.description || undefined,
      type: seo.openGraph.type === "article" ? "article" : "website",
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      card: seo.twitter.type === "summary" ? "summary" : "summary_large_image",
      title: seo.twitter.title || seo.title,
      description: seo.twitter.description || seo.description || undefined,
      images: twitterImage ? [twitterImage] : undefined
    }
  };
}

export default async function PublicPage({ params }: Props) {
  const { path, host } = await requestContext(params);
  const result = await getPublishedPage(path, host);
  if (!result) notFound();

  const payload = result.data;
  const background = mediaUrl(payload.page.background);

  return (
    <main id="main" className="site-shell">
      {background && (
        <>
          <img className="site-background" src={background} alt="" aria-hidden />
          <div className="site-background-overlay" aria-hidden />
        </>
      )}

      {payload.seo.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(payload.seo.structuredData).replace(/</g, "\\u003c")
          }}
        />
      ) : null}

      {payload.components.map(component => (
        <ComponentRenderer component={component} key={component.id} />
      ))}
    </main>
  );
}
