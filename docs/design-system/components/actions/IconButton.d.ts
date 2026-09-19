import * as React from "react";

/**
 * Tombol khusus ikon — aksi di baris tabel, tutup modal, toolbar chat.
 * `label` wajib: dipakai sebagai aria-label dan tooltip.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Deskripsi aksi untuk pembaca layar. Wajib. */
  label: string;
  variant?: "ghost" | "outline" | "solid" | "danger";
  /**
   * sm 36 · md 44 · lg 52 — sama dengan `Button`.
   * md adalah default sekaligus ambang sentuh WCAG AA (44px), jadi tidak perlu
   * mengingat ukuran khusus untuk area sentuh. `sm` (36px) hanya untuk baris
   * tabel padat dan toolbar desktop, bukan navigasi utama di mobile.
   */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export declare function IconButton(props: IconButtonProps): JSX.Element;
