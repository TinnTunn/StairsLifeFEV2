"use client";

import { useCallback, useSyncExternalStore } from "react";

/* Pilihan menyembunyikan saldo.

   Disimpan di localStorage, bukan di server: ini kenyamanan per perangkat,
   bukan data akun. Orang yang menyembunyikan saldo di laptop kantor tidak
   otomatis ingin saldonya tersembunyi di ponselnya sendiri.

   Disiarkan lewat event supaya semua tempat yang menampilkan saldo berubah
   bersamaan, termasuk yang sedang terbuka di tab lain. */

export const KUNCI_SALDO = "stairslife-saldo-tersembunyi";
const EVENT_SALDO = "stairslife-saldo-berubah";

function baca(): boolean {
  try {
    return window.localStorage.getItem(KUNCI_SALDO) === "1";
  } catch {
    /* Mode privat memblokir localStorage. Saldo tampil apa adanya. */
    return false;
  }
}

function langgan(onChange: () => void) {
  window.addEventListener(EVENT_SALDO, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT_SALDO, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useSaldoTersembunyi() {
  /* Snapshot server selalu false. Angka saldo memang baru datang setelah
     permintaan ke API, jadi pada render pertama belum ada apa pun untuk
     disembunyikan dan tidak ada kedipan yang membocorkan nominalnya. */
  const tersembunyi = useSyncExternalStore(langgan, baca, () => false);

  const ubah = useCallback(() => {
    try {
      window.localStorage.setItem(KUNCI_SALDO, baca() ? "0" : "1");
    } catch {
      /* Tidak bisa disimpan, tapi perubahannya tetap disiarkan untuk sesi ini. */
    }
    window.dispatchEvent(new Event(EVENT_SALDO));
  }, []);

  return { tersembunyi, ubah };
}
