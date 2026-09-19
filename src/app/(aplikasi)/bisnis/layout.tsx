import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ambilKamus } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: { absolute: `${t.aplikasi.bisnis.beranda.judul} · ${t.umum.meta.situs}` }, robots: { index: false, follow: false } };
}

export default function BisnisLayout({ children }: { children: ReactNode }) {
  return children;
}
