// Tautan lewati ke konten utama untuk pengguna papan ketik.

"use client";

import { useBahasa } from "@/i18n/BahasaProvider";

export function LewatiKonten() {
  const { t } = useBahasa();
  return (
    <a href="#konten" className="sl-lewati">
      {t.umum.aksi.lewatiKeKonten}
    </a>
  );
}
