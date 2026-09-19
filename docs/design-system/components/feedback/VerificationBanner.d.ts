import * as React from "react";

/**
 * Banner status verifikasi — muncul di seluruh area terautentikasi selama akun
 * belum terverifikasi. Copy-nya menjelaskan APA yang terkunci dan berapa lama
 * reviewnya, bukan hanya bahwa akun belum terverifikasi.
 */
export interface VerificationBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `terverifikasi` membuat komponen tidak merender apa pun. */
  status?: "belum_diajukan" | "menunggu_review" | "terverifikasi" | "ditolak" | "disuspend";
  /** Menentukan copy: mahasiswa tidak bisa melamar, bisnis tidak bisa menayangkan. */
  role?: "mahasiswa" | "bisnis";
  /** Alasan dari admin — wajib diisi saat status `ditolak` atau `disuspend`. */
  reason?: string;
  onAction?: () => void;
  /** Menimpa label tombol default. */
  actionLabel?: string;
}

export declare function VerificationBanner(props: VerificationBannerProps): JSX.Element | null;
