"use client";

import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon } from "../actions/Icon";
import styles from "./SampleDataNotice.module.css";

/**
 * Muncul di setiap halaman yang menampilkan data contoh, supaya isi contoh
 * tidak terbaca sebagai isi sungguhan.
 */
export function SampleDataNotice() {
  const { t } = useBahasa();
  return (
    <div className={styles.notice} role="status">
      <Icon name="Info" size={16} />
      <b>{t.umum.dataContoh.judul}.</b> {t.umum.dataContoh.isi}
    </div>
  );
}
