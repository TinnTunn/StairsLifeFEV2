import * as React from "react";

export interface Job {
  id?: string | number;
  judul: string;
  bisnis: string;
  /** Badge terverifikasi di sebelah nama bisnis. */
  verified?: boolean;
  lokasi?: string;
  /** "Penuh waktu" · "Paruh waktu" · "Magang" · "Remote" */
  tipe?: string;
  jadwal?: string;
  gajiMin?: number;
  gajiMaks?: number;
  /** Menampilkan "Nego" dan mengabaikan gajiMin/gajiMaks. */
  gajiNego?: boolean;
  tags?: string[];
  /** Teks siap tampil, mis. "2 hari lalu". */
  diposting?: string;
  pelamar?: number;
}

/**
 * Kartu lowongan — komponen paling sering dipakai di produk: daftar publik,
 * hasil pencarian, lowongan tersimpan, rekomendasi dashboard, profil bisnis.
 * Tiga varian sesuai kepadatan tempatnya.
 */
export interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  job: Job;
  /** grid: kartu penuh (default) · list: baris lebar · compact: sidebar & rekomendasi */
  variant?: "grid" | "list" | "compact";
  saved?: boolean;
  /** Menampilkan penanda "Dilamar" — wajib di daftar untuk mahasiswa yang sudah login. */
  applied?: boolean;
  onOpen?: (e: React.SyntheticEvent) => void;
  onSave?: (e: React.MouseEvent) => void;
  /** Tombol tambahan di baris bawah, mis. <Button size="sm">Lamar</Button>. */
  actions?: React.ReactNode;
}

export declare function JobCard(props: JobCardProps): JSX.Element;
