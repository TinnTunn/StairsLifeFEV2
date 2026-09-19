import * as React from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** Angka di sebelah label, mis. jumlah lamaran. */
  count?: number;
  icon?: React.ReactNode;
}

/**
 * Tab. `underline` untuk navigasi utama dalam halaman; `pill` untuk filter
 * kecil di dalam kartu. Tinggi underline 44px agar aman disentuh.
 */
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "underline" | "pill";
  fullWidth?: boolean;
}

export declare function Tabs(props: TabsProps): JSX.Element;
