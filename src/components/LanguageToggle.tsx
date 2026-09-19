"use client";

import { useBahasa } from "@/i18n/BahasaProvider";
import type { Bahasa } from "@/i18n/jenis";
import styles from "./LanguageToggle.module.css";

const PILIHAN: Bahasa[] = ["id", "en"];

/**
 * Pengganti bahasa ID dan EN. Dua tombol dengan lebar tetap yang sama, jadi
 * posisi header dan tombol di sekitarnya tidak bergeser saat bahasa berganti.
 */
export function LanguageToggle({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  const { bahasa, gantiBahasa, t, sedangGanti } = useBahasa();

  return (
    <div
      role="group"
      aria-label={t.umum.bahasa.pilih}
      aria-busy={sedangGanti || undefined}
      className={[styles.toggle, onDark ? styles.onDark : "", className].filter(Boolean).join(" ")}
      data-aktif={bahasa}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {PILIHAN.map((b) => (
        <button
          key={b}
          type="button"
          lang={b}
          className={styles.opsi}
          aria-pressed={bahasa === b}
          aria-label={t.umum.bahasa.nama[b]}
          onClick={() => bahasa !== b && gantiBahasa(b)}
        >
          {b.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
