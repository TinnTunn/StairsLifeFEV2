import type { Application, ApplicationStatus } from "../types";
import { apiFetch } from "./client";

export interface CreateApplicationPayload {
  project_id: string;
  /** Backend menolak di bawah 50 karakter. */
  cover_letter: string;
  estimated_completion: string;
  offered_budget?: number;
}

export const applications = {
  create: (payload: CreateApplicationPayload) =>
    apiFetch<Application>("/applications", { method: "POST", body: payload }),

  mine: () => apiFetch<Application[]>("/applications/my"),

  byProject: (projectId: string) =>
    apiFetch<Application[]>(`/applications/project/${projectId}`),

  detail: (id: string) => apiFetch<Application>(`/applications/${id}`),

  /* Menyetujui satu lamaran otomatis menolak semua lamaran pending dan
     shortlisted lain di proyek yang sama. Jumlahnya hanya muncul di message,
     bukan di data, karena interceptor global membuang kunci meta. */
  setStatus: (id: string, status: ApplicationStatus) =>
    apiFetch<Application>(`/applications/${id}/status`, { method: "PATCH", body: { status } }),

  /** Hanya boleh saat status masih pending atau shortlisted. */
  cancel: (id: string) => apiFetch<{ id: string }>(`/applications/${id}`, { method: "DELETE" }),
};
