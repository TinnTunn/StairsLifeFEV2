// Gabungan kamus Indonesia dan Inggris.

import * as en from "./en";
import * as id from "./id";
import type { Bahasa } from "./jenis";

export type Kamus = typeof id;

export const KAMUS: Record<Bahasa, Kamus> = { id, en };
