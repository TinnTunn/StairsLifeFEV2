import * as en from "./en";
import * as id from "./id";
import type { Bahasa } from "./jenis";

/* Kamus Indonesia adalah sumber bentuknya. Setiap berkas di en/ diketik
   dengan typeof versi Indonesia-nya, jadi kunci yang lupa diterjemahkan
   membuat build gagal, bukan tampil kosong di layar. */
export type Kamus = typeof id;

export const KAMUS: Record<Bahasa, Kamus> = { id, en };
