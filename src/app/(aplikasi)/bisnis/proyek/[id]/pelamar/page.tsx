import { redirect } from "next/navigation";

/**
 * Daftar pelamar sekarang menyatu dengan detail proyek, supaya brief dan
 * pelamarnya dibaca di satu layar. Rute lama dipertahankan sebagai pengalihan:
 * backend mengirim deep link /projects/:id/applications di notifikasi dan
 * email, dan tautan itu dipetakan ke sini lewat next.config.ts.
 */
export default async function PelamarLama({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/bisnis/proyek/${id}#pelamar`);
}
