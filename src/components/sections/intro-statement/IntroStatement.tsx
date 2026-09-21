import { text } from "@/lib/component-data";
import styles from "./IntroStatement.module.css";

export function IntroStatement({ id, data }: { id: number; data: Record<string, unknown> }) {
  return (
    <section className={styles.section} data-component-id={id}>
      <div className={styles.label}>{text(data, "eyebrow", "About")}</div>
      <div className={styles.content}>
        <h2>{text(data, "title", "Hi, I'm Alex.")}</h2>
        <p>{text(data, "body", "I build digital experiences where strong engineering and deliberate motion work together.")}</p>
      </div>
      <aside>{text(data, "aside", "Available for selected projects")}</aside>
    </section>
  );
}
