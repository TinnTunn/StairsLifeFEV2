import * as React from "react";

/**
 * Dialog terpusat. Di mobile (<768px) muncul sebagai bottom sheet;
 * di desktop terpusat. Dipakai untuk konfirmasi pembayaran escrow,
 * serah terima hasil, dan pengajuan sengketa.
 */
export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  /** Satu baris penjelas di bawah judul. */
  description?: string;
  children?: React.ReactNode;
  /** Baris tombol di bawah; aksi utama paling kanan. */
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** danger/success menambah garis aksen 3px di tepi atas. */
  tone?: "default" | "danger" | "success";
  /** false = harus memilih salah satu aksi (mis. konfirmasi dana). */
  dismissible?: boolean;
  style?: React.CSSProperties;
}

export declare function Modal(props: ModalProps): JSX.Element | null;
