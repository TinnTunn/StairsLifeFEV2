// Klien API proyek.

import type { Project, ProjectTier } from "../types";
import { apiFetch } from "./client";

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
  deadline: string;
  category: string;
  tier: ProjectTier;
  skills?: string[];
  deliverables?: string;
}

export const projects = {
  list: (filter: ProjectFilter = {}, next?: { revalidate?: number }) =>
    apiFetch<Project[]>("/projects", { query: filter, anonymous: true, next }),

  detail: (id: string, next?: { revalidate?: number }) =>
    apiFetch<Project>(`/projects/${id}`, { anonymous: true, next }),

  mine: () => apiFetch<Project[]>("/projects/my"),

  create: (payload: CreateProjectPayload) =>
    apiFetch<Project>("/projects", { method: "POST", body: payload }),

  update: (id: string, payload: Partial<CreateProjectPayload>) =>
    apiFetch<Project>(`/projects/${id}`, { method: "PATCH", body: payload }),

  remove: (id: string) => apiFetch<{ id: string }>(`/projects/${id}`, { method: "DELETE" }),
};
