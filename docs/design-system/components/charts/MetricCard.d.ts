import * as React from "react";

/** Kartu metrik dengan tren dibanding periode sebelumnya. Khusus panel admin. */
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** Nilai siap tampil, mis. "Rp 18.450.000" atau "24,3%". */
  value: React.ReactNode;
  /** Angka persen (positif = naik) atau string seperti "+12%". */
  delta?: number | string;
  /** Default "dari bulan lalu". */
  deltaLabel?: string;
  icon?: React.ReactNode;
  iconTone?: "primary" | "success" | "warning" | "neutral";
  /**
   * Balik arti tren: dipakai saat angka TURUN berarti kabar baik
   * (sengketa terbuka, waktu tanggap, tingkat pembatalan). Panah tetap
   * mengikuti arah aslinya, hanya warnanya yang mengikuti makna.
   */
  invertDelta?: boolean;
  /** Paksa warna tren tanpa peduli arah. "neutral" untuk metrik tanpa nilai baik/buruk. */
  deltaTone?: "success" | "danger" | "neutral";
}

export declare function MetricCard(props: MetricCardProps): JSX.Element;
