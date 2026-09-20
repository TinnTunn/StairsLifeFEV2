// Rincian potongan komisi dari nilai kontrak.

"use client";

import type { ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { hitungKomisi, usePengaturanPublik } from "@/lib/pengaturan";

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
