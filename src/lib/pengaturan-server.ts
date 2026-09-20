// Pembaca pengaturan publik di komponen server.

import { API_BASE } from "./api/client";
import type { PengaturanPublik } from "./pengaturan";

export async function ambilPengaturanServer(): Promise<PengaturanPublik | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "1") {
    return { platform_fee: 5, withdrawal_min_amount: 50_000, withdrawal_admin_fee: 2_500, verification_sla_days: 2 };
  }
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/settings/public`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: PengaturanPublik };
    return body.data ?? null;
  } catch {
    return null;
  }
}
