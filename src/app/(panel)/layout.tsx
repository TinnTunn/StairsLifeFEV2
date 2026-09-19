import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./panel.module.css";

/**
 * Bingkai untuk pintu masuk panel admin.
 *
 * Tanpa header pemasaran dan tanpa footer publik: di layar ini tidak ada yang
 * perlu dijual, dan tautan "Daftar Gratis" justru menyesatkan karena akun admin
 * memang tidak dibuat sendiri. Yang tersisa hanya pengatur bahasa dan tema,
 * karena keduanya menyangkut keterbacaan, bukan pemasaran.
 */
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.bar}>
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <main className={styles.main} id="konten" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
