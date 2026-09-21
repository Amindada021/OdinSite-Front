import { list, text } from "@/lib/component-data";
import styles from "./SkillList.module.css";

type Skill = {
  name?: string;
  years?: string | number;
  description?: string;
  tags?: string[];
};

export function SkillList({ id, data }: { id: number; data: Record<string, unknown> }) {
  const items = list<Skill>(data, "items");

  return (
    <section className={styles.section} data-component-id={id}>
      <header>
        <span>{text(data, "eyebrow", "Expertise")}</span>
        <h2>{text(data, "title", "Built through practice.")}</h2>
      </header>
      <div className={styles.list}>
        {items.map((item, index) => (
          <article className={styles.row} key={`${item.name || "skill"}-${index}`}>
            <div className={styles.num}>{String(index + 1).padStart(2, "0")}</div>
            <h3>{item.name || "Capability"}</h3>
            <div className={styles.years}>{item.years ? `${item.years} yrs` : "—"}</div>
            <div className={styles.detail}>
              <p>{item.description || ""}</p>
              <div className={styles.tags}>{(item.tags || []).map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
