import * as React from "react";

export interface NotificationItem {
  id: string | number;
  /** Satu baris, menyebut apa yang berubah — bukan judul kategori. */
  title: React.ReactNode;
  /** Baris kedua opsional: nama lowongan, bisnis, atau alasan. */
  description?: React.ReactNode;
  /** Waktu siap tampil, mis. "12 menit lalu" atau "24 Agu 2026". */
  time?: React.ReactNode;
  /** Glyph Lucide 16px, mis. <Icon name="Eye" size={16} />. */
  icon?: React.ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
  unread?: boolean;
  /** Rute tujuan saat diklik — dibaca call site di onOpenItem. */
  href?: string;
}

/**
 * Lonceng notifikasi + panel dropdown di topbar. Satu-satunya tempat kejadian
 * penting berkumpul lintas halaman: perubahan status lamaran, keputusan
 * moderasi, pembayaran, dan pesan baru. Halaman notifikasi penuh tetap ada
 * untuk riwayat dan filter; panel ini untuk melihat cepat tanpa pindah halaman.
 */
export interface NotificationCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: NotificationItem[];
  /** Dipanggil dengan item yang diklik — arahkan ke rutenya di sini. */
  onOpenItem?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  /** Tampilkan tombol "Lihat semua notifikasi" di dasar panel. */
  onSeeAll?: () => void;
  /**
   * Sorot sesaat item paling atas saat daftar bertambah, supaya kedatangan
   * notifikasi terasa tanpa memindahkan apa pun di layar.
   */
  live?: boolean;
  /** Default "Notifikasi" — dipakai aria-label dan judul panel. */
  label?: string;
  /** Sisi panel yang menempel ke tombol. Default "right". */
  align?: "left" | "right";
}

export declare function NotificationCenter(props: NotificationCenterProps): JSX.Element;
