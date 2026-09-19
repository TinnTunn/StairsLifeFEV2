import * as React from "react";

/**
 * Wadah dasar. Default: putih, garis 1px, radius 12px, TANPA shadow.
 * Shadow hanya saat `raised` (mengapung di atas konten lain).
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  as?: "div" | "article" | "a" | "li" | "section";
  padding?: "none" | "sm" | "md" | "lg";
  /** Hover: naik 1px + garis menguat. Pakai untuk kartu yang bisa diklik. */
  interactive?: boolean;
  /** Garis terakota — kartu yang sedang dipilih. */
  selected?: boolean;
  raised?: boolean;
  /** Baris atas (judul + aksi), di luar padding utama. */
  header?: React.ReactNode;
  /** Baris bawah berlatar pasir — biasanya berisi tombol. */
  footer?: React.ReactNode;
}

export declare function Card(props: CardProps): JSX.Element;
