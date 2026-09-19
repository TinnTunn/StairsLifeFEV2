import type { LucideName } from "./icon-registry";

/**
 * Ikon PNG monokrom dari Icons8 yang dipilih pemilik produk
 * (public/assets/ikon/icons8). Dirender sebagai mask CSS berwarna
 * currentColor, jadi ikut warna teks, status, dan tema gelap seperti ikon
 * Lucide.
 *
 * Sumbernya bitmap kecil (30 sampai 64px), jadi tidak tajam di semua ukuran.
 * Batas di bawah diambil dari simulasi di layar 2x: di luar batas itu ikon
 * jatuh ke padanan Lucide-nya supaya tidak buram atau garisnya tidak menyatu.
 *
 * Lisensi gratis Icons8 mewajibkan tautan atribusi; tautannya ada di footer
 * publik (PublicFooter).
 */
export interface IkonGambar {
  src: string;
  /** Padanan Lucide untuk ukuran di luar batas. */
  cadangan: LucideName;
  /** Ukuran CSS terkecil yang masih terbaca. */
  min?: number;
  /** Ukuran CSS terbesar sebelum bitmapnya buram. */
  maks?: number;
}

export const IKON_GAMBAR = {
  /** 64px: tajam di semua ukuran yang dipakai (sampai 36px). */
  Terverifikasi: { src: "/assets/ikon/icons8/terverifikasi-64.png", cadangan: "BadgeCheck" },
  /** 48px: tajam sampai 36px. */
  Gembok: { src: "/assets/ikon/icons8/gembok-48.png", cadangan: "Lock" },
  /** 30px: lembut di atas 24px, jadi empty state 28px ke atas memakai Lucide. */
  Kontrak: { src: "/assets/ikon/icons8/kontrak-30.png", cadangan: "FileText", maks: 24 },
  /** 50px, garis tipis: garis dalamnya menyatu di bawah 20px. */
  Komentar: { src: "/assets/ikon/icons8/komentar-50.png", cadangan: "MessageSquare", min: 20 },
  /** 50px: tiga bintang kecil tidak terbaca di bawah 20px. */
  Level: { src: "/assets/ikon/icons8/level-50.png", cadangan: "Star", min: 20 },
  /** 64px, garis tipis: terlalu tipis di bawah 16px. */
  Dompet: { src: "/assets/ikon/icons8/dompet-64.png", cadangan: "Wallet", min: 16 },
  /** 50px, hanya satu garis sudut: tetap terbaca sampai 14px. */
  Kembali: { src: "/assets/ikon/icons8/kembali-50.png", cadangan: "ArrowLeft", min: 14 },
} as const satisfies Record<string, IkonGambar>;

export type NamaIkonGambar = keyof typeof IKON_GAMBAR;

/**
 * Nama Lucide yang maknanya selalu sama dengan ikon PNG, di mana pun
 * dipakai, jadi otomatis diganti. FileText dan Star tidak ada di sini karena
 * juga berarti "berkas" dan "rating"; pemakaian yang berarti kontrak dan tingkat
 * memanggil Kontrak dan Level secara eksplisit.
 */
export const ALIAS_GAMBAR: Partial<Record<LucideName, NamaIkonGambar>> = {
  ArrowLeft: "Kembali",
  BadgeCheck: "Terverifikasi",
  Lock: "Gembok",
  Wallet: "Dompet",
  MessageSquare: "Komentar",
};
