"use client";

import { useState } from "react";

export interface ItemGalat {
  teks: string;
  /** id elemen kolom yang dituju tautan di ringkasan galat. */
  kolom?: string;
}

/** id kolom formulir yang dipakai bersama oleh input dan ringkasan galat. */
export function idKolom(nama: string): string {
  return `kolom-${nama}`;
}

/**
 * Galat formulir di dua tempat sekaligus: di bawah kolomnya (supaya terlihat
 * di tempat mata sedang melihat, termasuk di HP setelah ringkasan tergulir
 * keluar layar) dan di ringkasan atas formulir yang menautkan ke setiap kolom
 * (supaya pembaca layar mendengar semuanya sekali).
 */
export function useGalatKolom<K extends string>() {
  const [galat, setGalat] = useState<Partial<Record<K, string>>>({});
  const [umum, setUmum] = useState<string[]>([]);

  /** aturan: [kolom, gagal?, pesan]. Hanya pesan pertama per kolom yang dipakai. */
  function periksa(aturan: Array<[K, boolean, string]>): boolean {
    const hasil: Partial<Record<K, string>> = {};
    for (const [kolom, gagal, pesan] of aturan) {
      if (gagal && !hasil[kolom]) hasil[kolom] = pesan;
    }
    setGalat(hasil);
    setUmum([]);
    return Object.keys(hasil).length === 0;
  }

  /** Galat satu kolom hilang begitu kolomnya diubah. */
  function hapus(kolom: K) {
    setGalat((lama) => {
      if (!lama[kolom]) return lama;
      const baru = { ...lama };
      delete baru[kolom];
      return baru;
    });
  }

  function setGalatUmum(pesan: string[] | null) {
    setUmum(pesan ?? []);
  }

  const ringkasan: ItemGalat[] = [
    ...umum.map((teks) => ({ teks })),
    ...(Object.entries(galat) as Array<[string, string]>).map(([kolom, teks]) => ({ teks, kolom: idKolom(kolom) })),
  ];

  return { galat, periksa, hapus, setGalatUmum, ringkasan };
}
