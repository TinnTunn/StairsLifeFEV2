import * as React from "react";

/**
 * Kolom teks lengkap dengan label, hint, dan pesan error dalam satu komponen.
 * Label selalu di atas kolom (tidak pernah floating). Error mengganti hint.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  /** Teks bantuan di bawah kolom. Disembunyikan saat ada error. */
  hint?: string;
  /** Pesan error dalam bahasa Indonesia, kalimat utuh, tanpa menyalahkan. */
  error?: string;
  size?: "sm" | "md" | "lg";
  /** Awalan statis di dalam kolom, mis. "Rp". */
  prefix?: React.ReactNode;
  /** Akhiran statis, mis. "hari" atau "IDR". */
  suffix?: React.ReactNode;
  iconLeft?: React.ReactNode;
  /** Angka: tabular-nums, rata kanan, inputMode numeric. Untuk nominal & rekening. */
  numeric?: boolean;
  required?: boolean;
}

export declare function Input(props: InputProps): JSX.Element;
