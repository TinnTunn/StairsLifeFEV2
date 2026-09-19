"use client";

import { Logo } from "../brand/Logo";
import styles from "./LayarProses.module.css";

/**
 * Layar penuh dengan logo dan cincin berputar untuk perpindahan sesi: masuk,
 * daftar, dan keluar. Tampil di atas segalanya sampai halaman tujuan siap,
 * supaya pengguna tidak melihat formulir kosong atau kerangka yang berkedip.
 */
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
