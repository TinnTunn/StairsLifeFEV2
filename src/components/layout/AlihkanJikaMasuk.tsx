// Pengalih pengguna yang sudah masuk menjauh dari halaman tamu.

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { sedangKeluar, sedangMasuk } from "@/lib/api/session";
import { useSesi } from "@/lib/api/useSesi";
import { BERANDA_PERAN } from "./nav-items";

export function AlihkanJikaMasuk() {
  const router = useRouter();
  const { session, siap } = useSesi();

  useEffect(() => {
    if (siap && session && !sedangKeluar() && !sedangMasuk()) router.replace(BERANDA_PERAN[session.user.role]);
  }, [siap, session, router]);

  return null;
}
