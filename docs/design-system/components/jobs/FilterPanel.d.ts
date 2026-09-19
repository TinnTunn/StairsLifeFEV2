import * as React from "react";

export interface FilterOption {
  value?: string;
  label?: string;
  /** Jumlah hasil untuk opsi ini, ditampilkan di kanan. */
  count?: number;
}

export interface FilterGroup {
  key: string;
  label: string;
  /** String polos juga diterima sebagai opsi. */
  options: (FilterOption | string)[];
  /** Pilih banyak (checkbox) alih-alih satu (radio). */
  multi?: boolean;
  /** Paksa satu kolom untuk label panjang. Default: dua kolom otomatis. */
  columns?: 1 | 2;
}

/**
 * Panel filter — sidebar tetap di desktop, bottom sheet di mobile.
 * Filter aktif tampil sebagai chip yang bisa dihapus satu per satu, karena
 * pengguna sering lupa filter apa yang sedang menyembunyikan hasil.
 */
export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: FilterGroup[];
  /** Peta key grup → nilai terpilih (string, atau array bila multi). */
  value?: Record<string, string | string[] | undefined>;
  onChange?: (value: Record<string, string | string[] | undefined>) => void;
  onReset?: () => void;
  /** Biarkan undefined untuk mode sidebar. Isi boolean untuk mode bottom sheet. */
  open?: boolean;
  onClose?: () => void;
  /** Jumlah hasil, dipakai di label tombol bottom sheet. */
  resultCount?: number;
}

export declare function FilterPanel(props: FilterPanelProps): JSX.Element;
