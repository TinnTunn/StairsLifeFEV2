import * as React from "react";

export interface BottomNavItem {
  value: string;
  label: string;
  /** Ikon Lucide 24px. */
  icon?: React.ReactNode;
  /** Titik/angka merah untuk hal yang butuh tindakan. */
  badge?: number | string;
}

/**
 * Navigasi bawah mobile (<768px). Maksimal 5 item, tinggi 60px + safe area.
 * Item aktif: ikon + label terakota (bukan hanya warna — label ikut menebal).
 */
export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  items: BottomNavItem[];
  active?: string;
  onNavigate?: (value: string) => void;
}

export declare function BottomNav(props: BottomNavProps): JSX.Element;
