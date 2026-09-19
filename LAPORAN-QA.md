# Laporan QA StairsLife

Tanggal uji: 18 September 2026.
Lingkup: frontend `StairsLifeFEV3` dengan backend `StairsLifeBEV2` menyala di
`localhost:3000`, ditambah build produksi yang dijalankan terpisah.
Tujuan: menilai kesiapan rilis ke Vercel (frontend) dan Railway (backend).

## Putusan

**Layak rilis dengan tiga syarat.** Tidak ada cacat yang menahan rilis di sisi
frontend. Dua temuan keamanan sudah ditutup di sesi ini, satu di antaranya
menunggu backend dinyalakan ulang. Sisanya urusan konfigurasi penyebaran yang
harus benar sejak menit pertama, karena kalau salah, aplikasinya tampak rusak
total di peramban sementara log backend terlihat sehat.

| Syarat | Keterangan |
|---|---|
| Isi env di Vercel dan Railway | Daftar lengkapnya di bagian "Checklist penyebaran" |
| Samakan origin di `FRONTEND_URL` | Terbukti di uji ini: satu digit port yang beda membuat seluruh API terblokir CORS |
| Ganti kata sandi admin setelah masuk pertama | Kata sandi akun admin produksi pernah melewati percakapan, jadi harus dirotasi |

## Cara pengujian

| Lapisan | Yang dikerjakan |
|---|---|
| White box | Baca kode, telusuri konfigurasi, periksa kebersihan (TODO, `any`, `console`, `eslint-disable`), audit header dan CSP, lacak variabel lingkungan sampai ke titik pemakaiannya |
| Black box | Masuk lewat formulir sungguhan dengan akun uji, lalu susuri 34 halaman untuk tiga peran tanpa tiruan apa pun, mencatat galat konsol, respons 4xx atau 5xx, layar galat, dan scroll mendatar |
| Keamanan | 39 kasus otorisasi ditembakkan langsung ke API dengan token asli tiga peran, termasuk kasus uang dan kasus akses objek milik orang lain |
| Regresi | ESLint 78 aturan kepatuhan, TypeScript, kepatuhan token CSS, 27 uji unit, 42 uji ujung ke ujung, build produksi |

## Temuan

### K-01 Verifikasi KTM tanpa penjaga peran (tinggi, sudah diperbaiki)

`POST /users/me/verification` dan `GET /users/me/verification` hanya dijaga
`JwtAuthGuard`. Akun bisnis yang sudah masuk bisa membuat dan menimpa baris
verifikasi KTM untuk dirinya sendiri, berisi nama kampus dan nomor induk
karangan. Dibuktikan dua kali: balasan `201 Verifikasi berhasil diajukan` lalu
`201 Verifikasi berhasil diperbarui`.

Dampaknya bukan kenaikan hak akses, karena `is_verified` hanya berubah kalau
admin menyetujui. Yang terjadi adalah baris data KYC mengendap untuk akun yang
bukan mahasiswa, dan baris itu tidak pernah muncul di antrean moderasi admin,
jadi tidak ada yang bisa menindaknya.

Perbaikan: `@UseGuards(RolesGuard)` dan `@Roles('mahasiswa')` dipasang di kedua
endpoint. Sesudahnya, akun bisnis mendapat `403 Akses ditolak. Diperlukan role:
mahasiswa`, dan mahasiswa tetap `200`. Halaman verifikasi, beranda, dan profil
mahasiswa diuji ulang lewat antarmuka: keempat panggilan tetap `200`, tidak ada
layar galat.

### K-02 Access token berumur 7 hari (tinggi, sudah ditutup)

`JWT_EXPIRES_IN=7d`. Access token bersifat stateless, jadi logout tidak bisa
mencabutnya. Diukur langsung dari klaim `iat` dan `exp`: umurnya 10.080 menit.
Artinya token yang bocor tetap membuka akun penuh selama tujuh hari meski
penggunanya sudah keluar, dan mekanisme refresh yang sudah dibangun jadi
kehilangan gunanya.

Perbaikan: `.env` backend diubah ke `JWT_EXPIRES_IN=60m`, angka yang memang jadi
bawaan `token.service.ts` dan dipakai uji unitnya sendiri. Frontend sudah punya
pencegat 401 yang menyegarkan token sekali lalu mengulang permintaan, dan
alurnya sudah terkunci uji, jadi pemendekan ini tidak terasa oleh pengguna.
Backend sudah dinyalakan ulang dan nilainya diverifikasi langsung dari klaim
token: **60 menit**, turun dari 10.080 menit. Untuk postur lebih ketat, `15m`
juga aman dengan pencegat yang sama.

