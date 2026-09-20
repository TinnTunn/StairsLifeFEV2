// Layar kesalahan tak terduga untuk seluruh aplikasi.

"use client";

import { useEffect } from "react";
import { Button } from "@/components/actions/Button";
import { useBahasa } from "@/i18n/BahasaProvider";
import { TombolBeranda } from "@/components/layout/TombolBeranda";
import { LayarSistem } from "./LayarSistem";

export default function KesalahanTakTerduga({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useBahasa();
  const g = t.sistem.galat;

  useEffect(() => {
    console.error("Kesalahan halaman", error.digest ?? error.message);
  }, [error]);

  return (
    <LayarSistem
      icon="AlertTriangle"
      judul={g.judul}
      isi={g.isi}
      aksi={
        <>
          <Button onClick={reset} size="lg">
            {g.muatUlang}
          </Button>
          <TombolBeranda />
        </>
      }
    />
  );
}
