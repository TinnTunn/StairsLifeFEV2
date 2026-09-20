// Uji E2E halaman di dalam aplikasi untuk ketiga peran.

import { expect, test } from "@playwright/test";
import { galat, mockApi, ok, pasangSesi, pengguna } from "./api-tiruan";

const KONTRAK = {
  id: "c1",
  application_id: "a1",
  project_id: "p1",
  student_id: "u-mahasiswa",
  business_id: "u-bisnis",
  agreed_budget: 2000000,
  deadline: "2026-12-31T00:00:00Z",
  status: "active",
  progress_pct: 10,
  deliverable_url: null,
  deliverable_notes: null,
  started_at: "2026-09-01T00:00:00Z",
  completed_at: null,
  created_at: "2026-09-01T00:00:00Z",
  projects: { id: "p1", title: "Desain logo kedai kopi", category: "Desain", tier: "pemula" },
  users_contracts_student_idTousers: { id: "u-mahasiswa", full_name: "Mahasiswa Uji", avatar_url: null, rating_avg: "0" },
  users_contracts_business_idTousers: { id: "u-bisnis", full_name: "Toko Uji", avatar_url: null },
};

const PROYEK_CARI = Array.from({ length: 6 }, (_, i) => ({
  id: `p${i + 1}`,
  business_id: "u-bisnis",
  title: ["Desain feed Instagram", "Foto produk katalog", "Landing page UMKM", "Artikel blog", "Logo laundry", "Video promosi"][i],
  description: "Deskripsi singkat proyek.",
  category: "Desain",
  skills: ["Figma", "Canva"],
  tier: i % 2 ? "menengah" : "pemula",
  budget_min: 250000,
  budget_max: 700000,
  deadline: "2026-10-20T00:00:00Z",
  deliverables: "Tiga berkas",
  status: "open",
  applicant_count: i,
  created_at: "2026-09-10T00:00:00Z",
  users: { id: "u-bisnis", full_name: `Usaha ${i + 1}`, is_verified: true },
}));

const PROYEK_BISNIS = {
  id: "p1",
  business_id: "u-bisnis",
  title: "Design Logo Toko Pastry",
  description: "Butuh logo dan varian untuk kemasan, papan nama, dan media sosial.",
  category: "umum",
  skills: ["Illustrator", "Branding"],
  tier: "pemula",
  budget_min: 100000,
  budget_max: 100000,
  deadline: "2026-09-30T00:00:00Z",
  deliverables: "Berkas logo AI dan PNG, plus panduan warna satu halaman.",
  status: "open",
  applicant_count: 2,
  created_at: "2026-09-18T00:00:00Z",
  users: { id: "u-bisnis", full_name: "Sweetie Batter", is_verified: true },
};

const LAMARAN_BISNIS = [1, 2].map((n) => ({
  id: `a${n}`,
  project_id: "p1",
  student_id: `u-m${n}`,
  cover_letter: "Saya tertarik mengerjakan logo ini, berikut rencana singkat saya.",
  estimated_completion: "2026-09-28T00:00:00Z",
  offered_budget: null,
  status: "pending",
  created_at: "2026-09-18T01:00:00Z",
  users: {
    id: `u-m${n}`,
    full_name: `Mahasiswa ${n}`,
    avatar_url: null,
    tier: "pemula",
    is_verified: true,
    rating_avg: "0",
    total_projects: 0,
    skills: ["Illustrator"],
  },
}));

const PROYEK_LOGO = {
  id: "p1", business_id: "u-bisnis", title: "Design Logo Toko pastry",
  description: "Butuh logo untuk toko pastry.", category: "umum", skills: ["Figma"], tier: "pemula",
  budget_min: 50000, budget_max: 100000, deadline: "2026-09-30T00:00:00Z", deliverables: "Tiga berkas",
  status: "open", applicant_count: 1, created_at: "2026-09-10T00:00:00Z",
  users: { id: "u-bisnis", full_name: "Sweetie Batter", is_verified: true },
};
const LAMARAN_LOGO = {
  id: "a1", project_id: "p1", student_id: "u-mahasiswa", status: "pending",
  cover_letter: "Saya tertarik.", proposed_price: 80000, offered_budget: 80000,
  estimated_completion: "2026-09-26T00:00:00Z", created_at: "2026-09-11T00:00:00Z",
  projects: PROYEK_LOGO, users: pengguna("mahasiswa", { full_name: "Austin Yang" }), contracts: [],
};
const KONTRAK_LOGO = {
  id: "c1", project_id: "p1", business_id: "u-bisnis", student_id: "u-mahasiswa",
  amount: 50000, status: "active", payment_status: "held", deliverable_url: null,
  deadline: "2026-09-26T00:00:00Z", created_at: "2026-09-19T00:00:00Z", projects: PROYEK_LOGO,
  users_contracts_student_idTousers: pengguna("mahasiswa", { full_name: "Austin Yang" }),
  users_contracts_business_idTousers: pengguna("bisnis", { full_name: "Sweetie Batter" }),
};

const DOMPET_RAHASIA = {
  amount: 475000, pending_amount: 120000, total_earned: 1250000, total_withdrawn: 655000,
  recent_transactions: [
    { id: "t1", type: "earn_release", amount: 190000, description: "Foto produk katalog", created_at: "2026-09-18T04:00:00Z" },
  ],
};

