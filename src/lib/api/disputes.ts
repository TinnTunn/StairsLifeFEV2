import type { DisputeSummary, Payment, UserRole } from "../types";
import { apiFetch } from "./client";

type Pihak = { id: string; full_name: string; role?: UserRole };

export type DisputeRingkas = DisputeSummary & {
  resolved_at: string | null;
  opened_by: string;
  opened_by_me: boolean;
  opener: Pihak | null;
};

export interface DisputeDetail {
  id: string;
  contract_id: string;
  opened_by: string;
  reason: string;
  evidence_url: string | null;
  status: string | null;
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
  /** Porsi mahasiswa dari putusan, dari wallet_transactions. null bila tidak ada. */
  student_share: number | null;
  users_disputes_opened_byTousers: Pihak | null;
  contracts: {
    id: string;
    status: string;
    agreed_budget: number;
    student_id: string;
    business_id: string;
    projects: { id: string; title: string } | null;
    users_contracts_student_idTousers: Pihak | null;
    users_contracts_business_idTousers: Pihak | null;
    payments: Array<Pick<Payment, "id" | "status" | "amount" | "platform_fee" | "net_amount">>;
  } | null;
}

/** Status yang berarti sengketa masih berjalan dan dana ditahan. */
export const SENGKETA_AKTIF = ["open", "under_review", "in_review", "mediation"];

export function sengketaAktif(status: string | null | undefined): boolean {
  return SENGKETA_AKTIF.includes(status ?? "open");
}

export const disputes = {
  /** CreateDisputeDto: contract_id, reason (min 20), evidence_url opsional. */
  create: (payload: { contract_id: string; reason: string; evidence_url?: string }) =>
    apiFetch<{ id: string; status: string }>("/disputes", { method: "POST", body: payload }),

  /** Sengketa yang dibuka sendiri maupun yang melibatkan kontrak milik pengguna. */
  mine: () => apiFetch<DisputeRingkas[]>("/disputes/my"),

  detail: (id: string) => apiFetch<DisputeDetail>(`/disputes/${id}`),

  /** Backend menimpa evidence_url, jadi pemanggil mengirim daftar lengkap. */
  setEvidence: (id: string, evidence_url: string) =>
    apiFetch<DisputeDetail>(`/disputes/${id}/evidence`, { method: "POST", body: { evidence_url } }),
};

/** Beberapa berkas bukti disimpan sebagai JSON array di kolom teks yang sama. */
export function gabungBukti(paths: string[]): string | undefined {
  if (paths.length === 0) return undefined;
  return paths.length === 1 ? paths[0] : JSON.stringify(paths);
}
