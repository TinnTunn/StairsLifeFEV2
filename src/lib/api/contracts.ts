// Klien API kontrak dan hasil kerja.

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

  mine: () => apiFetch<Contract[]>("/contracts/my"),

  detail: (id: string) => apiFetch<Contract>(`/contracts/${id}`),

  deliverables: (id: string) => apiFetch<ContractDeliverable[]>(`/contracts/${id}/deliverables`),

  submitDeliverable: (id: string, payload: UploadDeliverablePayload) =>
    apiFetch<Contract>(`/contracts/${id}/deliverable`, { method: "PATCH", body: payload }),

  approve: (id: string, deliverableId?: string) =>
    apiFetch<Contract>(`/contracts/${id}/approve`, {
      method: "PATCH",
      body: deliverableId ? { deliverable_id: deliverableId } : {},
    }),

  reject: (id: string, reason?: string, deliverableId?: string) =>
    apiFetch<Contract>(`/contracts/${id}/reject`, {
      method: "PATCH",
      body: { reason, ...(deliverableId ? { deliverable_id: deliverableId } : {}) },
    }),
};
