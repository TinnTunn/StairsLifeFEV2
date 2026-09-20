// Panel hasil verifikasi email.

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/actions/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth } from "@/lib/api/auth";
import { ApiError, USE_MOCK } from "@/lib/api/client";

type Keadaan = "memeriksa" | "berhasil" | "gagal" | "tanpa_token";

export function VerifikasiEmailPanel() {
  const token = useSearchParams().get("token");
  const { t } = useBahasa();
  const v = t.auth.verifikasiEmail;
  const [keadaan, setKeadaan] = useState<Keadaan>(!token ? "tanpa_token" : USE_MOCK ? "gagal" : "memeriksa");
  const [pesan, setPesan] = useState<string | null>(null);
  const sudahJalan = useRef(false);

  useEffect(() => {
    if (!token || USE_MOCK || sudahJalan.current) return;
    sudahJalan.current = true;

    auth
      .verifyEmail(token)
      .then(() => setKeadaan("berhasil"))
      .catch((e: unknown) => {
        setKeadaan("gagal");
        setPesan(e instanceof ApiError ? e.message : null);
      });
  }, [token]);

  if (keadaan === "tanpa_token") {
    return (
      <EmptyState
        icon="Mail"
        title={v.tanpaTokenJudul}
        description={v.tanpaTokenIsi}
        action={<Button href="/masuk">{v.masuk}</Button>}
      />
    );
  }

  if (keadaan === "memeriksa") {
    return <EmptyState icon="Clock" title={v.memeriksaJudul} description={v.memeriksaIsi} />;
  }

  if (keadaan === "berhasil") {
    return (
      <EmptyState
        icon="MailCheck"
        title={v.berhasilJudul}
        description={v.berhasilIsi}
        action={<Button href="/masuk">{v.masukSekarang}</Button>}
      />
    );
  }

  const alasan = pesan ?? (USE_MOCK ? v.modeContoh : v.gagalBawaan);
  return (
    <EmptyState
      icon="AlertTriangle"
      title={v.gagalJudul}
      description={`${alasan} ${v.gagalSaran}`}
      action={<Button href="/masuk">{v.keMasuk}</Button>}
    />
  );
}
