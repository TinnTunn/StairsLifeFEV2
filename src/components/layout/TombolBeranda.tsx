// Tombol kembali ke beranda sesuai peran pengguna.

"use client";

import { Button } from "@/components/actions/Button";
import { useBahasa } from "@/i18n/BahasaProvider";
import { useSesi } from "@/lib/api/useSesi";
import { BERANDA_PERAN } from "./nav-items";

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
