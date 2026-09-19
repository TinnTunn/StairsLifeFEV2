"use client";

import { Icon } from "@/components/actions/Icon";
import { IconButton } from "@/components/actions/IconButton";
import { Money, type MoneyProps } from "@/components/data/Money";
import { useBahasa } from "@/i18n/BahasaProvider";
import { useSaldoTersembunyi } from "@/lib/saldo";
import styles from "./SaldoRahasia.module.css";

export type SaldoRahasiaProps = MoneyProps;

/**
 * Nominal saldo yang bisa disembunyikan pemiliknya.
 *
 * Dompet sering dibuka di tempat yang tidak privat: perpustakaan kampus,
 * angkutan umum, atau layar yang sedang dibagikan. Menyembunyikan angkanya
 * membuat halaman ini tetap bisa dipakai tanpa memperlihatkan berapa uang yang
 * dipegang.
 *
 * Yang disembunyikan hanya tampilannya. Nilainya tetap ada di halaman dan tetap
 * dipakai perhitungan lain, jadi tombol dan validasi tidak ikut berubah.
 */
export function SaldoRahasia(props: SaldoRahasiaProps) {
  const { tersembunyi } = useSaldoTersembunyi();
  const { t } = useBahasa();

  if (!tersembunyi) return <Money {...props} />;

  const { size = "md", label, className } = props;
  return (
    <span className={[styles.bungkus, className].filter(Boolean).join(" ")}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {/* Titiknya dekoratif; pembaca layar mendengar bahwa saldonya disembunyikan,
          bukan deretan titik yang tidak berarti. */}
      <span className={`${styles.tutup} ${styles[size]}`} aria-hidden="true">
        Rp ••••••
      </span>
      <span className="sl-visually-hidden">{t.aplikasi.mahasiswa.dompet.saldoTersembunyi}</span>
    </span>
  );
}

/** Tombol mata untuk menyalakan dan mematikan penyembunyian saldo. */
export function TombolSaldo({ className }: { className?: string }) {
  const { tersembunyi, ubah } = useSaldoTersembunyi();
  const { t } = useBahasa();
  const d = t.aplikasi.mahasiswa.dompet;

  return (
    <IconButton
      label={tersembunyi ? d.tampilkanSaldo : d.sembunyikanSaldo}
      aria-pressed={tersembunyi}
      onClick={ubah}
      className={className}
    >
      <Icon name={tersembunyi ? "EyeOff" : "Eye"} size={18} />
    </IconButton>
  );
}
