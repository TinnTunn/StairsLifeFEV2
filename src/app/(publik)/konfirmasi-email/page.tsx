import type { Metadata } from "next";
import { Suspense } from "react";
import { ambilKamus } from "@/i18n/server";
import styles from "../masuk/auth.module.css";
import { AuthShell } from "../masuk/AuthShell";
import { KonfirmasiEmailPanel } from "./KonfirmasiEmailPanel";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.fitur.akun.konfirmasiEmail.metaJudul, robots: { index: false, follow: false } };
}

export default function KonfirmasiEmail() {
  return (
    <AuthShell alihkanJikaMasuk={false}>
      <div className={styles.page}>
        <Suspense fallback={null}>
          <KonfirmasiEmailPanel />
        </Suspense>
      </div>
    </AuthShell>
  );
}
