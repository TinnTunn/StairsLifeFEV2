"use client";

import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Session } from "@/lib/api/session";
import styles from "./AppShell.module.css";

export interface NilaiShell {
  session: Session;
  /** Slot judul di topbar. null sampai shell selesai dipasang. */
  slotJudul: HTMLElement | null;
  /** Slot aksi di topbar, sebelum pengganti bahasa dan tema. */
  slotAksi: HTMLElement | null;
}

export const KonteksShell = createContext<NilaiShell | null>(null);

function useShell(): NilaiShell {
  const nilai = useContext(KonteksShell);
  if (!nilai) throw new Error("Halaman aplikasi harus dirender di dalam layout (aplikasi).");
  return nilai;
}

/** Sesi yang sudah dipastikan ada oleh layout (aplikasi). */
export function useSesiShell(): Session {
  return useShell().session;
}

export interface HalamanProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode | ((session: Session) => ReactNode);
}

/**
 * Isi satu halaman di dalam shell aplikasi.
 *
 * Shell (sidebar, topbar, bottom nav) dipasang sekali di layout (aplikasi) dan
 * tetap hidup saat berpindah halaman. Dulu setiap halaman memasang shell-nya
 * sendiri, sehingga sidebar dibongkar, animasinya diulang, dan posisi gulir
 * hilang setiap kali tautan diklik. Judul dan aksi halaman dikirim ke topbar
 * lewat portal, jadi halaman tetap menentukan isinya sendiri.
 */
export function Halaman({ title, subtitle, actions, children }: HalamanProps) {
  const { session, slotJudul, slotAksi } = useShell();

  return (
    <>
      {slotJudul
        ? createPortal(
            <>
              <h1 className={styles.title}>{title}</h1>
              {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
            </>,
            slotJudul,
          )
        : null}
      {/* Di layar lebar aksi halaman duduk di topbar. Di bawah 640px topbar
          hanya muat menu, logo, judul, dan lonceng, jadi aksinya pindah ke
          atas isi halaman. Salinan yang tidak tampil disembunyikan dengan
          display none, sehingga pembaca layar hanya menemui satu. */}
      {slotAksi && actions ? createPortal(<span className={styles.aksiLebar}>{actions}</span>, slotAksi) : null}
      {actions ? <div className={styles.aksiSempit}>{actions}</div> : null}
      {typeof children === "function" ? children(session) : children}
    </>
  );
}