const PROFIL_JEJAK = {
  user: pengguna("mahasiswa", { full_name: "Austin Yang", is_verified: true, rating_avg: "4.8", university: "Binus", major: "Sistem Informasi", semester: 5, skills: ["Figma", "React"] }),
  reviews: [
    { id: "r1", rating: 5, comment: "Hasilnya rapi dan tepat waktu.", created_at: "2026-08-21T00:00:00.000Z" },
    { id: "r2", rating: 4, comment: "Komunikatif, tapi revisinya agak lama.", created_at: "2026-07-05T00:00:00Z" },
  ],
  review_count: 2,
  rating_distribution: { "1": 0, "2": 0, "3": 0, "4": 1, "5": 1 },
};
const PORTOFOLIO_JEJAK = {
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

test.describe("shell aplikasi", () => {
  test("sidebar tidak dipasang ulang saat berpindah halaman", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, { "GET /users/me": () => ok(pengguna("mahasiswa")) });
    await page.goto("/mahasiswa");
    const sidebar = page.getByRole("navigation").first();
    await expect(sidebar).toBeVisible();
    await sidebar.evaluate((el) => el.setAttribute("data-penanda-uji", "masih-sama"));

    await page.getByRole("link", { name: "Kontrak" }).first().click();
    await expect(page).toHaveURL(/\/kontrak$/);
    await expect(page.locator('[data-penanda-uji="masih-sama"]')).toHaveCount(1);
  });

  test("lonceng menampilkan jumlah belum dibaca dan membuang emoji judul", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /notifications/unread-count": () => ok({ count: 3 }),
      "GET /notifications": () =>
        ok([
          {
            id: "n1",
            user_id: "u-mahasiswa",
            type: "payment",
            title: "✅ Dana Sudah Cair",
            body: "Dana Rp 97.500 sudah dikirim ke rekeningmu.",
            ref_id: null,
            action_url: "/wallet",
            is_read: false,
            read_at: null,
            created_at: new Date().toISOString(),
          },
        ]),
    });
    await page.goto("/mahasiswa");
    const lonceng = page.getByRole("button", { name: "Notifikasi, 3 belum dibaca" });
    await expect(lonceng).toBeVisible();
    await lonceng.click();
    await expect(page.getByRole("region", { name: "Notifikasi" }).getByText("Dana Sudah Cair")).toBeVisible();
  });

  test("batas tarik dana dibaca dari pengaturan backend", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /settings/public": () =>
        ok({ platform_fee: 7, withdrawal_min_amount: 75000, withdrawal_admin_fee: 3000, verification_sla_days: 2 }),
      "GET /withdrawals/wallet": () =>
        ok({ amount: 500000, pending_amount: 0, total_earned: 500000, total_withdrawn: 0, transactions: [] }),
      "GET /bank-accounts": () =>
        ok([{ id: "b1", bank_name: "BCA", bank_code: "BCA", account_number: "1234567890", account_holder: "Mahasiswa Uji", is_primary: true }]),
    });
    await page.goto("/mahasiswa/dompet/tarik");
    await expect(page.getByText(/Rp 75\.000/).first()).toBeVisible();
    await expect(page.getByText(/Rp 3\.000/).first()).toBeVisible();
  });

  test("sengketa bisa diajukan dari kontrak dan alasan pendek ditolak di kolomnya", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /contracts/c1": () => ok(KONTRAK),
      "GET /payments/contract/c1": () =>
        ok({ id: "pay1", contract_id: "c1", amount: 2000000, platform_fee: 100000, net_amount: 1900000, status: "held" }),
      "GET /disputes/my": () => ok([]),
    });
    await page.goto("/kontrak/c1");
    await page.getByRole("button", { name: "Ajukan sengketa" }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel(/Apa yang terjadi/).fill("Terlalu singkat");
    await dialog.getByRole("button", { name: "Ajukan sengketa" }).click();
    await expect(dialog.getByText(/Tambah \d+ karakter lagi/)).toBeVisible();
  });

  test("admin tanpa izin Keuangan tidak melihat menunya dan halaman terkunci", async ({ page }) => {
    await pasangSesi(page, "admin");
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("admin")),
      "GET /admin/me": () => ok({ penuh: false, izin: ["Disputes"], peran: ["Moderator"] }),
    });
    await page.goto("/admin/penarikan");
    await expect(page.getByText("Peranmu tidak punya akses ke modul ini")).toBeVisible();
    await expect(page.getByRole("link", { name: "Keuangan" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Sengketa" }).first()).toBeVisible();
  });

  test("respons izin admin yang tidak lengkap tidak meruntuhkan shell", async ({ page }) => {
    await pasangSesi(page, "admin");
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("admin")),
      "GET /admin/me": () => ok([]),
    });
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Perlu ditindak" })).toBeVisible();
    await expect(page.getByText("Ada yang gagal dimuat")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Keuangan" }).first()).toBeVisible();
  });

  for (const lebar of [1440, 900, 375]) {
    test(`nama di profil tidak tertutup sampul (${lebar}px)`, async ({ page }) => {
      await page.setViewportSize({ width: lebar, height: 900 });
      const nama = "Anastasia Wijayakusuma Pratiwi";
      await pasangSesi(page, "bisnis", { full_name: nama });
      await mockApi(page, {
        "GET /users/me": () => ok({ ...pengguna("bisnis", { full_name: nama }), rating_avg: "4.50", skills: [] }),
      });
      await page.goto("/profil");
      const judul = page.getByRole("heading", { name: nama });
      await expect(judul).toBeVisible();
      const kotakJudul = await judul.boundingBox();
      const kotakSampul = await page.locator("[class*='sampul']").boundingBox();
      expect(kotakJudul && kotakSampul).toBeTruthy();
      expect(kotakJudul!.y).toBeGreaterThanOrEqual(kotakSampul!.y + kotakSampul!.height);
    });
  }

  test("unggah berkas mengulang sendiri setelah token diperbarui", async ({ page }) => {
    let unggahan = 0;
    let dikirim: unknown = null;
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /contracts/c1": () => ok({ ...KONTRAK, status: "active" }),
      "GET /payments/contract/c1": () =>
        ok({ id: "pay1", contract_id: "c1", amount: 2000000, platform_fee: 100000, net_amount: 1900000, status: "held" }),
      "GET /disputes/my": () => ok([]),
      "POST /upload": () => {
        unggahan += 1;
        return unggahan === 1
          ? galat(401, "TOKEN_EXPIRED", "Token kedaluwarsa.")
          : ok({ url: "https://contoh.id/hasil.pdf" });
      },
      "POST /auth/refresh": () => ok({ token: "token-baru", refresh_token: "refresh-baru" }),
      "PATCH /contracts/c1/deliverable": (_r, body) => {
        dikirim = body;
        return ok({ ...KONTRAK, status: "submitted" });
      },
    });
    await page.goto("/kontrak/c1");
    await page
      .locator('input[type="file"]')
      .first()
      .setInputFiles({ name: "hasil.pdf", mimeType: "application/pdf", buffer: Buffer.from("berkas uji") });
    await page.getByRole("button", { name: "Kirim hasil untuk direview" }).click();

    await expect.poll(() => dikirim).toEqual({ deliverable_url: "https://contoh.id/hasil.pdf" });
    expect(unggahan).toBe(2);
  });

  test("bukti sengketa di atas 10 MB ditolak sebelum diunggah", async ({ page }) => {
    let unggahan = 0;
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /contracts/c1": () => ok(KONTRAK),
      "GET /payments/contract/c1": () =>
        ok({ id: "pay1", contract_id: "c1", amount: 2000000, platform_fee: 100000, net_amount: 1900000, status: "held" }),
      "GET /disputes/my": () => ok([]),
      "POST /upload": () => {
        unggahan += 1;
        return ok({ url: "https://contoh.id/bukti.png" });
      },
    });
    await page.goto("/kontrak/c1");
    await page.getByRole("button", { name: "Ajukan sengketa" }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel(/Apa yang terjadi/).fill("Hasil kerjanya tidak sesuai dengan yang disepakati di kontrak.");
    await dialog
      .locator('input[type="file"]')
      .setInputFiles({ name: "bukti.png", mimeType: "image/png", buffer: Buffer.alloc(11 * 1024 * 1024) });
    await dialog.getByRole("button", { name: "Ajukan sengketa" }).click();

    await expect(dialog.getByText(/bukti\.png lebih dari 10 MB/)).toBeVisible();
    expect(unggahan).toBe(0);
  });

  test("penarikan dana mengirim rekening dan jumlah yang dipilih", async ({ page }) => {
    let diminta: unknown = null;
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /withdrawals/wallet": () =>
        ok({ amount: 1250000, pending_amount: 0, total_earned: 2500000, total_withdrawn: 0, recent_transactions: [] }),
      "GET /bank-accounts": () =>
        ok([
          {
            id: "bank1",
            bank_name: "BCA",
            account_number: "1234567890",
            account_holder: "Mahasiswa Uji",
            bank_code: "014",
            is_primary: true,
          },
        ]),
      "POST /withdrawals": (_r, body) => {
        diminta = body;
        return ok({ id: "w1", amount: 200000, status: "pending" });
      },
    });
    await page.goto("/mahasiswa/dompet/tarik");
    await page.getByLabel("Jumlah penarikan").fill("200000");
    await page.getByRole("button", { name: "Ajukan penarikan" }).click();

    await expect(page.getByText("Permintaan penarikan terkirim")).toBeVisible();
    expect(diminta).toEqual({ bank_account_id: "bank1", amount: 200000 });
  });

  test("profil publik menampilkan portofolio tanpa membocorkan penghasilan", async ({ page }) => {
    await pasangSesi(page, "bisnis");
    await mockApi(page, {
      "GET /users/u-mahasiswa": () =>
        ok({
          user: {
            ...pengguna("mahasiswa", { full_name: "Rizky Pratama" }),
            university: "Universitas Padjadjaran",
            major: "Desain Komunikasi Visual",
            bio: "Suka desain identitas visual.",
            skills: ["Figma"],
            rating_avg: "4.80",
            total_projects: 3,
          },
          reviews: [],
          review_count: 2,
          rating_distribution: { "1": 0, "2": 0, "3": 0, "4": 1, "5": 1 },
        }),
      "GET /users/u-mahasiswa/portfolio": () =>
        ok({
          user_id: "u-mahasiswa",
          user_role: "mahasiswa",
          total_projects: 3,
          items: [
            {
              contract_id: "c1",
              project: { id: "p1", title: "Desain logo kedai kopi", category: "Desain", tier: "pemula", skills: [] },
              client: { id: "u-bisnis", full_name: "Toko Uji", avatar_url: null },
              budget: 2000000,
              started_at: "2026-08-01T00:00:00Z",
              completed_at: "2026-08-20T00:00:00Z",
              deliverable_url: "https://rahasia.contoh.id/berkas-klien.zip",
              review: { rating: 5, comment: "Hasilnya rapi dan tepat waktu.", created_at: "2026-08-21T00:00:00Z" },
            },
          ],
          summary: { total_completed: 1, total_earnings: 9500000, unique_categories: 1, average_rating: 5 },
        }),
    });
    await page.goto("/pengguna/u-mahasiswa");

    await expect(page.getByRole("heading", { name: "Rizky Pratama" })).toBeVisible();
    await expect(page.getByText("Desain logo kedai kopi")).toBeVisible();
    await expect(page.getByText("Hasilnya rapi dan tepat waktu.")).toBeVisible();
    await expect(page.getByText("9.500.000")).toHaveCount(0);
    await expect(page.getByText(/berkas-klien\.zip/)).toHaveCount(0);
  });

  test("judul tab, fokus, inert, offline, dan sesi berakhir", async ({ page, context }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await pasangSesi(page, "mahasiswa", { full_name: "Rizky Pratama" });
    await mockApi(page, {
      "GET /contracts/my": () => ok([]),
      "GET /applications/my": () => ok([]),
    });

    await page.goto("/kontrak");
    await expect(page).toHaveTitle("Kontrak · StairsLife");

    await page.getByRole("link", { name: "Lamaran saya" }).first().click();
    await page.waitForURL(/\/mahasiswa\/lamaran$/);
    await expect(page).toHaveTitle("Lamaran saya · StairsLife");
    const fokus = await page.evaluate(() => document.activeElement?.id ?? "");
    expect(fokus).toBe("konten");

    await context.setOffline(true);
    await expect(page.getByText("Kamu sedang offline")).toBeVisible();
    await context.setOffline(false);
    await expect(page.getByText("Kamu sedang offline")).toHaveCount(0);

    await page.unrouteAll();
    await mockApi(page, {
      "GET /contracts/my": () => galat(401, "TOKEN_EXPIRED", "Token kedaluwarsa."),
      "GET /applications/my": () => galat(401, "TOKEN_EXPIRED", "Token kedaluwarsa."),
      "GET /users/me": () => galat(401, "TOKEN_EXPIRED", "Token kedaluwarsa."),
      "POST /auth/refresh": () => galat(401, "REFRESH_INVALID", "Sesi tidak berlaku."),
    });
    await page.goto("/kontrak");
    await page.waitForURL(/\/masuk/);
    await expect(page.getByText(/Sesi kamu sudah berakhir/)).toBeVisible();
  });

  test("modal menonaktifkan latar untuk pembaca layar", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /contracts/c1": () =>
        ok({
          id: "c1",
          application_id: "a1",
          project_id: "p1",
          student_id: "u-mahasiswa",
          business_id: "u-bisnis",
          agreed_budget: 2000000,
          deadline: "2026-12-31T00:00:00Z",
          status: "active",
          progress_pct: 10,
          deliverable_url: null,
          deliverable_notes: null,
          started_at: "2026-09-01T00:00:00Z",
          completed_at: null,
          created_at: "2026-09-01T00:00:00Z",
          projects: { id: "p1", title: "Desain logo", category: "Desain", tier: "pemula" },
          users_contracts_student_idTousers: { id: "u-mahasiswa", full_name: "Mahasiswa Uji", avatar_url: null, rating_avg: "0" },
          users_contracts_business_idTousers: { id: "u-bisnis", full_name: "Toko Uji", avatar_url: null },
        }),
      "GET /payments/contract/c1": () =>
        ok({ id: "pay1", contract_id: "c1", amount: 2000000, platform_fee: 100000, net_amount: 1900000, status: "held" }),
      "GET /disputes/my": () => ok([]),
    });
    await page.goto("/kontrak/c1");
    await page.getByRole("button", { name: "Ajukan sengketa" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const inert = await page.evaluate(() =>
      Array.from(document.body.children).filter((el) => el.hasAttribute("inert")).length,
    );
    expect(inert).toBeGreaterThan(0);
  });

  test("cari proyek di dalam aplikasi menyaring dengan chip dan menandai yang sudah dilamar", async ({ page }) => {
    const PROYEK = [
      {
        id: "p1",
        business_id: "u-bisnis",
        title: "Desain feed Instagram",
        description: "Butuh sembilan konten feed.",
        category: "Desain",
        skills: ["Figma"],
        tier: "pemula",
        budget_min: 250000,
        budget_max: 400000,
        deadline: "2026-10-20T00:00:00Z",
        deliverables: "Sembilan berkas",
        status: "open",
        applicant_count: 1,
        created_at: "2026-09-10T00:00:00Z",
        users: { id: "u-bisnis", full_name: "Toko Kue", is_verified: true },
      },
      {
        id: "p2",
        business_id: "u-bisnis2",
        title: "Foto produk katalog",
        description: "Dua puluh foto produk.",
        category: "Fotografi",
        skills: ["Lightroom"],
        tier: "menengah",
        budget_min: 500000,
        budget_max: 900000,
        deadline: "2026-10-25T00:00:00Z",
        deliverables: "Dua puluh foto",
        status: "open",
        applicant_count: 3,
        created_at: "2026-09-11T00:00:00Z",
        users: { id: "u-bisnis2", full_name: "Kopi Tetangga", is_verified: true },
      },
    ];
    const diminta: string[] = [];
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /projects": (route) => {
        diminta.push(new URL(route.request().url()).search);
        const tier = new URL(route.request().url()).searchParams.get("tier");
        return ok(tier ? PROYEK.filter((p) => p.tier === tier) : PROYEK);
      },
      "GET /applications/my": () => ok([{ id: "a1", project_id: "p2", status: "pending" }]),
    });

    await page.goto("/mahasiswa/cari");
    await expect(page.getByRole("link", { name: "Lamaran saya" }).first()).toBeVisible();
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
    await expect(page.getByText("Desain feed Instagram")).toBeVisible();
    await expect(page.getByText("Dilamar")).toBeVisible();

    await page.getByRole("button", { name: "Menengah", exact: true }).click();
    await page.waitForURL(/tier=menengah/);
    await expect(page.getByText("Foto produk katalog")).toBeVisible();
    await expect(page.getByText("Desain feed Instagram")).toHaveCount(0);
    expect(diminta.some((q) => q.includes("tier=menengah"))).toBe(true);

    await page.getByRole("link", { name: "Foto produk katalog" }).click();
    await page.waitForURL(/\/mahasiswa\/cari\/p2$/);
  });

  test("beranda lalu cari: tidak ada crash dan logo sidebar tidak bisa ditekan", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await pasangSesi(page, "mahasiswa", { full_name: "Rizky Pratama" });
    await mockApi(page, {
      "GET /projects": () => ok(PROYEK_CARI),
      "GET /applications/my": () => ok([{ id: "a1", project_id: "p2", status: "pending" }]),
      "GET /contracts/my": () => ok([]),
      "GET /withdrawals/wallet": () => ok({ amount: 0, pending_amount: 0, total_earned: 0, total_withdrawn: 0, recent_transactions: [] }),
      "GET /users/me": () => ok(pengguna("mahasiswa", { full_name: "Rizky Pratama" })),
    });

    await page.goto("/mahasiswa");
    await page.waitForTimeout(900);
    await page.getByRole("link", { name: "Cari proyek" }).first().click();
    await page.waitForURL(/\/mahasiswa\/cari$/);
    await expect(page.getByText("Desain feed Instagram")).toBeVisible();
    await expect(page.getByText("Ada yang gagal dimuat")).toHaveCount(0);
    await expect(page.getByText("Dilamar")).toBeVisible();

    await expect(page.getByRole("link", { name: "StairsLife, ke beranda" })).toHaveCount(0);

    await expect(page.getByRole("button", { name: "Semua kategori" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Menengah", exact: true })).toBeVisible();
  });

  test("bisnis: detail proyek menampilkan brief dan pelamarnya di satu halaman", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await pasangSesi(page, "bisnis", { full_name: "Sweetie Batter" });
    await mockApi(page, {
      "GET /projects/p1": () => ok(PROYEK_BISNIS),
      "GET /applications/project/p1": () => ok(LAMARAN_BISNIS),
      "GET /projects/my": () => ok([PROYEK_BISNIS]),
    });

    await page.goto("/bisnis/proyek/p1");
    await expect(page.getByRole("heading", { name: "Design Logo Toko Pastry" })).toBeVisible();
    await expect(page.getByText("Butuh logo dan varian untuk kemasan")).toBeVisible();
    await expect(page.getByText("Berkas logo AI dan PNG")).toBeVisible();
    await expect(page.getByRole("link", { name: "Lihat pelamar" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Lamar proyek/ })).toHaveCount(0);
    await expect(page.getByText("Mahasiswa 1")).toBeVisible();
    await expect(page.getByText("Mahasiswa 2")).toBeVisible();
  });

  test("rute pelamar lama dialihkan ke detail", async ({ page }) => {
    await pasangSesi(page, "bisnis");
    await mockApi(page, {
      "GET /projects/p1": () => ok(PROYEK_BISNIS),
      "GET /applications/project/p1": () => ok([]),
    });
    await page.goto("/bisnis/proyek/p1/pelamar");
    await page.waitForURL(/\/bisnis\/proyek\/p1/);
    await expect(page.getByRole("heading", { name: "Design Logo Toko Pastry" })).toBeVisible();
  });

  test("halaman keuangan admin tetap berdiri saat ringkasan tidak lengkap", async ({ page }) => {
    await pasangSesi(page, "admin");
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("admin")),
      "GET /admin/me": () => ok({ penuh: true, izin: [], peran: [] }),
      "GET /admin/finances": () => ok({ summary: { total_komisi: 0, total_gmv: 0, total_transaksi: 0, komisi_hari_ini: 0, komisi_minggu_ini: 0, komisi_bulan_ini: 0 } }),
      "GET /admin/finances/detail": () => ok({ payments: [], pagination: { page: 1, limit: 20, total: 0, total_pages: 1 } }),
    });
    await page.goto("/admin/keuangan");
    await expect(page.getByRole("heading", { name: "Keuangan" }).first()).toBeVisible();
    await expect(page.getByText("Ada yang gagal dimuat")).toHaveCount(0);
  });

  test("kartu proyek: tombol lamar punya tujuan sendiri dan hilang kalau sudah dilamar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await pasangSesi(page, "mahasiswa");
    const proyek = (id: string, title: string) => ({ ...PROYEK_BISNIS, id, title, category: "Fotografi produk" });
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("mahasiswa")),
      "GET /projects": () => ok([proyek("p1", "Foto produk untuk katalog"), proyek("p9", "Desain feed Instagram")]),
      "GET /applications/my": () => ok([{ id: "a1", project_id: "p9", status: "pending" }]),
    });

    await page.goto("/mahasiswa/cari");
    const kartu = page.getByRole("article").filter({ hasText: "Foto produk untuk katalog" });
    const sudah = page.getByRole("article").filter({ hasText: "Desain feed Instagram" });

    await expect(kartu.getByText("Fotografi produk")).toBeVisible();

    await expect(sudah.getByRole("link", { name: "Lamar" })).toHaveCount(0);
    await expect(sudah.getByText("Dilamar")).toBeVisible();

    await kartu.getByRole("link", { name: "Lamar" }).click();
    await page.waitForURL(/\/mahasiswa\/lamar\/p1$/);

    await page.goBack();
    await page.getByRole("link", { name: "Foto produk untuk katalog" }).click();
    await page.waitForURL(/\/mahasiswa\/cari\/p1$/);
  });

  test("pelamar yang sudah berkontrak menawarkan buka kontrak, bukan buat kontrak", async ({ page }) => {
    await pasangSesi(page, "bisnis", { full_name: "Sweetie Batter" });
    const proyek = { ...PROYEK_LOGO, id: "p1", status: "inProgress" };
    const dasar = { ...LAMARAN_LOGO, id: "a1", project_id: "p1", status: "approved", projects: proyek };
    let punyaKontrak = false;
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("bisnis", { full_name: "Sweetie Batter" })),
      "GET /projects/p1": () => ok(proyek),
      "GET /applications/project/p1": () =>
        ok([{ ...dasar, contracts: punyaKontrak ? [{ id: "c1", status: "active" }] : [] }]),
    });

    await page.goto("/bisnis/proyek/p1");
    await expect(page.getByRole("button", { name: "Buat kontrak" })).toBeVisible();

    punyaKontrak = true;
    await page.reload();
    const buka = page.getByRole("link", { name: "Buka kontraknya" });
    await expect(buka).toBeVisible();
    await expect(buka).toHaveAttribute("href", "/kontrak/c1");
    await expect(page.getByRole("button", { name: "Buat kontrak" })).toHaveCount(0);
  });

  test("kolom isian di dalam modal menerima seluruh ketikan, bukan satu huruf", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await pasangSesi(page, "bisnis", { full_name: "Sweetie Batter" });
    const proyek = { ...PROYEK_LOGO, id: "p1", status: "open" };
    const lamaran = {
      ...LAMARAN_LOGO,
      id: "a1",
      project_id: "p1",
      status: "pending",
      contracts: [],
      projects: proyek,
    };
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("bisnis", { full_name: "Sweetie Batter" })),
      "GET /projects/p1": () => ok(proyek),
      "GET /applications/project/p1": () => ok([lamaran]),
      "PATCH /applications/a1/status": () => ok({ ...lamaran, status: "approved" }),
    });

    await page.goto("/bisnis/proyek/p1");
    await page.getByRole("button", { name: "Terima pelamar ini" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Ya, terima pelamar ini" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByLabel("Nilai kontrak")).toBeVisible();

    const nilai = dialog.getByLabel("Nilai kontrak");
    await nilai.fill("");
    await nilai.pressSequentially("175000", { delay: 20 });
    await expect(nilai).toHaveValue("175.000");
    await expect(nilai).toBeFocused();
  });

  test("kartu proyek: semua kartu setinggi sama dan kakinya tidak pernah pecah", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await pasangSesi(page, "mahasiswa");
    const bahan = [
      { id: "p1", title: "Logo", description: "Singkat.", budget_min: 75000, budget_max: 100000, applicant_count: 1 },
      {
        id: "p2",
        title: "Pembuatan konten Instagram mingguan untuk toko kue rumahan",
        description: "Butuh 12 konten per bulan, termasuk caption dan jadwal unggah setiap pekannya.",
        budget_min: 12500000,
        budget_max: 25000000,
        applicant_count: 128,
      },
    ];
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("mahasiswa")),
      "GET /projects": () => ok(bahan.map((b) => ({ ...PROYEK_BISNIS, ...b, category: "Konten media sosial" }))),
      "GET /applications/my": () => ok([]),
    });

    await page.goto("/mahasiswa/cari");
    await expect(page.getByRole("article")).toHaveCount(2);

    const ukur = await page.evaluate(() => {
      const satuBaris = (el: Element) => {
        const cs = getComputedStyle(el as HTMLElement);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
        return (el as HTMLElement).getBoundingClientRect().height < lh * 1.6;
      };
      return Array.from(document.querySelectorAll("article")).map((k) => {
        const kaki = k.children[k.children.length - 1] as HTMLElement;
        const nominal = kaki.querySelector("span")!;
        const pelamar = kaki.querySelectorAll("span")[1]!;
        return {
          tinggi: Math.round(k.getBoundingClientRect().height),
          kaki: Math.round(kaki.getBoundingClientRect().y - k.getBoundingClientRect().y),
          nominalUtuh: satuBaris(nominal),
          pelamarUtuh: satuBaris(pelamar),
        };
      });
    });

    expect(ukur.every((u) => u.nominalUtuh && u.pelamarUtuh)).toBe(true);
    expect(new Set(ukur.map((u) => u.tinggi)).size).toBe(1);
    expect(new Set(ukur.map((u) => u.kaki)).size).toBe(1);
  });

  test("penanda tab admin berpindah ke tab yang dipilih, bukan digambar ulang", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await pasangSesi(page, "admin");
    const proyek = (id: string, status: string) => ({
      ...PROYEK_BISNIS,
      id,
      status,
      business: { id: "u-bisnis", full_name: "Uji Bisnis" },
    });
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("admin")),
      "GET /admin/me": () => ok({ penuh: true, izin: [], peran: [] }),
      "GET /admin/projects": () => ok([proyek("p1", "open"), proyek("p2", "completed")]),
    });

    await page.goto("/admin/proyek");
    const tablist = page.getByRole("tablist").first();
    const penanda = tablist.locator("> span").first();
    await expect(tablist.getByRole("tab", { name: /Semua/ })).toHaveAttribute("aria-selected", "true");

    const menempel = async (nama: RegExp) => {
      const tab = tablist.getByRole("tab", { name: nama });
      await expect
        .poll(async () => {
          const a = await tab.boundingBox();
          const b = await penanda.boundingBox();
          if (!a || !b) return -1;
          return Math.round(Math.abs(a.x - b.x) + Math.abs(a.width - b.width));
        })
        .toBeLessThanOrEqual(1);
    };

    await menempel(/Semua/);
    await tablist.getByRole("tab", { name: /Selesai/ }).click();
    await expect(tablist.getByRole("tab", { name: /Selesai/ })).toHaveAttribute("aria-selected", "true");
    await menempel(/Selesai/);
    await expect(page.getByText("1 proyek")).toBeVisible();
  });

  test("rentang anggaran memakai strip dan tidak ada tautan ke rute publik proyek", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /projects": () => ok([PROYEK_BISNIS]),
      "GET /projects/p1": () => ok(PROYEK_BISNIS),
      "GET /applications/my": () => ok([]),
    });

    await page.goto("/mahasiswa/cari");
    await expect(page.getByText("Rp 100.000")).toBeVisible();
    await expect(page.getByText(/sampai/)).toHaveCount(0);

    for (const rute of ["/mahasiswa/cari", "/mahasiswa/cari/p1", "/mahasiswa/lamar/p1"]) {
      await page.goto(rute);
      await expect(page.locator('a[href^="/proyek"]')).toHaveCount(0);
    }
  });

  test("detail proyek menautkan profil pemasang dan lencana status tanpa titik", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /projects/p1": () => ok(PROYEK_BISNIS),
      "GET /applications/my": () => ok([]),
    });
    await page.goto("/mahasiswa/cari/p1");

    await expect(page.locator('a[href="/pengguna/u-bisnis"]')).toHaveCount(2);
    await page.locator('a[href="/pengguna/u-bisnis"]').first().click();
    await page.waitForURL(/\/pengguna\/u-bisnis$/);
  });

  test("kolom pencarian mengembang saat ditekan, mengirim kata kunci, lalu melipat", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await pasangSesi(page, "mahasiswa", { full_name: "Rizky Pratama" });
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("mahasiswa", { full_name: "Rizky Pratama" })),
      "GET /projects": () => ok(PROYEK_CARI),
      "GET /applications/my": () => ok([]),
    });

    await page.goto("/mahasiswa/cari");
    await page.waitForTimeout(1100);

    const pemicu = page.getByRole("search").getByRole("button").first();
    const kolom = page.getByRole("searchbox", { name: "Cari proyek" });
    const chip = page.getByRole("button", { name: "Menengah" });

    await expect(pemicu).toHaveAttribute("aria-expanded", "false");
    await expect(chip).toBeVisible();
    await expect(kolom).toHaveAttribute("tabindex", "-1");

    await pemicu.click();
    await expect(pemicu).toHaveAttribute("aria-expanded", "true");
    await expect(kolom).toBeFocused();

    await page.getByText("6 proyek sedang dibuka").click();
    await expect(pemicu).toHaveAttribute("aria-expanded", "false");

    await pemicu.click();
    await kolom.fill("Landing");
    await page.getByText("6 proyek sedang dibuka").click();
    await expect(pemicu).toHaveAttribute("aria-expanded", "true");
    await expect(kolom).toHaveValue("Landing");

    await kolom.press("Enter");
    await page.waitForURL(/search=Landing/);
    await expect(pemicu).toHaveAttribute("aria-expanded", "true");
    await expect(chip).toBeVisible();

    await kolom.press("Escape");
    await page.waitForURL(/\/mahasiswa\/cari$/);
    await expect(pemicu).toHaveAttribute("aria-expanded", "false");
  });

  test("obrolan memakai dua centang, biru saat sudah dibaca", async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await pasangSesi(page, "mahasiswa", { full_name: "Rizky" });
    await mockApi(page, {
      "GET /chat/inquiry/u-bisnis/messages": () =>
        ok({
          other_user: { id: "u-bisnis", full_name: "Sweetie Batter", role: "bisnis" },
          messages: [
            { id: "m1", sender_id: "u-mahasiswa", content: "Sudah dibaca", created_at: "2026-09-18T06:51:00Z", is_read: true },
            { id: "m2", sender_id: "u-mahasiswa", content: "Belum dibaca", created_at: "2026-09-18T06:52:00Z", is_read: false },
            { id: "m3", sender_id: "u-mahasiswa", content: "Tanpa bidang is_read", created_at: "2026-09-18T06:53:00Z" },
          ],
        }),
    });
    await page.goto("/pesan/tanya/u-bisnis");
    await page.waitForTimeout(1200);
    await expect(page.getByTitle("Sudah dibaca")).toBeVisible();
    await expect(page.getByTitle("Terkirim, belum dibaca")).toHaveCount(2);

    const warna = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-dibaca]")).map((el) => ({
        dibaca: el.getAttribute("data-dibaca"),
        warna: getComputedStyle(el).color,
      })),
    );
    const biru = warna.find((w) => w.dibaca === "true")!;
    const abu = warna.filter((w) => w.dibaca === "false");
    expect(biru.warna).not.toBe(abu[0].warna);
    expect(abu.every((w) => w.warna === abu[0].warna)).toBe(true);
  });

  test("bisnis menyetor dana: invoice dibuat, dipantulkan, lalu statusnya ditahan", async ({ page }) => {
    let diminta: unknown = null;
    let sync = 0;
    await pasangSesi(page, "bisnis");
    await mockApi(page, {
      "GET /contracts/c1": () => ok(KONTRAK),
      "GET /payments/contract/c1": () => ok(null),
      "GET /disputes/my": () => ok([]),
      "POST /payments/invoice": (_r, body) => {
        diminta = body;
        return ok({
          payment_id: "pay1",
          invoice_url: "http://localhost:3001/payment/result?status=success&payment_id=pay1",
          invoice_id: "inv1",
          amount: 2000000,
          expires_at: "2026-12-31T00:00:00Z",
          status: "pending",
        });
      },
      "GET /payments/pay1/sync": () => {
        sync += 1;
        return ok({
          id: "pay1",
          contract_id: "c1",
          amount: 2000000,
          platform_fee: 100000,
          net_amount: 1900000,
          status: "held",
        });
      },
    });

    await page.goto("/kontrak/c1");
    await expect(page.getByRole("heading", { name: "Setor dana ke escrow" })).toBeVisible();
    await page.getByRole("button", { name: "Bayar ke escrow" }).click();

    await expect.poll(() => diminta).toEqual({ contract_id: "c1", amount: 2000000 });

    await page.waitForURL(/\/payment\/result/);
    await expect(page.getByText("Dana sudah masuk escrow")).toBeVisible();
    expect(sync).toBeGreaterThanOrEqual(1);
    await expect(page.getByRole("link", { name: /kontrak/i }).first()).toBeVisible();
  });

  test("bisnis melepas dana lewat konfirmasi yang tidak bisa ditutup sembarangan", async ({ page }) => {
    let disetujui = false;
    await pasangSesi(page, "bisnis");
    await mockApi(page, {
      "GET /contracts/c1": () => ok({ ...KONTRAK, status: "pending_review" }),
      "GET /payments/contract/c1": () =>
        ok({ id: "pay1", contract_id: "c1", amount: 2000000, platform_fee: 100000, net_amount: 1900000, status: "held" }),
      "GET /disputes/my": () => ok([]),
      "GET /contracts/c1/deliverables": () => ok([{ id: "d1", status: "pending", created_at: "2026-09-18T00:00:00Z" }]),
      "PATCH /contracts/c1/approve": () => {
        disetujui = true;
        return ok({ ...KONTRAK, status: "completed" });
      },
    });

    await page.goto("/kontrak/c1");
    await page.getByRole("button", { name: "Setujui dan lepas dana" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Lepas dana sekarang?")).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Ya, lepas dananya" }).click();
    await expect.poll(() => disetujui).toBe(true);
  });

  test("verifikasi KTM: kolom wajib diperiksa sebelum berkas dikirim", async ({ page }) => {
    let unggah = 0;
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /users/me": () => ok({ ...pengguna("mahasiswa"), is_verified: false, university: "" }),
      "GET /users/me/verification": () => ok(null),
      "POST /upload": () => {
        unggah += 1;
        return ok({ url: "https://contoh.id/berkas.jpg" });
      },
    });

    await page.goto("/mahasiswa/verifikasi");
    await page.getByRole("button", { name: "Kirim untuk direview" }).click();

    await expect(page.getByText("Isi nama kampus sesuai yang tertulis di kartu.").first()).toBeVisible();
    await expect(page.getByText("Pilih foto kartu mahasiswamu.").first()).toBeVisible();
    await expect(page.getByText("Pilih foto selfie sambil memegang kartu.").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Isi nama kampus/ })).toBeVisible();
    expect(unggah).toBe(0);
  });

  test("verifikasi KTM: dua berkas diunggah dengan jenisnya lalu pengajuan terkirim", async ({ page }) => {
    const jenisUnggah: string[] = [];
    let pengajuan: unknown = null;
    await pasangSesi(page, "mahasiswa");
    await mockApi(page, {
      "GET /users/me": () => ok({ ...pengguna("mahasiswa"), is_verified: false, university: "" }),
      "GET /users/me/verification": () => ok(null),
      "POST /upload": (route) => {
        const isi = route.request().postData() ?? "";
        const jenis = /name="type"\s+([a-z-]+)/.exec(isi)?.[1] ?? "?";
        jenisUnggah.push(jenis);
        return ok({ url: `https://contoh.id/${jenis}.jpg` });
      },
      "POST /users/me/verification": (_r, body) => {
        pengajuan = body;
        return ok({ id: "v1", status: "pending", university: "Universitas Padjadjaran", created_at: "2026-09-18T00:00:00Z" });
      },
    });

    await page.goto("/mahasiswa/verifikasi");
    await page.getByLabel("Nama kampus").fill("Universitas Padjadjaran");
    await page.getByLabel("Nomor induk mahasiswa").fill("140810210001");

    const berkas = page.locator('input[type="file"]');
    await berkas
      .nth(0)
      .setInputFiles({ name: "ktm.jpg", mimeType: "image/jpeg", buffer: Buffer.from("kartu uji") });
    await berkas
      .nth(1)
      .setInputFiles({ name: "selfie.jpg", mimeType: "image/jpeg", buffer: Buffer.from("selfie uji") });

    await page.getByRole("button", { name: "Kirim untuk direview" }).click();

    await expect.poll(() => jenisUnggah).toEqual(["ktm", "selfie"]);
    await expect.poll(() => pengajuan).toEqual({
      university: "Universitas Padjadjaran",
      ktm_image_url: "https://contoh.id/ktm.jpg",
      selfie_url: "https://contoh.id/selfie.jpg",
      student_id_number: "140810210001",
    });
    await expect(page.getByText(/direview|Pengajuan diterima/i).first()).toBeVisible();
  });

  test("obrolan kontrak mengirim pesan dan menampilkannya", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    const terkirim: unknown[] = [];
    await mockApi(page, {
      "GET /contracts/c1": () => ok({ ...KONTRAK, status: "completed" }),
      "GET /payments/contract/c1": () =>
        ok({ id: "pay1", contract_id: "c1", amount: 2000000, platform_fee: 100000, net_amount: 1900000, status: "released" }),
      "GET /chat/c1/messages": () => ok([]),
      "POST /chat/c1/messages": (_r, body) => {
        terkirim.push(body);
        return ok({ id: "m1", sender_id: "u-mahasiswa", content: (body as { content: string }).content, created_at: new Date().toISOString() });
      },
    });
    await page.goto("/kontrak/c1");
    const kotak = page.locator("#obrolan textarea");
    await kotak.fill("Revisi kedua sudah saya unggah, mohon dicek.");
    await kotak.press("Enter");
    await expect(page.locator("#obrolan").getByText("Revisi kedua sudah saya unggah, mohon dicek.")).toBeVisible();
    expect(terkirim).toEqual([{ content: "Revisi kedua sudah saya unggah, mohon dicek." }]);
  });

  test("pemilih tanggal bisa dipakai dengan keyboard dan menolak tanggal lampau", async ({ page }) => {
    await pasangSesi(page, "bisnis");
    await mockApi(page, { "GET /users/me": () => ok(pengguna("bisnis")) });
    await page.goto("/bisnis/proyek/baru");
    const pemicu = page.locator("#kolom-deadline");
    await pemicu.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(pemicu).not.toContainText("Belum dipilih");
    await expect(pemicu).toBeFocused();
  });
  test("permintaan yang kedaluwarsa bersamaan berbagi satu refresh token", async ({ page }) => {
    await pasangSesi(page, "mahasiswa");
    let refresh = 0;
    const lamaDitolak = (route: import("@playwright/test").Route, data: unknown) =>
      route.request().headers()["authorization"] === "Bearer token-baru"
        ? ok(data)
        : { status: 401, body: { success: false, statusCode: 401, code: "UNAUTHORIZED", message: "Unauthorized" } };
    await mockApi(page, {
      "POST /auth/refresh": async (_r, body) => {
        refresh += 1;
        expect(body).toEqual({ refresh_token: "refresh-uji" });
        await new Promise((r) => setTimeout(r, 300));
        return ok({ token: "token-baru", refresh_token: "refresh-baru" });
      },
      "GET /applications/my": (r) => lamaDitolak(r, []),
      "GET /withdrawals/wallet": (r) => lamaDitolak(r, { amount: 0, pending_amount: 0, total_earned: 0, total_withdrawn: 0, transactions: [] }),
      "GET /users/me": (r) => lamaDitolak(r, pengguna("mahasiswa")),
      "GET /notifications/unread-count": (r) => lamaDitolak(r, { count: 0 }),
    });
    await page.goto("/mahasiswa");
    await expect(page.getByRole("heading", { level: 1, name: "Beranda" })).toBeVisible();
    await page.waitForTimeout(1500);
    expect(refresh).toBe(1);
    const sesi = await page.evaluate(() => JSON.parse(localStorage.getItem("stairslife-session") ?? "null"));
    expect(sesi?.refresh_token).toBe("refresh-baru");
  });

  test("daftar proyek bisnis menampilkan rentang anggaran", async ({ page }) => {
    await pasangSesi(page, "bisnis", { full_name: "Sweetie Batter" });
    await mockApi(page, { "GET /projects/my": () => ok([PROYEK_LOGO]) });
    await page.goto("/bisnis/proyek");
    await expect(page.getByText("Rp 50.000 - Rp 100.000")).toBeVisible();
  });

  test("pelamar: hanya terima atau tolak, plus chat", async ({ page }) => {
    let status: unknown = null;
    await pasangSesi(page, "bisnis", { full_name: "Sweetie Batter" });
    await mockApi(page, {
      "GET /projects/p1": () => ok(PROYEK_LOGO),
      "GET /applications/project/p1": () => ok([LAMARAN_LOGO]),
      "PATCH /applications/a1/status": (_r, body) => { status = body; return ok({ ...LAMARAN_LOGO, status: "rejected" }); },
    });
    await page.goto("/bisnis/proyek/p1/pelamar");
    await expect(page.getByRole("button", { name: "Terima pelamar ini" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tolak lamaran" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Masukkan seleksi" })).toHaveCount(0);
    const chat = page.getByRole("link", { name: "Chat pelamar" });
    await expect(chat).toHaveAttribute("href", "/pesan/tanya/u-mahasiswa");

    await chat.click();
    await page.waitForURL(/\/pesan\/tanya\/u-mahasiswa$/);
    await expect(page.getByRole("heading", { name: "Pesan" }).first()).toBeVisible();

    await page.goBack();
    await page.getByRole("button", { name: "Tolak lamaran" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Ya, tolak lamaran" }).click();
    await expect.poll(() => status).toEqual({ status: "rejected" });
  });

  test("detail kontrak punya tautan kembali ke daftar", async ({ page }) => {
    await pasangSesi(page, "bisnis", { full_name: "Sweetie Batter" });
    await mockApi(page, {
      "GET /contracts/c1": () => ok(KONTRAK_LOGO),
      "GET /payments/contract/c1": () => ok({ id: "pay1", status: "held", amount: 50000 }),
      "GET /disputes/my": () => ok([]),
    });
    await page.goto("/kontrak/c1");
    const kembali = page.getByRole("link", { name: "Ke daftar kontrak" }).first();
    await expect(kembali).toBeVisible();
    await kembali.click();
    await page.waitForURL(/\/kontrak$/);
  });

  test("kolom nominal memisahkan ribuan saat diketik", async ({ page }) => {
    await pasangSesi(page, "bisnis", { full_name: "Sweetie Batter" });
    await mockApi(page, {});
    await page.goto("/bisnis/proyek/baru");
    await page.waitForTimeout(1200);
    const min = page.getByLabel(/Anggaran minimal/i).first();
    await min.fill("");
    await min.type("1250000");
    await expect(min).toHaveValue("1.250.000");
    const maks = page.getByLabel(/Anggaran maksimal/i).first();
    await maks.fill("");
    await maks.type("250000");
  });

  test("beranda punya tombolnya sendiri, dan badge identitas profil sebangun", async ({ page }) => {
    await pasangSesi(page, "mahasiswa", { full_name: "Austin Yang", is_verified: true, tier: "pemula" });
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("mahasiswa", { full_name: "Austin Yang", is_verified: true })),
      "GET /withdrawals/wallet": () => ok(DOMPET_RAHASIA),
      "GET /applications/my": () => ok([]),
      "GET /users/me/verification": () =>
        ok({ id: "v1", status: "approved", submitted_at: "2026-09-01T00:00:00Z", reviewed_at: "2026-09-02T00:00:00Z", rejection_reason: null }),
    });
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto("/mahasiswa");
    await expect(page.getByText("Rp 475.000")).toBeVisible();
    await page.getByRole("button", { name: "Sembunyikan saldo" }).click();
    await expect(page.getByText("Rp 475.000")).toHaveCount(0);
    await page.getByRole("button", { name: "Tampilkan saldo" }).click();
    await expect(page.getByText("Rp 475.000")).toBeVisible();

    await page.goto("/profil");
    await expect(page.getByText("Terverifikasi", { exact: true })).toBeVisible();
    const ukur = await page.evaluate(() =>
      Array.from(document.querySelectorAll("span"))
        .filter(
          (el) =>
            el.children.length === 0 &&
            ["MAHASISWA", "TERVERIFIKASI", "PEMULA"].includes((el.textContent ?? "").trim().toUpperCase()),
        )
        .map((el) => {
          const cs = getComputedStyle(el);
          return [
            Math.round(el.getBoundingClientRect().height),
            cs.borderTopLeftRadius,
            cs.fontSize,
            cs.textTransform,
          ].join("|");
        }),
    );
    expect(ukur.length).toBe(3);
    expect(new Set(ukur).size).toBe(1);
  });

  test("saldo bisa disembunyikan dan pilihannya bertahan", async ({ page }) => {
    test.setTimeout(180_000);
    await pasangSesi(page, "mahasiswa", { full_name: "Rina" });
    await mockApi(page, {
      "GET /users/me": () => ok(pengguna("mahasiswa", { full_name: "Rina" })),
      "GET /withdrawals/wallet": () => ok(DOMPET_RAHASIA),
      "GET /applications/my": () => ok([]),
      "GET /bank-accounts": () => ok([]),
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/mahasiswa/dompet");
    await expect(page.getByText("Rp 475.000")).toBeVisible();

    const tombol = page.getByRole("button", { name: "Sembunyikan saldo" });
    await expect(tombol).toBeVisible();
    await tombol.click();

    await expect(page.getByText("Rp 475.000")).toHaveCount(0);
    await expect(page.getByText("Rp 120.000")).toHaveCount(0);
    await expect(page.getByText("Rp 1.250.000")).toHaveCount(0);

    await page.reload();
    await expect(page.getByRole("button", { name: "Tampilkan saldo" })).toBeVisible();
    await expect(page.getByText("Rp 475.000")).toHaveCount(0);

    await page.goto("/mahasiswa");
    await expect(page.getByText("Rp 475.000")).toHaveCount(0);
    await page.goto("/mahasiswa/dompet/tarik");
    await expect(page.getByText("Rp 475.000")).toHaveCount(0);

    await page.goto("/mahasiswa/dompet");
    await page.getByRole("button", { name: "Tampilkan saldo" }).click();
    await expect(page.getByText("Rp 475.000")).toBeVisible();
  });

  test("portofolio dan ulasan tampil di profil sendiri, hanya dibaca", async ({ page }) => {
    test.setTimeout(180_000);
    await pasangSesi(page, "mahasiswa", { full_name: "Austin Yang", is_verified: true });
    await mockApi(page, {
      "GET /users/me": () => ok(PROFIL_JEJAK.user),
      "GET /users/me/verification": () => ok({ id: "v1", status: "approved", submitted_at: "2026-09-01T00:00:00Z", reviewed_at: "2026-09-02T00:00:00Z", rejection_reason: null }),
      "GET /users/u-mahasiswa": () => ok(PROFIL_JEJAK),
      "GET /users/u-mahasiswa/portfolio": () => ok(PORTOFOLIO_JEJAK),
    });
    await page.setViewportSize({ width: 1280, height: 1100 });
    await page.goto("/profil");

    await expect(page.getByRole("heading", { name: "Rekam jejak" })).toBeVisible();
    await expect(page.getByText("Foto produk untuk katalog")).toBeVisible();
    await expect(page.getByText("Hasilnya rapi dan tepat waktu.").first()).toBeVisible();
    await expect(page.getByText("Sweetie Batter")).toBeVisible();

    const kontrol = await page.evaluate(() => ({
      isian: document.querySelectorAll("main input, main textarea, main select").length,
      tautanBerkas: document.body.innerHTML.includes("rahasia.pdf"),
    }));
    expect(kontrol.isian).toBe(0);
    expect(kontrol.tautanBerkas).toBe(false);

    await expect(page.getByText("Hasilnya rapi dan tepat waktu.")).toHaveCount(1);

    await expect(page.getByText("Komunikatif, tapi revisinya agak lama.")).toBeVisible();

    const lihat = page.getByRole("link", { name: "Lihat sebagai orang lain" });
    await expect(lihat).toHaveAttribute("href", "/pengguna/u-mahasiswa");
  });

});
