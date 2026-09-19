import type { Application, Contract, Payment, Wallet } from "../types";
import { MOCK_PROJECTS } from "./projects";

/* Data contoh untuk area terautentikasi. Nominal dan namanya mengikuti brief
   produk (Kopi Senja Malang, Rani Pratiwi). Setiap layar yang memakainya
   menampilkan penanda "data contoh" yang terlihat pengguna. */

const MAHASISWA = "s0000000-0000-4000-8000-000000000001";

function iso(daysFromNow: number, hour = 10): string {
  const d = new Date("2026-09-08T00:00:00+07:00");
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 32, 0, 0);
  return d.toISOString();
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    project_id: MOCK_PROJECTS[0].id,
    student_id: MAHASISWA,
    cover_letter:
      "Saya sudah pernah mengerjakan menu untuk dua kedai di Malang, keduanya siap cetak dan diterima percetakan tanpa revisi teknis. Saya bisa mulai minggu ini.",
    estimated_completion: iso(18),
    offered_budget: 2300000,
    status: "approved",
    created_at: iso(-2, 9),
    projects: {
      id: MOCK_PROJECTS[0].id,
      title: MOCK_PROJECTS[0].title,
      budget_min: MOCK_PROJECTS[0].budget_min,
      budget_max: MOCK_PROJECTS[0].budget_max,
      category: MOCK_PROJECTS[0].category,
      tier: MOCK_PROJECTS[0].tier,
      status: "inProgress",
      users: { id: MOCK_PROJECTS[0].business_id, full_name: "Kopi Senja Malang" },
    },
    contracts: [{ id: "c1111111-1111-4111-8111-111111111111", status: "active" }],
    users: {
      id: MAHASISWA,
      full_name: "Rani Pratiwi",
      avatar_url: null,
      tier: "menengah",
      is_verified: true,
      rating_avg: "4.80",
      total_projects: 6,
      skills: ["Figma", "Tipografi", "Siap cetak", "Ilustrasi"],
    },
  },
  {
    id: "a2222222-2222-4222-8222-222222222222",
    project_id: MOCK_PROJECTS[1].id,
    student_id: MAHASISWA,
    cover_letter:
      "Saya punya setup foto produk sendiri dengan latar polos dan lampu kontinu. Bisa mengambil barang di toko.",
    estimated_completion: iso(12),
    offered_budget: null,
    status: "shortlisted",
    created_at: iso(-4, 16),
    projects: {
      id: MOCK_PROJECTS[1].id,
      title: MOCK_PROJECTS[1].title,
      budget_min: MOCK_PROJECTS[1].budget_min,
      budget_max: MOCK_PROJECTS[1].budget_max,
      category: MOCK_PROJECTS[1].category,
      tier: MOCK_PROJECTS[1].tier,
      status: "open",
      users: { id: MOCK_PROJECTS[1].business_id, full_name: "Toko Rempah Bu Sri" },
    },
    contracts: [],
    users: {
      id: MAHASISWA,
      full_name: "Rani Pratiwi",
      avatar_url: null,
      tier: "menengah",
      is_verified: true,
      rating_avg: "4.80",
      total_projects: 6,
      skills: ["Figma", "Tipografi", "Siap cetak", "Ilustrasi"],
    },
  },
  {
    id: "a3333333-3333-4333-8333-333333333333",
    project_id: MOCK_PROJECTS[2].id,
    student_id: MAHASISWA,
    cover_letter:
      "Saya biasa membuat halaman satu layar dengan HTML dan CSS tanpa framework, jadi hasilnya ringan dibuka di HP.",
    estimated_completion: iso(26),
    offered_budget: 3800000,
    status: "pending",
    created_at: iso(-1, 8),
    projects: {
      id: MOCK_PROJECTS[2].id,
      title: MOCK_PROJECTS[2].title,
      budget_min: MOCK_PROJECTS[2].budget_min,
      budget_max: MOCK_PROJECTS[2].budget_max,
      category: MOCK_PROJECTS[2].category,
      tier: MOCK_PROJECTS[2].tier,
      status: "open",
      users: { id: MOCK_PROJECTS[2].business_id, full_name: "Laundry Kilat Sawojajar" },
    },
    contracts: [],
    users: {
      id: MAHASISWA,
      full_name: "Rani Pratiwi",
      avatar_url: null,
      tier: "menengah",
      is_verified: true,
      rating_avg: "4.80",
      total_projects: 6,
      skills: ["Figma", "Tipografi", "Siap cetak", "Ilustrasi"],
    },
  },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "c1111111-1111-4111-8111-111111111111",
    application_id: MOCK_APPLICATIONS[0].id,
    project_id: MOCK_PROJECTS[0].id,
    student_id: MAHASISWA,
    business_id: MOCK_PROJECTS[0].business_id,
    agreed_budget: 2500000,
    deadline: iso(18),
    status: "active",
    progress_pct: 40,
    deliverable_url: null,
    deliverable_notes: null,
    started_at: iso(-1, 14),
    completed_at: null,
    created_at: iso(-1, 14),
    projects: {
      id: MOCK_PROJECTS[0].id,
      title: MOCK_PROJECTS[0].title,
      category: MOCK_PROJECTS[0].category,
      tier: MOCK_PROJECTS[0].tier,
    },
    users_contracts_student_idTousers: {
      id: MAHASISWA,
      full_name: "Rani Pratiwi",
      avatar_url: null,
      rating_avg: "4.80",
    },
    users_contracts_business_idTousers: {
      id: MOCK_PROJECTS[0].business_id,
      full_name: "Kopi Senja Malang",
      avatar_url: null,
    },
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "p1111111-1111-4111-8111-111111111111",
    contract_id: MOCK_CONTRACTS[0].id,
    amount: 2500000,
    platform_fee: 125000,
    net_amount: 2375000,
    status: "held",
    payer_id: MOCK_PROJECTS[0].business_id,
    payee_id: MAHASISWA,
    proof_url: null,
    held_at: iso(-1, 15),
    released_at: null,
    created_at: iso(-1, 14),
    xendit_invoice_url: null,
    xendit_invoice_id: null,
    payment_method: "QRIS",
    payment_channel: "QRIS",
    expires_at: null,
    paid_at: iso(-1, 15),
    contracts: {
      id: MOCK_CONTRACTS[0].id,
      agreed_budget: 2500000,
      status: "active",
      projects: { id: MOCK_PROJECTS[0].id, title: MOCK_PROJECTS[0].title },
    },
  },
];

export const MOCK_WALLET: Wallet = {
  amount: 1850000,
  pending_amount: 500000,
  total_earned: 7350000,
  total_withdrawn: 5000000,
  recent_transactions: [
    {
      id: "t1",
      wallet_id: "w1",
      user_id: MAHASISWA,
      type: "withdrawal_lock",
      amount: 500000,
      ref_type: "withdrawal",
      ref_id: "wd-002",
      description: "Penarikan ke BCA 7890 sedang diproses",
      created_at: iso(-3, 9),
    },
    {
      id: "t2",
      wallet_id: "w1",
      user_id: MAHASISWA,
      type: "earn_release",
      amount: 2375000,
      ref_type: "contract",
      ref_id: "c-lama-01",
      description: "Dana dilepas dari kontrak katalog Toko Rempah",
      created_at: iso(-9, 16),
    },
    {
      id: "t3",
      wallet_id: "w1",
      user_id: MAHASISWA,
      type: "withdrawal_done",
      amount: 2000000,
      ref_type: "withdrawal",
      ref_id: "wd-001",
      description: "Penarikan ke BCA 7890 selesai",
      created_at: iso(-20, 11),
    },
  ],
};
