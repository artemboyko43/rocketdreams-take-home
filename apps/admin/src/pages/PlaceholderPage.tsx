import styles from "./FaqsPage.module.css";

export function PlaceholderPage({ title, copy }: { title: string; copy: string }) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2>{title}</h2>
          <p className={styles.muted}>{copy}</p>
        </div>
      </header>
    </section>
  );
}
