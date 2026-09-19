import type { NextConfig } from "next";

/* Backend menaruh deep link berbahasa Inggris di notifications.action_url dan
   di tautan email. Rute produk memakai bahasa Indonesia, jadi setiap path yang
   benar-benar dikirim backend dipetakan di sini. Daftar ini diambil dari
   grep action_url di ../StairsLifeBEV2/src, bukan dikira-kira: kalau backend
   menambah deep link baru, tambahkan barisnya di sini juga. */
const nextConfig: NextConfig = {
  /* Tidak mengumumkan framework dan versinya ke setiap respons. */
  poweredByHeader: false,

  /* Header keamanan dasar. Content-Security-Policy lengkap (dengan nonce per
     permintaan) dipasang di src/proxy.ts.
     - X-Frame-Options: halaman masuk, kontrak, dan tombol "Setujui dan lepas
       dana" tidak boleh disematkan di iframe situs lain (clickjacking);
       frame-ancestors di CSP menjaga browser modern, ini untuk yang lama.
     - Referrer-Policy: /reset-password?token=... tidak boleh membocorkan
       token lewat header Referer ke domain lain.
     - nosniff: berkas unggahan tidak ditafsirkan ulang sebagai skrip. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      /* Tautan email dari email.service.ts dan welcome.template.ts. Query
         string (?token=...) diteruskan otomatis oleh Next ke tujuan. */
      { source: "/verify-email", destination: "/verifikasi-email", permanent: false },
      {
        source: "/",
        has: [{ type: "query", key: "tab", value: "verification" }],
        destination: "/mahasiswa/verifikasi",
        permanent: false,
      },
      {
        source: "/",
        has: [{ type: "query", key: "tab", value: "projects" }],
        destination: "/bisnis/proyek/baru",
        permanent: false,
      },
      /* Deep link proyek dari notifikasi dan email selalu ditujukan ke
         mahasiswa, dan daftar proyek kini hanya ada di dalam aplikasi. */
      { source: "/projects/:id", destination: "/mahasiswa/cari/:id", permanent: false },
      {
        source: "/projects/:id/applications",
        destination: "/bisnis/proyek/:id/pelamar",
        permanent: false,
      },
      { source: "/applications", destination: "/mahasiswa/lamaran", permanent: false },
      { source: "/applications/:id", destination: "/mahasiswa/lamaran/:id", permanent: false },
      { source: "/contracts/:id", destination: "/kontrak/:id", permanent: false },
      { source: "/disputes/:id", destination: "/sengketa/:id", permanent: false },
      { source: "/admin/disputes/:id", destination: "/admin/sengketa/:id", permanent: false },
      { source: "/chat/inquiry/:id", destination: "/pesan/tanya/:id", permanent: false },
      { source: "/wallet", destination: "/mahasiswa/dompet", permanent: false },
      { source: "/profile", destination: "/profil", permanent: false },
    ];
  },
};

export default nextConfig;
