import * as React from "react";

/**
 * Kolom pencarian yang melebar. Keadaan tertutup berupa satu pill; saat diklik
 * atau difokuskan, ikon terlepas menjadi tombol bulat dan kolomnya melebar —
 * sambungan antar bentuk memakai filter gooey pada lapisan latar, sehingga
 * teks dan ikon tetap tajam. Ini SATU-SATUNYA komponen bentuk pill di sistem
 * (pengecualian yang disepakati); semua kontrol lain memakai radius 8px.
 */
export interface SearchFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Enter atau klik ikon saat sudah terbuka. */
  onSubmit?: (value: string) => void;
  onExpandChange?: (open: boolean) => void;
  /** md 44px · lg 52px */
  size?: "md" | "lg";
  /** Lebar saat tertutup (diabaikan bila fullWidth). Default 216. */
  collapsedWidth?: number;
  /** Lebar saat terbuka (diabaikan bila fullWidth). Default 380. */
  expandedWidth?: number;
  /** Mengisi lebar induk; animasi hanya memisahkan ikon dari kolom. */
  fullWidth?: boolean;
  /** Matikan efek gooey (tetap ada animasi lebar). Default true. */
  gooey?: boolean;
  /** aria-label kolom & tombol. Default "Cari". */
  label?: string;
  /** Menutup kembali saat blur bila kolom kosong. Default true. */
  autoCollapse?: boolean;
}

export declare function SearchField(props: SearchFieldProps): JSX.Element;
