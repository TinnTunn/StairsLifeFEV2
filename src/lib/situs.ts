/**
 * Alamat publik situs untuk metadata, sitemap, dan robots. Isi
 * NEXT_PUBLIC_SITE_URL di lingkungan produksi; tanpa itu dipakai alamat dev.
 */
export const SITUS_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(/\/$/, "");
