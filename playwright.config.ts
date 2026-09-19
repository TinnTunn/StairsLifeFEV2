import { defineConfig, devices } from "@playwright/test";

/**
 * Uji ujung ke ujung antarmuka. Semua panggilan browser ke API StairsLife
 * dimock di tes (lihat tests/e2e/api-tiruan.ts), jadi uji ini tidak menulis
 * ke database dan tidak menyentuh Xendit. Halaman publik yang dirender server
 * tetap boleh jalan tanpa backend: tes tidak bergantung pada isinya.
 *
 * Lokal: memakai Chrome yang terpasang (channel chrome) supaya tidak perlu
 * mengunduh browser. CI: `npx playwright install --with-deps chromium`.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "retain-on-failure",
    locale: "id-ID",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3001/masuk",
    reuseExistingServer: true,
    timeout: 180_000,
    env: { NEXT_PUBLIC_USE_MOCK: "0" },
  },
});
