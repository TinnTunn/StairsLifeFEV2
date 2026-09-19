import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/actions/Icon";
import { ambilKamus } from "@/i18n/server";
import styles from "../masuk/auth.module.css";
import { AuthShell } from "../masuk/AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.pilihPeran.meta, description: t.auth.pilihPeran.metaDeskripsi };
}

const PERAN = [
  { href: "/daftar/mahasiswa", icon: "GraduationCap", kunci: "mahasiswa" },
  { href: "/daftar/bisnis", icon: "Store", kunci: "bisnis" },
] as const;

export default async function PilihPeran() {
  const { t } = await ambilKamus();
  const p = t.auth.pilihPeran;
  return (
    <AuthShell lebar>
      <div className={styles.page}>
        <div className={styles.head}>
          <h1 className={styles.title}>{p.judul}</h1>
          <p className={styles.subtitle}>{p.sub}</p>
        </div>
        <div className={styles.roleCards}>
          {PERAN.map((r) => (
            <Link key={r.href} href={r.href} className={styles.roleCard}>
              <span className={styles.roleIcon}>
                <Icon name={r.icon} size={24} />
              </span>
              <span className={styles.roleTitle}>{p[r.kunci].judul}</span>
              <span className={styles.roleBody}>{p[r.kunci].isi}</span>
              <span className={styles.roleArrow} aria-hidden="true">
                <Icon name="ArrowUpRight" size={16} />
              </span>
            </Link>
          ))}
        </div>
        <p className={styles.alt}>
          {p.sudahPunya} <Link href="/masuk">{p.masuk}</Link>
        </p>
      </div>
    </AuthShell>
  );
}
