// Penyusun label rentang anggaran proyek.

import { formatRupiah } from "./format";
import type { Project } from "./types";

export function labelAnggaran(
  project: Pick<Project, "budget_min" | "budget_max">,
  k: { anggaranSampai: string; anggaranMulai: string; anggaranKosong: string },
): string {
  const { budget_min: min, budget_max: max } = project;
  if (min && max && min !== max) return `${formatRupiah(min)} ${k.anggaranSampai} ${formatRupiah(max)}`;
  if (max) return formatRupiah(max);
  if (min) return `${k.anggaranMulai} ${formatRupiah(min)}`;
  return k.anggaranKosong;
}
