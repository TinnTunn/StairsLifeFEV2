/* Dua bahasa antarmuka. Indonesia jadi bawaan karena pengguna utamanya
   mahasiswa dan UMKM Indonesia; pesan dari backend tetap berbahasa Indonesia
   apa pun pilihan pengguna. */

export type Bahasa = "id" | "en";

export const BAHASA_BAWAAN: Bahasa = "id";

/* Disimpan di cookie, bukan localStorage: server perlu tahu bahasanya saat
   merender halaman publik, supaya tidak ada kedipan dari Indonesia ke Inggris. */
export const BAHASA_COOKIE = "sl-bahasa";

export const LOCALE: Record<Bahasa, string> = {
  id: "id-ID",
  en: "en-GB",
};

export function normalisasiBahasa(nilai: string | null | undefined): Bahasa {
  return nilai === "en" ? "en" : "id";
}
