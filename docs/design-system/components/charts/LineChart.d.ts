import * as React from "react";

export interface ChartPoint {
  /** Label sumbu X, mis. "Jun" atau "12 Sep". */
  label: string;
  value: number;
}

/**
 * Grafik garis + area untuk panel admin (aliran dana, kontrak per bulan).
 * Digambar sebagai SVG polos: tanpa gradasi, satu warna garis, kisi hairline.
 * Khusus admin — layar mahasiswa/bisnis cukup dengan angka dan status.
 */
export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartPoint[];
  height?: number;
  /** Format label sumbu Y, mis. (v) => (v / 1e6).toFixed(0) + " jt". */
  valueFormat?: (value: number) => string;
  yTicks?: number;
  tone?: "primary" | "success" | "muted";
  showArea?: boolean;
}

export declare function LineChart(props: LineChartProps): JSX.Element | null;
