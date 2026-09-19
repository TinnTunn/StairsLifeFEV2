"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/actions/Icon";
import styles from "./TautanKembali.module.css";

export interface TautanKembaliProps {
  /** Tujuan, ditulis tetap dan bukan history.back(): halaman turunan sering
      dibuka langsung dari notifikasi atau tautan email, dan di situ riwayat
      perambannya kosong. */
  href: string;
  /** Sebutkan tujuannya, bukan sekadar "Kembali": orang perlu tahu ke mana
      ia akan mendarat sebelum menekannya. */
  label: string;
  /** Untuk halaman yang bisa dibuka dari beberapa arah, misalnya profil publik
      yang dicapai dari detail proyek maupun dari kartu pelamar. Kembalinya
      mengikuti riwayat, dan href di atas jadi cadangan saat riwayatnya kosong
      karena halamannya dibuka langsung dari tautan. */
  pakaiRiwayat?: boolean;
  className?: string;
}

/**
 * Tautan kembali ke halaman induk.
 *
 * Sebelumnya tiga halaman menyalin gaya yang sama ke modulnya masing-masing,
 * tiga halaman lain memakai gaya tautan seksi yang berwarna brand dan tebal,
 * dan sisanya tidak punya jalan pulang sama sekali. Disatukan di sini supaya
 * rupanya seragam dan halaman baru tidak perlu menyalin apa pun.
 */
export function TautanKembali({ href, label, pakaiRiwayat = false, className }: TautanKembaliProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={[styles.kembali, className].filter(Boolean).join(" ")}
      onClick={
        pakaiRiwayat
          ? (event) => {
              /* Tetap ditulis sebagai tautan, bukan tombol: klik tengah, klik
                 kanan, dan pembaca layar tetap mendapat tujuan yang jelas. */
              if (window.history.length <= 1) return;
              event.preventDefault();
              router.back();
            }
          : undefined
      }
    >
      <Icon name="ArrowLeft" size={16} />
      {label}
    </Link>
  );
}
