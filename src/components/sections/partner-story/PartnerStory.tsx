import { list, text } from "@/lib/component-data";
import styles from "./PartnerStory.module.css";

type Pillar = { label?: string; title?: string; body?: string };

export function PartnerStory({ id, data }: { id: number; data: Record<string, unknown> }) {
  const items = list<Pillar>(data, "items");

  return (
    <section className={styles.section} data-component-id={id}>
      <div className={styles.lead}>
        <span>{text(data, "eyebrow", "Built together")}</span>
        <h2>{text(data, "title", "The best work happens between disciplines.")}</h2>
        <p>{text(data, "body", "Technology, design and animation are treated as one product decision from the beginning.")}</p>
      </div>
      <div className={styles.pillars}>
        {items.map((item, index) => (
          <article key={index}>
            <span>{item.label || String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title || "Discipline"}</h3>
            <p>{item.body || ""}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
