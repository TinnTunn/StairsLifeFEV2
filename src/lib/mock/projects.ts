// Data contoh proyek untuk mode tanpa backend.

import type { Project } from "../types";

function iso(daysFromNow: number): string {
  const d = new Date("2026-09-08T09:00:00+07:00");
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    business_id: "b1111111-1111-4111-8111-111111111111",
    title: "Desain menu dan papan harga Kopi Senja",
    description:
      "Kedai kami pindah ke tempat baru dan butuh menu cetak plus papan harga di dinding. Gaya hangat, mudah dibaca dari jarak dua meter. File akhir siap cetak.",
    budget_min: 2000000,
    budget_max: 2500000,
    deadline: iso(21),
    category: "Desain grafis",
    tier: "menengah",
    skills: ["Figma", "Tipografi", "Siap cetak"],
    deliverables: "Menu A3, papan harga 60x90 cm, file sumber",
    status: "open",
    applicant_count: 7,
    created_at: iso(-2),
    updated_at: iso(-2),
    users: { id: "b1111111-1111-4111-8111-111111111111", full_name: "Kopi Senja Malang", is_verified: true },
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    business_id: "b2222222-2222-4222-8222-222222222222",
    title: "Foto produk 20 item untuk katalog online",
    description:
      "Butuh foto produk dengan latar polos untuk diunggah ke marketplace. Barang bisa diambil di toko atau dikirim.",
    budget_min: 1200000,
    budget_max: 1800000,
    deadline: iso(14),
    category: "Fotografi",
    tier: "pemula",
    skills: ["Fotografi produk", "Lightroom"],
    deliverables: "20 foto, format JPG dan PNG latar transparan",
    status: "open",
    applicant_count: 12,
    created_at: iso(-5),
    updated_at: iso(-5),
    users: { id: "b2222222-2222-4222-8222-222222222222", full_name: "Toko Rempah Bu Sri", is_verified: false },
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    business_id: "b3333333-3333-4333-8333-333333333333",
    title: "Landing page satu halaman untuk jasa laundry",
    description:
      "Satu halaman berisi layanan, harga, dan tombol WhatsApp. Sudah punya logo dan warna. Perlu responsif di HP.",
    budget_min: 3000000,
    budget_max: 4500000,
    deadline: iso(30),
    category: "Pengembangan web",
    tier: "mahir",
    skills: ["HTML", "CSS", "Responsif"],
    deliverables: "Satu halaman siap tayang plus panduan singkat",
    status: "open",
    applicant_count: 3,
    created_at: iso(-1),
    updated_at: iso(-1),
    users: { id: "b3333333-3333-4333-8333-333333333333", full_name: "Laundry Kilat Sawojajar", is_verified: true },
  },
];
