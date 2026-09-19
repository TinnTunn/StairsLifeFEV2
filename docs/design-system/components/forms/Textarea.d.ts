import * as React from "react";

/** Kolom teks panjang: deskripsi proyek, surat lamaran, kronologi sengketa. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  rows?: number;
  maxLength?: number;
  /** Tampilkan penghitung karakter (butuh maxLength). */
  showCount?: boolean;
  required?: boolean;
}

export declare function Textarea(props: TextareaProps): JSX.Element;
