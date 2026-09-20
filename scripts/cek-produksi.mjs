// Penjaga sebelum build: menghentikan build produksi kalau variabel NEXT_PUBLIC_ salah.

import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error });

const diLuar = Boolean(process.env.VERCEL || process.env.CI) || process.env.NODE_ENV === "production";

const temuan = [];

function url(nama, { wajibHttps }) {
  const nilai = process.env[nama];
  if (!nilai) {
    temuan.push(`${nama} belum diisi.`);
    return;
  }
  let u;
  try {
    u = new URL(nilai);
  } catch {
    temuan.push(`${nama} bukan URL yang sah: ${nilai}`);
    return;
  }
  if (diLuar && /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(u.hostname)) {
    temuan.push(`${nama} masih menunjuk ${u.hostname}. Isi dengan domain sungguhan.`);
  }
  if (wajibHttps && u.protocol !== "https:") {
    temuan.push(`${nama} memakai ${u.protocol.replace(":", "")}. Produksi harus https.`);
  }
  if (nilai.endsWith("/")) {
    temuan.push(`${nama} diakhiri garis miring. Hapus supaya alamat yang disusun tidak berisi //.`);
  }
}

url("NEXT_PUBLIC_API_BASE_URL", { wajibHttps: diLuar });
url("NEXT_PUBLIC_SITE_URL", { wajibHttps: diLuar });

if (process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_BASE_URL.endsWith("/api/v1")) {
  temuan.push("NEXT_PUBLIC_API_BASE_URL harus berakhir dengan /api/v1, mengikuti prefix backend.");
}

if (process.env.NEXT_PUBLIC_USE_MOCK === "1") {
  temuan.push("NEXT_PUBLIC_USE_MOCK masih 1. Build ini akan memakai data contoh, bukan backend.");
}

if (temuan.length === 0) {
  console.log("Cek produksi lolos.");
  process.exit(0);
}

const judul = diLuar ? "Build dihentikan" : "Peringatan build lokal";
console[diLuar ? "error" : "warn"](`${judul}, ${temuan.length} temuan:`);
for (const t of temuan) console[diLuar ? "error" : "warn"](`  - ${t}`);
if (diLuar) {
  console.error("\nIsi variabel ini di Vercel (Settings, Environment Variables) lalu jalankan ulang.");
  process.exit(1);
}
