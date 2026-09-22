# OdinSite Front

Public rendering frontend for **OdinSite**, built with Next.js App Router and TypeScript.

## Goals

- Server Component first: public pages ship semantic HTML with minimal client JavaScript.
- Dynamic section registry: backend sends `component.type + data`, frontend selects the renderer.
- Component-local styles: every visual section owns a CSS Module.
- SEO from OdinSite: title, description, canonical, robots, Open Graph, Twitter and JSON-LD are rendered from the published snapshot.
- Multi-tenant by host: the incoming host is forwarded to OdinSite so the backend resolves the correct website.
- Fast media rendering: known width/height are preserved to reduce layout shift; images are lazy by default.
- Progressive enhancement: the current sample uses native HTML/CSS interactions instead of hydrating the whole page.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open:

- `/sample` — local eight-section creative portfolio sample.
- `/` or any slug — resolves the published page from OdinSite.

## Environment

```env
ODINSITE_API_URL=https://api.example.com
ODINSITE_ASSET_URL=https://api.example.com
ODINSITE_PREVIEW_HOST=example.com
```

`ODINSITE_PREVIEW_HOST` is only useful during local development when `localhost` is not registered as an OdinSite domain.

## Component keys

| Key | Renderer |
| --- | --- |
| `hero.typography` | Typography-led hero |
| `content.intro` | Intro statement |
| `skills.list` | Skills / experience rows |
| `services.accordion` | Native details accordion |
| `projects.showcase` | Featured project |
| `projects.grid` | Project card grid |
| `story.partner` | Multi-discipline story |
| `cta.contact` | Contact CTA + compact footer |

See `docs/component-contracts.md` for the data contract.


## Live builder preview

Set `ODINSITE_PREVIEW_PARENT_ORIGINS` to the exact admin panel origin(s), comma-separated, without trailing slashes. In ASP.NET set `NextJs__PreviewUrl` to this app's `/builder-preview` URL. Both apps must be deployed and restarted. For local HTTP development use `http://localhost:54920` for the panel and `http://localhost:3000/builder-preview` for the preview; HTTPS panels require an HTTPS preview.

The authenticated panel sends unsaved page data directly to the iframe using an origin-checked message channel. The preview shares the public `PageContent` and component registry; it does not fetch or publish drafts. Mobile (390px), tablet (768px) and desktop (1440px) selectors live in the panel. Missing renderer types are reported in preview only.
