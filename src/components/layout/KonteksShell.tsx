// Konteks shell dan komponen Halaman yang mengisi judul tiap rute.

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Session } from "@/lib/api/session";
import styles from "./AppShell.module.css";

export interface NilaiShell {
  session: Session;
  slotJudul: HTMLElement | null;
  slotAksi: HTMLElement | null;
}

export const KonteksShell = createContext<NilaiShell | null>(null);

function useShell(): NilaiShell {
  const nilai = useContext(KonteksShell);
  if (!nilai) throw new Error("Halaman aplikasi harus dirender di dalam layout (aplikasi).");
  return nilai;
}

export function useSesiShell(): Session {
  return useShell().session;
}

export interface HalamanProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode | ((session: Session) => ReactNode);
}

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
      {slotAksi && actions ? createPortal(<span className={styles.aksiLebar}>{actions}</span>, slotAksi) : null}
      {actions ? <div className={styles.aksiSempit}>{actions}</div> : null}
      {typeof children === "function" ? children(session) : children}
    </>
  );
}
