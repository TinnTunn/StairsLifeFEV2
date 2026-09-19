/**
 * Tujuan ?lanjut= setelah masuk. Hanya jalur relatif di dalam situs yang
 * diikuti, supaya tautan masuk tidak bisa dipakai mengalihkan ke situs lain.
 */
export function jalurAman(lanjut: string | null | undefined): string | null {
  if (!lanjut || !lanjut.startsWith("/")) return null;
  /* "//host" dan "/\host" dibaca browser sebagai alamat situs lain. */
  return lanjut[1] === "/" || lanjut[1] === "\\" ? null : lanjut;
}
