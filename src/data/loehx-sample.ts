import type { ComponentDto } from "@/lib/contracts";

export const loehxSample: ComponentDto[] = [
  {
    id: 1,
    type: "hero.typography",
    data: {
      eyebrow: "Independent digital studio",
      title: "Leading digital products into what comes next.",
      subtitle: "Strategy, frontend engineering and deliberate motion for brands that care about the details.",
      primaryLabel: "Start a project",
      primaryHref: "#contact",
      secondaryLabel: "Selected work",
      secondaryHref: "#work"
    }
  },
  {
    id: 2,
    type: "content.intro",
    data: {
      eyebrow: "About",
      title: "Hi, I'm Alex.",
      body: "I build expressive websites and product interfaces where engineering, design and motion are treated as one system.",
      aside: "Based in Europe — working worldwide"
    }
  },
  {
    id: 3,
    type: "skills.list",
    data: {
      eyebrow: "Expertise",
      title: "Built through practice.",
      items: [
        { name: "React / Next.js", years: 8, description: "Server-first product interfaces with careful component architecture and performance budgets.", tags: ["Next.js", "React", "TypeScript"] },
        { name: "Creative frontend", years: 10, description: "High-fidelity interactions without turning every page into a JavaScript application.", tags: ["CSS", "Motion", "WebGL"] },
        { name: "AI products", years: 3, description: "Interfaces and workflows for AI-assisted products, automation and content systems.", tags: ["AI", "Agents", "Automation"] },
        { name: "Backend systems", years: 9, description: "APIs and content models designed to keep frontend contracts small, stable and cacheable.", tags: [".NET", "API", "Architecture"] }
      ]
    }
  },
  {
    id: 4,
    type: "services.accordion",
    data: {
      eyebrow: "Services",
      title: "Ways to work together.",
      items: [
        { title: "Frontend engineering", status: "NOW", description: "Join an existing team to own architecture, performance and the difficult UI details.", items: ["Architecture", "Performance", "Design systems"] },
        { title: "New websites", status: "NOW", description: "Build a new marketing or portfolio site from component system to production.", items: ["Next.js", "CMS integration", "SEO"] },
        { title: "AI-driven migrations", status: "SELECTIVE", description: "Move legacy interfaces toward a modern component architecture without losing business rules.", items: ["Audit", "Migration plan", "Delivery"] }
      ]
    }
  },
  {
    id: 5,
    type: "projects.showcase",
    data: {
      eyebrow: "Selected work",
      period: "2025 — 2026",
      title: "A digital flagship built for speed.",
      description: "A modular experience combining editorial typography, product storytelling and a strict performance budget.",
      company: "Northstar",
      role: "Lead Frontend",
      sector: "Commerce",
      tags: ["Next.js", "TypeScript", "Motion"],
      visualLabel: "NORTHSTAR / 2026"
    }
  },
  {
    id: 6,
    type: "projects.grid",
    data: {
      eyebrow: "More projects",
      title: "A few more things I've built.",
      items: [
        { title: "Atlas", company: "Studio", role: "Engineering", year: "2026" },
        { title: "Forma", company: "Retail", role: "Frontend", year: "2025" },
        { title: "Signal", company: "AI", role: "Product UI", year: "2025" },
        { title: "Field Notes", company: "Editorial", role: "Design + Dev", year: "2024" }
      ]
    }
  },
  {
    id: 7,
    type: "story.partner",
    data: {
      eyebrow: "Built together",
      title: "The best work happens between disciplines.",
      body: "A small senior team can move faster when the system is shared from the first sketch to production.",
      items: [
        { label: "01", title: "Technology", body: "Architecture that stays understandable as pages and components multiply." },
        { label: "02", title: "Design", body: "Strong hierarchy, typography and layout rules instead of one-off screens." },
        { label: "03", title: "Motion", body: "Animation used to explain structure and state, not to hide slow interfaces." }
      ]
    }
  },
  {
    id: 8,
    type: "cta.contact",
    data: {
      eyebrow: "Let's talk",
      title: "Have something ambitious in mind?",
      body: "Tell me what you are building and where the current experience is getting in the way.",
      email: "hello@example.com",
      buttonLabel: "Start a conversation",
      brand: "OdinSite",
      links: [
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "GitHub", href: "https://github.com" }
      ]
    }
  }
];
