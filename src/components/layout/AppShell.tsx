"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon } from "../actions/Icon";
import { IconButton } from "../actions/IconButton";
import { Avatar } from "../data/Avatar";
import { Logo } from "../brand/Logo";
import { BottomNav } from "../navigation/BottomNav";
import { Sidebar, type NavItem, type SidebarEntry } from "../navigation/Sidebar";
import { LanguageToggle } from "../LanguageToggle";
import { ThemeToggle } from "../ThemeToggle";
import type { Session } from "@/lib/api/session";
import { useKeluar } from "./KeluarProvider";
import { useKelolaGulir } from "@/lib/gulir";
import { KonteksShell } from "./KonteksShell";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  session: Session;
  sidebar: SidebarEntry[];
  /** Maksimal 5 tujuan utama. Sisanya tetap terjangkau lewat drawer sidebar. */
  bottom: NavItem[];
  /** Isi di kanan judul topbar yang milik shell, bukan halaman (mis. lonceng). */
  topbarExtra?: ReactNode;
  children: ReactNode;
}

export function AppShell({ session, sidebar, bottom, topbarExtra, children }: AppShellProps) {
  const pathname = usePathname();
  const { t } = useBahasa();
  /* Drawer dicatat terbuka untuk rute tertentu. Begitu rute berpindah, termasuk
     lewat tautan di dalam drawer, ia otomatis tertutup tanpa efek tambahan. */
  const [menuDi, setMenuDi] = useState<string | null>(null);
  const menu = menuDi === pathname;
  const setMenu = (buka: boolean) => setMenuDi(buka ? pathname : null);
  const role = session.user.role;
  const konten = useRef<HTMLElement>(null);
  /* Slot disimpan sebagai state (bukan ref) supaya halaman dirender ulang
     begitu elemennya tersedia dan portal judulnya bisa dipasang. */
  const [slotJudul, setSlotJudul] = useState<HTMLElement | null>(null);
  const [slotAksi, setSlotAksi] = useState<HTMLElement | null>(null);
  /* Isi aplikasi bergulir di dalam main, bukan jendela, jadi posisinya dikelola sendiri. */
  useKelolaGulir(konten);

  /* Navigasi klien tidak memindahkan fokus: tanpa ini, pengguna keyboard tetap
     tertinggal di tautan sidebar yang tadi ditekan dan pembaca layar tidak
     diberi tahu halamannya sudah berganti. Muat pertama dilewati supaya fokus
     tidak direbut dari awal halaman. preventScroll dipakai karena posisi gulir
     sudah diatur useKelolaGulir. */
  const muatPertama = useRef(true);
  useEffect(() => {
    if (muatPertama.current) {
      muatPertama.current = false;
      return;
    }
    konten.current?.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const tutup = (e: KeyboardEvent) => e.key === "Escape" && setMenuDi(null);
    window.addEventListener("keydown", tutup);
    return () => window.removeEventListener("keydown", tutup);
  }, [menu]);

  const { keluar: keluarAkun } = useKeluar();

  function keluar() {
    setMenuDi(null);
    keluarAkun(session.user.full_name);
  }

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={styles.scrim}
        data-open={String(menu)}
        onClick={() => setMenu(false)}
        aria-label={t.navigasi.aplikasi.tutupMenu}
        tabIndex={menu ? 0 : -1}
      />

      <div className={styles.side} data-open={String(menu)}>
        <Sidebar
          role={t.umum.peran[role]}
          items={sidebar}
          brand={
            /* Bukan tautan: di dalam aplikasi, satu-satunya jalan keluar adalah
               tombol keluar di bawah. Logo yang bisa ditekan membawa orang ke
               halaman pemasaran dan terasa seperti tersesat dari akunnya. */
            <span aria-label={t.navigasi.header.logoLabel} className={styles.brandLink}>
              <Logo size={22} />
            </span>
          }
          footer={
            <>
              {/* Di layar sempit pilihan bahasa dan tema pindah ke sini agar topbar tidak sesak. */}
              <div className={styles.prefs}>
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <div className={styles.userCard}>
                {/* Tanda verifikasi hanya untuk mahasiswa: bisnis selalu is_verified true sejak daftar. */}
                <Avatar
                  name={session.user.full_name}
                  src={session.user.avatar_url}
                  size="sm"
                  verified={session.user.role === "mahasiswa" && session.user.is_verified}
                />
                <span className={styles.userText}>
                  <b className={styles.userName}>{session.user.full_name}</b>
                  <span className={styles.userEmail}>{session.user.email}</span>
                </span>
                <span className={styles.logout}>
                  <IconButton label={t.navigasi.aplikasi.keluar} onClick={keluar}>
                    <Icon name="LogOut" size={18} />
                  </IconButton>
                </span>
              </div>
            </>
          }
        />
      </div>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.menuButton}>
            <IconButton label={t.navigasi.aplikasi.bukaMenu} aria-expanded={menu} onClick={() => setMenu(true)}>
              <Icon name="Menu" />
            </IconButton>
          </span>
          <span className={styles.brandMobile}>
            <Logo size={22} wordmark={false} />
          </span>
          <div className={styles.titles} ref={setSlotJudul} />
          <div className={styles.topActions}>
            <span className={styles.slotAksi} ref={setSlotAksi} />
            {topbarExtra}
            <span className={styles.topPrefs}>
              <LanguageToggle />
              <ThemeToggle />
            </span>
          </div>
        </header>

        <main ref={konten} className={styles.content} id="konten" tabIndex={-1}>
          <KonteksShell.Provider value={{ session, slotJudul, slotAksi }}>
            <div className={styles.inner}>{children}</div>
          </KonteksShell.Provider>
        </main>
      </div>

      <div className={styles.bottomNav}>
        <BottomNav items={bottom} />
      </div>
    </div>
  );
}
