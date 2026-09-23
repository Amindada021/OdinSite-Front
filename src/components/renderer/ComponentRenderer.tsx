import type { ComponentDto, FontDto, MediaDto } from "@/lib/contracts";
import { ContactCta } from "@/components/sections/contact-cta/ContactCta";
import { HeroTypography } from "@/components/sections/hero-typography/HeroTypography";
import { IntroStatement } from "@/components/sections/intro-statement/IntroStatement";
import { PartnerStory } from "@/components/sections/partner-story/PartnerStory";
import { ProjectGrid } from "@/components/sections/project-grid/ProjectGrid";
import { ProjectShowcase } from "@/components/sections/project-showcase/ProjectShowcase";
import { ServiceAccordion } from "@/components/sections/service-accordion/ServiceAccordion";
import { SkillList } from "@/components/sections/skill-list/SkillList";
import { DesignMotion } from "./DesignMotion";

type Section = (props: { id: number; data: Record<string, unknown> }) => React.ReactNode;

const registry: Record<string, Section> = {
  "hero.typography": HeroTypography,
  "content.intro": IntroStatement,
  "skills.list": SkillList,
  "services.accordion": ServiceAccordion,
  "projects.showcase": ProjectShowcase,
  "projects.grid": ProjectGrid,
  "story.partner": PartnerStory,
  "cta.contact": ContactCta
};

export function ComponentRenderer({
  component,
  preview = false,
  fonts,
  assets,
}: {
  component: ComponentDto;
  preview?: boolean;
  fonts?: FontDto[];
  assets?: Record<string, MediaDto>;
}) {
  const SectionComponent = registry[component.type];

  if (!SectionComponent) {
    if (preview) return <p dir="rtl" role="alert">این کامپوننت هنوز در فرانت پیاده‌سازی نشده است: {component.type}</p>;
    if (process.env.NODE_ENV === "development") {
      return <div data-unknown-component={component.type} />;
    }
    return null;
  }

  return (
    <DesignMotion
      appearance={component.resolvedAppearance ?? component.appearance}
      animation={component.animation}
      fonts={fonts}
      assets={assets}
    >
      <SectionComponent id={component.id} data={component.data} />
    </DesignMotion>
  );
}
