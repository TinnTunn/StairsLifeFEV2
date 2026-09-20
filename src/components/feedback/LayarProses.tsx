// Layar tunggu berlogo untuk proses yang lama.

"use client";

import { Logo } from "../brand/Logo";
import styles from "./LayarProses.module.css";

export function LayarProses({ judul, isi }: { judul: string; isi?: string }) {
  return (
    <div className={styles.layar} role="status" aria-live="assertive" aria-busy="true">
      <div className={styles.isi}>
        <span className={styles.logo}>
          <Logo size={40} wordmark={false} />
          <span className={styles.cincin} aria-hidden="true" />
        </span>
        <p className={styles.judul}>{judul}</p>
        {isi ? <p className={styles.teks}>{isi}</p> : null}
      </div>
    </div>
  );
}