### K-03 CORS menentukan hidup matinya aplikasi (tinggi, urusan penyebaran)

Terbukti tanpa sengaja saat menguji build produksi di port 3002 sementara
`FRONTEND_URL` backend berisi port 3001: setiap permintaan diblokir dengan
`Response to preflight request doesn't pass access control check`. Gejalanya
menipu. Halaman tetap tergambar rapi, tidak ada galat merah di layar, formulir
tetap bisa diisi, tapi tidak ada satu pun data yang masuk, dan log backend
bersih karena permintaannya memang tidak pernah sampai.

Saat domain frontend diganti, `FRONTEND_URL` di Railway wajib ikut diganti.
Kolom itu menerima beberapa origin dipisah koma, jadi domain kustom dan domain
`*.vercel.app` bisa diisi bersamaan selama masa peralihan.

### W-01 Variabel lingkungan yang lupa diisi lolos tanpa peringatan (sedang, sudah diperbaiki)

`NEXT_PUBLIC_*` dibekukan ke dalam bundel saat build, bukan dibaca saat
dijalankan. Sebelum perbaikan, kalau `NEXT_PUBLIC_API_BASE_URL` tidak diisi di
Vercel, buildnya tetap sukses dan penyebarannya tetap hijau, lalu aplikasinya
menembak `http://localhost:3000` dari peramban pengguna. CSP ikut salah, karena
`connect-src` diturunkan dari alamat yang sama.

Perbaikan: `scripts/cek-produksi.mjs` dijalankan otomatis lewat `prebuild`. Di
mesin sendiri ia hanya mengingatkan; di Vercel, CI, atau build produksi mana pun
ia menghentikan build bila ada variabel yang kosong, bukan https, menunjuk
localhost, berakhiran garis miring, tidak berakhiran `/api/v1`, atau bila
`NEXT_PUBLIC_USE_MOCK` masih `1`. Diuji dua arah: konfigurasi salah keluar
dengan kode 1, konfigurasi benar lolos.

### W-02 Access token tetap sah setelah logout (rendah, sifat bawaan)

Diukur: sesudah `POST /auth/logout`, refresh token langsung ditolak `401`
(benar), tapi access token lama masih diterima `200` sampai kedaluwarsa. Ini
perilaku wajar JWT stateless. Risikonya turun dari tujuh hari menjadi satu jam
begitu K-02 berlaku. Kalau nanti butuh pencabutan seketika, jalannya daftar
hitam `jti` di Redis, dan itu pekerjaan backend tersendiri.

### W-03 HSTS tidak dipasang aplikasi (informasi)

