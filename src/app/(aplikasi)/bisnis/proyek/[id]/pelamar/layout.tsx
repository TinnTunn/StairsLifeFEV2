import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ambilKamus } from "@/i18n/server";

/* Judul tab per rute. Halamannya komponen klien, jadi judulnya tidak bisa
   diekspor dari sana; tanpa berkas ini seluruh area terautentikasi memakai satu
   judul yang sama dan riwayat browser jadi deretan baris kembar. */
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: { absolute: `${t.aplikasi.bisnis.pelamar.judul} · ${t.umum.meta.situs}` } };
}

export default function Tata({ children }: { children: ReactNode }) {
  return children;
}
