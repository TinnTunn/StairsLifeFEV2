// Hook pemetaan galat backend ke kolom formulir.

"use client";

import { useState } from "react";

export interface ItemGalat {
  teks: string;
  kolom?: string;
}

export function idKolom(nama: string): string {
  return `kolom-${nama}`;
}

export function useGalatKolom<K extends string>() {
  const [galat, setGalat] = useState<Partial<Record<K, string>>>({});
  const [umum, setUmum] = useState<string[]>([]);

  function periksa(aturan: Array<[K, boolean, string]>): boolean {
    const hasil: Partial<Record<K, string>> = {};
    for (const [kolom, gagal, pesan] of aturan) {
      if (gagal && !hasil[kolom]) hasil[kolom] = pesan;
    }
    setGalat(hasil);
    setUmum([]);
    return Object.keys(hasil).length === 0;
  }

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
