"use client";

import { useSyncExternalStore } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon } from "../actions/Icon";
import styles from "./BilahOffline.module.css";

/**
 * Kabar kecil saat perangkat kehilangan koneksi.
 *
 * Tanpa ini, jaringan yang putus hanya terlihat sebagai galat yang sama dengan
 * kesalahan server, dan pengguna mencoba ulang aksi yang memang tidak mungkin
 * berhasil. Bilahnya juga menjadi tanda bahwa halaman akan menyusul sendiri
 * begitu koneksi kembali, karena polling obrolan dan notifikasi memang menunggu
 * event online.
 *
 * navigator.onLine hanya tahu perangkat punya jaringan, bukan bahwa server bisa
 * dihubungi. Itu cukup untuk kasus yang paling sering terjadi (sinyal hilang di
 * jalan) dan tidak pernah salah memunculkan bilah saat koneksi ada.
 *
 * Status jaringan adalah state di luar React, jadi dibaca lewat
 * useSyncExternalStore: di server selalu dianggap online, sehingga HTML yang
 * dikirim dan hasil hidrasi tidak pernah berbeda.
 */
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
