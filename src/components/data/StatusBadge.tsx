"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { Kamus } from "@/i18n/kamus";
import styles from "./StatusBadge.module.css";

type Family =
  | "draft"
  | "aktif"
  | "menunggu"
  | "escrow"
  | "dikerjakan"
  | "review"
  | "selesai"
  | "sengketa"
  | "ditolak"
  | "dilihat"
  | "seleksi"
  | "suspend";

export type StatusKey = keyof Kamus["komponen"]["status"];

/** Keluarga warna setiap status. Labelnya ada di kamus (t.komponen.status). */
const FAMILY: Record<StatusKey, Family> = {
  draft: "draft",
  aktif: "aktif",
  menunggu_pembayaran: "menunggu",
  escrow_ditahan: "escrow",
  dikerjakan: "dikerjakan",
  menunggu_review: "review",
  selesai: "selesai",
  sengketa: "sengketa",
  ditolak: "ditolak",
  menunggu_review_lowongan: "menunggu",
  ditolak_admin: "sengketa",
  ditutup: "draft",
  kedaluwarsa: "dilihat",
  terkirim: "dikerjakan",
  dilihat: "dilihat",
  seleksi: "seleksi",
  diterima: "selesai",
  dibatalkan: "draft",
  belum_diajukan: "draft",
  terverifikasi: "aktif",
  disuspend: "suspend",
  menunggu_konfirmasi: "seleksi",
  lunas: "selesai",
  gagal: "sengketa",
  dikembalikan: "draft",
  dibagi_sebagian: "escrow",
};

export interface StatusBadgeProps extends ComponentPropsWithoutRef<"span"> {
  status: string;
  /** Menimpa label bawaan. Warnanya tetap mengikuti status. */
  label?: string;
  size?: "sm" | "md";
}

function isStatusKey(s: string): s is StatusKey {
  return s in FAMILY;
}

/**
 * Label status berbentuk kotak bersudut lembut.
 *
 * Tanpa titik warna dan tanpa bentuk pil: titik kecil berwarna adalah bahasa
 * lampu indikator ("sedang menyala sekarang"), padahal status di sini adalah
 * keterangan keadaan, dan warnanya sudah dibawa latar serta teksnya.
 */
export function StatusBadge({ status, label, size = "md", className, ...rest }: StatusBadgeProps) {
  const { t } = useBahasa();
  const key: StatusKey = isStatusKey(status) ? status : "draft";
  return (
    <span
      {...rest}
      className={[styles.badge, styles[FAMILY[key]], size === "sm" ? styles.sm : "", className].filter(Boolean).join(" ")}
    >
      {label ?? t.komponen.status[key]}
    </span>
  );
}