Aplikasi memasang `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, dan CSP lengkap dengan nonce per
permintaan. `Strict-Transport-Security` tidak dipasang sendiri karena Vercel
menambahkannya untuk domain kustom ber-HTTPS. Periksa sekali setelah domain
aktif.

## Yang diuji dan terbukti benar

Bagian ini sama pentingnya dengan daftar temuan, karena inilah yang menahan
uang orang.

| Pemeriksaan | Hasil |
|---|---|
| Penjaga rute lintas peran di antarmuka | Mahasiswa membuka `/admin`, `/admin/keuangan`, `/admin/pengguna`, `/bisnis/proyek/baru`: semuanya berhenti di layar "Halaman ini untuk akun admin" berikut jalan kembali. Sama untuk bisnis dan admin |
| Penjaga peran di API | Mahasiswa dan bisnis ditolak `403` di seluruh endpoint `/admin/*`, termasuk membekukan akun, menyetujui verifikasi, dan membaca keuangan platform |
| Otorisasi uang | Mahasiswa tidak bisa menyetujui hasil kerjanya sendiri, tidak bisa melepas escrow, tidak bisa menghapus proyek orang. Semuanya `403` |
| Akses objek orang lain | Mahasiswa lain ditolak membaca lamaran (`403 Kamu tidak punya akses ke lamaran ini`), membaca kontrak, mengunggah hasil ke kontrak orang, dan membatalkan lamaran orang |
| Kenaikan hak lewat badan permintaan | `role`, `is_verified`, dan `tier` yang diselundupkan ke `PATCH /users/me` ditolak `400 property ... should not exist` |
| Nilai penarikan | Di bawah minimum dan bernilai negatif ditolak `400` |
| Pembatasan laju login | Tiga percobaan salah lalu `429` beruntun |
| Daur hidup sesi | Refresh token berputar setiap dipakai, dicabut saat logout, token sampah ditolak `401` |
| Token di alamat | Tidak ada token sesi di URL mana pun. Token di tautan email dilindungi `Referrer-Policy` |
| Akun dibekukan | Login akun beku menampilkan panel "Akun ini dibekukan" berikut alasan dan tombol ajukan banding, bukan jalan buntu |
| Endpoint publik | `GET /projects` dan `GET /settings/public` terbuka tanpa token, sesuai rancangan |

## Ronda tiga peran dengan backend sungguhan

Masuk lewat formulir, lalu setiap halaman dibuka satu per satu.

| Peran | Halaman | Waktu masuk | Render gagal | Galat konsol | HTTP 4xx/5xx | Scroll mendatar |
|---|---|---|---|---|---|---|
| Mahasiswa | 15 | 2.967 ms | 0 | 0 | 0 | 0 |
| Bisnis | 9 | 1.406 ms | 0 | 0 | 0 | 0 |
| Admin | 10 | 1.978 ms | 0 | 0 | 0 | 0 |

### Alur mahasiswa

Beranda, cari proyek, lamaran, dompet, rekening bank, penarikan, verifikasi KTM,
kontrak, pesan, notifikasi, profil, keamanan, sengketa, bantuan. Semuanya memuat
data sungguhan tanpa galat. Status verifikasi terbaca benar ("Kartu mahasiswamu
sudah disetujui"), tingkat dan rating tampil dari backend. Pencarian proyek
sekarang memakai kolom yang mengembang, dan pintasan Ctrl K beserta layar
pencarian cepatnya sudah dihapus sesuai permintaan.

### Alur bisnis

Beranda, proyek saya, buat proyek, kontrak, pesan, notifikasi, profil, sengketa,
bantuan. Semuanya memuat tanpa galat. Alur uangnya sendiri (tagihan Xendit,
escrow ditahan, pelepasan dana) sudah terkunci empat uji ujung ke ujung di
`tests/e2e/aplikasi.spec.ts`, dan pada data sungguhan ditemukan kontrak dengan
pembayaran berstatus `released`, artinya rantai penuhnya pernah berjalan.

### Alur admin

Ringkasan, pengguna, verifikasi KTM, proyek, sengketa, keuangan, penarikan,
dukungan, pengumuman, pengaturan. Semuanya memuat tanpa galat. Alur "Aktifkan
kembali" diuji sungguhan terhadap tiga akun uji yang dibekukan pada audit
15 September, dan ketiganya kembali bisa masuk. Bilah tab panel admin kini
memakai penanda yang meluncur, dan baris proyek memakai tiga kolom lurus.

## Hasil regresi dan kebersihan kode

| Pemeriksaan | Hasil |
|---|---|
| ESLint (78 aturan kepatuhan design system) | Lolos |
| TypeScript `tsc --noEmit` | Lolos |
| Kepatuhan token CSS | Lolos, 330 token semuanya terdefinisi |
| Uji unit (Vitest) | 27 lolos |
| Uji ujung ke ujung (Playwright) | 42 lolos |
| Build produksi | Lolos, 51 rute |
| `TODO`, `FIXME`, `any`, `console.log` | 0, 0, 0, 0 |
| `console.error` | 2, keduanya di batas galat React, memang seharusnya ada |
| `dangerouslySetInnerHTML` | 2, keduanya skrip tema ber-nonce sebelum paint pertama |
| `target="_blank"` tanpa `rel` | 0 |
| `eslint-disable` | 9, semuanya sempit dan beralasan |
| Kesejajaran kamus dua bahasa | Dijamin kompilator: kamus Inggris diketik `typeof` kamus Indonesia |

Waktu muat build produksi di mesin lokal: beranda 419 ms, halaman masuk 229 ms,
pendaftaran mahasiswa 183 ms, bantuan 202 ms.

## Checklist penyebaran

### Vercel (frontend)

| Variabel | Isi | Kalau salah |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<domain-railway>/api/v1` | Build dihentikan penjaga baru. Kalau penjaganya dilewati, seluruh API gagal dan CSP ikut salah |
| `NEXT_PUBLIC_SITE_URL` | Domain kustom, tanpa garis miring di akhir | Sitemap, robots, dan pratinjau tautan yang dibagikan menunjuk alamat salah |
| `NEXT_PUBLIC_USE_MOCK` | `0` | Aplikasi menampilkan data contoh di produksi |

Ketiganya dibekukan saat build. Mengubahnya di Vercel harus diikuti build ulang,
bukan sekadar menyimpan.

### Railway (backend)

| Variabel | Isi | Kalau salah |
|---|---|---|
| `FRONTEND_URL` | Domain kustom frontend. Boleh beberapa, dipisah koma | Seluruh permintaan diblokir CORS. Gejalanya halaman tampak normal tapi kosong |
| `APP_URL` | Domain kustom frontend | Pantulan Xendit dan tautan email mendarat di domain lama |
| `NODE_ENV` | `production` | Whitelist CORS pengembangan (port 5173 dan 5500) ikut aktif di produksi |
| `JWT_EXPIRES_IN` | `60m` | Lihat K-02 |
| `XENDIT_CALLBACK_TOKEN` | Sama persis dengan yang di dasbor Xendit | Webhook pembayaran ditolak dan status escrow tidak pernah berubah |
| `PUBLIC_BASE_URL` | Alamat publik backend | Tautan yang disusun backend menunjuk alamat salah |
| `EMAIL_FROM`, `RESEND_API_KEY` | Domain pengirim yang sudah diverifikasi | Email verifikasi dan reset kata sandi tidak terkirim |

### Di dasbor Xendit

Alamat webhook harus menunjuk
`https://<domain-railway>/api/v1/payments/webhook/xendit`. Redirect sukses dan
gagal dibangun backend dari `APP_URL` menuju `/payment/result`, dan rute itu
sudah ada di frontend.

### Urutan yang disarankan

1. Sebarkan backend ke Railway, catat domainnya.
2. Isi env Vercel memakai domain itu, sebarkan frontend, catat domainnya.
3. Isi `FRONTEND_URL` dan `APP_URL` di Railway memakai domain frontend, nyalakan ulang.
4. Perbarui alamat webhook di dasbor Xendit.
5. Uji satu putaran penuh dengan uang kecil: daftar, masuk, buat proyek, lamar,
   terima, bayar, lepas dana.

## Batasan laporan ini

- Pengujian dijalankan terhadap backend di mesin lokal, bukan di Railway. Latensi
  jaringan, cold start, dan batas sumber daya Railway belum terukur.
- Tidak ada uji beban dan tidak ada uji penetrasi mendalam. Yang dikerjakan
  adalah uji otorisasi terarah pada permukaan yang dipakai produk.
- Aksesibilitas diperiksa lewat struktur (label, peran, urutan fokus, cincin
  fokus, kontras token), bukan lewat pemindai otomatis.
- Seluruh akun uji sudah dihapus setelah pengujian selesai (lihat bagian
  berikutnya), jadi hasil ronda di atas tidak bisa diulang persis tanpa membuat
  akun baru.

## Ronda kedua: alur tiga aktor dari ujung ke ujung (19 September 2026)

Dijalankan setelah pembersihan data, melawan backend sungguhan, dengan akun
sementara yang dihapus lagi di skrip yang sama.

### Alur uang penuh lewat API

Satu jalan tanpa putus: bisnis memasang proyek, dua mahasiswa melamar, satu
diterima, kontrak dibuat, tagihan escrow terbit, webhook Xendit dipanggil dengan
token callback yang sah, dana masuk escrow, hasil kerja dikirim, bisnis
menyetujui, dana dilepas, komisi terpotong, penarikan diajukan lalu ditolak
admin dan dananya kembali. **42 pemeriksaan, nol temuan.** Termasuk di dalamnya:
webhook yang diulang tetap aman, webhook tanpa token sah ditolak `403`, saldo
ditahan saat penarikan diajukan, dan komisi lima persen terpotong tepat sekali.

### Ronda antarmuka

43 halaman untuk tiga peran, masing masing diperiksa di 1440px dan 375px: nol
render gagal, nol galat konsol, nol respons 4xx, nol scroll mendatar. Satu
pengalihan tercatat dan memang disengaja, yaitu rute pelamar lama yang menyatu
ke detail proyek.

### Tiga cacat ditemukan lewat interaksi sungguhan, bukan lewat memuat halaman

| Kode | Cacat | Sebab | Status |
|---|---|---|---|
| I-01 | Kolom isian di dalam modal hanya menerima satu huruf | Efek fokus `Modal` ikut bergantung pada `onClose`, yang ditulis pemanggil sebagai fungsi inline. Setiap ketikan membuat identitas baru, efeknya dipasang ulang, dan fokus dilempar ke tombol pertama | Diperbaiki |
| I-02 | Modal "buat kontrak" tidak pernah muncul setelah menerima pelamar | Daftar pelamar dimuat ulang dengan mengganti dependensi `useAsync`, yang membuang data lama dan membongkar pohon komponennya bersama state modal yang baru dinyalakan | Diperbaiki |
| I-03 | Lencana status proyek tetap tertulis AKTIF setelah pelamar diterima | Hanya daftar pelamar yang dimuat ulang, proyeknya tidak | Diperbaiki |
| I-04 | Pelamar yang sudah punya kontrak tetap ditawari "Buat kontrak" | `GET /applications/project/:id` tidak pernah menyertakan relasi `contracts`, padahal kartunya membacanya. Daftar lamaran milik mahasiswa sudah menyertakannya sejak awal, jadi hanya sisi bisnis yang timpang | Diperbaiki |

I-01 yang paling luas akibatnya. Dua belas layar punya kolom isian di dalam
modal, termasuk nilai kontrak, alasan pembekuan akun, catatan putusan sengketa,
dan formulir rekening bank. Sebelum perbaikan, tidak satu pun bisa diisi lebih
dari satu huruf lewat papan ketik.

Diukur setelah perbaikan: fokus bertahan di kolomnya untuk keenam ketikan, dan
karetnya mengikuti pemisah ribuan yang bergeser (posisi 1, 2, 3, 5, 6, 7). Satu
uji regresi permanen menguncinya.

I-04 tidak sampai menggandakan kontrak, karena `contracts.create` di backend
memang idempoten dan mengembalikan kontrak yang sudah ada. Yang terjadi adalah
pemilik usaha ditawari formulir nilai dan tenggat yang isinya diabaikan diam
diam. Setelah perbaikan, tombolnya berubah jadi "Buka kontraknya" dan menuju
kontrak yang benar. Diuji juga bahwa membuat ulang tetap mengembalikan kontrak
yang sama, tidak ada kontrak ganda, dan nilai kontrak lama tidak tertimpa.

### Dua perbaikan lain di ronda ini

| Perubahan | Bukti |
|---|---|
| Proyek tertutup begitu satu pelamar diterima | Sebelumnya status baru berubah saat kontrak dibuat, jadi di selanya proyek masih bisa dilamar orang lain. Diuji: `open` lalu diterima lalu `inProgress`, pelamar berikutnya ditolak `400`, dan proyeknya hilang dari daftar publik |
| Centang biru untuk chat tanya jawab dan dukungan | Tabel `support_messages` tidak punya kolom `is_read` sama sekali, jadi backend tidak pernah bisa melaporkan "sudah dibaca". Kolomnya ditambah lewat `prisma/migrations/support_messages_is_read.sql`, penandaan baca dipasang di tiga titik buka percakapan, dan diuji: pesan jadi `is_read` hanya setelah lawan bicara membukanya, bukan saat pengirimnya sendiri membuka |

### Pemeriksaan akhir ronda ini

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 31 lolos |
| Playwright | 51 lolos |
| `next build` | Lolos, 51 rute |
| Alur uang penuh lewat API | 42 pemeriksaan, nol temuan |
| Ronda antarmuka tiga peran | 43 halaman, nol masalah |

## Pembersihan data uji dan akun admin produksi

Dikerjakan setelah pengujian selesai, 19 September 2026.

| Langkah | Hasil |
|---|---|
| Cadangan | 102 baris dari 17 tabel diekspor ke JSON sebelum apa pun dihapus |
| Periksa tautan silang | Nol. Tidak ada data akun uji yang bertaut ke akun sungguhan, jadi penghapusan tidak menyentuh keduanya |
| Admin baru | `admin@stairslife.id` dibuat dengan peran admin, email tertandai terverifikasi, kata sandi di-hash bcrypt 12 putaran seperti jalur pendaftaran biasa |
| Penghapusan | 4 akun uji dan 97 baris turunannya dihapus dalam satu transaksi |
| Penunjuk yang dikosongkan | 1 baris verifikasi milik akun sungguhan yang dulu ditinjau admin uji: kolom peninjaunya dikosongkan, barisnya tidak ikut dihapus |

Urutannya sengaja dibalik dari yang diminta: admin baru dibuat lebih dulu,
karena satu-satunya akun admin di basis data justru akun uji. Menghapusnya
duluan akan meninggalkan sistem tanpa pintu masuk admin sama sekali. Skrip
penghapus menolak berjalan kalau tidak ada admin lain di luar akun uji.

Sesudahnya: akun uji ditolak `401` saat login, `admin@stairslife.id` masuk
dengan peran admin, dan enam halaman panel admin dibuka lewat antarmuka tanpa
satu pun galat konsol atau respons 4xx. Pengguna tersisa tiga, yaitu dua akun
sungguhan milik pemilik produk dan satu admin baru.

Kata sandi admin itu pernah melewati percakapan teks, jadi perlakukan sebagai
sudah bocor: masuk sekali lalu ganti dari halaman keamanan. Untuk produksi,
sebaiknya akun admin juga memakai alamat email yang bisa menerima surat, supaya
alur lupa kata sandi bisa dipakai kalau sewaktu-waktu terkunci.
