import * as React from "react";

export interface DonutSlice {
  label: string;
  value: number;
  /** Warna irisan — ambil dari token status/semantik, jangan warna baru. */
  color: string;
}

/** Donut proporsi: komposisi antrean moderasi, hasil putusan sengketa. Khusus admin. */
export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  /** Teks kecil di bawah angka tengah. */
  centerLabel?: string;
  /** Angka besar di tengah donut. */
  centerValue?: string;
}

export declare function DonutChart(props: DonutChartProps): JSX.Element;
