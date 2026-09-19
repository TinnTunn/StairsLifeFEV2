"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth } from "@/lib/api/auth";
import { clearSession, readSession, tandaiKeluar } from "@/lib/api/session";
import { bersihkanCacheData } from "@/lib/useAsync";
import { LayarProses } from "../feedback/LayarProses";

interface KonteksKeluar {
  keluar: (nama: string) => void;
}

const Konteks = createContext<KonteksKeluar | null>(null);

/* Layar keluar hidup di layout akar, bukan di shell aplikasi. Shell ikut
   dilepas begitu sesi dihapus, jadi layar yang dipasang di dalamnya akan hilang
   di tengah jalan dan pengguna sempat melihat "halaman ini butuh akun". */
const JEDA_MINIMUM = 700;

export function KeluarProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useBahasa();
  const [nama, setNama] = useState<string | null>(null);

  const keluar = useCallback(
    (namaPengguna: string) => {
      setNama(namaPengguna.split(" ")[0] || namaPengguna);
      tandaiKeluar(true);
      /* Jeda minimum supaya layar tidak hanya berkedip. Logout backend mencabut
         sesi refresh; kalau gagal (jaringan), token tetap dihapus di perangkat. */
      const refresh = readSession()?.refresh_token;
      void Promise.allSettled([auth.logout(refresh), new Promise((r) => setTimeout(r, JEDA_MINIMUM))]).then(() => {
        clearSession();
        bersihkanCacheData();
        router.replace("/");
      });
    },
    [router],
  );

  /* Layar ditutup setelah benar-benar sampai di beranda. */
  useEffect(() => {
    if (nama === null || pathname !== "/") return;
    const id = setTimeout(() => {
      setNama(null);
      tandaiKeluar(false);
    }, 250);
    return () => clearTimeout(id);
  }, [pathname, nama]);

  return (
    <Konteks.Provider value={{ keluar }}>
      {children}
      {nama !== null ? <LayarProses judul={t.umum.keluar.judul(nama)} isi={t.umum.keluar.isi} /> : null}
    </Konteks.Provider>
  );
}

export function useKeluar(): KonteksKeluar {
  const k = useContext(Konteks);
  if (!k) throw new Error("useKeluar harus dipakai di dalam KeluarProvider");
  return k;
}
