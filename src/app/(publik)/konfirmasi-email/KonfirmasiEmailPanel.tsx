"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/actions/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useBahasa } from "@/i18n/BahasaProvider";
import { akun } from "@/lib/api/akun";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { readSession, writeSession } from "@/lib/api/session";

type Keadaan = "memeriksa" | "berhasil" | "gagal" | "tanpa_token";

/* Link dari email konfirmasi: ${APP_URL}/konfirmasi-email?token=... */
export function KonfirmasiEmailPanel() {
  const token = useSearchParams().get("token");
  const { t } = useBahasa();
  const k = t.fitur.akun.konfirmasiEmail;
  const [keadaan, setKeadaan] = useState<Keadaan>(!token ? "tanpa_token" : USE_MOCK ? "gagal" : "memeriksa");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState<string | null>(null);
  const sudahJalan = useRef(false);

  useEffect(() => {
    if (!token || USE_MOCK || sudahJalan.current) return;
    /* Token sekali pakai; StrictMode memanggil efek dua kali. */
    sudahJalan.current = true;
    akun
      .konfirmasiEmail(token)
      .then((r) => {
        setEmail(r.email);
        setKeadaan("berhasil");
        // Kalau pemilik sedang masuk di perangkat ini, email di sesi ikut diperbarui.
        const kini = readSession();
        if (kini) writeSession({ ...kini, user: { ...kini.user, email: r.email } });
      })
      .catch((e: unknown) => {
        setKeadaan("gagal");
        setPesan(e instanceof ApiError ? e.message : t.umum.galat.jaringan);
      });
  }, [token, t.umum.galat.jaringan]);

  if (keadaan === "tanpa_token") {
    return <EmptyState icon="Mail" title={k.gagalJudul} description={k.tanpaToken} action={<Button href="/masuk">{k.keMasuk}</Button>} />;
  }
  if (keadaan === "memeriksa") {
    return <EmptyState icon="Clock" title={k.memproses} />;
  }
  if (keadaan === "berhasil") {
    const masuk = Boolean(readSession());
    return (
      <EmptyState
        icon="MailCheck"
        title={k.berhasilJudul}
        description={k.berhasilIsi(email)}
        action={<Button href={masuk ? "/profil" : "/masuk"}>{masuk ? k.keProfil : k.keMasuk}</Button>}
      />
    );
  }
  return (
    <EmptyState
      icon="AlertTriangle"
      title={k.gagalJudul}
      description={pesan ?? t.aplikasi.umum.modeContoh}
      action={<Button href="/masuk">{k.keMasuk}</Button>}
    />
  );
}
