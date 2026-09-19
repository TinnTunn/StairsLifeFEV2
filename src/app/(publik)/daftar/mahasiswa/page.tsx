import type { Metadata } from "next";
import Link from "next/link";
import { ambilKamus } from "@/i18n/server";
import { RegisterForm } from "../RegisterForm";
import styles from "../../masuk/auth.module.css";
import { AuthShell } from "../../masuk/AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.daftar.mahasiswa.meta, description: t.auth.daftar.mahasiswa.metaDeskripsi };
}

export default async function DaftarMahasiswa() {
  const { t } = await ambilKamus();
  const d = t.auth.daftar.mahasiswa;
  return (
    <AuthShell sisi="mahasiswa">
      <div className={styles.page}>
        <div className={styles.head}>
          <h1 className={styles.title}>{d.judul}</h1>
          <p className={styles.subtitle}>{d.sub}</p>
        </div>
        <RegisterForm role="mahasiswa" />
        <p className={styles.alt}>
          {d.alih} <Link href="/daftar/bisnis">{d.alihTautan}</Link>
        </p>
      </div>
    </AuthShell>
  );
}
