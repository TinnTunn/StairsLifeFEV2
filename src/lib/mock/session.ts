// Akun contoh dan proses masuk tiruan.

import type { AuthResult, UserRole } from "../types";

const AKUN: Record<UserRole, { id: string; full_name: string; email: string; is_verified: boolean }> = {
  mahasiswa: {
    id: "s0000000-0000-4000-8000-000000000001",
    full_name: "Rani Pratiwi",
    email: "rani@contoh.id",
    is_verified: true,
  },
  bisnis: {
    id: "b1111111-1111-4111-8111-111111111111",
    full_name: "Kopi Senja Malang",
    email: "halo@contoh.id",
    is_verified: true,
  },
  admin: {
    id: "a0000000-0000-4000-8000-000000000001",
    full_name: "Admin StairsLife",
    email: "admin@contoh.id",
    is_verified: true,
  },
};

export const AKUN_CONTOH = Object.entries(AKUN).map(([role, a]) => ({
  role: role as UserRole,
  email: a.email,
  nama: a.full_name,
}));

export function mockLogin(email: string): AuthResult | null {
  const entry = Object.entries(AKUN).find(([, a]) => a.email === email.trim().toLowerCase());
  if (!entry) return null;
  const [role, akun] = entry;
  return {
    user: { ...akun, role: role as UserRole, tier: "menengah", email_verified: true },
    token: "contoh-tanpa-backend",
    refresh_token: "contoh-tanpa-backend",
  };
}
