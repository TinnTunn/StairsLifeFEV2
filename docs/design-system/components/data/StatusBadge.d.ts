import * as React from "react";

/** Siklus proyek/kontrak escrow. */
export type ProjectStatus =
  | "draft" | "aktif" | "menunggu_pembayaran" | "escrow_ditahan"
  | "dikerjakan" | "menunggu_review" | "selesai" | "sengketa" | "ditolak";

/** Siklus lowongan (PAGES_AND_FLOWS §3). */
export type JobStatus =
  | "draft" | "menunggu_moderasi" | "aktif" | "ditolak_admin" | "ditutup" | "kedaluwarsa";

/** Siklus lamaran. */
export type ApplicationStatus =
  | "terkirim" | "dilihat" | "seleksi" | "diterima" | "ditolak" | "dibatalkan";

/** Siklus verifikasi akun. */
export type VerificationStatus =
  | "belum_diajukan" | "menunggu_verifikasi" | "terverifikasi" | "verifikasi_ditolak" | "disuspend";

/** Siklus pembayaran QRIS. */
export type PaymentStatus =
  | "menunggu_pembayaran" | "menunggu_konfirmasi" | "lunas" | "gagal";

export type AnyStatus = ProjectStatus | JobStatus | ApplicationStatus | VerificationStatus | PaymentStatus;

/**
 * Badge status siklus proyek/kontrak. Warna dan label berasal dari satu peta
 * (STATUS) agar status yang sama selalu tampil sama di seluruh produk.
 */
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: AnyStatus;
  /** Ganti label default (jarang perlu). */
  label?: string;
  size?: "sm" | "md";
}

/** Label netral non-status: keahlian, kategori, tag proyek. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  tone?: "neutral" | "primary" | "outline";
  size?: "sm" | "md";
  /** Jika diisi, muncul tombol × (filter aktif). */
  onRemove?: () => void;
}

export declare function StatusBadge(props: StatusBadgeProps): JSX.Element;
export declare function Tag(props: TagProps): JSX.Element;
export declare const STATUS: Record<AnyStatus, { label: string; bg: string; fg: string }>;
