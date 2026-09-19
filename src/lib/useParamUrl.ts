"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * State saringan yang disimpan di query string, bukan useState. Tab, status,
 * dan nomor halaman jadi ikut kembali saat pengguna menekan Back/Forward,
 * bertahan setelah muat ulang, dan bisa dibagikan lewat tautan.
 *
 * Memakai history.replaceState, bukan router.replace: tidak ada permintaan ke
 * server untuk halaman klien, dan mengganti saringan tidak menambah entri
 * riwayat, jadi Back tetap meninggalkan halaman ini.
 */
export function useParamUrl<T extends string>(kunci: string, bawaan: T, izin?: readonly T[]): [T, (nilai: T) => void] {
  const params = useSearchParams();
  const mentah = params.get(kunci);
  const nilai = mentah !== null && (!izin || izin.includes(mentah as T)) ? (mentah as T) : bawaan;

  const atur = useCallback(
    (baru: T) => {
      const p = new URLSearchParams(window.location.search);
      if (baru === bawaan) p.delete(kunci);
      else p.set(kunci, baru);
      const q = p.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`);
    },
    [kunci, bawaan],
  );

  return [nilai, atur];
}

/** Varian angka untuk nomor halaman; nilai yang bukan bilangan bulat positif jatuh ke 1. */
export function useHalamanUrl(kunci = "halaman"): [number, (n: number) => void] {
  const [mentah, atur] = useParamUrl<string>(kunci, "1");
  const n = Number.parseInt(mentah, 10);
  const halaman = Number.isInteger(n) && n > 0 ? n : 1;
  return [halaman, useCallback((baru: number) => atur(String(baru)), [atur])];
}
