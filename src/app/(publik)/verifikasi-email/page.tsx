// Halaman verifikasi email dari tautan yang dikirim backend.

import type { Metadata } from "next";
import { Suspense } from "react";
import { ambilKamus } from "@/i18n/server";
import { VerifikasiEmailPanel } from "./VerifikasiEmailPanel";
import styles from "../masuk/auth.module.css";
import { AuthShell } from "../masuk/AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.verifikasiEmail.meta, robots: { index: false, follow: false } };
}

export default function VerifikasiEmail() {
  return (
    <AuthShell alihkanJikaMasuk={false}>
      <div className={styles.page}>
        <Suspense fallback={null}>
          <VerifikasiEmailPanel />
        </Suspense>
      </div>
    </AuthShell>
  );
}
