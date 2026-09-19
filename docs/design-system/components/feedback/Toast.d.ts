import * as React from "react";

/**
 * Notifikasi sementara. Empat nada; garis aksen 3px di kiri menandai nada.
 * Untuk peristiwa yang menyangkut dana, sertakan nominalnya di `description`.
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "info" | "success" | "warning" | "danger";
  title: React.ReactNode;
  description?: string;
  /** Tombol tindak lanjut, mis. <Button size="sm" variant="ghost">Lihat kontrak</Button> */
  action?: React.ReactNode;
  onClose?: () => void;
}

/** Wadah toast: tengah-bawah di mobile (di atas bottom nav), atas di desktop. */
export interface ToastStackProps {
  children?: React.ReactNode;
  position?: "bottom" | "top";
  style?: React.CSSProperties;
}

export declare function Toast(props: ToastProps): JSX.Element;
export declare function ToastStack(props: ToastStackProps): JSX.Element;
