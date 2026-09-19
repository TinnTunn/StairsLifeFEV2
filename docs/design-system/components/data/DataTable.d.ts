import * as React from "react";

export interface TableColumn<T = any> {
  key: string;
  header: React.ReactNode;
  /** Angka: rata kanan + tabular-nums. Wajib untuk nominal & tanggal. */
  numeric?: boolean;
  align?: "left" | "center" | "right";
  width?: string | number;
  /**
   * Perbolehkan isi sel membungkus ke beberapa baris. Default false (nowrap) —
   * tanggal, nominal, dan status tidak boleh terpecah di tengah nilai. Pakai
   * `true` hanya untuk kolom prosa seperti judul proyek atau alasan penolakan.
   */
  wrap?: boolean;
  render?: (row: T) => React.ReactNode;
}

/**
 * Tabel data untuk riwayat pembayaran, daftar kontrak, dan panel admin.
 * Header sticky, kepadatan "nyaman" (baris 52px) atau `dense` (44px).

 */
export interface DataTableProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  rows: T[];
  onRowClick?: (row: T, index: number) => void;
  /** Teks saat tidak ada baris. Default "Belum ada data." */
  empty?: React.ReactNode;
  dense?: boolean;
  stickyHeader?: boolean;
}

export declare function DataTable<T = any>(props: DataTableProps<T>): JSX.Element;
