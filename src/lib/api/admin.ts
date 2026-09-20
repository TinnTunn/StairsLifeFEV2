// Klien API panel admin.

import type {
  BankAccount,
  Contract,
  DisputeOutcome,
  Pagination,
  Payment,
  PaymentStatus,
  Project,
  User,
  UserRole,
  UserTier,
  Verification,
} from "../types";
import { apiFetch } from "./client";

export interface TitikTren {
  date: string;
  count: number;
}

export interface AdminStats {
  total_users: number;
  total_projects: number;
  active_projects: number;
  pending_verifications: number;
  active_disputes: number;
  project_trend: TitikTren[];
  registration_trend: TitikTren[];
}

export type AdminUser = Pick<
  User,
  | "id"
  | "full_name"
  | "email"
  | "role"
  | "is_verified"
  | "is_suspended"
  | "suspension_reason"
  | "created_at"
  | "avatar_url"
  | "university"
  | "major"
  | "company_name"
  | "phone"
> & { tier: UserTier };

export interface AdminVerification extends Verification {
  user: { id: string; full_name: string; email: string; university: string | null } | null;
}

type Pihak = { id: string; full_name: string; role: UserRole };

export interface AdminDispute {
  id: string;
  contract_id: string;
  opened_by: string;
  reason: string;
  evidence_url: string | null;
  status: string | null;
  admin_notes: string | null;
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
  contracts: Omit<Contract, "projects" | "users_contracts_student_idTousers" | "users_contracts_business_idTousers"> & {
    projects: { id: string; title: string } | null;
    users_contracts_student_idTousers: Pihak | null;
    users_contracts_business_idTousers: Pihak | null;
  };
  users_disputes_opened_byTousers: Pihak | null;
}

export interface ResolveDisputePayload {
  status: "under_review" | "resolved" | "rejected";
  outcome?: DisputeOutcome;
  student_share_percent?: number;
  admin_notes?: string;
}

export type AdminProject = Project & { business: { id: string; full_name: string } | null };

export interface Announcement {
  id: string;
  title: string;
  body: string;
  target: "all" | "student" | "bisnis";
  sent_by: string | null;
  created_at: string;
}

export interface FinanceSummary {
  summary: {
    total_komisi: number;
    total_gmv: number;
    total_transaksi: number;
    komisi_hari_ini: number;
    komisi_minggu_ini: number;
    komisi_bulan_ini: number;
  };
  daily_trend: { date: string; komisi: number }[];
}

export interface FinancePayment extends Omit<Payment, "contracts"> {
  status: PaymentStatus;
  contracts: {
    id: string;
    projects: { id: string; title: string; category: string } | null;
    users_contracts_student_idTousers: { id: string; full_name: string } | null;
    users_contracts_business_idTousers: { id: string; full_name: string } | null;
  } | null;
}

