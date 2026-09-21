import { text } from "@/lib/component-data";
import styles from "./HeroTypography.module.css";

export function HeroTypography({ id, data }: { id: number; data: Record<string, unknown> }) {
  const eyebrow = text(data, "eyebrow", "Independent digital studio");
  const title = text(data, "title", "Leading the web into the AI revolution");
  const subtitle = text(data, "subtitle", "Strategy, design and engineering for ambitious digital products.");
  const primaryLabel = text(data, "primaryLabel", "Start a project");
  const primaryHref = text(data, "primaryHref", "#contact");
  const secondaryLabel = text(data, "secondaryLabel", "Selected work");
  const secondaryHref = text(data, "secondaryHref", "#work");

  return (
    <section className={styles.section} data-component-id={id}>
      <div className={styles.topline}>
        <span>{eyebrow}</span>
        <span className={styles.index}>01</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.bottom}>
        <p>{subtitle}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={primaryHref}>{primaryLabel}</a>
          <a className={styles.secondary} href={secondaryHref}>{secondaryLabel}</a>
        </div>
      </div>
    </section>
  );
}
