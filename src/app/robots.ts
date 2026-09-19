import type { MetadataRoute } from "next";
import { SITUS_URL } from "@/lib/situs";

/* Hanya halaman publik yang layak diindeks. Area yang butuh akun sudah
   ber-noindex, tetapi tetap dilarang di sini supaya tidak dirayapi percuma. */
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
