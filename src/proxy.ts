import { NextResponse, type NextRequest } from "next/server";

/**
 * Content Security Policy dengan nonce per permintaan.
 *
 * Token sesi disimpan di localStorage, jadi satu skrip asing yang berhasil
 * berjalan bisa membawanya keluar. CSP ini membatasi skrip ke bundel Next dan
 * skrip inline yang membawa nonce (skrip tema di <head>), dan membatasi ke mana
 * halaman boleh mengirim data: situs ini sendiri dan API StairsLife.
 *
 * - style-src memakai 'unsafe-inline' tanpa nonce: komponen memakai atribut
 *   style (variabel CSS per elemen), dan nonce tidak berlaku untuk atribut.
 *   Gaya inline jauh lebih sempit risikonya daripada skrip.
 * - 'unsafe-eval' hanya di pengembangan, dipakai React untuk jejak galat.
 */
function asalApi(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1").origin;
  } catch {
    return "";
  }
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const dev = process.env.NODE_ENV === "development";
  const api = asalApi();

  const kebijakan = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    // Avatar publik dari Supabase Storage.
    "img-src 'self' blob: data: https://*.supabase.co",
    "font-src 'self' data:",
    `connect-src 'self' ${api}${dev ? " ws: wss:" : ""}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const headerPermintaan = new Headers(request.headers);
  headerPermintaan.set("x-nonce", nonce);
  headerPermintaan.set("Content-Security-Policy", kebijakan);

  const response = NextResponse.next({ request: { headers: headerPermintaan } });
  response.headers.set("Content-Security-Policy", kebijakan);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|assets/|icon|apple-icon|manifest.webmanifest|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
