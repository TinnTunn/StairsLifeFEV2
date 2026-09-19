import type { Project, ProjectTier } from "../types";
import { apiFetch } from "./client";

/**
 * Backend hanya menerima tiga filter ini dan tidak punya paginasi.
 * Filter lokasi, tipe kerja, rentang gaji, dan jadwal yang ada di spesifikasi
 * layar belum punya dukungan backend, jadi sengaja tidak diikutkan: filter yang
 * dikirim tapi diabaikan akan terlihat bekerja lalu gagal saat disambungkan.
 */
export interface ProjectFilter {
  [key: string]: string | undefined;
  search?: string;
  tier?: ProjectTier;
  category?: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  /** ISO 8601. */
  deadline: string;
  category: string;
  tier: ProjectTier;
  skills?: string[];
  deliverables?: string;
}

export const projects = {
  /** Publik, tanpa guard, jadi bisa dipanggil dari Server Component tanpa token. */
  list: (filter: ProjectFilter = {}, next?: { revalidate?: number }) =>
    apiFetch<Project[]>("/projects", { query: filter, anonymous: true, next }),

  /** Publik. id berupa UUID: backend tidak punya kolom slug. */
  detail: (id: string, next?: { revalidate?: number }) =>
    apiFetch<Project>(`/projects/${id}`, { anonymous: true, next }),

  mine: () => apiFetch<Project[]>("/projects/my"),

  create: (payload: CreateProjectPayload) =>
    apiFetch<Project>("/projects", { method: "POST", body: payload }),

  update: (id: string, payload: Partial<CreateProjectPayload>) =>
    apiFetch<Project>(`/projects/${id}`, { method: "PATCH", body: payload }),

  remove: (id: string) => apiFetch<{ id: string }>(`/projects/${id}`, { method: "DELETE" }),
};
