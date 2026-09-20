// Penyedia bahasa aktif dan kamusnya ke seluruh komponen klien.

"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState, useTransition, type ReactNode } from "react";
import { BAHASA_COOKIE, type Bahasa } from "./jenis";
import { KAMUS, type Kamus } from "./kamus";

interface NilaiBahasa {
  bahasa: Bahasa;
  t: Kamus;
  gantiBahasa: (bahasa: Bahasa) => void;
  sedangGanti: boolean;
}

const Konteks = createContext<NilaiBahasa | null>(null);

export function BahasaProvider({ awal, children }: { awal: Bahasa; children: ReactNode }) {
  const router = useRouter();
  const [bahasa, setBahasa] = useState<Bahasa>(awal);
  const [sedangGanti, mulaiTransisi] = useTransition();

  const gantiBahasa = useCallback(
    (baru: Bahasa) => {
      document.cookie = `${BAHASA_COOKIE}=${baru}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = baru;
      setBahasa(baru);
      mulaiTransisi(() => router.refresh());
    },
    [router],
  );

  const nilai = useMemo(() => ({ bahasa, t: KAMUS[bahasa], gantiBahasa, sedangGanti }), [bahasa, gantiBahasa, sedangGanti]);

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function useBahasa(): NilaiBahasa {
  const nilai = useContext(Konteks);
  if (!nilai) throw new Error("useBahasa dipakai di luar BahasaProvider.");
  return nilai;
}
