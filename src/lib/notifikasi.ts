import type { Kamus } from "@/i18n/kamus";
import type { Notification } from "./types";

/**
 * Tautan notifikasi dari backend memakai rute lama berbahasa Inggris
 * (/contracts/:id, /wallet). next.config.ts juga mengalihkannya, tetapi
 * dipetakan langsung di sini supaya klik notifikasi tidak melewati satu
 * pengalihan server.
 */
const PETA: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^\/admin\/disputes\/([\w-]+)$/, (m) => `/admin/sengketa/${m[1]}`],
  [/^\/contracts\/([\w-]+)$/, (m) => `/kontrak/${m[1]}`],
  [/^\/applications\/([\w-]+)$/, (m) => `/mahasiswa/lamaran/${m[1]}`],
  [/^\/applications$/, () => "/mahasiswa/lamaran"],
  [/^\/projects\/([\w-]+)\/applications$/, (m) => `/bisnis/proyek/${m[1]}/pelamar`],
  [/^\/projects\/([\w-]+)$/, (m) => `/proyek/${m[1]}`],
  [/^\/disputes\/([\w-]+)$/, (m) => `/sengketa/${m[1]}`],
  [/^\/chat\/inquiry\/([\w-]+)$/, (m) => `/pesan/tanya/${m[1]}`],
  [/^\/wallet$/, () => "/mahasiswa/dompet"],
  [/^\/profile$/, () => "/profil"],
];

export function ruteNotifikasi(actionUrl: string | null | undefined): string | null {
  if (!actionUrl) return null;
  // Hanya jalur relatif di dalam situs; tautan eksternal tidak diikuti.
  if (!actionUrl.startsWith("/") || actionUrl.startsWith("//")) return null;
  const [jalur] = actionUrl.split(/[?#]/);
  for (const [re, ke] of PETA) {
    const m = jalur.match(re);
    if (m) return ke(m);
  }
  return jalur;
}

/**
 * Judul backend diawali emoji ("✅ Dana Cair!"). Di antarmuka jenisnya sudah
 * ditandai ikon, jadi emojinya dibuang supaya tidak menjadi dua penanda.
 */
export function bersihkanJudul(judul: string): string {
  return judul.replace(/^[\p{Extended_Pictographic}\p{Emoji_Component}️‍\s★⭐]+/u, "").trim() || judul;
}

export interface TeksNotifikasi {
  judul: string;
  isi: string | null;
}

/**
 * Isi notifikasi dibuat backend dalam bahasa Indonesia. Dalam mode Inggris,
 * judul yang dikenal diterjemahkan dan isinya diganti kalimat umum per jenis,
 * supaya satu baris tidak bercampur dua bahasa. Judul yang tidak dikenal
 * (pengumuman admin) ditampilkan apa adanya.
 */
export function teksNotifikasi(n: Notification, t: Kamus["fitur"]["notifikasi"], bahasa: "id" | "en"): TeksNotifikasi {
  const judul = bersihkanJudul(n.title);
  if (bahasa === "id") return { judul, isi: n.body };

  const pesanDari = judul.match(/^Pesan baru dari (.+)$/);
  if (pesanDari) return { judul: `New message from ${pesanDari[1]}`, isi: null };
  if (/Review Baru$/.test(judul)) return { judul: "New review", isi: t.isiUmum.review };

  const terjemahan = t.judulTerjemahan[judul];
  if (terjemahan) return { judul: terjemahan, isi: t.isiUmum[n.type] ?? null };
  return { judul, isi: n.type === "system" ? n.body : t.isiUmum[n.type] ?? n.body };
}
