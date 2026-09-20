// Halaman permintaan tautan atur ulang kata sandi.

import type { Metadata } from "next";
import Link from "next/link";
import { ambilKamus } from "@/i18n/server";
import { LupaPasswordForm } from "./LupaPasswordForm";
import styles from "../masuk/auth.module.css";
import { AuthShell } from "../masuk/AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.lupa.meta, robots: { index: false, follow: false } };
}

export default async function LupaPassword() {
  const { t } = await ambilKamus();
  const l = t.auth.lupa;
  return (
    <AuthShell>
      <div className={styles.page}>
        <div className={styles.head}>
          <h1 className={styles.title}>{l.judul}</h1>
          <p className={styles.subtitle}>{l.sub}</p>
        </div>
        <LupaPasswordForm />
        <p className={styles.alt}>
          {l.ingat} <Link href="/masuk">{l.masuk}</Link>
        </p>
      </div>
    </AuthShell>
  );
}
