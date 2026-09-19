import * as React from "react";

export interface HowItWorksStep {
  /** Judul langkah, 2–4 kata. */
  label: string;
  /** Satu frasa di dalam kartu langkah. */
  short: React.ReactNode;
  /** Penjelasan penuh di panel bawah. */
  body: React.ReactNode;
  /** Baris tambahan opsional — biasanya jaminan atau batas waktu. */
  note?: React.ReactNode;
  /** Glyph Lucide 20–22px. */
  icon?: React.ReactNode;
  /** Elemen di sisi kanan panel, mis. kartu escrow atau nominal. */
  aside?: React.ReactNode;
}

/**
 * Penjelas alur bertahap untuk permukaan marketing. Kartu langkah bisa diklik
 * dan berjalan otomatis; bilah kemajuan menunjukkan sisa waktu. Hanya untuk
 * landing dan onboarding — layar aplikasi memakai `ContractStepper`, yang
 * menampilkan keadaan nyata, bukan penjelasan.
 */
export interface HowItWorksProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: HowItWorksStep[];
  /** Berjalan sendiri, berhenti saat kursor masuk. Default true. Otomatis mati bila pengguna meminta `prefers-reduced-motion: reduce`. */
  autoPlay?: boolean;
  /** Milidetik per langkah. Default 4200. */
  interval?: number;
  /** vertical menumpuk kartu langkah — untuk kolom sempit. */
  orientation?: "horizontal" | "vertical";
}

export declare function HowItWorks(props: HowItWorksProps): JSX.Element | null;
