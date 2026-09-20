// Klien API lamaran.

import type { Application, ApplicationStatus } from "../types";
import { apiFetch } from "./client";

export interface CreateApplicationPayload {
  project_id: string;
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

  setStatus: (id: string, status: ApplicationStatus) =>
    apiFetch<Application>(`/applications/${id}/status`, { method: "PATCH", body: { status } }),

  cancel: (id: string) => apiFetch<{ id: string }>(`/applications/${id}`, { method: "DELETE" }),
};