export interface PlatformSettings {
  platform_fee: number;
  verification_sla_days: number;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export const IZIN_ADMIN = [
  "Overview",
  "Projects",
  "Users",
  "Verification",
  "Disputes",
  "Finance",
  "Support",
  "Announcement",
  "Settings",
] as const;
export type IzinAdmin = (typeof IZIN_ADMIN)[number];

export interface AksesAdmin {
  penuh: boolean;
  izin: IzinAdmin[];
  peran: string[];
}

export interface HalamanPengguna {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  members: string[];
  is_system: boolean;
  created_at: string;
}

export interface AdminWithdrawal {
  id: string;
  user_id: string;
  amount_gross: number;
  admin_fee: number;
  amount_net: number;
  status: "pending" | "processing" | "completed" | "rejected" | "failed";
  rejection_reason: string | null;
  processed_at: string | null;
  requested_at: string;
  bank_account: BankAccount | null;
  users: { id: string; full_name: string; email: string } | null;
}

export interface SupportRoom {
  room_id: string;
  user_id: string | null;
  user_name: string | null;
  user_role: UserRole | null;
  is_suspended: boolean | null;
  suspension_reason: string | null;
  last_message: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_role: string | null;
  content: string;
  created_at: string;
  sender: { id: string; full_name: string; role: UserRole } | null;
}

export const admin = {
  me: () =>
    apiFetch<Partial<AksesAdmin> | null>("/admin/me").then(
      (r): AksesAdmin => ({
        penuh: r?.penuh === true || !Array.isArray(r?.izin),
        izin: Array.isArray(r?.izin) ? r.izin : [],
        peran: Array.isArray(r?.peran) ? r.peran : [],
      }),
    ),

  stats: () => apiFetch<AdminStats>("/admin/stats"),

  users: (role?: "mahasiswa" | "bisnis") => apiFetch<AdminUser[]>("/admin/users", { query: { role } }),
  cariUsers: (q: { role: "mahasiswa" | "bisnis"; q?: string; status?: string; page: number; limit?: number }) =>
    apiFetch<HalamanPengguna>("/admin/users", {
      query: { role: q.role, q: q.q, status: q.status === "semua" ? undefined : q.status, page: q.page, limit: q.limit ?? 20 },
    }),
  toggleSuspend: (id: string, reason?: string) =>
    apiFetch<AdminUser>(`/admin/users/${id}/suspend`, { method: "PATCH", body: reason ? { reason } : {} }),

  verifications: (status: "pending" | "approved" | "rejected") =>
    apiFetch<AdminVerification[]>("/admin/verifications", { query: { status } }),
  reviewVerification: (id: string, status: "approved" | "rejected", rejection_reason?: string) =>
    apiFetch<Verification>(`/admin/verifications/${id}`, {
      method: "PATCH",
      body: rejection_reason ? { status, rejection_reason } : { status },
    }),

  disputes: (status?: string) => apiFetch<AdminDispute[]>("/admin/disputes", { query: { status } }),
  dispute: (id: string) => apiFetch<AdminDispute>(`/admin/disputes/${id}`),
  resolveDispute: (id: string, payload: ResolveDisputePayload) =>
    apiFetch<AdminDispute>(`/admin/disputes/${id}`, { method: "PATCH", body: payload }),

  projects: (status?: string) => apiFetch<AdminProject[]>("/admin/projects", { query: { status } }),
  deleteProject: (id: string) => apiFetch<{ id: string }>(`/admin/projects/${id}`, { method: "DELETE" }),

  announcements: () => apiFetch<Announcement[]>("/admin/announcements"),
  sendAnnouncement: (payload: Pick<Announcement, "title" | "body" | "target">) =>
    apiFetch<Announcement>("/admin/announcements", { method: "POST", body: payload }),

  finances: () =>
    apiFetch<Partial<FinanceSummary> | null>("/admin/finances").then(
      (r): FinanceSummary => ({
        summary: (r?.summary ?? {}) as FinanceSummary["summary"],
        daily_trend: Array.isArray(r?.daily_trend) ? r.daily_trend : [],
      }),
    ),
  financeDetail: (page: number, status?: string) =>
    apiFetch<{ payments: FinancePayment[]; pagination: Pagination }>("/admin/finances/detail", {
      query: { page, limit: 20, status },
    }),

  settings: () => apiFetch<PlatformSettings>("/admin/settings"),
  updateSettings: (payload: Partial<PlatformSettings>) =>
    apiFetch<PlatformSettings>("/admin/settings", { method: "PATCH", body: payload }),

  auditLogs: (limit = 30) => apiFetch<AuditLog[]>("/admin/audit-logs", { query: { limit } }),

  roles: () => apiFetch<AdminRole[]>("/admin/roles"),
  createRole: (payload: { name: string; description?: string; permissions?: string[]; members?: string[] }) =>
    apiFetch<AdminRole>("/admin/roles", { method: "POST", body: payload }),
  updateRole: (id: string, payload: { name?: string; description?: string; permissions?: string[]; members?: string[] }) =>
    apiFetch<AdminRole>(`/admin/roles/${id}`, { method: "PATCH", body: payload }),
  deleteRole: (id: string) => apiFetch<unknown>(`/admin/roles/${id}`, { method: "DELETE" }),

  withdrawals: (page: number, status?: string) =>
    apiFetch<{ items: AdminWithdrawal[]; pagination: Pagination }>("/withdrawals", {
      query: { page, limit: 20, status },
    }),
  processWithdrawal: (id: string, payload: { action: "approve" | "reject"; reason?: string; use_xendit?: boolean }) =>
    apiFetch<{ id: string; status: string }>(`/withdrawals/${id}/process`, { method: "PATCH", body: payload }),

  supportInbox: () => apiFetch<SupportRoom[]>("/chat/support-inbox"),
  supportHistory: (roomId: string) => apiFetch<SupportMessage[]>(`/chat/support-history/${encodeURIComponent(roomId)}`),
  supportReply: (roomId: string, content: string) =>
    apiFetch<SupportMessage>(`/chat/support/${encodeURIComponent(roomId)}/reply`, { method: "POST", body: { content } }),
};
