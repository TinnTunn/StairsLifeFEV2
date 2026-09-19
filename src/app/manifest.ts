import type { MetadataRoute } from "next";

/* Pintasan layar utama di HP memakai logo, bukan tangkapan layar halaman. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StairsLife",
    short_name: "StairsLife",
    description: "Platform freelance mahasiswa dan UMKM Indonesia dengan pembayaran escrow.",
    start_url: "/",
    display: "standalone",
    /* Dibaca sistem operasi, bukan CSS, jadi token var() tidak bisa dipakai.
       Nilainya sama dengan --bg-page dan --brand (clay-600) mode terang. */
    // eslint-disable-next-line no-restricted-syntax
    background_color: "#FCF8F2",
    // eslint-disable-next-line no-restricted-syntax
    theme_color: "#B4531F",
    lang: "id",
    icons: [
      { src: "/assets/ikon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/assets/ikon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
