import type { AuthUser } from "../types";

/* Sesi hidup di localStorage, bukan cookie, karena backend memakai Bearer token
   murni dan tidak pernah menyetel cookie. Konsekuensinya sudah disengaja:
   halaman yang butuh token dirender di klien, dan halaman publik (yang memang
   tanpa guard di backend) dirender di server tanpa token sama sekali. */

const KEY = "stairslife-session";

export interface Session {
  token: string;
  refresh_token: string;
  user: AuthUser;
}

/* Snapshot di-cache berdasarkan string mentahnya.
   readSession dipakai sebagai getSnapshot useSyncExternalStore, yang
   membandingkan hasil berurutan dengan Object.is. Tanpa cache ini setiap
   panggilan mengembalikan objek hasil JSON.parse yang baru, snapshot dianggap
   selalu berubah, dan React masuk ke render loop tak berujung. */
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

/* Penanda proses keluar yang sedang berjalan. Penjaga rute memeriksanya supaya
   tidak melempar ke /masuk?lanjut=... saat sesi dihapus dengan sengaja; tujuan
   setelah keluar adalah beranda. */
let prosesKeluar = false;

export function tandaiKeluar(aktif: boolean): void {
  prosesKeluar = aktif;
}

export function sedangKeluar(): boolean {
  return prosesKeluar;
}

/* Penanda proses masuk atau daftar. Formulir yang menulis sesi juga yang
   mengarahkan (termasuk ke ?lanjut=), jadi pengalih "sudah masuk" di halaman
   auth menunggu, bukan balapan ke beranda peran. */
let prosesMasuk = false;

export function tandaiMasuk(aktif: boolean): void {
  prosesMasuk = aktif;
}

export function sedangMasuk(): boolean {
  return prosesMasuk;
}

/* Sesi yang ditolak server ditandai supaya halaman masuk bisa menjelaskan
   kenapa pengguna tiba-tiba ada di sana. Disimpan di sessionStorage, bukan
   memori modul, karena pengalihan ke halaman masuk bisa memuat ulang halaman. */
const KUNCI_BERAKHIR = "stairslife-sesi-berakhir";

export function tandaiSesiBerakhir(): void {
  try {
    window.sessionStorage.setItem(KUNCI_BERAKHIR, "1");
  } catch {
    /* Penyimpanan diblokir: pesannya hilang, alurnya tetap jalan. */
  }
}

/** Sekali baca: penandanya langsung dihapus supaya pesan tidak muncul lagi. */
export function ambilSesiBerakhir(): boolean {
  try {
    const ada = window.sessionStorage.getItem(KUNCI_BERAKHIR) === "1";
    if (ada) window.sessionStorage.removeItem(KUNCI_BERAKHIR);
    return ada;
  } catch {
    return false;
  }
}
