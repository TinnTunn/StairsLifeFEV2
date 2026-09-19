import * as React from "react";

/**
 * Rating bintang. Tampilan angka pakai koma desimal ala Indonesia ("4,8").
 * `editable` untuk form ulasan setelah serah terima.
 */
export interface RatingProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 0–5, boleh pecahan (bintang terisi sebagian). */
  value?: number;
  /** Jumlah ulasan, ditampilkan sebagai "(23 ulasan)". */
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  /**
   * Mode input: lima bintang menjadi `role="radio"` sungguhan dengan roving
   * tabIndex, navigasi panah/Home/End, Space/Enter, dan area sentuh 44px.
   * Bisa dipakai penuh dengan papan tombol dan pembaca layar.
   */
  editable?: boolean;
  onChange?: (value: number) => void;
  /** aria-label radiogroup saat `editable`. Default "Beri penilaian dari 1 sampai 5 bintang". */
  label?: string;
}

export declare function Rating(props: RatingProps): JSX.Element;
