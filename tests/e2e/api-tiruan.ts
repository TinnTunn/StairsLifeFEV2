import type { Page, Route } from "@playwright/test";

/* API tiruan untuk uji E2E. Bentuk respons mengikuti envelope backend
   ({ success, data, message }) dan kode galat dari filter global. */

export const API = "http://localhost:3000/api/v1";

export type Penangan = (route: Route, body: unknown) => unknown | Promise<unknown>;

export function ok(data: unknown) {
  return { status: 200, body: { success: true, data, message: "Berhasil", timestamp: new Date().toISOString() } };
}

export function galat(status: number, code: string, message: string | string[]) {
  return { status, body: { success: false, statusCode: status, code, message, timestamp: new Date().toISOString() } };
}

export const PENGATURAN = {
  platform_fee: 5,
  withdrawal_min_amount: 50000,
  withdrawal_admin_fee: 2500,
  verification_sla_days: 2,
};

export function pengguna(role: "mahasiswa" | "bisnis" | "admin", tambahan: Record<string, unknown> = {}) {
  return {
    id: `u-${role}`,
    full_name: role === "admin" ? "Admin Uji" : role === "bisnis" ? "Toko Uji" : "Mahasiswa Uji",
    email: `${role}@contoh.id`,
    role,
    tier: "pemula",
    is_verified: true,
    is_suspended: false,
    suspension_reason: null,
    email_verified: true,
    avatar_url: null,
    ...tambahan,
  };
}

/** Pasang sesi di localStorage sebelum skrip halaman berjalan. */
export async function pasangSesi(page: Page, role: "mahasiswa" | "bisnis" | "admin", tambahan: Record<string, unknown> = {}) {
  const sesi = { token: "token-uji", refresh_token: "refresh-uji", user: pengguna(role, tambahan) };
  await page.addInitScript((isi) => {
    window.localStorage.setItem("stairslife-session", isi);
  }, JSON.stringify(sesi));
}

/**
 * Mock semua permintaan ke API. `rute` dicocokkan dengan "METHOD /path"
 * (tanpa query). Rute yang tidak didaftarkan dibalas data kosong yang aman,
 * supaya halaman tidak bergantung pada backend sungguhan.
 */
export async function mockApi(page: Page, rute: Record<string, Penangan> = {}) {
  await page.route(`${API}/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const jalur = url.pathname.replace("/api/v1", "");
    const kunci = `${req.method()} ${jalur}`;
    let body: unknown = null;
    try {
      body = req.postDataJSON();
    } catch {
      body = null;
    }

    const cocok = Object.entries(rute).find(([pola]) => {
      const [metode, jalurPola] = pola.split(" ");
      if (metode !== req.method()) return false;
      const re = new RegExp(`^${jalurPola.replace(/:[a-z]+/gi, "[^/]+")}$`);
      return re.test(jalur);
    });

    let hasil: unknown;
    if (cocok) hasil = await cocok[1](route, body);
    else hasil = bawaan(kunci);

    const { status, body: isi } = hasil as { status: number; body: unknown };
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(isi) });
  });
}

function bawaan(kunci: string) {
  if (kunci === "GET /settings/public") return ok(PENGATURAN);
  if (kunci === "GET /notifications/unread-count") return ok({ count: 0 });
  if (kunci === "GET /notifications") return ok([]);
  if (kunci === "GET /users/me") return ok(pengguna("mahasiswa"));
  if (kunci.startsWith("GET ")) return ok([]);
  return ok(null);
}
