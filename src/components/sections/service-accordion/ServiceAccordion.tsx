import { list, text } from "@/lib/component-data";
import styles from "./ServiceAccordion.module.css";

type Service = { title?: string; status?: string; description?: string; items?: string[] };

export function ServiceAccordion({ id, data }: { id: number; data: Record<string, unknown> }) {
  const items = list<Service>(data, "items");

  return (
    <section className={styles.section} data-component-id={id}>
      <div className={styles.intro}>
        <span>{text(data, "eyebrow", "Services")}</span>
        <h2>{text(data, "title", "Ways to work together.")}</h2>
      </div>
      <div className={styles.items}>
        {items.map((item, index) => (
          <details className={styles.item} key={`${item.title || "service"}-${index}`}>
            <summary>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title || "Service"}</strong>
              <span className={styles.status}>{item.status || "NOW"}</span>
              <span className={styles.plus} aria-hidden>+</span>
            </summary>
            <div className={styles.panel}>
              <p>{item.description || ""}</p>
              {(item.items || []).length > 0 && <ul>{(item.items || []).map(value => <li key={value}>{value}</li>)}</ul>}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
