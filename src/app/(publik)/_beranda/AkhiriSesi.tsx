// Pembersih sesi saat pengguna membuka beranda publik.

"use client";

import { useEffect } from "react";
import { auth } from "@/lib/api/auth";
import { clearSession, readSession, sedangKeluar } from "@/lib/api/session";
import { bersihkanCacheData } from "@/lib/useAsync";

export function AkhiriSesi() {
  useEffect(() => {
    let batal = false;
    void Promise.resolve().then(async () => {
      const sesi = readSession();
      if (batal || !sesi || sedangKeluar()) return;
      await Promise.allSettled([auth.logout(sesi.refresh_token)]);
      clearSession();
      bersihkanCacheData();
    });
    return () => {
      batal = true;
    };
  }, []);

  return null;
}
