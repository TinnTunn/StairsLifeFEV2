import type { Contract } from "../types";
import { apiFetch } from "./client";

export interface CreateContractPayload {
  application_id: string;
  agreed_budget: number;
  deadline: string;
}

export interface UploadDeliverablePayload {
  deliverable_url?: string;
  deliverable_urls?: string[];
  deliverable_notes?: string;
  progress_pct?: number;
}

/** Satu baris riwayat kiriman. users adalah peninjau (reviewed_by), bukan pengirim. */
export interface ContractDeliverable {
  id: string;
  contract_id: string;
  deliverable_url: string;
  deliverable_notes: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  users?: { id: string; full_name: string } | null;
}

export const contracts = {
  create: (payload: CreateContractPayload) =>
    apiFetch<Contract>("/contracts", { method: "POST", body: payload }),

  /** Backend memilih sisi mahasiswa atau bisnis dari role di token. */
  mine: () => apiFetch<Contract[]>("/contracts/my"),

  detail: (id: string) => apiFetch<Contract>(`/contracts/${id}`),

  deliverables: (id: string) => apiFetch<ContractDeliverable[]>(`/contracts/${id}/deliverables`),

  submitDeliverable: (id: string, payload: UploadDeliverablePayload) =>
    apiFetch<Contract>(`/contracts/${id}/deliverable`, { method: "PATCH", body: payload }),

  /* Menyetujui hasil sekaligus melepas escrow: pembayaran berpindah ke released
     dan saldo mahasiswa bertambah net_amount dalam satu transaksi. */
  approve: (id: string, deliverableId?: string) =>
    apiFetch<Contract>(`/contracts/${id}/approve`, {
      method: "PATCH",
      body: deliverableId ? { deliverable_id: deliverableId } : {},
    }),

  /** Field-nya reason, bukan rejection_reason: nama lain ditolak 400. */
  reject: (id: string, reason?: string, deliverableId?: string) =>
    apiFetch<Contract>(`/contracts/${id}/reject`, {
      method: "PATCH",
      body: { reason, ...(deliverableId ? { deliverable_id: deliverableId } : {}) },
    }),
};
