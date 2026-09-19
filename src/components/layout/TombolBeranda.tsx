"use client";

import { Button } from "@/components/actions/Button";
import { useBahasa } from "@/i18n/BahasaProvider";
import { useSesi } from "@/lib/api/useSesi";
import { BERANDA_PERAN } from "./nav-items";

/**
 * Tombol pulang di halaman sistem (404 dan layar galat).
 *
 * Beranda publik menutup sesi (lihat AkhiriSesi), jadi mengirim pengguna yang
 * sudah masuk ke sana berarti mengeluarkan mereka hanya karena salah alamat.
 * Tombol ini mengarah ke beranda peran selama sesinya ada, dan baru ke beranda
 * publik untuk tamu.
 */
export function TombolBeranda({ variant = "secondary" }: { variant?: "primary" | "secondary" }) {
  const { session, siap } = useSesi();
  const { t } = useBahasa();

  const masuk = siap && session;
  return (
    <Button href={masuk ? BERANDA_PERAN[session.user.role] : "/"} variant={variant} size="lg">
      {masuk ? t.umum.aksi.keBeranda : t.sistem.tidakDitemukan.keBeranda}
    </Button>
  );
}
