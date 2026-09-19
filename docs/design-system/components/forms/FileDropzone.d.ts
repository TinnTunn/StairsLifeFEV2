import * as React from "react";

export interface UploadedFile {
  name: string;
  /** Ukuran siap tampil, mis. "2,4 MB". */
  size?: string;
}

/**
 * Area unggah berkas: portofolio, hasil kerja, KTM untuk verifikasi identitas,
 * bukti untuk sengketa. Mendukung drag-and-drop dan klik.
 */
export interface FileDropzoneProps {
  label?: string;
  /** Batas format & ukuran, ditulis apa adanya. */
  hint?: string;
  accept?: string;
  multiple?: boolean;
  /** Berkas yang sudah dipilih, ditampilkan sebagai daftar. */
  files?: UploadedFile[];
  onFiles?: (files: File[]) => void;
  onRemove?: (file: UploadedFile, index: number) => void;
  error?: string;
  disabled?: boolean;
}

export declare function FileDropzone(props: FileDropzoneProps): JSX.Element;
