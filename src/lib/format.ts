// Pemformat rupiah, tanggal, dan pemisah ribuan.

import { LOCALE, type Bahasa } from "@/i18n/jenis";

const BULAN: Record<Bahasa, string[]> = {
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export function formatRupiah(
  value: number | string,
  { withPrefix = true, sign = false }: { withPrefix?: boolean; sign?: boolean } = {},
): string {
  const num = Number(value) || 0;
  const body = Math.abs(num).toLocaleString("id-ID", { maximumFractionDigits: 0 });
  const prefix = sign ? (num < 0 ? "− " : "+ ") : "";
  return prefix + (withPrefix ? "Rp " : "") + body;
}

export function pisahRibuan(nilai: string | number): string {
  const digit = String(nilai ?? "").replace(/\D/g, "");
  if (!digit) return "";
  return digit.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatTanggal(value: string | Date, bahasa: Bahasa = "id"): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${BULAN[bahasa][d.getMonth()]} ${d.getFullYear()}`;
}

export function formatJam(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatTanggalJam(value: string | Date, bahasa: Bahasa = "id"): string {
  const tanggal = formatTanggal(value, bahasa);
  return tanggal ? `${tanggal}, ${formatJam(value)}` : "";
}

export function formatDesimal(value: number | string, digit = 1, bahasa: Bahasa = "id"): string {
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString(LOCALE[bahasa], { minimumFractionDigits: digit, maximumFractionDigits: digit });
}

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
