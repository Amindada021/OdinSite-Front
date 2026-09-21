# Dynamic component contract

OdinSite already publishes this shape:

```json
{
  "id": 123,
  "type": "hero.typography",
  "data": {}
}
```

The frontend registry maps `type` to a server-rendered component. Unknown types fail closed and render nothing in production.

## 1. hero.typography

```json
{
  "eyebrow": "Independent digital studio",
  "title": "Leading digital products into what comes next.",
  "subtitle": "Strategy, design and engineering.",
  "primaryLabel": "Start a project",
  "primaryHref": "#contact",
  "secondaryLabel": "Selected work",
  "secondaryHref": "#work"
}
```

## 2. content.intro

Fields: `eyebrow`, `title`, `body`, `aside`.

## 3. skills.list

```json
{
  "eyebrow": "Expertise",
  "title": "Built through practice.",
  "items": [
    {
      "name": "React / Next.js",
      "years": 8,
      "description": "Server-first product interfaces.",
      "tags": ["Next.js", "React", "TypeScript"]
    }
  ]
}
```

## 4. services.accordion

```json
{
  "eyebrow": "Services",
  "title": "Ways to work together.",
  "items": [
    {
      "title": "Frontend engineering",
      "status": "NOW",
      "description": "Architecture and delivery.",
      "items": ["Architecture", "Performance"]
    }
  ]
}
```

## 5. projects.showcase

Fields: `eyebrow`, `period`, `title`, `description`, `company`, `role`, `sector`, `href`, `image`, `tags`, `visualLabel`.

The backend already materializes an `image` field into its public `MediaDto`.

## 6. projects.grid

```json
{
  "eyebrow": "More projects",
  "title": "A few more things I've built.",
  "items": [
    {
      "title": "Atlas",
      "company": "Studio",
      "role": "Engineering",
      "year": "2026",
      "href": "https://example.com",
      "image": null
    }
  ]
}
```

## 7. story.partner

```json
{
  "eyebrow": "Built together",
  "title": "The best work happens between disciplines.",
  "body": "Shared system from sketch to production.",
  "items": [
    { "label": "01", "title": "Technology", "body": "..." },
    { "label": "02", "title": "Design", "body": "..." },
    { "label": "03", "title": "Motion", "body": "..." }
  ]
}
```

## 8. cta.contact

Fields: `eyebrow`, `title`, `body`, `email`, `buttonLabel`, `brand`, and `links[]` where each link has `label` and `href`.

## Backend schema gap

The current OdinSite `ComponentSchemaValidator` supports only:

`text`, `textarea`, `url`, `number`, `boolean`, `image`, `map`.

The four list-oriented components above need a first-class `repeater`/array field in the builder if administrators should edit those nested items normally. The public payload does **not** need to change; only the admin schema/editor needs to learn repeaters.
