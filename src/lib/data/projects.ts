import { teksGalat } from "@/i18n/aktif";
import type { Bahasa } from "@/i18n/jenis";
import { ApiError, USE_MOCK } from "../api/client";
import { projects as api, type ProjectFilter } from "../api/projects";
import { MOCK_PROJECTS } from "../mock/projects";
import type { Project } from "../types";

/* Satu titik peralihan antara data contoh dan API sungguhan.
   Halaman tidak pernah memeriksa USE_MOCK sendiri, jadi menyalakan backend
   hanya perlu mengubah satu env var, bukan menyunting setiap layar. */

export interface ProjectListResult {
  items: Project[];
  /** true saat isinya data contoh, dipakai untuk menampilkan penanda ke pengguna. */
  sample: boolean;
  /** Terisi kalau backend menyala tapi gagal dihubungi. */
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

/** bahasa diisi pemanggil di server, karena cookie bahasa tidak terbaca dari sini. */
export async function listProjects(filter: ProjectFilter = {}, bahasa?: Bahasa): Promise<ProjectListResult> {
  if (USE_MOCK) return { items: filterMock(filter), sample: true };
  try {
    /* Endpoint publik tanpa guard, jadi aman dipanggil dari Server Component
       tanpa token. revalidate 60 detik: daftar proyek berubah dalam hitungan
       jam, bukan detik. */
    const items = await api.list(filter, { revalidate: 60 });
    /* Alasannya sama dengan ambil() di data/work: daftar yang datang bukan
       daftar dijadikan kosong, bukan dibiarkan menjatuhkan halaman. */
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
