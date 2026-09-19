import { cookies } from "next/headers";
import { BAHASA_COOKIE, normalisasiBahasa, type Bahasa } from "./jenis";
import { KAMUS, type Kamus } from "./kamus";

/** Bahasa pilihan pengguna untuk Server Component, dibaca dari cookie. */
export async function ambilBahasa(): Promise<Bahasa> {
  const jar = await cookies();
  return normalisasiBahasa(jar.get(BAHASA_COOKIE)?.value);
}

export async function ambilKamus(): Promise<{ bahasa: Bahasa; t: Kamus }> {
  const bahasa = await ambilBahasa();
  return { bahasa, t: KAMUS[bahasa] };
}
