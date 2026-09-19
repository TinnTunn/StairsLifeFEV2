import { expect, test } from "@playwright/test";
import { galat, mockApi, ok, pasangSesi, pengguna } from "./api-tiruan";

test.describe("halaman publik", () => {
  test("CSP dengan nonce terpasang dan skrip tema tetap berjalan", async ({ page }) => {
    const res = await page.goto("/masuk");
    const csp = res?.headers()["content-security-policy"] ?? "";
    expect(csp).toContain("script-src 'self' 'nonce-");
    expect(csp).toContain("frame-ancestors 'none'");
    await expect(page.locator("html")).toHaveClass(/js/);
  });

  test("formulir masuk menampilkan galat di kolomnya", async ({ page }) => {
    await mockApi(page);
    await page.goto("/masuk");
    await page.getByRole("button", { name: "Masuk ke akunku" }).click();
    const email = page.locator("#kolom-email");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Masukkan alamat email yang valid.").first()).toBeVisible();
  });

  test("masuk menampilkan layar berputar lalu menghormati ?lanjut=", async ({ page }) => {
    await mockApi(page, {
      "POST /auth/login": async () => {
        await new Promise((r) => setTimeout(r, 1200));
        return ok({ token: "token-uji", refresh_token: "refresh-uji", user: pengguna("mahasiswa") });
      },
    });
    await page.goto("/masuk?lanjut=/kontrak");
    await page.locator("#kolom-email").fill("mahasiswa@contoh.id");
    await page.locator("#kolom-password").fill("rahasia-uji");
    await page.getByRole("button", { name: "Masuk ke akunku" }).click();

    await expect(page.getByRole("status").filter({ hasText: "Memeriksa akunmu" })).toBeVisible();
    // Pengalih "sudah masuk" tidak boleh mendahului formulir ke beranda peran.
    await page.waitForURL(/\/kontrak$/);
    await expect(page.getByRole("heading", { name: "Belum ada kontrak" })).toBeVisible();
  });

  test("ringkasan galat pendaftaran menautkan ke kolom yang salah", async ({ page }) => {
    await mockApi(page);
    await page.goto("/daftar/mahasiswa");
    /* Diulang sampai berhasil: di mode dev, rute yang baru pertama kali dibuka
       masih dikompilasi, jadi klik bisa mendahului hidrasi dan formulirnya
       terkirim biasa tanpa validasi klien. */
    await expect(async () => {
      await page.getByRole("button", { name: "Buat akun mahasiswa" }).click();
      await expect(page.locator("#kolom-full_name")).toHaveAttribute("aria-invalid", "true", { timeout: 3000 });
    }).toPass({ timeout: 30_000 });
    await page.getByRole("link", { name: "Kata sandi minimal 8 karakter." }).click();
    await expect(page.locator("#kolom-password")).toBeFocused();
  });

  test("beranda publik menutup sesi yang masih terbuka", async ({ page }) => {
    let logout = 0;
    await pasangSesi(page, "mahasiswa", { full_name: "Rizky" });
    await mockApi(page, {
      "POST /auth/logout": () => {
        logout += 1;
        return ok(null);
      },
    });
    await page.goto("/");
    /* Sesinya ditutup tanpa pemberitahuan apa pun di layar: yang membuktikan
       aturannya bekerja adalah token yang hilang dan logout yang terkirim. */
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem("stairslife-session"))).toBeNull();
    expect(logout).toBe(1);
    await expect(page.getByText(/Sesimu ditutup/)).toHaveCount(0);
    // Header publik tidak lagi menawarkan jalan kembali ke aplikasi.
    await expect(page.getByRole("link", { name: "Ke berandaku" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Masuk" }).first()).toBeVisible();
  });

  test("tombol utama di beranda membawa tamu ke pendaftaran", async ({ page }) => {
    /* Melamar mensyaratkan akun mahasiswa, jadi tamu yang menekan tombol utama
       memang harus mendaftar dulu, bukan mampir ke daftar proyek. */
    await mockApi(page);
    await page.goto("/");
    await page.getByRole("link", { name: "Cari Proyek" }).first().click();
    await page.waitForURL(/\/daftar\/mahasiswa$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("pintu masuk admin menolak akun biasa dan menghormati ?lanjut=", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await mockApi(page, {
      "POST /auth/login": (_r, body) => {
        const b = body as { email: string };
        if (b.email === "bukan-admin@contoh.id") {
          return ok({ token: "t", refresh_token: "r", user: pengguna("mahasiswa") });
        }
        if (b.email === "salah@contoh.id") return galat(401, "INVALID_CREDENTIALS", "Email atau kata sandi salah.");
        return ok({ token: "t", refresh_token: "r", user: pengguna("admin", { full_name: "Uji Admin" }) });
      },
      "GET /users/me": () => ok(pengguna("admin", { full_name: "Uji Admin" })),
      "GET /admin/me": () => ok({ penuh: true, izin: [], peran: [] }),
      "GET /admin/stats": () => ok({ total_users: 0, total_projects: 0, active_projects: 0, pending_verifications: 0, active_disputes: 0, project_trend: [], registration_trend: [] }),
      "GET /withdrawals": () => ok({ items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }),
    });

    // Rute admin tanpa sesi mengarah ke pintu admin, bukan halaman masuk biasa.
    await page.goto("/admin/penarikan");
    await page.waitForURL(/\/masuk\/admin\?lanjut=/);
    await expect(page.getByRole("heading", { name: "Masuk ke panel admin" })).toBeVisible();

    // Akun bukan admin ditolak di pintu ini dan sesinya tidak ditulis.
    await page.locator("#kolom-email").fill("bukan-admin@contoh.id");
    await page.locator("#kolom-password").fill("uji-bukan-sandi");
    await page.getByRole("button", { name: "Masuk ke panel" }).click();
    await expect(page.getByText(/bukan akun admin/)).toBeVisible();
    expect(await page.evaluate(() => window.localStorage.getItem("stairslife-session"))).toBeNull();

    // Akun admin masuk dan mendarat di tujuan semula.
    await page.locator("#kolom-email").fill("uji-admin@contoh.id");
    await page.locator("#kolom-password").fill("uji-bukan-sandi");
    await page.getByRole("button", { name: "Masuk ke panel" }).click();
    await page.waitForURL(/\/admin\/penarikan$/);
  });

  test("akun beku diarahkan ke banding, bukan jalan buntu", async ({ page }) => {
    let banding: unknown = null;
    await mockApi(page, {
      "POST /auth/login": () =>
        galat(401, "ACCOUNT_SUSPENDED", JSON.stringify({ suspended: true, reason: "Laporan penipuan" })),
      "POST /auth/suspended-appeal": (_r, body) => {
        banding = body;
        return ok(null);
      },
    });
    await page.goto("/masuk");
    await page.locator("#kolom-email").fill("beku@contoh.id");
    await page.locator("#kolom-password").fill("rahasia-uji");
    await page.getByRole("button", { name: "Masuk ke akunku" }).click();

    await expect(page.getByText("Akun ini dibekukan")).toBeVisible();
    await expect(page.getByText("Alasan: Laporan penipuan")).toBeVisible();
    await page.getByRole("button", { name: "Ajukan banding" }).click();

    await expect(page.getByLabel("Email akun")).toHaveValue("beku@contoh.id");
    await page.getByLabel("Kenapa akunmu perlu dipulihkan?").fill("Saya tidak pernah menipu. Ini salah paham.");
    await page.getByRole("button", { name: "Kirim banding" }).click();
    await expect(page.getByText("Banding terkirim")).toBeVisible();
    expect(banding).toEqual({ email: "beku@contoh.id", message: "Saya tidak pernah menipu. Ini salah paham." });
  });

  test("isian otomatis peramban tetap terbaca formulir masuk", async ({ page }) => {
    let dikirim = 0;
    await mockApi(page, {
      "POST /auth/login": () => {
        dikirim += 1;
        return galat(401, "INVALID_CREDENTIALS", "Email atau kata sandi tidak cocok.");
      },
    });

    /* Meniru pengisian otomatis peramban: nilai ditulis langsung ke DOM tanpa
       memancarkan event apa pun, persis seperti Chrome mengisi formulir yang
       sudah terpasang. Dulu formulirnya menolak dengan "belum diisi" padahal
       kolomnya terlihat terisi, dan tidak ada permintaan yang keluar sama
       sekali. */
    await page.goto("/masuk", { waitUntil: "load" });
    await page.evaluate(() => {
      const e = document.querySelector("#kolom-email") as HTMLInputElement;
      const p = document.querySelector("#kolom-password") as HTMLInputElement;
      e.value = "autofill@contoh.id";
      p.value = "RahasiaAutofill1";
    });
    /* Kolomnya memang terlihat terisi oleh pengguna. */
    await expect(page.locator("#kolom-password")).toHaveValue("RahasiaAutofill1");
    await page.waitForTimeout(2200);

    await page.locator("form button[type=submit]").first().click();
    await expect.poll(() => dikirim).toBe(1);
    await expect(page.getByText("Kata sandi belum diisi.")).toHaveCount(0);
  });


  test("color-scheme mengikuti tema yang benar-benar dipakai", async ({ page }) => {
    /* Warna yang digambar peramban sendiri (isian otomatis, scrollbar, pemilih
       tanggal) diambil dari color-scheme, bukan dari token kita. Saat pengguna
       memaksa tema terang di sistem yang gelap, keduanya sempat berbeda dan
       Chrome menulis teks isian otomatis putih di atas kolom putih. */
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => window.localStorage.setItem("stairslife-theme", "light"));
    await page.goto("/masuk", { waitUntil: "load" });
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).colorScheme))
      .toBe("light");

    const terang = await page.evaluate(() => {
      const el = document.querySelector("#kolom-email") as HTMLInputElement;
      return {
        latar: getComputedStyle(el.parentElement!).backgroundColor,
        teks: getComputedStyle(el).color,
      };
    });
    expect(terang).toEqual({ latar: "rgb(255, 255, 255)", teks: "rgb(51, 41, 31)" });
  });

  test("color-scheme gelap saat tema gelap dipaksa di sistem terang", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(() => window.localStorage.setItem("stairslife-theme", "dark"));
    await page.goto("/masuk", { waitUntil: "load" });
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).colorScheme))
      .toBe("dark");
  });

});
