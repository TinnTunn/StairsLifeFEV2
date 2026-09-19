import * as React from "react";

/**
 * Keadaan kosong. Sistem ini TIDAK memakai ilustrasi — hanya ikon besar
 * di dalam lingkaran pasir + copy ramah + satu jalan keluar yang jelas.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ikon Lucide berukuran 28–36px, mis. <Icon name="Inbox" size={32} strokeWidth={1.5} /> */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Satu–dua baris: kenapa kosong dan apa yang bisa dilakukan. */
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: "md" | "lg";
}

export declare function EmptyState(props: EmptyStateProps): JSX.Element;
