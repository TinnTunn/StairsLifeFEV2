import * as React from "react";

/**
 * Tempat gambar yang belum terisi — portofolio, logo bisnis, foto KTM,
 * kode QRIS, bukti transfer, pratinjau CV. Ikon besar di dalam bulatan
 * terang plus satu baris ramah, bukan kotak bergaris putus-putus yang
 * terlihat seperti gambar gagal dimuat.
 */
export interface MediaSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glyph Lucide, ukuran mengikuti `size`. */
  icon?: React.ReactNode;
  /** Satu frasa: apa yang seharusnya ada di sini. */
  label?: React.ReactNode;
  /** Satu baris penjelas — syarat berkas atau apa yang perlu dicocokkan. */
  hint?: React.ReactNode;
  /** Tombol unggah atau aksi lain, dirender di bawah hint. */
  action?: React.ReactNode;
  /** CSS aspect-ratio. Default "4 / 3"; pakai "1 / 1" untuk QRIS, "1 / 1.2" untuk CV. */
  ratio?: string;
  size?: "sm" | "md" | "lg";
  /** primary saat slot ini yang sedang diminta diisi. Default neutral. */
  tone?: "neutral" | "primary";
}

export declare function MediaSlot(props: MediaSlotProps): JSX.Element;
