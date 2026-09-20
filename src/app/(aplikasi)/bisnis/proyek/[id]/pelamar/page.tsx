// Rute lama daftar pelamar yang kini mengarah ke detail proyek.

import { redirect } from "next/navigation";

export default async function PelamarLama({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/bisnis/proyek/${id}#pelamar`);
}
