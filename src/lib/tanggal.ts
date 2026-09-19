/* Tanggal kalender tanpa jam, disimpan sebagai "YYYY-MM-DD" (format yang sama
   dengan <input type="date">), dihitung di zona waktu lokal supaya tidak
   bergeser sehari di sekitar tengah malam WIB. */

export function keIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const h = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${h}`;
}

export function dariIso(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1 ? null : d;
}

export function tambahHari(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function tambahBulan(d: Date, n: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const hariTerakhir = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), hariTerakhir));
}

export function hariIni(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/**
 * Enam minggu (42 sel) untuk bulan yang memuat `bulan`, dimulai hari Senin,
 * konvensi kalender Indonesia dan Inggris-Britania.
 */
export function selKalender(bulan: Date): Date[] {
  const awal = new Date(bulan.getFullYear(), bulan.getMonth(), 1);
  const geser = (awal.getDay() + 6) % 7;
  const mulai = tambahHari(awal, -geser);
  return Array.from({ length: 42 }, (_, i) => tambahHari(mulai, i));
}

export function samaHari(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && keIso(a) === keIso(b);
}

export function dalamBatas(d: Date, min?: string, max?: string): boolean {
  const iso = keIso(d);
  return (!min || iso >= min) && (!max || iso <= max);
}
