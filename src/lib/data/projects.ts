// Pembaca proyek yang memilih antara data contoh dan backend.

import { teksGalat } from "@/i18n/aktif";
import type { Bahasa } from "@/i18n/jenis";
import { ApiError, USE_MOCK } from "../api/client";
import { projects as api, type ProjectFilter } from "../api/projects";
import { MOCK_PROJECTS } from "../mock/projects";
import type { Project } from "../types";

export interface ProjectListResult {
  items: Project[];
  sample: boolean;
  error?: string;
}

function filterMock(filter: ProjectFilter): Project[] {
  const q = filter.search?.toLowerCase().trim();
  return MOCK_PROJECTS.filter((p) => {
    if (filter.tier && p.tier !== filter.tier) return false;
    if (filter.category && !p.category.toLowerCase().includes(filter.category.toLowerCase())) return false;
    if (q && !(p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))) return false;
    return true;
  });
}

export async function listProjects(filter: ProjectFilter = {}, bahasa?: Bahasa): Promise<ProjectListResult> {
  if (USE_MOCK) return { items: filterMock(filter), sample: true };
  try {
    const items = await api.list(filter, { revalidate: 60 });
    return { items: Array.isArray(items) ? items : [], sample: false };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : teksGalat(bahasa).jaringan;
    return { items: [], sample: false, error: message };
  }
}

export async function getProject(
  id: string,
  bahasa?: Bahasa,
): Promise<{ project: Project | null; sample: boolean; error?: string }> {
  if (USE_MOCK) {
    return { project: MOCK_PROJECTS.find((p) => p.id === id) ?? null, sample: true };
  }
  try {
    return { project: await api.detail(id, { revalidate: 60 }), sample: false };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return { project: null, sample: false };
    const message = error instanceof ApiError ? error.message : teksGalat(bahasa).jaringan;
    return { project: null, sample: false, error: message };
  }
}
