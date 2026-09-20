// robots.txt yang disusun dari alamat situs.

import type { MetadataRoute } from "next";
import { SITUS_URL } from "@/lib/situs";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/mahasiswa",
        "/bisnis",
        "/admin",
        "/kontrak",
        "/profil",
        "/pesan",
        "/sengketa",
        "/notifikasi",
        "/bantuan",
        "/payment",
        "/reset-password",
        "/verifikasi-email",
        "/konfirmasi-email",
        "/kit",
      ],
    },
    sitemap: `${SITUS_URL}/sitemap.xml`,
    host: SITUS_URL,
  };
}
