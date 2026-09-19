import styles from "./StatusTimeline.module.css";

export interface TimelineItem {
  label: string;
  /** Sudah diformat lewat formatTanggalJam, bukan tanggal mentah. */
  time?: string;
  description?: string;
  tone?: "done" | "active" | "todo" | "alert";
}

const DOT = {
  done: "",
  active: styles.dotActive,
  todo: styles.dotTodo,
  alert: styles.dotAlert,
};

/**
 * Riwayat status yang sudah terjadi, dengan cap waktu. Berbeda dari
 * ContractStepper yang menampilkan tahap yang akan datang.
 */
export function StatusTimeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={[styles.list, className].filter(Boolean).join(" ")}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const tone = item.tone ?? "done";
        return (
          <li key={`${item.label}-${i}`} className={[styles.item, last ? styles.itemLast : ""].filter(Boolean).join(" ")}>
            <span className={styles.rail} aria-hidden="true">
              <span className={[styles.dot, DOT[tone]].filter(Boolean).join(" ")} />
              {last ? null : <span className={styles.line} />}
            </span>
            <span className={styles.body}>
              <span className={styles.head}>
                <b className={[styles.label, tone === "todo" ? styles.labelTodo : ""].filter(Boolean).join(" ")}>
                  {item.label}
                </b>
                {item.time ? <span className={styles.time}>{item.time}</span> : null}
              </span>
              {item.description ? <span className={styles.description}>{item.description}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
