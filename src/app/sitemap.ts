// sitemap.xml berisi rute publik yang boleh diindeks.

import type { MetadataRoute } from "next";
import { SITUS_URL } from "@/lib/situs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITUS_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITUS_URL}/daftar`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITUS_URL}/daftar/mahasiswa`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITUS_URL}/daftar/bisnis`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
