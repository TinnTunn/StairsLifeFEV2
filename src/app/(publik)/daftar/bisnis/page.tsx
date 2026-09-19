import type { Metadata } from "next";
import Link from "next/link";
import { ambilKamus } from "@/i18n/server";
import { ambilPengaturanServer } from "@/lib/pengaturan-server";
import { RegisterForm } from "../RegisterForm";
import styles from "../../masuk/auth.module.css";
import { AuthShell } from "../../masuk/AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.daftar.bisnis.meta, description: t.auth.daftar.bisnis.metaDeskripsi };
}

export default async function DaftarBisnis() {
  const [{ t }, pengaturan] = await Promise.all([ambilKamus(), ambilPengaturanServer()]);
  const d = t.auth.daftar.bisnis;
  return (
    <AuthShell sisi="bisnis">
      <div className={styles.page}>
        <div className={styles.head}>
          <h1 className={styles.title}>{d.judul}</h1>
          <p className={styles.subtitle}>{d.sub(pengaturan ? t.fitur.pengaturan.persen(pengaturan.platform_fee) : null)}</p>
        </div>
        <RegisterForm role="bisnis" />
        <p className={styles.alt}>
          {d.alih} <Link href="/daftar/mahasiswa">{d.alihTautan}</Link>
        </p>
      </div>
    </AuthShell>
  );
}
