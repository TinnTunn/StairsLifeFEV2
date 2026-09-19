import * as React from "react";

export interface ContractStep {
  label: string;
  /** Tanggal/waktu tahap, mis. "12 Sep 2026". Ditampilkan tabular. */
  meta?: string;
  /** Penjelasan singkat status dana pada tahap ini. */
  description?: string;
  /** Paksa nada tahap; `alert` untuk sengketa. */
  tone?: "done" | "active" | "todo" | "alert";
}

/**
 * Stepper progres kontrak — tulang belakang transparansi escrow.
 * Tahap baku: Kontrak dibuat → Dana masuk escrow → Sedang dikerjakan →
 * Serah terima → Review bisnis → Dana dilepas.

 */
export interface ContractStepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: ContractStep[];
  /** Index tahap yang sedang berjalan (0-based). Sebelumnya dianggap selesai. */
  current?: number;
  /** horizontal untuk desktop, vertical untuk mobile & panel samping. */
  orientation?: "horizontal" | "vertical";
  /**
   * Permukaan tempat stepper dipasang. `"ink"` WAJIB dipakai di atas
   * permukaan brand tetap (`--ink-surface`): panel pendaftaran, footer,
   * blok "Untuk bisnis". Tanpa itu stepper memakai token tema, yang di mode
   * terang menghasilkan teks gelap di atas latar gelap dan di mode gelap
   * ikut membalik bersama tema.
   */
  surface?: "default" | "ink";
}

export declare function ContractStepper(props: ContractStepperProps): JSX.Element;
