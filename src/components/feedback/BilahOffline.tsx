// Bilah pemberitahu saat peramban kehilangan jaringan.

"use client";

import { useSyncExternalStore } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon } from "../actions/Icon";
import styles from "./BilahOffline.module.css";

function langganan(kabari: () => void) {
  window.addEventListener("online", kabari);
  window.addEventListener("offline", kabari);
  return () => {
    window.removeEventListener("online", kabari);
    window.removeEventListener("offline", kabari);
  };
}

export function BilahOffline() {
  const { t } = useBahasa();
  const offline = useSyncExternalStore(
    langganan,
    () => !navigator.onLine,
    () => false,
  );

  if (!offline) return null;

  return (
    <div className={styles.bilah} role="status">
      <Icon name="BellOff" size={16} />
      <span className={styles.teks}>
        <b>{t.umum.offline.judul}</b>
        <span>{t.umum.offline.isi}</span>
      </span>
    </div>
  );
}
