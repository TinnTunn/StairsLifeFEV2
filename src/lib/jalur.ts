// Penyaring jalur pengalihan supaya tidak keluar ke situs lain.

export function jalurAman(lanjut: string | null | undefined): string | null {
  if (!lanjut || !lanjut.startsWith("/")) return null;
  return lanjut[1] === "/" || lanjut[1] === "\\" ? null : lanjut;
}
