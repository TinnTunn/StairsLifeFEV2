import { expect, test } from "@playwright/test";
import { mockApi, ok, pasangSesi, pengguna } from "./api-tiruan";
const OUT = "C:/Users/AUSTIN~1/AppData/Local/Temp/claude/C--Users-Austin-Yang-Documents-StairsLifeFEV3/9ab555b4-9b0b-4f3d-94f4-42eb9717e05c/scratchpad";

const PROFIL = {
  user: pengguna("mahasiswa", { full_name: "Austin Yang", is_verified: true, rating_avg: "4.8", university: "Binus", major: "Sistem Informasi", semester: 5, skills: ["Figma", "React"] }),
  reviews: [
    { id: "r1", rating: 5, comment: "Hasilnya rapi dan tepat waktu.", created_at: "2026-09-10T00:00:00Z" },
    { id: "r2", rating: 4, comment: null, created_at: "2026-08-20T00:00:00Z" },
  ],
  review_count: 2,
  rating_distribution: { "1": 0, "2": 0, "3": 0, "4": 1, "5": 1 },
};
const PORTOFOLIO = {
  user_id: "u-mahasiswa", user_role: "mahasiswa", total_projects: 2,
  items: [
    {
      contract_id: "c1",
      project: { id: "p1", title: "Foto produk untuk katalog", category: "Fotografi produk", tier: "pemula", skills: [] },
      client: { id: "u-bisnis", full_name: "Sweetie Batter", avatar_url: null },
      budget: 350000, started_at: "2026-08-01T00:00:00Z", completed_at: "2026-08-20T00:00:00Z",
      deliverable_url: "https://contoh.invalid/rahasia.pdf",
      review: { rating: 5, comment: "Hasilnya rapi dan tepat waktu.", created_at: "2026-08-21T00:00:00Z" },
    },
  ],
  summary: { total_completed: 1, total_earnings: 332500, unique_categories: 1, average_rating: 5 },
};

test("portofolio dan ulasan tampil di profil sendiri, hanya dibaca", async ({ page }) => {
  test.setTimeout(180_000);
  await pasangSesi(page, "mahasiswa", { full_name: "Austin Yang", is_verified: true });
  await mockApi(page, {
    "GET /users/me": () => ok(PROFIL.user),
    "GET /users/me/verification": () => ok({ id: "v1", status: "approved", submitted_at: "2026-09-01T00:00:00Z", reviewed_at: "2026-09-02T00:00:00Z", rejection_reason: null }),
    "GET /users/u-mahasiswa": () => ok(PROFIL),
    "GET /users/u-mahasiswa/portfolio": () => ok(PORTOFOLIO),
  });
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto("/profil");

  await expect(page.getByRole("heading", { name: "Rekam jejak" })).toBeVisible();
  await expect(page.getByText("Foto produk untuk katalog")).toBeVisible();
  await expect(page.getByText("Hasilnya rapi dan tepat waktu.").first()).toBeVisible();
  await expect(page.getByText("Sweetie Batter")).toBeVisible();

  /* Hanya dibaca: tidak ada kolom isian atau tombol simpan di seksi ini. */
  const kontrol = await page.evaluate(() => ({
    isian: document.querySelectorAll("main input, main textarea, main select").length,
    tautanBerkas: document.body.innerHTML.includes("rahasia.pdf"),
  }));
  console.log("JJ kontrol:", JSON.stringify(kontrol));
  expect(kontrol.isian).toBe(0);
  /* Tautan berkas hasil kerja tetap tidak ditampilkan, seperti di profil publik. */
  expect(kontrol.tautanBerkas).toBe(false);

  /* Ulasan yang sudah tampil di kartu portofolio tidak diulang di bawahnya. */
  await expect(page.getByText("Hasilnya rapi dan tepat waktu.")).toHaveCount(1);

  const lihat = page.getByRole("link", { name: "Lihat sebagai orang lain" });
  await expect(lihat).toHaveAttribute("href", "/pengguna/u-mahasiswa");
  await page.screenshot({ path: `${OUT}/profil-jejak.png`, fullPage: true });
});
