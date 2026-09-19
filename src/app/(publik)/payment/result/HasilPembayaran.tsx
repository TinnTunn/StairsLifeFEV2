"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/actions/Button";
import { Money } from "@/components/data/Money";
import { EmptyState } from "@/components/feedback/EmptyState";
import { teksGalat } from "@/i18n/aktif";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { payments } from "@/lib/api/payments";
import type { Payment } from "@/lib/types";

type Keadaan = "memeriksa" | "ditahan" | "menunggu" | "gagal" | "tanpa_id";

export function HasilPembayaran() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const status = params.get("status");
  const { t } = useBahasa();
  const p = t.sistem.pembayaran;

  /* USE_MOCK konstan saat build, jadi keadaan awalnya dihitung di sini
     alih-alih lewat efek yang langsung memanggil setState. */
  const [keadaan, setKeadaan] = useState<Keadaan>(!paymentId ? "tanpa_id" : USE_MOCK ? "gagal" : "memeriksa");
  const [payment, setPayment] = useState<Payment | null>(null);
  /* null berarti pakai teks bawaan kamus, supaya ikut berganti bahasa. */
  const [pesan, setPesan] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId || USE_MOCK) return;

    /* Status di query hanya kabar dari Xendit ke browser, bukan sumber
       kebenaran. Yang menentukan adalah webhook ke backend. Sync menarik ulang
       status invoice supaya halaman ini tetap benar walau webhook-nya telat. */
    payments
      .sync(paymentId)
      .then((hasil) => {
        setPayment(hasil);
        if (hasil.status === "held" || hasil.status === "released") setKeadaan("ditahan");
        else if (hasil.status === "pending") setKeadaan("menunggu");
        else setKeadaan("gagal");
      })
      .catch((e: unknown) => {
        setKeadaan("gagal");
        setPesan(e instanceof ApiError ? e.message : teksGalat().jaringan);
      });
  }, [paymentId]);

  const keKontrak = payment ? (
    <Button href={`/kontrak/${payment.contract_id}`}>{p.bukaKontrak}</Button>
  ) : (
    <Button href="/">{p.keBeranda}</Button>
  );

  if (keadaan === "tanpa_id") {
    return (
      <EmptyState
        icon="Receipt"
        title={p.tanpaIdJudul}
        description={p.tanpaIdIsi}
        action={<Button href="/masuk">{p.masuk}</Button>}
      />
    );
  }

  if (keadaan === "memeriksa") {
    return <EmptyState icon="Clock" title={p.memeriksaJudul} description={p.memeriksaIsi} />;
  }

  if (keadaan === "ditahan") {
    return (
      <EmptyState
        icon="ShieldCheck"
        title={p.ditahanJudul}
        description={p.ditahanIsi}
        action={keKontrak}
        secondaryAction={payment ? <Money value={payment.amount} label={p.nominalDitahan} tone="held" /> : undefined}
      />
    );
  }

  if (keadaan === "menunggu") {
    return (
      <EmptyState
        icon="Clock"
        title={p.menungguJudul}
        description={p.menungguIsi}
        action={<Button onClick={() => window.location.reload()}>{p.periksaLagi}</Button>}
      />
    );
  }

  return (
    <EmptyState
      icon="AlertTriangle"
      title={status === "failed" ? p.gagalJudul : p.belumPastiJudul}
      description={pesan ?? (USE_MOCK ? p.modeContoh : p.gagalIsi)}
      action={keKontrak}
    />
  );
}
