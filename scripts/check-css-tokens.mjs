/* Pendamping ESLint untuk berkas CSS.
   ESLint hanya membaca JS/TS, jadi warna mentah yang ditulis di CSS Module lolos
   dari 77 aturan kepatuhan design system. Skrip ini menutup celah itu. */

import { readFileSync } from "node:fs";
import { glob } from "node:fs/promises";

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const FUNC_COLOR = /\b(?:rgba?|hsla?)\s*\(/;
/* Lookahead memuat spasinya sendiri. Ditulis \s*:\s*(?!var\() regex akan
   mundur sampai \s* kosong, lalu lookahead memeriksa spasi dan selalu lolos. */
const FONT_FAMILY = /font-family\s*:(?!\s*var\()/i;
const FONT_SIZE = /font-size\s*:(?!\s*var\()[^;]*\d/i;

const CHECKS = [
  [HEX, "warna heksadesimal mentah, pakai token var(--...)"],
  [FUNC_COLOR, "warna rgb/hsl literal, pakai token var(--...)"],
  [FONT_FAMILY, "font-family bukan token, pakai var(--font-display) atau var(--font-sans)"],
  [FONT_SIZE, "font-size bukan token, pakai var(--text-*)"],
];

const DEFINISI = /(^|[;{\s])(--[a-z0-9-]+)\s*:/gi;
const PEMAKAIAN = /var\(\s*(--[a-z0-9-]+)/gi;

/* Properti yang isinya warna, dan properti yang isinya ukuran. Token yang
   tersesat di antara keduanya membuat deklarasinya tidak sah tanpa satu pun
   peringatan, dan propertinya diam diam jatuh ke nilai warisan. Itu yang
   terjadi pada 33 deklarasi `color: var(--text-body)`: --text-body adalah
   ukuran font, bukan warna, sehingga teks isian otomatis sempat digambar
   peramban dengan warnanya sendiri, putih di atas kertas putih. */
const PROP_WARNA =
  /(?:^|[;{\s])(?:color|background|background-color|border-color|border-(?:top|right|bottom|left)-color|caret-color|outline-color|text-decoration-color|fill|stroke|-webkit-text-fill-color)\s*:\s*var\(\s*(--[a-z0-9-]+)/gi;
const PROP_UKURAN = /(?:^|[;{\s])(?:font-size|letter-spacing)\s*:\s*var\(\s*(--[a-z0-9-]+)/gi;

/* Token yang dipakai tapi tidak pernah didefinisikan diam diam membuat
   deklarasinya tidak sah, dan propertinya jatuh ke nilai warisan tanpa satu pun
   peringatan. Itu yang terjadi pada var(--text-h4): skala tipografi memang
   berhenti di h3, jadi judul kartu proyek dan kolom pencarian cepat memakai
   ukuran teks biasa sementara kodenya terlihat benar. */
const DIKENAL = new Set();
/* Token dipilah menurut berkas tempat ia lahir: yang lahir di typography.css
   adalah ukuran dan jarak huruf, yang lahir di colors.css adalah warna. */
const TOKEN_UKURAN = new Set();
const TOKEN_WARNA = new Set();
for await (const file of glob("src/styles/**/*.css")) {
  const isi = readFileSync(file, "utf8");
  for (const [, , nama] of isi.matchAll(DEFINISI)) {
    DIKENAL.add(nama);
    if (file.includes("typography")) TOKEN_UKURAN.add(nama);
    if (file.includes("colors")) TOKEN_WARNA.add(nama);
  }
}
/* Nama yang lahir di dua tempat tidak bisa dinilai, jadi tidak dipakai menilai. */
for (const nama of [...TOKEN_UKURAN]) if (TOKEN_WARNA.has(nama)) TOKEN_UKURAN.delete(nama);

/* Sebagian properti kustom tidak pernah ditulis di CSS: komponen mengopernya
   lewat atribut style (mis. --urutan untuk menunda animasi per item). Nama itu
   dikumpulkan dari berkas komponennya supaya tidak dilaporkan palsu. */
for await (const file of glob("src/**/*.tsx")) {
  for (const [, nama] of readFileSync(file, "utf8").matchAll(/["'`](--[a-z0-9-]+)["'`]/gi)) {
    DIKENAL.add(nama);
  }
}

const findings = [];

/* Aturan warna dan font mentah hanya berlaku untuk CSS Module, karena berkas
   token memang tempatnya menulis nilai mentah. Pemeriksaan token berlaku untuk
   seluruh CSS, termasuk lembar global. */
for await (const file of glob("src/**/*.css")) {
  const modul = file.endsWith(".module.css");
  const isi = readFileSync(file, "utf8");
  /* Token yang didefinisikan di berkas itu sendiri, termasuk yang dioper
     komponen lewat atribut style (mis. --urutan), ikut dianggap dikenal. */
  const lokal = new Set([...isi.matchAll(DEFINISI)].map(([, , nama]) => nama));
  isi.split(/\r?\n/).forEach((line, i) => {
    if (line.trimStart().startsWith("/*") || line.trimStart().startsWith("*")) return;
    if (modul) {
      for (const [re, message] of CHECKS) {
        if (re.test(line)) findings.push(`${file}:${i + 1}  ${message}\n    ${line.trim()}`);
      }
      for (const [, nama] of line.matchAll(PEMAKAIAN)) {
        if (DIKENAL.has(nama) || lokal.has(nama)) continue;
        findings.push(`${file}:${i + 1}  token tidak dikenal ${nama}\n    ${line.trim()}`);
      }
    }
    for (const [, nama] of line.matchAll(PROP_WARNA)) {
      if (!TOKEN_UKURAN.has(nama)) continue;
      findings.push(`${file}:${i + 1}  ${nama} adalah token ukuran, bukan warna\n    ${line.trim()}`);
    }
    for (const [, nama] of line.matchAll(PROP_UKURAN)) {
      if (!TOKEN_WARNA.has(nama) || TOKEN_UKURAN.has(nama)) continue;
      findings.push(`${file}:${i + 1}  ${nama} adalah token warna, bukan ukuran\n    ${line.trim()}`);
    }
  });
}

if (findings.length) {
  console.error(`Kepatuhan CSS gagal, ${findings.length} temuan:\n`);
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log(
  `Kepatuhan CSS lolos: ${DIKENAL.size} token terdefinisi, tidak ada warna atau font mentah, ` +
    "dan tidak ada token yang dipakai di jenis properti yang salah.",
);
