"use client";

import Link from "next/link";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Logo } from "../brand/Logo";
import styles from "./PublicFooter.module.css";

/* Footer gaya V2: rata tengah di atas tinta. Hanya rute dan seksi yang benar
   benar ada yang ditautkan. */
export function PublicFooter() {
  const { t } = useBahasa();
  const f = t.navigasi.footer;

  const tautan = [
    { href: "/#cara-kerja", label: f.caraKerja },
    { href: "/#fitur", label: f.fitur },
    { href: "/#tentang", label: f.tentang },
    { href: "/daftar/mahasiswa", label: f.daftarMahasiswa },
    { href: "/daftar/bisnis", label: f.daftarBisnis },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label={t.navigasi.header.logoLabel}>
          <Logo surface="ink" size={26} />
        </Link>
        <p className={styles.tagline}>{f.tagline}</p>
        <nav aria-label={f.label} className={styles.links}>
          {tautan.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.divider} />
        <div className={styles.bawah}>
          <span>{f.hakCipta(new Date().getFullYear())}</span>
          <span>{f.kota}</span>
        </div>
      </div>
    </footer>
  );
}
