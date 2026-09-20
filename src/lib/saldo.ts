// Pilihan menyembunyikan saldo, disimpan per perangkat.

"use client";

import { useCallback, useSyncExternalStore } from "react";

export const KUNCI_SALDO = "stairslife-saldo-tersembunyi";
const EVENT_SALDO = "stairslife-saldo-berubah";

function baca(): boolean {
  try {
    return window.localStorage.getItem(KUNCI_SALDO) === "1";
  } catch {
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
