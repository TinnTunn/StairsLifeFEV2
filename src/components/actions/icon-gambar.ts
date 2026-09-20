// Peta nama ikon ke berkas gambar milik merek.

import type { LucideName } from "./icon-registry";

export interface IkonGambar {
  src: string;
  cadangan: LucideName;
  min?: number;
  maks?: number;
}

export const IKON_GAMBAR = {
  Terverifikasi: { src: "/assets/ikon/icons8/terverifikasi-64.png", cadangan: "BadgeCheck" },
  Gembok: { src: "/assets/ikon/icons8/gembok-48.png", cadangan: "Lock" },
  Kontrak: { src: "/assets/ikon/icons8/kontrak-30.png", cadangan: "FileText", maks: 24 },
  Komentar: { src: "/assets/ikon/icons8/komentar-48.png", cadangan: "MessageSquare", min: 20 },
  Bintang: { src: "/assets/ikon/icons8/bintang-48.png", cadangan: "Star", min: 20 },
  Dompet: { src: "/assets/ikon/icons8/dompet-64.png", cadangan: "Wallet", min: 16 },
  Terang: { src: "/assets/ikon/icons8/terang-50.png", cadangan: "Sun", min: 16 },
  Gelap: { src: "/assets/ikon/icons8/gelap-50.png", cadangan: "Moon", min: 16 },
  Kembali: { src: "/assets/ikon/icons8/kembali-50.png", cadangan: "ArrowLeft", min: 14 },
} as const satisfies Record<string, IkonGambar>;

export type NamaIkonGambar = keyof typeof IKON_GAMBAR;

export const ALIAS_GAMBAR: Partial<Record<LucideName, NamaIkonGambar>> = {
  ArrowLeft: "Kembali",
  BadgeCheck: "Terverifikasi",
  Lock: "Gembok",
  Wallet: "Dompet",
  MessageSquare: "Komentar",
};
