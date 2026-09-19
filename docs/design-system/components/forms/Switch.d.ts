import * as React from "react";

/**
 * Toggle untuk pengaturan yang berlaku langsung — preferensi notifikasi,
 * mode maintenance, moderasi aktif/nonaktif. Untuk pilihan di dalam formulir
 * yang baru berlaku setelah "Simpan", pakai `Checkbox`.
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  /** Satu baris penjelas di bawah label — sebutkan akibat menyalakannya. */
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
}

export declare function Switch(props: SwitchProps): JSX.Element;
