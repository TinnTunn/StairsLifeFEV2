// Halaman masuk pengguna.

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ambilKamus } from "@/i18n/server";
import { LoginForm } from "./LoginForm";
import styles from "./auth.module.css";
import { AuthShell } from "./AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.masuk.meta, robots: { index: false, follow: false } };
}

export default async function Masuk() {
  const { t } = await ambilKamus();
  const m = t.auth.masuk;
  return (
    <AuthShell>
      <div className={styles.page}>
        <div className={styles.head}>
          <h1 className={styles.title}>{m.judul}</h1>
          <p className={styles.subtitle}>{m.sub}</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className={styles.alt}>
          {m.belumPunya} <Link href="/daftar">{m.buatAkun}</Link>
        </p>
      </div>
    </AuthShell>
  );
}
