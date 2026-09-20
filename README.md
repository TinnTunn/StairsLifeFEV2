# StairsLife Frontend

Antarmuka StairsLife, marketplace proyek freelance yang mempertemukan mahasiswa
Indonesia dengan UMKM. Dana klien ditahan di escrow sampai hasil kerja disetujui,
lalu dilepas ke dompet mahasiswa dikurangi komisi platform.

Backendnya ada di repositori terpisah: [StairsLifeBEV2](https://github.com/TinnTunn/StairsLifeBEV2).

## Teknologi

Next.js 16 dengan App Router, React 19, TypeScript. Gaya memakai CSS Modules di
atas token CSS, tanpa Tailwind dan tanpa pustaka komponen. Uji memakai Vitest dan
Playwright.

## Menjalankan di mesin sendiri

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3001`. Port 3001 dipilih karena backend memakai 3000.

Dengan `NEXT_PUBLIC_USE_MOCK=1` aplikasi berjalan tanpa backend memakai data
contoh, dan setiap halaman yang memakainya menampilkan penanda "data contoh".
Setel `0` untuk menembak backend sungguhan. Saat `0`, isi juga `FRONTEND_URL` di
backend dengan `http://localhost:3001` supaya lolos CORS.

## Variabel lingkungan

Ketiganya dibekukan ke dalam bundel saat build, bukan dibaca saat dijalankan,
jadi mengubahnya di Vercel mengharuskan build ulang.

| Variabel | Isi |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Alamat backend, wajib berakhir `/api/v1`, tanpa garis miring di akhir |
| `NEXT_PUBLIC_SITE_URL` | Alamat situs ini sendiri, dipakai metadata Open Graph, sitemap, dan robots |
| `NEXT_PUBLIC_USE_MOCK` | `1` memakai data contoh, `0` memakai backend |

`scripts/cek-produksi.mjs` berjalan otomatis sebelum build. Di mesin sendiri ia
hanya mengingatkan; di Vercel dan CI ia menghentikan build kalau ada yang kosong,
masih menunjuk localhost, memakai http, atau `NEXT_PUBLIC_USE_MOCK` masih `1`.
Tanpa penjaga ini, build tetap hijau dan aplikasinya baru gagal di peramban
pengguna karena menembak localhost.

## Perintah

| Perintah | Isi |
|---|---|
| `npm run dev` | Server pengembangan di port 3001 |
| `npm run check` | ESLint, pemeriksa token CSS, dan `tsc --noEmit` |
| `npm test` | Uji unit Vitest di `tests/unit` |
| `npm run test:e2e` | Uji ujung ke ujung Playwright, seluruh panggilan API dimock |
| `npm run build` | Build produksi, didahului cek variabel lingkungan |
| `npm run verifikasi` | `check`, `test`, lalu `build` sekaligus |

## Struktur

```
src/app          51 halaman, dikelompokkan tiga route group
src/components   56 komponen
src/i18n         kamus Indonesia dan Inggris
src/lib          klien API, tipe, format, hook
src/styles       330 token CSS, tema terang dan gelap
```

Tiga route group di `src/app`:

- `(publik)` untuk halaman tanpa login: beranda, masuk, daftar, verifikasi email,
  atur ulang kata sandi, dan hasil pembayaran
- `(aplikasi)` untuk halaman yang butuh login. Shell aplikasi dipasang sekali di
  layout grup ini, jadi halaman cukup merender `<Halaman title=...>` atau alias
  bernama peran, bukan memasang shell sendiri
- `(panel)` untuk pintu masuk admin

## Aturan yang dijaga alat, bukan ingatan

**Tanpa warna dan font mentah.** `npm run lint:css` menolak nilai warna atau font
yang ditulis langsung di CSS Module. Semuanya harus token yang didefinisikan di
`src/styles`. Pemeriksa yang sama juga menolak token yang tidak pernah
didefinisikan, dan token yang dipakai di jenis properti yang salah, misalnya
ukuran font yang dipakai sebagai warna.

**Tanpa teks yang ditulis di komponen.** Aplikasi ini dwibahasa dengan bahasa
Indonesia sebagai bawaan. Setiap kalimat yang dilihat pengguna melewati kamus di
`src/i18n`. Kamus Inggris bertipe mengikuti kamus Indonesia, jadi kunci yang
tertinggal menjadi galat TypeScript, bukan teks kosong di layar.

Setelah mengubah tampilan, periksa kedua bahasa di lebar 375px dan 1440px. Teks
Inggris sering lebih panjang dan itu yang biasanya merusak tata letak.

**Angka uang datang dari backend.** Komisi, minimum penarikan, dan biaya admin
dibaca dari `GET /settings/public` lewat `src/lib/pengaturan.ts`, tidak pernah
ditulis di kode.

## Uji

Uji unit menutup pemformatan rupiah dan tanggal, pemetaan galat backend, izin
rute, dan penyaring jalur pengalihan.

Uji E2E menjalankan alur ketiga peran dengan seluruh panggilan API dimock di
lapisan jaringan, jadi tidak menyentuh basis data maupun Xendit.

Keduanya berjalan otomatis di GitHub Actions bersama lint, typecheck, dan build.

## Penyebaran

Disiapkan untuk Vercel. Isi ketiga variabel `NEXT_PUBLIC_*` di Settings,
Environment Variables, lalu build. Halaman publik dirender di server sehingga
daftar proyek bisa diindeks mesin pencari, sedangkan halaman yang butuh login
dirender di klien dengan Bearer token; token tidak pernah menyentuh server Next.

## Dokumen lain

- `DESIGN.md` arah visual dan dasar design system
- `DECISIONS.md` alasan di balik keputusan besar, termasuk penyimpangan dari
  design system beserta ukurannya
- `LAPORAN-QA.md` hasil pengujian white box, black box, dan keamanan tiga peran
- `docs/` salinan design system dan catatan pekerjaan backend
