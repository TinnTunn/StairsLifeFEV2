// Baca, tulis, dan hapus sesi di penyimpanan peramban.

import type { AuthUser } from "../types";

const KEY = "stairslife-session";

export interface Session {
  token: string;
  refresh_token: string;
  user: AuthUser;
}

let rawTerakhir: string | null = null;
let sesiTerakhir: Session | null = null;

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === rawTerakhir) return sesiTerakhir;
    rawTerakhir = raw;
    sesiTerakhir = raw ? (JSON.parse(raw) as Session) : null;
    return sesiTerakhir;
  } catch {
    rawTerakhir = null;
    sesiTerakhir = null;
    return null;
  }
}

export function writeSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
    window.dispatchEvent(new Event("stairslife-session-change"));
  } catch {
    /* Mode privat memblokir penyimpanan. Sesi tetap berlaku sampai tab ditutup. */
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("stairslife-session-change"));
  } catch {
    /* abaikan */
  }
}

let prosesKeluar = false;

export function tandaiKeluar(aktif: boolean): void {
  prosesKeluar = aktif;
}

export function sedangKeluar(): boolean {
  return prosesKeluar;
}

let prosesMasuk = false;

export function tandaiMasuk(aktif: boolean): void {
  prosesMasuk = aktif;
}

export function sedangMasuk(): boolean {
  return prosesMasuk;
}

const KUNCI_BERAKHIR = "stairslife-sesi-berakhir";

export function tandaiSesiBerakhir(): void {
  try {
    window.sessionStorage.setItem(KUNCI_BERAKHIR, "1");
  } catch {
    /* Penyimpanan diblokir: pesannya hilang, alurnya tetap jalan. */
  }
}

export function ambilSesiBerakhir(): boolean {
  try {
    const ada = window.sessionStorage.getItem(KUNCI_BERAKHIR) === "1";
    if (ada) window.sessionStorage.removeItem(KUNCI_BERAKHIR);
    return ada;
  } catch {
    return false;
  }
}
