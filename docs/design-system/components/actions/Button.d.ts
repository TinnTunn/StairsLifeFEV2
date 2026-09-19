import * as React from "react";

/**
 * Tombol aksi StairsLife. Empat varian: primary (satu per layar), secondary,
 * ghost, destructive. Tinggi md/lg ≥ 44px agar aman untuk sentuh.
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** primary = aksi utama (maks. 1 per layar) */
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  /** sm 36px · md 44px · lg 52px */
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  /** menampilkan spinner dan menonaktifkan klik */
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  /** jika diisi, render sebagai <a> */
  href?: string;
}

export declare function Button(props: ButtonProps): JSX.Element;
