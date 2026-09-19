"use client";

import type { ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { hitungKomisi, usePengaturanPublik } from "@/lib/pengaturan";

/**
 * Kalimat rincian komisi yang angkanya berasal dari pengaturan backend, bukan
 * 5 persen yang ditulis di frontend. Selama pengaturan dimuat, kalimatnya
 * menunggu; bila gagal dibaca, layar mengatakan itu alih-alih menebak angka.
 */
export function RincianKomisi({
  nominal,
  children,
}: {
  nominal: number;
  children: (komisi: number, diterima: number, persen: number) => ReactNode;
}) {
  const { t } = useBahasa();
  const { data, loading, gagal } = usePengaturanPublik();

  if (loading) return <>{t.fitur.pengaturan.komisiMemuat}</>;
  if (gagal || !data) return <>{t.fitur.pengaturan.komisiTidakTerbaca}</>;

  const komisi = hitungKomisi(nominal, data.platform_fee);
  return <>{children(komisi, nominal - komisi, data.platform_fee)}</>;
}
