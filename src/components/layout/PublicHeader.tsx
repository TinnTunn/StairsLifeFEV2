// Kepala halaman publik.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Button } from "../actions/Button";
import { Icon } from "../actions/Icon";
import { IconButton } from "../actions/IconButton";
import { Logo } from "../brand/Logo";
import { LanguageToggle } from "../LanguageToggle";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./PublicHeader.module.css";

const SEKSI = [
  { id: "cara-kerja", kunci: "caraKerja" },
  { id: "fitur", kunci: "fitur" },
  { id: "tentang", kunci: "tentang" },
] as const;

export function PublicHeader() {
  const pathname = usePathname();
  const { t } = useBahasa();
  const [open, setOpen] = useState(false);

  const [bergeser, setBergeser] = useState(false);
  const [seksiAktif, setSeksiAktif] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const cek = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setBergeser(window.scrollY > 24));
    };
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", cek);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/" || !("IntersectionObserver" in window)) return;
    const elemen = SEKSI.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSeksiAktif(entry.target.id);
          else setSeksiAktif((aktif) => (aktif === entry.target.id ? null : aktif));
        }
      },
      { rootMargin: "-40% 0% -55% 0%" },
    );
    elemen.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setSeksiAktif(null);
  }

  const tautan = SEKSI.map((s) => ({ href: `/#${s.id}`, id: s.id, label: t.navigasi.header[s.kunci] }));

  return (
    <header className={styles.header} data-bergeser={bergeser || undefined}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label={t.navigasi.header.logoLabel}>
          <Logo />
        </Link>

        <nav className={styles.nav} aria-label={t.navigasi.header.label}>
          {tautan.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={styles.link}
              aria-current={seksiAktif === l.id ? "location" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <span className={styles.bahasaDesktop}>
            <LanguageToggle />
          </span>
          <span className={`${styles.desktopOnly} ${styles.tombolMasuk}`}>
            <Button href="/masuk" variant="ghost" size="sm">
              {t.umum.aksi.masuk}
            </Button>
          </span>
          <span className={styles.daftar}>
            <Button href="/daftar" size="sm">
              {t.umum.aksi.daftarGratis}
            </Button>
          </span>
          <span className={styles.menuButton}>
            <IconButton
              label={open ? t.umum.aksi.tutupMenu : t.umum.aksi.bukaMenu}
              aria-expanded={open}
              aria-controls="menu-publik"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "XCircle" : "Menu"} />
            </IconButton>
          </span>
        </div>
      </div>

      {open ? (
        <div className={styles.panel} id="menu-publik">
          {tautan.map((l) => (
            <Link key={l.id} href={l.href} className={styles.panelLink} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className={styles.panelBahasa}>
            <span>{t.umum.bahasa.label}</span>
            <LanguageToggle />
          </div>
          <div className={styles.panelActions}>
            <Button href="/masuk" variant="ghost" fullWidth>
              {t.umum.aksi.masuk}
            </Button>
            <Button href="/daftar" fullWidth>
              {t.umum.aksi.daftarGratis}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
