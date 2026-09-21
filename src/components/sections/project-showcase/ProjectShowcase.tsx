import { list, media, text } from "@/lib/component-data";
import { MediaImage } from "@/components/shared/MediaImage";
import styles from "./ProjectShowcase.module.css";

export function ProjectShowcase({ id, data }: { id: number; data: Record<string, unknown> }) {
  const image = media(data, "image");
  const tags = list<string>(data, "tags");

  return (
    <section className={styles.section} id="work" data-component-id={id}>
      <header>
        <span>{text(data, "eyebrow", "Selected work")}</span>
        <span>{text(data, "period", "2025 — 2026")}</span>
      </header>

      <div className={styles.hero}>
        <div>
          <h2>{text(data, "title", "A digital flagship built for speed.")}</h2>
          <p>{text(data, "description", "A product experience where brand, motion and engineering share one system.")}</p>
        </div>
        <div className={styles.meta}>
          <dl>
            <div><dt>Company</dt><dd>{text(data, "company", "Example Co.")}</dd></div>
            <div><dt>Role</dt><dd>{text(data, "role", "Lead Frontend")}</dd></div>
            <div><dt>Sector</dt><dd>{text(data, "sector", "Digital")}</dd></div>
          </dl>
          {tags.length > 0 && <div className={styles.tags}>{tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
        </div>
      </div>

      <div className={styles.visual}>
        {image ? <MediaImage media={image} eager /> : <div className={styles.placeholder}><span>{text(data, "visualLabel", "FEATURED PROJECT")}</span></div>}
      </div>

      {text(data, "href") && <a className={styles.link} href={text(data, "href")} target="_blank" rel="noreferrer">Visit project ↗</a>}
    </section>
  );
}
