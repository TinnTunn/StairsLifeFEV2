// Halaman masuk khusus admin.

import type { Metadata } from "next";
import { Suspense } from "react";
import { Icon } from "@/components/actions/Icon";
import { Logo } from "@/components/brand/Logo";
import { AlihkanJikaMasuk } from "@/components/layout/AlihkanJikaMasuk";
import { ambilKamus } from "@/i18n/server";
import { FormAdmin } from "./FormAdmin";
import styles from "./admin.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.masukAdmin.meta, robots: { index: false, follow: false } };
}

export default async function MasukAdmin() {
  const { t } = await ambilKamus();
  const a = t.auth.masukAdmin;

  return (
    <div className={styles.halaman}>
      <AlihkanJikaMasuk />
      <div className={styles.kartu}>
        <div className={styles.kepala}>
          <span className={styles.merek}>
            <Logo size={20} />
          </span>
          <span className={styles.label}>
            <Icon name="Gembok" size={13} />
            {a.label}
          </span>
        </div>

        <h1 className={styles.judul}>{a.judul}</h1>
        <p className={styles.sub}>{a.sub}</p>

        <Suspense fallback={null}>
          <FormAdmin />
        </Suspense>
      </div>
    </div>
  );
}
