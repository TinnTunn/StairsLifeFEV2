// Pembaca bahasa aktif di luar React beserta teks galatnya.

import { BAHASA_BAWAAN, BAHASA_COOKIE, normalisasiBahasa, type Bahasa } from "./jenis";
import { KAMUS, type Kamus } from "./kamus";

export function bahasaAktif(): Bahasa {
  if (typeof document === "undefined") return BAHASA_BAWAAN;
  const cocok = document.cookie.match(new RegExp(`(?:^|;\\s*)${BAHASA_COOKIE}=([^;]+)`));
  return normalisasiBahasa(cocok?.[1]);
}

export function teksGalat(bahasa: Bahasa = bahasaAktif()): Kamus["umum"]["galat"] {
  return KAMUS[bahasa].umum.galat;
}
