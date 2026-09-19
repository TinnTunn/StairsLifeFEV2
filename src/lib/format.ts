/* Format angka, uang, dan tanggal StairsLife. Semua tampilan uang dan tanggal
   melewati berkas ini supaya satu perubahan aturan tidak perlu dikejar ke
   puluhan layar. Tanggal dan desimal mengikuti bahasa antarmuka; rupiah
   selalu memakai titik ribuan karena itu konvensi mata uangnya, bukan bahasa. */

import { LOCALE, type Bahasa } from "@/i18n/jenis";

const BULAN: Record<Bahasa, string[]> = {
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** "Rp 2.500.000". Spasi setelah Rp, titik ribuan, tanpa desimal. */
export function formatRupiah(
  value: number | string,
  { withPrefix = true, sign = false }: { withPrefix?: boolean; sign?: boolean } = {},
): string {
  const num = Number(value) || 0;
  const body = Math.abs(num).toLocaleString("id-ID", { maximumFractionDigits: 0 });
  /* Minus memakai U+2212, bukan tanda hubung: di angka tabular tanda hubung
     terbaca terlalu pendek dan mudah tertukar dengan sengkang. */
  const prefix = sign ? (num < 0 ? "− " : "+ ") : "";
  return prefix + (withPrefix ? "Rp " : "") + body;
}

/** "50000" jadi "50.000". Untuk kolom isian, jadi yang diketik tetap angka
    mentah sementara yang terbaca sudah berkelompok ribuan. Nilai bukan angka
    dibuang, bukan dibiarkan lewat, supaya kolom nominal tidak pernah berisi
    huruf. */
export function pisahRibuan(nilai: string | number): string {
  const digit = String(nilai ?? "").replace(/\D/g, "");
  if (!digit) return "";
  return digit.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** "12 Sep 2026". */
export function formatTanggal(value: string | Date, bahasa: Bahasa = "id"): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${BULAN[bahasa][d.getMonth()]} ${d.getFullYear()}`;
}

/** "14:32". */
export function formatJam(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** "12 Sep 2026, 14:32". Dipakai di mutasi dompet dan log yang butuh menit. */
export function formatTanggalJam(value: string | Date, bahasa: Bahasa = "id"): string {
  const tanggal = formatTanggal(value, bahasa);
  return tanggal ? `${tanggal}, ${formatJam(value)}` : "";
}

/** "4,8" dalam bahasa Indonesia, "4.8" dalam bahasa Inggris. */
export function formatDesimal(value: number | string, digit = 1, bahasa: Bahasa = "id"): string {
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString(LOCALE[bahasa], { minimumFractionDigits: digit, maximumFractionDigits: digit });
}

/**
 * "5 menit lalu", "kemarin". Di atas 7 hari jatuh ke tanggal biasa, karena
 * "23 hari lalu" lebih sulit ditempatkan daripada tanggalnya.
 */
export function formatWaktuRelatif(value: string | Date, bahasa: Bahasa = "id", sekarang: Date = new Date()): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const detik = Math.round((d.getTime() - sekarang.getTime()) / 1000);
  const abs = Math.abs(detik);
  const rtf = new Intl.RelativeTimeFormat(LOCALE[bahasa], { numeric: "auto" });
  if (abs < 60) return rtf.format(0, "second");
  if (abs < 3600) return rtf.format(Math.round(detik / 60), "minute");
  if (abs < 86_400) return rtf.format(Math.round(detik / 3600), "hour");
  if (abs < 7 * 86_400) return rtf.format(Math.round(detik / 86_400), "day");
  return formatTanggal(d, bahasa);
}
