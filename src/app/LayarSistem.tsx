"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/actions/Icon";
import { Logo } from "@/components/brand/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./sistem.module.css";

/** Kerangka bersama halaman 404, galat, dan rute yang belum dibangun. */
export function LayarSistem({
  kode,
  icon,
  judul,
  isi,
  aksi,
}: {
  kode?: string;
  icon?: IconName;
  judul: string;
  isi: string;
  aksi: ReactNode;
}) {
  const { t } = useBahasa();
  return (
    <div className={styles.layar}>
      <header className={styles.atas}>
        <Link href="/" className={styles.logo} aria-label={t.navigasi.header.logoLabel}>
          <Logo size={24} />
        </Link>
        <div className={styles.pengaturan}>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.tengah} id="konten" tabIndex={-1}>
        <div className={styles.kartu}>
          {kode ? (
            <span className={styles.kode} aria-hidden="true">
              {kode}
            </span>
          ) : icon ? (
            <span className={styles.ikon} aria-hidden="true">
              <Icon name={icon} size={32} />
            </span>
          ) : null}
          <h1 className={styles.judul}>{judul}</h1>
          <p className={styles.isi}>{isi}</p>
          <div className={styles.aksi}>{aksi}</div>
        </div>
      </main>
    </div>
  );
}
