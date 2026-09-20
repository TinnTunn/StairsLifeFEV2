// Konfigurasi Next: header keamanan, dan pengalihan deep link berbahasa Inggris dari backend.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

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
