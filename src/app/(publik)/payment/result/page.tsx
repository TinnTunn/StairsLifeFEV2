// Halaman hasil pembayaran tujuan pengalihan Xendit.

import type { Metadata } from "next";
import { Suspense } from "react";
import { ambilKamus } from "@/i18n/server";
import { HasilPembayaran } from "./HasilPembayaran";
import styles from "../../masuk/shell.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.sistem.pembayaran.meta, robots: { index: false, follow: false } };
}

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
