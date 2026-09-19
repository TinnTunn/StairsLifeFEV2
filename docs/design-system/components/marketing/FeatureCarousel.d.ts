import * as React from "react";

export interface FeatureItem {
  id: string;
  /** Teks chip, 1–3 kata. */
  label: string;
  /** Glyph Lucide 16px untuk chip. */
  icon?: React.ReactNode;
  /** Angka di ujung chip, mis. jumlah lowongan aktif. */
  count?: number;
  /** Overline panel. Default "Kategori". */
  eyebrow?: React.ReactNode;
  /** Judul panel. Default sama dengan `label`. */
  title?: React.ReactNode;
  body: React.ReactNode;
  /** Sampai tiga angka pendukung. */
  meta?: { label: string; value: React.ReactNode }[];
  /** Tombol di bawah isi panel. */
  action?: React.ReactNode;
  /** Elemen di kolom kanan panel — kartu contoh atau slot gambar. Kolom 220px hanya dibuat bila prop ini ada. */
  aside?: React.ReactNode;
}

/**
 * Karosel kategori: chip yang bisa diklik di atas, satu panel isi di bawah.
 * Sengaja TIDAK memakai kartu 3D bertumpuk seperti pola aslinya — kartu yang
 * tersembunyi di belakang membuat isinya tidak terjangkau. Di sini semua
 * kategori selalu terlihat sebagai chip; hanya panelnya yang berganti.
 * Untuk permukaan marketing saja.
 */
export interface FeatureCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FeatureItem[];
  /** Berjalan sendiri, berhenti saat kursor masuk. Default true. Otomatis mati bila pengguna meminta `prefers-reduced-motion: reduce`. */
  autoPlay?: boolean;
  /** Milidetik per kategori. Default 3600. */
  interval?: number;
  /** "single" menghilangkan kolom kanan — untuk lebar sempit. */
  columns?: "auto" | "single";
}

export declare function FeatureCarousel(props: FeatureCarouselProps): JSX.Element | null;
