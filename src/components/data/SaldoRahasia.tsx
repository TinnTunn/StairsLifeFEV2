// Nominal saldo yang bisa disembunyikan beserta tombol matanya.

"use client";

import { Icon } from "@/components/actions/Icon";
import { IconButton } from "@/components/actions/IconButton";
import { Money, type MoneyProps } from "@/components/data/Money";
import { useBahasa } from "@/i18n/BahasaProvider";
import { useSaldoTersembunyi } from "@/lib/saldo";
import styles from "./SaldoRahasia.module.css";

export type SaldoRahasiaProps = MoneyProps;

export function SaldoRahasia(props: SaldoRahasiaProps) {
  const { tersembunyi } = useSaldoTersembunyi();
  const { t } = useBahasa();

  if (!tersembunyi) return <Money {...props} />;

  const { size = "md", label, className } = props;
  return (
    <span className={[styles.bungkus, className].filter(Boolean).join(" ")}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={`${styles.tutup} ${styles[size]}`} aria-hidden="true">
        Rp ••••••
      </span>
      <span className="sl-visually-hidden">{t.aplikasi.mahasiswa.dompet.saldoTersembunyi}</span>
    </span>
  );
}

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
