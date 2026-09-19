import type { Metadata } from "next";
import { ambilKamus } from "@/i18n/server";
import styles from "../masuk/auth.module.css";
import { AuthShell } from "../masuk/AuthShell";
import { FormBanding } from "./FormBanding";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.fitur.banding.halamanJudul, robots: { index: false, follow: false } };
}

/* Akun beku tidak punya sesi, jadi halaman ini tidak mengalihkan pengguna
   yang sudah masuk ke dasbor seperti halaman auth lain. */
export default async function Banding() {
  const { t } = await ambilKamus();
  const b = t.fitur.banding;
  return (
    <AuthShell alihkanJikaMasuk={false}>
      <div className={styles.page}>
        <div className={styles.head}>
          <h1 className={styles.title}>{b.halamanJudul}</h1>
          <p className={styles.subtitle}>{b.halamanSub}</p>
        </div>
        <FormBanding />
      </div>
    </AuthShell>
  );
}
