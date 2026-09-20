// Hook sesi pengguna yang sedang masuk.

"use client";

import { useEffect, useSyncExternalStore } from "react";
import { USE_MOCK } from "./client";
import { readSession, writeSession, type Session } from "./session";
import { users } from "./users";

function subscribe(onChange: () => void) {
  window.addEventListener("stairslife-session-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("stairslife-session-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

const tanpaLangganan = () => () => {};

const JEDA_MS = 60_000;
let terakhir = 0;
let berjalan: Promise<void> | null = null;

export function segarkanSesi(): Promise<void> {
  const awal = readSession();
  if (USE_MOCK || !awal || Date.now() - terakhir < JEDA_MS) return Promise.resolve();
  if (berjalan) return berjalan;

  berjalan = users
    .me()
    .then((u) => {
      terakhir = Date.now();
      const kini = readSession();
      if (!kini || kini.user.id !== u.id) return;
      const user = {
        ...kini.user,
        full_name: u.full_name,
        tier: u.tier,
        is_verified: u.is_verified,
        is_suspended: u.is_suspended,
        suspension_reason: u.suspension_reason,
        avatar_url: u.avatar_url,
      };
      if (JSON.stringify(user) !== JSON.stringify(kini.user)) writeSession({ ...kini, user });
    })
    .catch(() => {
      /* Gagal jaringan: sesi lama tetap dipakai. Token yang benar-benar tidak
         berlaku sudah dibersihkan apiFetch, dan penjaga rute mengarahkan ke login. */
    })
    .finally(() => {
      berjalan = null;
    });
  return berjalan;
}

export function useSesi(): { session: Session | null; siap: boolean } {
  const session = useSyncExternalStore(subscribe, readSession, () => null);
  const siap = useSyncExternalStore(tanpaLangganan, () => true, () => false);

  useEffect(() => {
    void segarkanSesi();
  }, []);

  return { session, siap };
}
