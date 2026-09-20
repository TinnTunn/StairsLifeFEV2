// Klien API pengaturan akun.

import { apiFetch } from "./client";

export const akun = {
  gantiPassword: (payload: { current_password?: string; new_password: string }) =>
    apiFetch<{ token: string; refresh_token: string }>("/account/password", { method: "PATCH", body: payload }),

  mintaGantiEmail: (payload: { new_email: string; password: string }) =>
    apiFetch<{ pending_email: string }>("/account/email", { method: "POST", body: payload }),

  konfirmasiEmail: (token: string) =>
    apiFetch<{ email: string }>("/account/email/confirm", { method: "POST", body: { token }, anonymous: true }),

  hapus: (payload: { password: string; reason?: string }) =>
    apiFetch<null>("/account/delete", { method: "POST", body: payload }),
};
