import type { AuthResult, UserRole } from "../types";
import { apiFetch } from "./client";

/* ValidationPipe backend memakai forbidNonWhitelisted, jadi satu field asing
   membuat permintaan ditolak 400. Payload di bawah harus persis sama dengan
   DTO-nya, tidak boleh ada tambahan. */

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  /** admin ditolak backend: akun admin dibuat internal. */
  role: Exclude<UserRole, "admin">;
  university?: string;
  major?: string;
  semester?: number;
  phone?: string;
  company_name?: string;
}

export const auth = {
  register: (payload: RegisterPayload) =>
    apiFetch<AuthResult>("/auth/register", { method: "POST", body: payload, anonymous: true }),

  login: (email: string, password: string) =>
    apiFetch<AuthResult>("/auth/login", {
      method: "POST",
      body: { email, password },
      anonymous: true,
    }),

  /** Refresh token dikirim di body, bukan header Authorization. */
  refresh: (refresh_token: string) =>
    apiFetch<AuthResult>("/auth/refresh", {
      method: "POST",
      body: { refresh_token },
      anonymous: true,
    }),

  verifyEmail: (token: string) =>
    apiFetch<{ email_verified: true }>("/auth/verify-email", {
      method: "POST",
      body: { token },
      anonymous: true,
    }),

  resendVerification: (email: string) =>
    apiFetch<null>("/auth/resend-verification", {
      method: "POST",
      body: { email },
      anonymous: true,
    }),

  forgotPassword: (email: string) =>
    apiFetch<null>("/auth/forgot-password", { method: "POST", body: { email }, anonymous: true }),

  resetPassword: (token: string, new_password: string) =>
    apiFetch<null>("/auth/reset-password", {
      method: "POST",
      body: { token, new_password },
      anonymous: true,
    }),

  /* Mencabut sesi refresh di server. Dikirim tanpa Authorization: access
     token yang kedaluwarsa akan memicu refresh, yang merotasi refresh token
     sebelum logout sempat mencabut yang lama. */
  logout: (refresh_token?: string) =>
    apiFetch<null>("/auth/logout", {
      method: "POST",
      body: refresh_token ? { refresh_token } : {},
      anonymous: true,
    }),

  suspendedAppeal: (email: string, message: string) =>
    apiFetch<null>("/auth/suspended-appeal", {
      method: "POST",
      body: { email, message },
      anonymous: true,
    }),
};
