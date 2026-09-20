// Pengaturan publik dari backend beserta perhitungan komisinya.

"use client";

import { useEffect, useState } from "react";
import { apiFetch, USE_MOCK } from "./api/client";

export interface PengaturanPublik {
  platform_fee: number;
  withdrawal_min_amount: number;
  withdrawal_admin_fee: number;
  verification_sla_days: number;
}

const CONTOH: PengaturanPublik = {
  platform_fee: 5,
  withdrawal_min_amount: 50_000,
  withdrawal_admin_fee: 2_500,
  verification_sla_days: 2,
};

export function hitungKomisi(nominal: number, persen: number): number {
  return Math.round((Number(nominal) || 0) * (persen / 100));
}

const UMUR_CACHE = 60_000;
let tersimpan: { nilai: PengaturanPublik; waktu: number } | null = null;
let berjalan: Promise<PengaturanPublik> | null = null;

export function ambilPengaturanPublik(): Promise<PengaturanPublik> {
  if (USE_MOCK) return Promise.resolve(CONTOH);
  if (tersimpan && Date.now() - tersimpan.waktu < UMUR_CACHE) return Promise.resolve(tersimpan.nilai);
  if (berjalan) return berjalan;
  berjalan = apiFetch<PengaturanPublik>("/settings/public", { anonymous: true })
    .then((nilai) => {
      tersimpan = { nilai, waktu: Date.now() };
      return nilai;
    })
    .finally(() => {
      berjalan = null;
    });
  return berjalan;
}

export interface StatusPengaturan {
  data: PengaturanPublik | null;
  loading: boolean;
  gagal: boolean;
}

export function usePengaturanPublik(): StatusPengaturan {
  const [status, setStatus] = useState<StatusPengaturan>(() =>
    tersimpan ? { data: tersimpan.nilai, loading: false, gagal: false } : { data: null, loading: true, gagal: false },
  );

  useEffect(() => {
    let batal = false;
    ambilPengaturanPublik()
      .then((data) => {
        if (!batal) setStatus({ data, loading: false, gagal: false });
      })
      .catch(() => {
        if (!batal) setStatus({ data: null, loading: false, gagal: true });
      });
    return () => {
      batal = true;
    };
  }, []);

  return status;
}
