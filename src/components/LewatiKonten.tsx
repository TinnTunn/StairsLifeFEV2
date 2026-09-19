"use client";

import { useBahasa } from "@/i18n/BahasaProvider";

/** Tautan pertama di setiap halaman untuk pengguna keyboard: melompati header ke isi. */
export function LewatiKonten() {
  const { t } = useBahasa();
  return (
    <a href="#konten" className="sl-lewati">
      {t.umum.aksi.lewatiKeKonten}
    </a>
  );
}
