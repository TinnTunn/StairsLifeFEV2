"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { sedangKeluar, sedangMasuk } from "@/lib/api/session";
import { useSesi } from "@/lib/api/useSesi";
import { BERANDA_PERAN } from "./nav-items";

/**
 * Halaman masuk dan daftar tidak berguna bagi yang sudah masuk. Tanpa ini,
 * menekan Back setelah login membuka formulir login lagi seolah sesi hilang.
 * replace, bukan push, supaya tidak menambah entri riwayat baru.
 */
export function AlihkanJikaMasuk() {
  const router = useRouter();
  const { session, siap } = useSesi();

  useEffect(() => {
    if (siap && session && !sedangKeluar() && !sedangMasuk()) router.replace(BERANDA_PERAN[session.user.role]);
  }, [siap, session, router]);

  return null;
}
