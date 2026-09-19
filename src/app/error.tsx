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

  /* Digest-nya dicatat supaya kesalahan ini bisa dicocokkan dengan log server.
     Pesan aslinya tidak ditampilkan ke pengguna: isinya bisa memuat detail
     internal yang tidak berguna dan tidak seharusnya terlihat. */
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
