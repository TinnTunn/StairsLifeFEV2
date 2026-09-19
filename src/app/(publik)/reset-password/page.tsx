import type { Metadata } from "next";
import { Suspense } from "react";
import { ambilKamus } from "@/i18n/server";
import { ResetPasswordForm } from "./ResetPasswordForm";
import styles from "../masuk/auth.module.css";
import { AuthShell } from "../masuk/AuthShell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.auth.reset.meta, robots: { index: false, follow: false } };
}

/* Backend menyusun tautannya sebagai ${APP_URL}/reset-password?token=... */
export default async function ResetPassword() {
  const { t } = await ambilKamus();
  return (
    <AuthShell alihkanJikaMasuk={false}>
      <div className={styles.page}>
        <div className={styles.head}>
          <h1 className={styles.title}>{t.auth.reset.judul}</h1>
          <p className={styles.subtitle}>{t.auth.reset.sub}</p>
        </div>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </AuthShell>
  );
}
