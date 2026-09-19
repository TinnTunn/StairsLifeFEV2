import type { Metadata } from "next";
import { Suspense } from "react";
import { ambilKamus } from "@/i18n/server";
import { HasilPembayaran } from "./HasilPembayaran";
import styles from "../../masuk/shell.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.sistem.pembayaran.meta, robots: { index: false, follow: false } };
}

/**
 * Xendit memantulkan pengguna ke sini setelah membayar, ke alamat yang
 * dibangun backend sebagai ${APP_URL}/payment/result?status=...&payment_id=...
 * Path dan nama query-nya dipatok backend, jadi rute ini memakai nama Inggris
 * meski rute lain berbahasa Indonesia.
 */
export default function HasilPembayaranPage() {
  return (
    <div className={styles.form}>
      <div className={styles.card}>
        <Suspense fallback={null}>
          <HasilPembayaran />
        </Suspense>
      </div>
    </div>
  );
}
