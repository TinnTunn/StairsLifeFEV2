import * as React from "react";

export interface SidebarItem {
  value?: string;
  label?: string;
  icon?: React.ReactNode;
  /** Angka notifikasi (lamaran baru, sengketa terbuka). */
  badge?: number | string;
  badgeTone?: "neutral" | "danger";
  /** Judul kelompok; item ini bukan tautan. */
  section?: string;
}

/**
 * Navigasi samping aplikasi (desktop ≥1280px). Di mobile diganti BottomNav.
 * Item aktif: latar terakota lembut + ikon terakota.

 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarItem[];
  active?: string;
  onNavigate?: (value: string) => void;
  /** Logo + wordmark di kepala sidebar. */
  brand?: React.ReactNode;
  /** Blok profil/pengaturan di dasar sidebar. */
  footer?: React.ReactNode;
  collapsed?: boolean;
  /** Label peran pengguna, mis. "Mahasiswa" / "Bisnis" / "Admin". */
  role?: string;
}

export declare function Sidebar(props: SidebarProps): JSX.Element;
