import { list, text } from "@/lib/component-data";
import type { MediaDto } from "@/lib/contracts";
import { MediaImage } from "@/components/shared/MediaImage";
import styles from "./ProjectGrid.module.css";

type Project = {
  title?: string;
  company?: string;
  role?: string;
  year?: string | number;
  href?: string;
  image?: MediaDto | null;
};

export function ProjectGrid({ id, data }: { id: number; data: Record<string, unknown> }) {
  const items = list<Project>(data, "items");

  return (
    <section className={styles.section} data-component-id={id}>
      <header>
        <span>{text(data, "eyebrow", "More projects")}</span>
        <h2>{text(data, "title", "A few more things I've built.")}</h2>
      </header>
      <div className={styles.grid}>
        {items.map((item, index) => {
          const body = (
            <>
              <div className={styles.visual}>
                {item.image ? <MediaImage media={item.image} /> : <span>{String(index + 1).padStart(2, "0")}</span>}
              </div>
              <div className={styles.info}>
                <h3>{item.title || "Project"}</h3>
                <div>
                  <span>{item.company || ""}</span>
                  <span>{item.role || ""}</span>
                  <span>{item.year || ""}</span>
                </div>
              </div>
            </>
          );

          return item.href ? <a className={styles.card} href={item.href} key={index} target="_blank" rel="noreferrer">{body}</a> : <article className={styles.card} key={index}>{body}</article>;
        })}
      </div>
    </section>
  );
}
