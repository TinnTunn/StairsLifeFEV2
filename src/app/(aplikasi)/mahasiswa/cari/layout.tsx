// Judul tab untuk rute cari proyek.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ambilKamus } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: { absolute: `${t.aplikasi.mahasiswa.cari.judul} · ${t.umum.meta.situs}` } };
}

export default function Tata({ children }: { children: ReactNode }) {
  return children;
}
