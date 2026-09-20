// Penanda bahwa isi halaman berasal dari data contoh.

"use client";

import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon } from "../actions/Icon";
import styles from "./SampleDataNotice.module.css";

export function SampleDataNotice() {
  const { t } = useBahasa();
  return (
    <div className={styles.notice} role="status">
      <Icon name="Info" size={16} />
      <b>{t.umum.dataContoh.judul}.</b> {t.umum.dataContoh.isi}
    </div>
  );
}
