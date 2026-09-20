// Potongan bersama panel admin: kartu, paginasi, dan pembungkus aksi.

"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import styles from "./admin.module.css";

export function useAksi() {
  const { t } = useBahasa();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function jalankan(fn: () => Promise<unknown>): Promise<boolean> {
    setError(null);
    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(t.aplikasi.umum.modeContoh);
        return false;
      }
      await fn();
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.messages.join(" ") : t.umum.galat.jaringan);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const galat = error ? (
    <p role="alert" className={styles.galat}>
      <Icon name="AlertTriangle" size={18} />
      <span>{error}</span>
    </p>
  ) : null;

  return { loading, error, setError, jalankan, galat };
}

export { TombolBerkas } from "@/components/data/TombolBerkas";

export function Paginasi({
  halaman,
  total,
  onGanti,
}: {
  halaman: number;
  total: number;
  onGanti: (h: number) => void;
}) {
  const { t } = useBahasa();
  if (total <= 1) return null;
  return (
    <nav className={styles.paginasi} aria-label={t.admin.umum.halaman(halaman, total)}>
      <Button
        size="sm"
        variant="secondary"
        disabled={halaman <= 1}
        onClick={() => onGanti(halaman - 1)}
        iconLeft={<Icon name="ChevronLeft" size={16} />}
      >
        {t.admin.umum.sebelumnya}
      </Button>
      <span className={styles.paginasiTeks}>{t.admin.umum.halaman(halaman, total)}</span>
      <Button
        size="sm"
        variant="secondary"
        disabled={halaman >= total}
        onClick={() => onGanti(halaman + 1)}
        iconRight={<Icon name="ChevronRight" size={16} />}
      >
        {t.admin.umum.berikutnya}
      </Button>
    </nav>
  );
}

export function KartuAdmin({
  judul,
  sub,
  icon,
  aksi,
  children,
}: {
  judul: string;
  sub?: string;
  icon: Parameters<typeof Icon>[0]["name"];
  aksi?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.kartu}>
      <header className={styles.kartuKepala}>
        <span className={styles.kartuIkon} aria-hidden="true">
          <Icon name={icon} size={18} />
        </span>
        <div className={styles.kartuJudulBlok}>
          <h2 className={styles.kartuJudul}>{judul}</h2>
          {sub ? <span className={styles.kartuSub}>{sub}</span> : null}
        </div>
        {aksi ? <div className={styles.kartuAksi}>{aksi}</div> : null}
      </header>
      {children}
    </section>
  );
}
