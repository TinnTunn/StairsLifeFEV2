// Manifest web app (nama, ikon, warna tema).

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StairsLife",
    short_name: "StairsLife",
    description: "Platform freelance mahasiswa dan UMKM Indonesia dengan pembayaran escrow.",
    start_url: "/",
    display: "standalone",
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
