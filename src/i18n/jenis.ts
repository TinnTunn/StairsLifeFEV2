// Tipe bahasa, nama cookie, dan locale yang dipakai pemformatan.

export type Bahasa = "id" | "en";

export const BAHASA_BAWAAN: Bahasa = "id";

export const BAHASA_COOKIE = "sl-bahasa";

export const LOCALE: Record<Bahasa, string> = {
  id: "id-ID",
  en: "en-GB",
};

export function normalisasiBahasa(nilai: string | null | undefined): Bahasa {
  return nilai === "en" ? "en" : "id";
}
