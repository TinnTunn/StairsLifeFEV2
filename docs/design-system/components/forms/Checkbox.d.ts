import * as React from "react";

/** Kotak centang. Area sentuh selalu ≥44px meski kotaknya 20px. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  /** Baris penjelas di bawah label, mis. syarat & ketentuan. */
  description?: string;
  indeterminate?: boolean;
}

export declare function Checkbox(props: CheckboxProps): JSX.Element;
