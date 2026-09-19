import type { Metadata } from "next";
import { ambilKamus } from "@/i18n/server";
import { TombolBeranda } from "@/components/layout/TombolBeranda";
import { LayarSistem } from "./LayarSistem";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: t.sistem.tidakDitemukan.meta, robots: { index: false, follow: false } };
}

export default async function TidakDitemukan() {
  const { t } = await ambilKamus();
  const n = t.sistem.tidakDitemukan;
  return (
    <LayarSistem
      kode={n.kode}
      judul={n.judul}
      isi={n.isi}
      aksi={
        <>
          <TombolBeranda variant="primary" />
        </>
      }
    />
  );
}
