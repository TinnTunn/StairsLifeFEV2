import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Dropdown native (paling andal di browser mobile). Chevron Lucide di kanan. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  /** Daftar pilihan; string dianggap value = label. */
  options?: Array<SelectOption | string>;
  /** Opsi kosong pertama. Kosongkan string untuk menghilangkannya. */
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  required?: boolean;
}

export declare function Select(props: SelectProps): JSX.Element;
