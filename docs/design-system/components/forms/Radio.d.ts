import * as React from "react";

/** Radio tunggal. Untuk pilihan berbobot (metode bayar, paket) pakai RadioCard. */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  description?: string;
}

export interface RadioCardProps extends RadioProps {
  /** Nominal di kanan label, mis. "Rp 2.500.000". */
  price?: string;
}

export declare function Radio(props: RadioProps): JSX.Element;
export declare function RadioCard(props: RadioCardProps): JSX.Element;
