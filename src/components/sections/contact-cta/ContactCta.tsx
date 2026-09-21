import { list, text } from "@/lib/component-data";
import styles from "./ContactCta.module.css";

type LinkItem = { label?: string; href?: string };

export function ContactCta({ id, data }: { id: number; data: Record<string, unknown> }) {
  const links = list<LinkItem>(data, "links");
  const email = text(data, "email", "hello@example.com");
  const buttonLabel = text(data, "buttonLabel", "Let's talk");

  return (
    <section className={styles.section} id="contact" data-component-id={id}>
      <div className={styles.kicker}>{text(data, "eyebrow", "Let's talk")}</div>
      <h2>{text(data, "title", "Have something ambitious in mind?")}</h2>
      <div className={styles.bottom}>
        <p>{text(data, "body", "Tell me what you are building, what needs to change and where you want to go next.")}</p>
        <a className={styles.cta} href={`mailto:${email}`}>{buttonLabel}<span>↗</span></a>
      </div>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} {text(data, "brand", "OdinSite")}</span>
        <nav aria-label="Social links">
          {links.map((link, index) => link.href ? <a href={link.href} key={index} target="_blank" rel="noreferrer">{link.label || "Link"}</a> : null)}
        </nav>
        <a href={`mailto:${email}`}>{email}</a>
      </footer>
    </section>
  );
}
