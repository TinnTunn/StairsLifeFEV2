import { BAHASA_BAWAAN, BAHASA_COOKIE, normalisasiBahasa, type Bahasa } from "./jenis";
import { KAMUS, type Kamus } from "./kamus";

/**
 * Bahasa aktif untuk kode di luar React (klien API, lapisan data). Di browser
 * dibaca dari cookie yang sama dengan BahasaProvider; di server fungsi ini
 * tidak bisa membaca cookie, jadi pemanggil di server mengoper bahasanya sendiri.
 */
export function bahasaAktif(): Bahasa {
  if (typeof document === "undefined") return BAHASA_BAWAAN;
  /* Garis miring ganda: di template literal, \s tunggal kehilangan garis
     miringnya sehingga pola hanya cocok bila cookie bahasa berada paling depan. */
  const cocok = document.cookie.match(new RegExp(`(?:^|;\\s*)${BAHASA_COOKIE}=([^;]+)`));
  return normalisasiBahasa(cocok?.[1]);
}

export function teksGalat(bahasa: Bahasa = bahasaAktif()): Kamus["umum"]["galat"] {
  return KAMUS[bahasa].umum.galat;
}
