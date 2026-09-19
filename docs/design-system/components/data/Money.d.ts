import * as React from "react";

/**
 * Nominal rupiah. Selalu tabular-nums agar kolom angka rata.
 * Format sistem: "Rp 2.500.000" — titik sebagai pemisah ribuan, spasi setelah "Rp",
 * tanpa desimal.
 */
export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Angka (diformat otomatis) atau string yang sudah diformat. */
  value: number | string;
  /** sm baris transaksi · md harga proyek · lg saldo dompet */
  size?: "sm" | "md" | "lg";
  /** in = dana masuk (hijau) · out = keluar · held = tertahan di escrow (terakota) */
  tone?: "default" | "in" | "out" | "held" | "muted";
  /** Tampilkan + / − di depan nominal. */
  sign?: boolean;
  /** Label kecil di atas nominal, mis. "Saldo tersedia". */
  label?: string;
}

export declare function Money(props: MoneyProps): JSX.Element;
export declare function formatRupiah(value: number, opts?: { withPrefix?: boolean; sign?: boolean }): string;
