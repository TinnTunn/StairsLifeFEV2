# Evaluasi pengerjaan

Tanggal: 8 September 2026. Mode antislop: selama pengerjaan.

**Design Read yang dideklarasikan:** web app marketplace escrow untuk mahasiswa
dan UMKM Indonesia, bergaya netral pasir hangat dengan satu aksen terakota,
dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## Yang jadi

| | Jumlah |
|---|---|
| Rute halaman | 31, ditambah `not-found` dan `error` |
| Komponen ter-port ke CSS Modules | 35 berkas, 40 CSS Module |
| Baris kode aplikasi | 13.058 (di luar token design system) |
| Token design system dipakai apa adanya | 441 |

Alur yang bisa ditelusuri ujung ke ujung: beranda, cari proyek dengan saringan,
detail proyek, daftar dan masuk, beranda mahasiswa, daftar dan detail lamaran,
form lamaran, dompet dan penarikan, verifikasi, beranda bisnis, kelola proyek,
pasang proyek, daftar pelamar, daftar dan detail kontrak dengan escrow, profil,
hasil pembayaran Xendit.

---

## Delivery Gate

### Blok 1: Hard Gate, semua jawaban harus "tidak"

| Aturan | Jawaban | Bukti |
|---|---|---|
| R-02 em dash di teks | tidak | Tidak ada karakter em dash di copy produk |
| R-03 overflow horizontal atau layout rusak di mobile | tidak | Diukur di 360px: `scrollWidth` 360 = `innerWidth` 360, nol elemen meluber. Target sentuh: nol di bawah 44px setelah dua perbaikan |
| R-17 angka tanpa sumber | tidak | Tidak ada statistik di landing. Angka yang tampil berasal dari data yang dimuat, dan saat memakai data contoh setiap halaman membawa penanda terlihat |
| R-18 testimoni fiktif | tidak | Tidak ada seksi testimoni |
| R-23 aset dibuat tanpa konfirmasi | tidak | Logo, token, dan aset seluruhnya dari design system yang kamu kirim. Avatar memakai inisial, bukan foto orang |
| R-24 tautan nav ke halaman yang tidak ada | tidak | Crawl otomatis: 30 rute diperiksa, semua 200; setiap tautan yang dirender diikuti, nol tautan mati; rute tak dikenal mengembalikan 404 |
| R-25 kontras di bawah AA | tidak | 13 halaman diaudit di kedua tema dari elemen yang benar-benar dirender. Nol kegagalan. Satu kegagalan ditemukan dan diperbaiki (wordmark footer, rasio 1,0) |
| R-26 kontrol yang tidak melakukan apa-apa | tidak | Aksi yang backend-nya ada tapi alurnya belum dibangun dirender `disabled` dengan label "segera hadir" plus komentar di kode |
| R-27 tanpa state kosong, memuat, dan error | tidak | Ketiganya ada di setiap layar yang memuat data. State kosong dibedakan: belum pernah ada data vs hasil saringan kosong |
| R-28 FAQ generik | tidak | Tidak ada FAQ |
| R-32 tidak bisa dijelajah keyboard atau fokus tak terlihat | tidak | Diuji dengan Tab sungguhan: `:focus-visible` true, outline 2,67px solid `rgb(180,83,31)`, offset 2px. Modal punya jebakan fokus dan mengembalikan fokus ke pemicu |
| R-33 fitur ditambal lewat skrip | tidak | Semua ditulis di sumber |
| R-34 satu mode tema rusak | tidak | Kedua tema diaudit penuh, termasuk kombinasi OS terang dengan aplikasi dipaksa gelap |
| R-35 dikirim tanpa dijalankan | tidak | Build hijau, klik-tayang terekam di bawah |
| R-36 klaim keamanan atau kepatuhan karangan | tidak | Tidak ada klaim "aman", "terenkripsi", atau menyebut OJK |
| R-37 dibangun tanpa arah | tidak | `DESIGN.md` ditranskripsi dari design system, dial dideklarasikan |
| R-38 isi karangan yang terlihat nyata | tidak | Data contoh selalu membawa penanda terlihat di setiap halaman yang memakainya |

### Blok 2: Purpose-Gate, semua "tidak"

Gradasi, glow, grid latar, pola titik, badge kapsul, dan ilustrasi generik tidak
dipakai sama sekali. Blur hanya di satu tempat (overlay modal), bayangan hanya di
tiga tempat (dropdown, toast, modal). Alasan setiap keputusan ada di `DECISIONS.md`.

Ikon: Lucide dipakai sebagai keputusan tertulis, stroke dikunci 1.75, registri
tertutup 68 ikon. Tidak ada Sparkle, Lightning, Diamond, Robot, atau Orb.
`Star` hanya dipakai di `Rating`, tempat bintang memang berarti rating.

### Blok 3: Liveliness, semua "ya"

Dial dideklarasikan dan dipegang. Landing memakai komposisi yang berbeda tiap
seksi: hero rata kiri, blok tinta lebar penuh, grid kartu, kolom sempit terpusat
untuk rincian biaya, pita terakota. Satu titik fokus per layar. Aksen terakota
dipakai hemat. Motif identitas: bentuk balok tangga dari logo, dan panel tinta
"siapa memegang uangnya sekarang" yang berulang di setiap layar dana.

### Blok 4: Craftsmanship, semua "tidak"

Palet: netral pasir + terakota + empat warna status semantik. Melewati R-29 lewat
jalan keluar "clear design system", dan alasannya ditulis: warna status adalah
skala fungsional, bukan perluasan palet brand, dan selalu berpasangan dengan teks.

---

## Klik-tayang terekam

Dijalankan di browser sungguhan, dua peran, dua tema, lebar 360 dan 1280.

| Tindakan | Hasil |
|---|---|
| Beranda dimuat | Wordmark, hero, 4 seksi, footer. Nol error konsol |
| Klik "Cari proyek" | Ke `/proyek`, 3 proyek tampil |
| Isi saringan lalu Terapkan | URL jadi `/proyek?search=...`, hasil menyusut, tombol Hapus muncul |
| Saringan tanpa hasil | State kosong "Tidak ada proyek yang cocok" dengan tombol hapus saringan |
| Klik judul proyek | Ke `/proyek/[id]`, panel aksi menampilkan "Masuk untuk melamar" karena belum ada sesi |
| Masuk sebagai mahasiswa | Ke `/mahasiswa`, sidebar peran, 4 kartu statistik, 3 lamaran |
| Sidebar: Lamaran saya | 5 tab dengan hitungan (Semua 3, Terkirim 1, Seleksi 1, Diterima 1, Ditolak 0) |
| Buka detail lamaran | Timeline status, callout "Lamaranmu diterima", tombol ke kontrak |
| Buka kontrak | Panel tinta "StairsLife menahan dananya", stepper 6 tahap, rincian komisi |
| Sidebar: Dompet | 3 saldo terpisah, mutasi dengan baris "tidak bergerak" untuk dana yang dikunci |
| Tarik dana | State kosong jujur karena daftar rekening butuh backend |
| Keluar lalu masuk sebagai bisnis | Ke `/bisnis`, navigasi berganti ke navigasi bisnis |
| Pasang proyek, submit kosong | 5 pesan validasi muncul di `role="alert"` |
| Daftar pelamar | Kartu pelamar dengan avatar inisial, tingkat, rating 4,8 |
| Tab dari topbar | Cincin fokus terlihat di setiap kontrol |
| Ganti tema | Kedua mode benar, tanpa kedip saat muat ulang |
| Lebar 360 | Sidebar jadi drawer, bottom nav 60px muncul, nol overflow |
| Lebar 1280 | Sidebar 248px, bottom nav hilang, konten 1152px, padding 48px |
| Rute tak dikenal | Halaman 404 dengan dua jalan keluar |

Tiga bug ditemukan lewat lintasan ini dan sudah diperbaiki. Ketiganya tidak
terlihat dari pembacaan kode: render loop tak berujung, pengguna terlempar ke
login tiap muat ulang, dan wordmark footer yang tidak terlihat di mode terang.
Rinciannya di `DECISIONS.md`.

---

## Rantai escrow: sudah tersambung

Iterasi kedua menyambungkan seluruh langkah yang memindahkan uang. Semuanya
memanggil endpoint yang sudah ada di backend.

| Langkah | Di mana | Endpoint |
|---|---|---|
| Masukkan pelamar ke seleksi | Daftar pelamar | `PATCH /applications/:id/status` |
| Terima pelamar, dengan peringatan berapa lamaran lain otomatis ditolak | Daftar pelamar | `PATCH /applications/:id/status` |
| Buat kontrak, nilai dan tenggat disepakati di sini | Daftar pelamar | `POST /contracts` |
| Setor dana ke escrow, diarahkan ke Xendit | Halaman kontrak | `POST /payments/invoice` |
| Buat tagihan baru kalau yang lama kedaluwarsa | Halaman kontrak | `POST /payments/invoice` |
| Kirim hasil kerja, banyak berkas sekaligus | Halaman kontrak | `POST /upload` lalu `PATCH /contracts/:id/deliverable` |
| Buka berkas hasil dari bucket privat | Halaman kontrak | `GET /upload/signed-url` |
| Setujui hasil dan lepas dana | Halaman kontrak | `PATCH /contracts/:id/approve` |
| Minta perbaikan dengan catatan | Halaman kontrak | `PATCH /contracts/:id/reject` |
| Beri ulasan setelah kontrak selesai | Halaman kontrak | `POST /reviews` |
| Kelola rekening tujuan penarikan | Dompet | `GET`, `POST`, `PATCH`, `DELETE /bank-accounts` |
| Ajukan penarikan | Dompet | `POST /withdrawals` |

Dua keputusan yang menyangkut uang dipasang di balik modal yang tidak bisa
ditutup dengan Escape, karena pengguna harus benar-benar memilih: melepas dana,
dan menerima pelamar yang otomatis menolak pelamar lain. Nominal yang akan
berpindah selalu disebut sebelum tombolnya, bukan sesudah.

## Yang belum dikerjakan

Disebut apa adanya, bukan disembunyikan.

**Layar yang rutenya ada tapi isinya belum dibangun:** panel admin lengkap,
sengketa dua sisi, keempat permukaan chat, dan sunting profil. Rutenya sengaja
tetap hidup karena backend mengirim deep link ke sana lewat `action_url`;
menghapusnya berarti notifikasi berujung di halaman 404.

**Aksi yang backend-nya siap tapi tombolnya belum tersambung:** tinggal sunting
profil, dirender dengan label terlihat. Unggah kartu mahasiswa sudah dibangun
pada uji sambung 14 September, karena tanpanya mahasiswa tidak pernah bisa
melamar.

**Pekerjaan di sisi backend** yang muncul dari pembandingan ini ada di tabel B
rencana kerja: proyek tersimpan, moderasi proyek, verifikasi bisnis, laporan dan
aduan, master data, paginasi dan saringan lanjutan, pertanyaan tambahan di
lamaran, preferensi notifikasi, ganti email dan kata sandi, serta hapus akun.
Sepuluh hal itu diminta spesifikasi layar tapi belum punya endpoint.

---

## Uji sambung ke backend sungguhan

Dijalankan 9 September 2026 dengan backend menyala di port 3000.

**Yang terbukti benar.** Amplop error backend cocok persis dengan yang ditangani
client saya, dan ini baru bisa dipastikan dengan memanggilnya sungguhan:

| Kasus | Bentuk yang datang | Ditangani |
|---|---|---|
| Validasi DTO gagal | `{"success":false,"statusCode":400,"message":["property fieldAsing should not exist"]}` | `message` sebagai array, ditampilkan per baris |
| Kredensial ditolak | `{"success":false,"statusCode":401,"message":"Email atau password salah"}` | Amplop standar |
| Error non-HttpException | `{"statusCode":500,"message":"Internal server error"}`, **tanpa kunci `success`** | Dibaca dari `body.message`, tidak mengandalkan `success` |

CORS juga terverifikasi: preflight dari `http://localhost:3001` dijawab 204
dengan header izin, origin di luar whitelist tidak dapat header itu.

**Yang memblokir.** Proyek Supabase-nya sudah tidak ada. Domain
`bdsksqmteysuhoftvzoc.supabase.co` tidak resolve di DNS, jadi Prisma maupun REST
Supabase sama-sama gagal dan setiap endpoint yang menyentuh database menjawab
500. Rinciannya di `docs/TUGAS-BACKEND.md`.

**Dua hal yang diperbaiki karena uji ini.** Frontend meneruskan pesan mentah
"Internal server error" ke pengguna Indonesia; sekarang 500 generik dan 503
diterjemahkan jadi pesan yang menyebut langkah berikutnya. Dan satu bug backend
ditemukan yang tidak terlihat dari membaca kode: saat database mati, login
menjawab "Email atau password salah", bukan gangguan layanan, karena objek
`error` dari Supabase dibuang di `auth.service.ts` baris 126.

`NEXT_PUBLIC_USE_MOCK` dikembalikan ke `1` supaya aplikasinya tetap bisa dibuka
selama databasenya belum ada.

---

## Uji sambung kedua: alur uang ujung ke ujung

Dijalankan 14 September 2026 dengan database Supabase baru, backend di port
3000, frontend di 3001, dan `NEXT_PUBLIC_USE_MOCK=0`. Setiap langkah dijalankan
lewat UI frontend, lalu hasilnya dicocokkan ke backend lewat API atau database,
bukan hanya dari apa yang tampil di layar.

**Satu pengecualian, disebut apa adanya.** Akun uji dibuat dan dimasukkan lewat
skrip ke API, bukan dengan mengetik kata sandi ke form login di browser. Form
login dan daftar sendiri belum teruji dengan data asli; cukup dicoba sekali oleh
manusia.

Lamaran pertama sempat dikirim lewat API karena belum ada admin. Setelah akun
admin uji aktif, alurnya diulang lengkap lewat UI (tabel kedua di bawah).

| Langkah | Hasil di backend |
|---|---|
| Pasang proyek lewat form | Proyek `open`, anggaran 150.000 sampai 200.000, keahlian tersimpan sebagai array |
| Unggah KTM dan selfie | Dua berkas di bucket privat `verification`, pengajuan `pending` |
| Seleksi, lalu terima pelamar | Status berpindah, modal buat kontrak langsung terbuka |
| Buat kontrak | Nilai dan tenggat terisi dari penawaran pelamar |
| Bayar escrow di Xendit staging, simulasi VA Permata | Kembali ke `/payment/result`; pembayaran `held`, 180.000, komisi 9.000 |
| Kirim dua berkas hasil | Kontrak `pending_review`, `deliverable_url` berupa array JSON |
| Buka berkas | Signed URL Supabase didapat, tab baru tanpa `opener` |
| Minta perbaikan dengan alasan | Kontrak kembali `active`, riwayat `rejected` dengan alasan |
| Kirim ulang satu berkas | `pending_review` lagi, riwayat bertambah |
| Setujui dan lepas dana | Pembayaran `released`, dompet mahasiswa **+171.000**, transaksi `earn_release` |
| Ulasan dua arah | Tersimpan, rating profil jadi 5,0 dan 4,0 |
| Tambah rekening, ajukan tarik 100.000 | Saldo 71.000, terkunci 100.000, rincian biaya admin 2.500 benar |

**Bug frontend yang hanya muncul dengan data asli, semuanya sudah diperbaiki:**

| Bug | Akibat sebelum diperbaiki |
|---|---|
| Aksi di halaman kontrak memanggil `router.refresh()` | Layar tidak berubah setelah kirim hasil, putuskan hasil, atau ulasan. Mahasiswa akan mengira gagal dan mengirim ulang |
| Tidak ada form unggah KTM | Mahasiswa tidak pernah bisa diverifikasi, jadi tidak pernah bisa melamar |
| `is_verified` dibaca dari sesi login | Mahasiswa yang sudah disetujui tetap terkunci sampai login ulang. Sekarang disegarkan dari `/users/me` |
| Amplop `{ data: null }` terbungkus ganda oleh backend | Pengajuan verifikasi yang tidak ada terbaca "sedang direview" |
| Alasan penolakan tampil sebagai catatan mahasiswa | Backend menimpa satu kolom untuk dua arti; sekarang dibaca dari riwayat |
| Detail lamaran tanpa judul proyek dan tautan kontrak | Endpoint detail tidak membawa relasi; sekarang dibaca dari `/applications/my` |
| Timeline lamaran memakai `updated_at` | Kolom itu tidak ada di tabel; langkah "Masuk seleksi" juga dikarang untuk lamaran yang langsung diterima |
| `window.open` setelah `await` | Tombol "Buka berkas" diblokir sebagai popup di Chrome dan Safari |
| Rating "0.00" bernilai truthy | Mahasiswa tanpa ulasan tampil dengan rating 0,0 |
| `total_projects` dipakai sebagai jumlah ulasan | Label "(n ulasan)" menyimpang begitu dua angka itu berbeda |
| Header publik tidak membaca sesi | Pengguna yang sudah masuk tetap melihat "Masuk" dan "Buat akun" |
| Layar "halaman ini butuh akun" berkedip saat hidrasi | Muncul sekejap untuk pengguna yang sudah masuk |
| Pesan validasi rekening dari DTO | Pengguna melihat "account_number must be longer than or equal to 6 characters" |
| Badge dan tanda "terverifikasi" untuk bisnis | Bertentangan dengan keputusan bahwa bisnis tidak diverifikasi |
| Chip tingkat "Pemula" di profil bisnis | Tingkat adalah jenjang mahasiswa |
| Beranda dan profil mahasiswa menyuruh unggah KTM saat pengajuan sedang direview | Status pengajuan tidak dibaca |
| Input 23px di dalam kotak 44px | Ketukan di bagian atas atau bawah kotak tidak memfokuskan kolom |
| Cincin fokus kolom error memakai `--danger-soft` | Pola yang sama dengan cincin fokus 1,56:1 yang sudah diperbaiki sebelumnya |
| Modal terima pelamar bisa ditutup dengan Escape | Evaluasi ini mengklaim sebaliknya; kodenya sekarang sesuai klaim |
| Mutasi dana terkunci tanpa nominal | Hanya tertulis "tidak bergerak" |

**Putaran kedua, setelah akun admin uji aktif:**

| Langkah | Hasil |
|---|---|
| Admin menyetujui KTM mahasiswa pertama | Tanpa login ulang, sesi di browser berubah ke `is_verified: true` dan banner verifikasi hilang |
| Mahasiswa membuka proyek baru dan melamar lewat form | Validasi surat pendek dan tanggal kosong muncul; lamaran terkirim dan halaman pindah ke detailnya |
| Membatalkan lamaran, lalu melamar ulang | Baris lamaran terhapus, lamaran baru berhasil |
| Membuka proyek yang sudah dilamar | Tombol jadi "Lihat status lamaran", form lamar tidak ditampilkan |
| Admin menolak KTM mahasiswa kedua dengan alasan | Banner menampilkan alasannya, form unggah ulang muncul dengan nama kampus terisi |
| Unggah ulang | Status kembali direview |
| Modal terima pelamar ditekan Escape | Modal bertahan, tertutup lewat tombol Batal |

Bug yang ditemukan di putaran ini, sudah diperbaiki:

| Bug | Akibat sebelum diperbaiki |
|---|---|
| Tidak ada tombol batalkan lamaran | Form lamar menjanjikan pembatalan yang tidak bisa dilakukan di mana pun |
| Syarat pembatalan di copy lebih sempit dari backend | Tertulis "selama belum masuk seleksi", padahal backend mengizinkan sampai diterima atau ditolak |
| Mahasiswa yang sudah melamar tetap melihat "Lamar proyek ini" | Ia menulis surat dulu, baru mendapat penolakan 409 |
| Timeline verifikasi membaca `reviewed_at` | Setelah unggah ulang, pengajuan yang sedang direview tetap tertulis "Ditolak admin" |
| Alasan penolakan verifikasi tampil dua kali | Di banner dan di timeline |

**Tiga klaim copy yang ternyata salah** setelah dicocokkan ke kode backend: ulasan
dijanjikan terbit bersamaan padahal langsung terlihat, hasil verifikasi dijanjikan
lewat email padahal lewat notifikasi, dan urutan "kontrak dibuat setelah dana
disetor" terbalik. Ketiganya sudah diganti sesuai perilaku sebenarnya.

Pemeriksaan tambahan: nol permintaan ke backend selama 15 detik halaman diam (tidak
ada polling tersembunyi), nol scroll horizontal di 375px pada form verifikasi dan
halaman kontrak, dan `npm run check` lolos setelah setiap perbaikan.

Temuan di sisi backend dari uji ini ada di `docs/TUGAS-BACKEND.md` Langkah 11.

---

## Redesign landing dan sistem gerak (14 September 2026)

Pemicu: pemilik produk menilai tampilan V3 terasa diam dan tidak mengikuti zoom
dibanding FE V2. Arah yang dipilih: energi V2, warna design system V3.

**Masalah responsif yang terukur sebelum diperbaiki.** Di 1920px judul hero
terkunci di kolom 395px dan pecah jadi lima baris, sisi kanan hero kosong, dan
kontainer 1152px hanya mengisi 60 persen layar. Ukuran huruf naik bertingkat,
jadi zoom tidak mengubah apa pun sampai melewati breakpoint. Dugaan awal bahwa
header tidak sejajar dengan isi ternyata salah setelah diukur (keduanya 379
sampai 1531px).

**Klik-tayang terekam:**

| Elemen | Hasil |
|---|---|
| Tab "Saya mahasiswa / Saya punya usaha" | Klik mengganti kartu dan CTA; panah kanan pindah tab dan fokus; tabIndex roving benar |
| Tombol "Putar ulang alurnya" | Alur berjalan lagi dari tahap awal, tombol nonaktif selama berjalan |
| Kalkulator komisi | Huruf dibuang, 1.000.000 menghasilkan komisi 50.000 dan diterima 950.000 |
| Kartu proyek di hero | Menaut ke `/proyek/353e71ed...`, proyek asli terbaru |
| Nav Cara kerja dan Biaya | Menuju `#cara-kerja` dan `#biaya` yang ada |
| `/verify-email?token=abc123` | 307 ke `/verifikasi-email?token=abc123` |
| `/?tab=verification`, `/?tab=projects` | 307 ke `/mahasiswa/verifikasi` dan `/bisnis/proyek/baru` |
| Tujuh halaman masuk dan daftar | Semua 200, panel tampil di 1440px dan tersembunyi di 375px |

**Bug yang ditemukan dan diperbaiki dalam putaran ini:** scroll horizontal 13px
di 375px dari elemen reveal yang tergeser ke samping, tombol putar ulang 36px,
kartu proyek tunggal meregang selebar kontainer, balok tangga yang terbaca
sebagai lempengan terputus, blok reduced-motion sidebar yang memberi ikon
transform yang salah, tautan verifikasi email yang berujung 404, dan tidak ada
header keamanan (sekarang ada `frame-ancestors 'none'`, `X-Frame-Options`,
`nosniff`, `Referrer-Policy`, dan `X-Powered-By` dihapus).

**Delivery Gate:**

| Blok | Status | Bukti |
|---|---|---|
| Hard Gate | PASS | Nol em dash dan emoji di teks UI; nol statistik, testimoni, dan bar logo; semua tautan punya tujuan; 375px tanpa scroll horizontal; target sentuh 44px; kontras teks tinta diukur (muted 7,33:1 dan aksen 7,15:1 di kartu, aksen 8,03:1 di panel); tema terang dan gelap diperiksa; build dan klik-tayang dijalankan |
| Purpose-Gate | PASS | Shadow, anak tangga, dan setiap animasi punya alasan tertulis di DECISIONS.md dan komentar CSS; tanpa glow, glass, gradasi, atau loop tanpa akhir |
| Liveliness | PASS | Design Read dan dial dideklarasikan; satu titik fokus (hero tinta); satu aksen (terakota); motif identitas (anak tangga logo) diulang di hero, CTA, dan panel masuk |
| Craftsmanship | PASS | Ritme seksi bervariasi (tab dan kartu, dua kolom dengan stepper, grid, dua kolom dengan kalkulator, pita); CTA spesifik; tanpa klaim buatan |

**Batas verifikasi yang disebut apa adanya.** Pane browser yang dipakai untuk
uji sering tersembunyi, dan di tab tersembunyi browser menghentikan animasi CSS
serta IntersectionObserver. Scroll-reveal terbukti berjalan saat pane terlihat
(elemen ditandai berurutan saat di-scroll), tapi rekaman visual gerak dari awal
sampai akhir tidak bisa diambil. Perilaku `prefers-reduced-motion` diverifikasi
dari kode, bukan dengan emulasi.

---

## Gaya V2, dwibahasa, dan evaluasi ulang (15 September 2026)

Permintaan: lepas antislop, ikuti gaya FE V2 dengan warna logo, perbaiki FE
sepenuhnya, nav tanpa Biaya (diganti Tentang Kami), versi ID dan EN tanpa
posisi komponen bergeser, lalu evaluasi semuanya.

### Yang dikerjakan

| Area | Isi |
|---|---|
| Fondasi | `tema.css` (token V2 dalam palet terakota: aurora, kaca, bayangan, radius, skala judul `clamp()`, easing spring), font Schibsted Grotesk dan Manrope, keyframe V2 di `motion.css` |
| Dwibahasa | Cookie `sl-bahasa`, `BahasaProvider` dan `ambilKamus()`, 9 kamus per area (umum, navigasi, beranda, komponen, auth, proyek, sistem, aplikasi) dalam ID dan EN, metadata halaman ikut bahasa, tanggal ikut bahasa, pesan galat klien ikut bahasa |
| Komponen | Tombol, input, select, tabs, kartu, kartu proyek, badge status, banner verifikasi, modal, toast, dropzone, rating, avatar, stepper kontrak, sidebar, bottom nav, header dan footer publik, pengganti bahasa dan tema, tautan lewati ke konten |
| Halaman publik | Beranda (hero aurora, bento Cara Kerja dan Fitur, seksi Tentang Kami), cari proyek, detail proyek, masuk, pilih peran, daftar mahasiswa dan bisnis, lupa dan ganti kata sandi, verifikasi email, hasil pembayaran |
| Halaman aplikasi | Beranda mahasiswa dan bisnis (kartu sapaan, bento stat tile), lamaran, detail lamaran, kirim lamaran, verifikasi, dompet, tarik dana, rekening, proyek saya, pasang proyek, pelamar, kontrak, detail kontrak dan escrow, profil |
| Halaman sistem | 404, galat, dan empat rute "belum dibangun" memakai satu kerangka dengan logo, pengganti bahasa, dan tema |

### Pemeriksaan otomatis

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` (ESLint + aturan kepatuhan, token CSS, `tsc`) | Lolos, 0 galat, 0 peringatan |
| `next build` | Lolos, 32 rute |
| Kunci kamus EN yang hilang | 0 (dijaga tipe `typeof` kamus ID) |
| Pemindaian teks keras di komponen dan halaman | 0 di luar `/kit` (halaman internal, 404 di produksi) |

### Uji di browser dengan backend sungguhan

Tiga akun uji (mahasiswa terverifikasi, mahasiswa belum terverifikasi, bisnis),
sesi diserahkan ke tab lewat server lokal sementara, bukan dengan mengetik kata
sandi.

| Uji | Hasil |
|---|---|
| Ganti ID ke EN di header publik 1440px | Pusat tautan nav tetap 331 / 456,5 / 582,5 px, tombol tema, ID, EN, Masuk, Daftar tidak bergeser satu piksel pun |
| Ganti bahasa dari drawer aplikasi 375px | Drawer tetap terbuka, label sidebar dan judul berganti, posisi pengganti bahasa tetap |
| Overflow horizontal 375px | 0 di beranda, daftar, daftar bisnis, dompet, kontrak, detail kontrak, proyek saya, profil |
| Tema gelap | Beranda mahasiswa, dompet, detail kontrak, verifikasi dirender benar |
| Konsol | Tidak ada galat selain 404 dari halaman 404 yang sengaja dibuka |

### Bug dan masalah yang ditemukan lalu diperbaiki

| Temuan | Perbaikan |
|---|---|
| **Keamanan:** `?lanjut=` di halaman masuk diteruskan apa adanya ke `router.push`, jadi `/masuk?lanjut=https://situs-lain` bisa mengalihkan pengguna yang baru masuk ke situs lain | Hanya jalur relatif di dalam situs yang diikuti; `//host` dan `/\host` ditolak |
| Label peran dan tingkat (`ROLE_LABEL`, `TIER_LABEL`) selalu Indonesia | Diganti kamus, konstanta lama dihapus |
| `budgetLabel` diekspor dari komponen `"use client"` sehingga tidak bisa dipanggil Server Component | Dipindah ke `lib/anggaran.ts`, dipakai bersama kartu proyek, kartu hero, detail proyek, dan formulir lamaran |
| Efek di `AppShell` memanggil `setState` langsung (render berantai) | Drawer dicatat terbuka per rute, jadi otomatis tertutup saat rute berpindah tanpa efek |
| Teks tersembunyi ", terpilih" di tab diulang pembaca layar bersama `aria-selected` | Dihapus |
| Ikon keluar memakai `ArrowLeftRight` | Diganti `LogOut` |
| Select dengan `placeholder=""` tetap memunculkan opsi kosong di pilihan tingkat | Opsi kosong tidak dirender saat placeholder string kosong |
| Inline style warna galat di tarik dana, rekening, pelamar, kontrak | Diganti kelas `galat` bersama |
| Stepper kontrak tetap menandai "tahap saat ini" setelah dana dilepas | Semua tahap ditandai selesai |
| Nominal besar tampil `Rp 71 . 000` | `proportional-nums` untuk angka berhuruf display |
| Stat tile jadi satu kolom panjang di HP | Dua kolom sampai 340px |
| Tombol Pasang proyek muncul dua kali di beranda bisnis | Yang di topbar dihapus |
| Tidak ada tautan lewati ke konten | Ditambahkan di layout akar, target `#konten` di layout publik, shell aplikasi, dan halaman sistem |

### Yang tetap dan perlu diketahui

- Pesan dari backend (validasi, 409, dan sejenisnya) tetap berbahasa Indonesia
  di mode EN, karena teksnya dibuat server.
- Pesan 5xx yang terjadi saat Server Component memanggil backend memakai bahasa
  bawaan (Indonesia); pesan jaringan di daftar dan detail proyek sudah ikut
  bahasa.
- Tombol bulat "N" di pojok kiri bawah adalah indikator dev Next.js dan tidak
  ada di build produksi.
- Chat dan sengketa sisi pengguna masih rute "belum dibangun". Panel admin
  dibangun di bagian berikutnya.

## Panel admin, keluar, ubah profil, dan navigasi riwayat (15 September 2026)

Permintaan: hapus titik hijau di badge hero dan semua chip fakta, bangun panel
admin dengan isi FE V2 sebagai acuan, perhatikan detail seperti layar saat
keluar, sediakan ubah profil untuk bisnis dan mahasiswa, evaluasi ulang
Back/Forward antarhalaman, dan ganti ikon seksi Nilai dengan tiga ikon Icons8
yang diberikan.

### Yang dikerjakan

| Area | Isi |
|---|---|
| Hero | Titik hijau di badge dan daftar chip fakta dihapus, jarak bawah tombol aksi disesuaikan |
| Panel admin | 11 rute: ringkasan (perlu ditindak, grafik tren, aktivitas audit), verifikasi KTM, pengguna (bekukan dan aktifkan), proyek (hapus), sengketa dan detail putusan, keuangan (grafik komisi, tabel transaksi), penarikan (manual, Xendit, tolak), dukungan (inbox dan balas), pengumuman, pengaturan (komisi, SLA, peran, jejak audit). Client bertipe `lib/api/admin.ts`, kamus `admin.ts` ID dan EN |
| Keluar | `KeluarProvider`: layar "Sampai jumpa, {nama}" menutup halaman, `POST /auth/logout` dan jeda minimum 700ms berjalan bersamaan, lalu `router.replace("/")`. Penjaga rute tidak lagi melempar ke `/masuk?lanjut=` selama proses keluar |
| Ubah profil | `/profil/ubah` untuk semua peran: foto (unggah avatar), data diri atau data usaha, kampus dan keahlian (mahasiswa), kontak. Hanya kolom yang berubah yang dikirim, sesi ikut diperbarui, lalu kembali ke profil dengan banner tersimpan |
| Ikon Nilai | Tiga SVG vektor buatan ulang di `public/assets/ikon/`: perisai, mata, pelukan |
| Navigasi riwayat | Pengelola posisi gulir (`lib/gulir.ts`), filter dan halaman daftar di URL (`useParamUrl`), pengalihan dari halaman auth bila sudah masuk, `router.replace` setelah kirim formulir |

### Kenapa ikon dibuat ulang, bukan dipakai langsung

Berkas yang diberikan adalah PNG 48px. Di kotak 44px dengan layar 2x, gambar
itu diperbesar dan terlihat lembek, dan lisensi gratis Icons8 mewajibkan tautan
atribusi di halaman. Ketiganya digambar ulang sebagai SVG dengan makna yang
sama (perisai kuning bertitik, dua bola mata, dua sosok berpelukan), jadi tajam
di ukuran apa pun dan tidak butuh atribusi. Dirasterkan pada 26, 52, dan 160px
untuk diperiksa: tepi tetap tajam. Lengan sosok biru digambar ulang agar
menyatu dengan badannya, karena versi pertama terbaca seperti plester.

### Evaluasi Back dan Forward

| Skenario | Sebelum | Sesudah |
|---|---|---|
| Masuk, lalu tekan Back | Formulir masuk tampil lagi padahal sesi aktif | Halaman auth mengalihkan ke beranda peran; masuk dan daftar memakai `replace`, jadi Back tidak kembali ke formulir |
| Tautan footer ke `/proyek` dari dasar beranda | Halaman proyek terbuka di posisi bawah | Mulai dari atas (scrollY 0) |
| Beranda digulir 4061px, buka proyek, Back | Kembali ke atas | Kembali ke 4061px; Forward mengembalikan posisi di halaman proyek |
| Beranda mahasiswa digulir 200px di kontainer shell, buka lamaran, Back | Kembali ke atas (browser tidak mengingat kontainer dalam) | Kembali ke 200px; Back kedua setelah Forward juga 200px |
| Muat ulang halaman shell yang sudah digulir | Kembali ke atas | Posisi dipulihkan (120px) |
| Tab status di daftar lamaran, buka detail, Back | Tab kembali ke "Semua" | Tab "Terkirim" tetap, `?status=terkirim` di URL. Berlaku juga untuk filter dan halaman di verifikasi, pengguna, proyek, sengketa, keuangan, dan penarikan admin |
| Pengguna yang sudah masuk membuka `/masuk` langsung | Formulir masuk tampil | Dialihkan ke `/mahasiswa` |

Tiga penyebab yang ditemukan saat menguji, bukan dari membaca kode:

1. Pemulihan bawaan browser berjalan sebelum Next selesai merender halaman
   tujuan, jadi posisinya terpotong ke tinggi halaman lama. Sekarang
   `history.scrollRestoration = "manual"` dan posisi dipulihkan setelah isi
   halaman cukup tinggi (maksimal 3 detik, batal bila pengguna menggulir).
2. Pada navigasi maju, efek halaman baru berjalan sebelum Next memperbarui URL,
   sehingga posisi halaman baru tersimpan dengan kunci halaman lama. Kunci
   sekarang diambil dari `usePathname`.
3. StrictMode menjalankan efek dua kali saat mount. Jalan pertama menghabiskan
   penanda popstate, jalan kedua menggulir ke atas. Penanda sekarang baru
   dipakai setelah posisi benar-benar ditulis.

Pergantian tab filter memakai `replaceState`, bukan entri riwayat baru. Back
dari daftar langsung keluar ke halaman sebelumnya, bukan menelusuri setiap tab
yang pernah diklik. Pencarian di `/proyek` tetap membuat entri riwayat, karena
hasil pencarian adalah halaman yang layak dikembalikan.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos, 0 galat, 0 peringatan |
| `next build` | Lolos, 42 rute |
| Panel admin dengan data backend sungguhan | 1440px dan 375px, ID dan EN, tema gelap; tooltip grafik bisa dibuka dengan tombol panah |
| Keluar | Layar "Sampai jumpa" tampil, berakhir di `/`, sesi terhapus |
| Ubah profil | Bio mahasiswa tersimpan lalu dikembalikan kosong; kolom bisnis diperiksa di 375px EN |

Aksi admin yang tidak bisa dibatalkan (memproses penarikan, menyetujui
verifikasi, memutus sengketa, mengirim pengumuman) tidak dijalankan saat uji;
yang diuji adalah form, modal konfirmasi, dan validasinya.

### Yang tetap dan perlu diketahui

- Komisi 5 persen dan batas tarik dana (minimum Rp 50.000, biaya Rp 2.500)
  masih tertulis di frontend, sementara admin bisa mengubah `platform_fee`.
  Backend belum punya endpoint pengaturan publik untuk dibaca frontend.
- Detail sengketa admin mengambil seluruh daftar sengketa lalu mencari satu,
  karena backend tidak punya `GET /admin/disputes/:id`.
- Pencarian pengguna admin berjalan di klien atas seluruh daftar per peran.
- Peran admin bisa dibuat dan dihapus, tetapi backend belum memeriksa izin per
  peran; semua admin punya akses penuh.
- Uji gulir dijalankan di panel browser tersembunyi, sehingga event gulir dan
  `requestAnimationFrame` tidak berjalan. Karena itu pemulihan memakai
  `setTimeout`, dan posisi disimpan juga saat klik tautan, popstate, dan
  `pagehide`, bukan hanya dari event gulir.

## Perbaikan temuan audit kesiapan (15 September 2026)

Permintaan: eksekusi semua temuan di laporan Audit Kesiapan StairsLife, dari
Kritis sampai Rendah, lalu evaluasi ulang. Izin backend diperluas pemilik
produk: boleh mengubah kode NestJS, tetapi tidak mengubah skema database.

### Status per temuan

| ID | Temuan | Yang dikerjakan | Status |
|---|---|---|---|
| K-01 | Tidak ada jalur sengketa pengguna | Tombol dan modal Ajukan sengketa (alasan minimal 20 karakter, sampai 5 berkas bukti) di kontrak berjalan atau menunggu review; banner sengketa di kontrak; halaman `/sengketa` dan `/sengketa/[id]` (tahap, alasan, bukti, tambah bukti, putusan dalam rupiah, catatan admin, ruang mediasi). Backend: `GET /disputes/my` kini memuat sengketa yang melibatkan kontrak pengguna, bukan hanya yang ia buka; status `under_review` dihitung aktif; sengketa hanya untuk kontrak berjalan; pihak lawan boleh membuka berkas bukti; approve, reject, dan release escrow ditolak selama sengketa aktif (`DISPUTE_ACTIVE`) | Selesai |
| K-02 | Komisi dan biaya tarik tertulis tetap | Backend `GET /settings/public` (komisi, minimum dan biaya tarik, SLA) dengan cache 60 detik yang sama dengan PaymentsService; ubah pengaturan admin membuang kedua cache. Frontend: `usePengaturanPublik`, `RincianKomisi`, `hitungKomisi` (rumus identik backend) di pasang proyek, buat kontrak, bayar escrow, detail kontrak, tarik dana, beranda, daftar bisnis. Angka yang tidak terbaca tidak ditebak | Selesai |
| K-03 | Nol uji otomatis, tanpa CI | Vitest 24 tes (`npm test`), Playwright 12 tes E2E dengan API dimock (`npm run test:e2e`), workflow `.github/workflows/ci.yml`. Backend: 3 berkas spec baru (kode galat, guard izin, token keperluan), total 38 tes lolos | Selesai, CI belum pernah jalan karena belum di-push |
| T-01 | Sesi mudah dicuri dan tidak bisa dicabut | Backend: refresh token membawa `jti`, hash-nya disimpan di `verification_tokens` (tipe `refresh_session`), rotasi sekali pakai, logout mencabut sesi, reset dan ganti kata sandi serta pembekuan mencabut semua sesi. Frontend: CSP dengan nonce per permintaan di `src/proxy.ts`, logout mengirim refresh token tanpa Authorization, refresh bersamaan berbagi satu permintaan dan membaca token yang sudah diperbarui tab lain, galat jaringan tidak lagi mengeluarkan pengguna | Selesai, dengan batas di bawah |
| T-02 | Peran admin tidak membatasi | Backend: `IzinAdminGuard` dan `@Izin()` di semua endpoint admin, penarikan admin, inbox dukungan, escrow manual; `GET /admin/me`. Anggota dicocokkan dengan id atau email; peran sistem akses penuh; admin yang tidak tercantum di peran mana pun akses penuh. Frontend: menu admin disaring, halaman tanpa izin terkunci, editor peran dengan kotak centang modul dan daftar anggota | Selesai |
| T-03 | Belum ada chat | Komponen `Obrolan` (polling 5 detik saat tab terlihat, kirim optimistis dengan coba lagi, Enter kirim) untuk chat kontrak, tanya sebelum melamar (`/pesan/tanya/[id]`, tombol Tanya bisnis di detail proyek), dukungan (`/bantuan`), dan mediasi sengketa (pengguna dan admin); daftar percakapan `/pesan` | Selesai |
| T-04 | Notifikasi tanpa tampilan | Lonceng di topbar (jumlah belum dibaca tiap 30 detik, panel 8 terbaru, tandai semua), halaman `/notifikasi` (tab belum dibaca, tandai, hapus), rute tautan backend dipetakan langsung, emoji judul dibuang, mode Inggris tanpa campuran bahasa | Selesai |
| T-05 | Akun beku jalan buntu | Login akun beku menampilkan alasan dan tombol Ajukan banding dengan email terisi; halaman `/banding`; banner akun dibekukan di shell selama access token masih berlaku | Selesai |
| T-06 | Shell dan data dimuat ulang tiap klik | Area berakun dipindah ke grup rute `(aplikasi)` dengan satu layout: sidebar, topbar, lonceng, dan kontainer gulir tidak dibongkar; judul dan aksi halaman dikirim ke topbar lewat portal. `useAsync` menampilkan kerangka saat tab berganti dan punya cache per pengguna (tidak dipakai untuk saldo) | Selesai |
| S-01 | Galat hanya di ringkasan | `useGalatKolom` dan ringkasan yang menautkan ke kolom, dipakai di masuk, daftar, pasang proyek, lamar, buat kontrak, verifikasi, rekening, tarik dana, ubah profil, sengketa, banding, keamanan akun | Selesai |
| S-02 | Input tanggal bawaan | `PemilihTanggal`: format bahasa antarmuka, minimum hari ini, pintasan +1 minggu, +2 minggu, +1 bulan, navigasi keyboard (panah, Home/End, PageUp/PageDown, Enter, Escape) | Selesai |
| S-03 | Pesan backend Indonesia di mode Inggris | Backend: setiap respons galat membawa `code` (dan `params` untuk angka), dari kode eksplisit atau registri pola pesan. Frontend: kamus `galatApi` ID dan EN (66 kode), rupiah diisi dari params; notifikasi diterjemahkan per judul | Selesai untuk galat; isi pengumuman admin tetap bahasa penulisnya |
| S-04 | SEO dan pratinjau berbagi | `robots.ts`, `sitemap.ts` (proyek terbuka), `manifest.ts`, Open Graph dan gambar 1200x630, canonical dan og detail proyek. Data halaman publik tetap memakai cache data 60 detik | Selesai, tanpa hreflang |
| S-05 | Admin tidak siap data besar | Backend `GET /admin/disputes/:id`, `GET /admin/users?page&q&status`. Frontend: pencarian pengguna dengan jeda ketik dan paginasi server; detail sengketa admin memakai endpoint baru, bukti banyak berkas, ruang mediasi | Selesai |
| S-06 | Status kontrak basi | Pemeriksaan ulang status kontrak dan pembayaran tiap 20 detik dan saat tab kembali terlihat, dengan pemberitahuan; approve dan reject mengirim `deliverable_id` yang dilihat klien, backend menolak bila kiriman sudah berganti (`DELIVERABLE_CHANGED`) | Selesai |
| S-07 | Tanpa ganti sandi, email, hapus akun | Backend `/account/password`, `/account/email`, `/account/email/confirm`, `/account/delete` (anonimisasi, syarat saldo kosong dan tanpa kontrak, penarikan, atau sengketa aktif; berkas KTM, selfie, avatar dihapus). Frontend `/profil/keamanan` dan `/konfirmasi-email` | Selesai |
| R-01 | Akun uji tertinggal | Tiga akun uji non-admin dibekukan lewat panel admin (bisa diaktifkan lagi). Akun `uji-admin-0914` dibiarkan aktif karena satu-satunya admin di database | Sebagian, perlu keputusan pemilik |
| R-02 | Tanpa ikon aplikasi | `favicon.ico` (sebelumnya logo bawaan Next), `icon.png`, `apple-icon.png`, ikon manifest 192 dan maskable 512, `opengraph-image.png` | Selesai |

### Temuan tambahan yang ditemukan dan diperbaiki selama pengerjaan

| Temuan | Perbaikan |
|---|---|
| `bahasaAktif()` hanya membaca cookie bahasa bila cookie itu paling depan: `\s` di template literal kehilangan garis miringnya | Pola diperbaiki, diuji unit test |
| Favicon situs masih logo bawaan create-next-app | Diganti ikon StairsLife |
| Pencarian pengguna admin berpaginasi selalu kosong: `NOT { suspension_reason }` di Prisma ikut membuang baris yang kolomnya NULL | Diganti `OR [null, not]`, diperiksa ulang lewat API dan browser |
| Dua tombol aksi di topbar profil membuat judul halaman menyusut ke lebar 0 di 375px | Di bawah 640px aksi halaman pindah ke atas isi |
| `addEvidence` di backend memeriksa `in_review`, padahal admin menulis `under_review` | Memakai daftar status aktif yang sama |
| Sengketa kedua bisa dibuka saat yang pertama sedang ditinjau admin | `under_review` dihitung aktif |

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| `npm test` (Vitest) | 24 lolos |
| `npm run test:e2e` (Playwright, Chrome terpasang) | 12 lolos |
| `next build` | Lolos, 49 rute, proxy CSP aktif |
| Backend `tsc --noEmit` dan `jest` | Lolos, 14 suite, 38 tes |
| Uji asap backend lewat API | 17 dari 17 lolos: kode galat, rotasi refresh, logout mencabut sesi, pengaturan publik, izin admin, paginasi, 403 non-admin |
| Browser dengan backend sungguhan | Mahasiswa, bisnis, admin; ID dan EN; 375px dan 1440px; tanpa luapan horizontal di beranda, kontrak, pesan, notifikasi, sengketa, bantuan, keamanan akun, tarik dana, profil; tanpa pelanggaran CSP di konsol; halaman aplikasi menolak disematkan di iframe |

### Yang tetap dan perlu diketahui

- Access token tetap stateless dan berlaku sampai 60 menit setelah logout atau
  pembekuan. Banner akun dibekukan menutup celah itu di antarmuka.
- Refresh token lama (tanpa `jti`) ditolak. Setelah backend ini dipasang,
  semua pengguna yang sedang masuk perlu masuk ulang sekali.
- Admin yang tidak tercantum di peran mana pun punya akses penuh. Ini menjaga
  admin yang ada tetap bekerja; pembatasan berlaku begitu admin dimasukkan ke
  peran.
- Chat dan notifikasi memakai polling (5 dan 30 detik), bukan WebSocket.
- Aksi yang mengubah data sungguhan tidak dijalankan di database bersama:
  pengajuan sengketa, kirim pesan, ganti kata sandi, ganti email, dan hapus
  akun diuji jalur sukses dengan API dimock, dan jalur galat (kata sandi salah)
  lewat API sungguhan. Tidak ada kontrak aktif di data uji, dan membuatnya
  butuh pembayaran Xendit.
- Email konfirmasi ganti email hanya terkirim bila `RESEND_API_KEY` diisi;
  tanpa itu backend mencetaknya ke log.
- Bahasa masih dari cookie di URL yang sama, jadi versi Inggris tidak diindeks
  terpisah (tanpa hreflang).
- Isi pengumuman admin ditampilkan dalam bahasa penulisnya.
- Backend bukan repositori git. Salinan `src` sebelum perubahan disimpan di
  folder sementara sesi, bukan di proyek; sebaiknya backend dimasukkan ke git
  sebelum perubahan ini dipasang.
- `npm audit` melaporkan 2 kerentanan tingkat sedang di dependensi pengembangan;
  dependensi produksi 0.
- `GET /projects/:id` dengan id yang bukan UUID membalas 500 (sudah ada
  sebelumnya, belum diubah).

## Ikon dompet, header profil, dan layar masuk (15 September 2026)

### Yang dikerjakan

- Ikon dompet diganti ke PNG Icons8 baru (`dompet-64.png`, sumber 64px,
  sebelumnya 50px). Karena `Wallet` dialiaskan, penggantinya berlaku di seluruh
  aplikasi: sidebar, bottom nav, kartu saldo, panel auth, landing.
- **Bug header profil.** Kolom teks header ditarik ke atas 48px (`margin-top:
  -48px`) supaya avatar menumpang di sampul, sehingga nama ikut naik dan
  tertutup sampul. Terjadi di profil bisnis dan mahasiswa (halaman yang sama).
  Header kini grid tiga kolom: hanya avatar yang menumpang, nama dan rating
  diberi jarak setinggi tumpangan, dan di bawah 640px semuanya menumpuk. Nama
  panjang dibungkus (`overflow-wrap: anywhere`), tidak meluber.
- Admin tidak punya halaman `/profil`; rute itu menampilkan arahan ke panel
  admin, dan dashboard admin tidak memakai header bersampul, jadi bug yang sama
  tidak ada di sana.
- Layar berputar saat masuk dan daftar (`LayarProses`, dipakai bersama layar
  keluar): "Memeriksa akunmu" bila pemeriksaan lebih dari 350 ms, lalu
  "Selamat datang" sampai halaman tujuan tampil.

### Bug yang ditemukan saat evaluasi

- **Shell admin runtuh bila `/admin/me` tidak lengkap.** Membuka tab admin
  saat tab lain masih masuk sebagai bisnis mengganti sesi di tab lama; bila
  respons izin tidak memuat `izin`, `ShellAplikasi` melempar galat dan halaman
  jatuh ke layar "Ada yang gagal dimuat". Respons kini dinormalkan di
  `admin.me()`: bentuk tidak lengkap berarti menu lengkap, backend tetap yang
  menolak.
- Dashboard admin runtuh bila `project_trend` atau `registration_trend` tidak
  ada. Kini dianggap kosong.
- Ikon `BadgeCheck` pada "Jurusan" dan "Keahlian" ikut berubah menjadi lencana
  terverifikasi karena alias PNG, sehingga terbaca sebagai status. Diganti
  BookOpen dan ListChecks.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` (ESLint, token CSS, tsc) | Lolos |
| Vitest | 24 lolos |
| Playwright | 17 lolos, termasuk 5 uji baru: layar masuk + `?lanjut=`, nama profil di bawah sampul (1440, 900, 375), izin admin tidak lengkap |
| `next build` | Lolos |
| Tangkapan layar profil dan beranda bisnis, mahasiswa, admin di 1440, 1024, 900, 375; layar masuk ID dan EN | Tidak ada tumpang tindih; konsol tanpa galat |

## Eksekusi temuan audit mutu (17 September 2026)

Audit menghasilkan 17 temuan; 13 dikerjakan, sisanya keputusan kamu (commit git,
menjalankan CI) atau sudah selesai dengan sendirinya.

### Prioritas tinggi

| Temuan | Perbaikan |
|---|---|
| Unggah berkas tidak ikut pembaruan token | `apiUpload` kini memakai alur yang sama dengan `apiFetch`: 401 memicu satu pembaruan token lalu unggahan diulang. Enam alur unggah ikut terlindungi |
| Ukuran berkas tidak diperiksa di klien | `BATAS_UNGGAH` dan `berkasTerlaluBesar` di klien API, mengikuti angka backend (50 MB hasil kerja, 10 MB sisanya). Dipasang di kirim hasil kerja, ajukan sengketa, dan tambah bukti |
| Tidak ada progres unggah | Kirim hasil kerja menampilkan "Mengunggah berkas 2 dari 3"; halaman sengketa juga |
| Permintaan tanpa batas waktu | `AbortSignal.timeout` 25 detik untuk permintaan biasa, 5 menit untuk unggahan. Galat jaringan dan kehabisan waktu kini jadi ApiError berbahasa Indonesia, bukan "Failed to fetch" |
| Satu field hilang menjatuhkan halaman | `admin.me()` dan dompet dinormalkan; komponen `BatasSeksi` membatasi kegagalan render pada kartunya sendiri (dipasang di dua grafik admin dan daftar mutasi dompet) |

### Prioritas sedang

| Temuan | Perbaikan |
|---|---|
| Judul tab generik | 23 layout rute menyetel judulnya sendiri lewat `generateMetadata` dan kamus, memakai `title.absolute` supaya akhiran situs pasti ikut |
| Fokus tidak pindah setelah navigasi | `AppShell` memindahkan fokus ke `#konten` setiap `pathname` berganti, kecuali muat pertama |
| Latar modal terbaca pembaca layar | Anak `body` di luar dialog diberi `inert` selama modal terbuka |
| Sesi berakhir tanpa penjelasan | Sesi yang ditolak server ditandai, halaman masuk menjelaskannya, dan shell kini langsung mengarahkan begitu sesi dicabut (sebelumnya berhenti di layar "butuh akun" sampai pengguna berpindah sendiri) |
| Portofolio pelamar tidak pernah tampil | Rute baru `/pengguna/[id]`: profil, ringkasan kontrak selesai, portofolio, dan ulasan. Ditautkan dari kartu pelamar. Penghasilan dan tautan berkas milik klien sengaja tidak ditampilkan |
| Halaman publik tanpa umpan balik | `loading.tsx` untuk `/proyek` dan `/proyek/[id]` |
| Koneksi putus tidak ditangani | Bilah "Kamu sedang offline"; polling obrolan dan notifikasi berhenti saat offline dan menarik sekali saat online kembali |
| Foto profil tanpa ukuran tetap | `width`, `height`, `loading="lazy"`, `decoding="async"` pada avatar |

### Perbaikan sampingan yang ikut ditemukan

- Rekening utama (atau satu-satunya) kini terpilih otomatis di halaman tarik dana.
  Sebelumnya penarikan gagal di langkah memilih dari daftar berisi satu baris.
- Sesi yang dicabut server tidak pernah mengarahkan ke halaman masuk sampai
  pengguna berpindah halaman sendiri. Ditemukan saat menulis uji untuk pesan
  sesi berakhir.

### Belum dikerjakan

- **Commit git.** Seluruh proyek masih satu commit bawaan Create Next App. Ini
  keputusan kamu, jadi tidak ada commit yang dibuat.
- **CI.** Alur kerjanya siap tapi belum pernah berjalan karena repositori belum
  diunggah.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos (3 uji batas unggah baru) |
| Playwright | 23 lolos (6 uji baru: unggah mengulang setelah token diperbarui, bukti di atas 10 MB, penarikan dana, profil publik, judul tab dan fokus dan offline dan sesi berakhir, modal inert) |
| `next build` | Lolos, 50 rute |
| Tangkapan layar profil publik 1440 dan 375, bilah offline, pesan sesi berakhir | Sesuai |

## Cari proyek dipindahkan ke dalam aplikasi (18 September 2026)

### Masalahnya

`/proyek` dibuat sebagai halaman publik supaya bisa diindeks mesin pencari, tapi
seluruh tautan di dalam aplikasi ikut mengarah ke sana: sidebar mahasiswa,
bottom nav, tombol di beranda, dan empty state lamaran serta kontrak. Akibatnya
mahasiswa yang sudah masuk keluar dari shell aplikasi dan mendarat di halaman
bergaya pemasaran lengkap dengan footer publik. Ditambah hero setinggi sekitar
330 piksel, kartu pertama baru terlihat setelah menggulir.

### Yang dikerjakan

- **Rute baru `/mahasiswa/cari`** di dalam shell aplikasi, mengikuti susunan tab
  Cari Project di FE V2: jumlah proyek, bilah cari, chip tingkat dan kategori,
  lalu grid kartu. Proyek yang sudah dilamar diberi penanda, dibaca dari
  `/applications/my`.
- **Rute baru `/mahasiswa/cari/[id]`** supaya klik dari kartu tidak melempar
  keluar shell. Isinya komponen yang sama dengan halaman publik
  (`IsiDetailProyek`), jadi brief yang dibaca pelamar tidak pernah berbeda.
- **Seluruh tautan dalam aplikasi diarahkan ulang** ke `/mahasiswa/cari`:
  sidebar, bottom nav, beranda mahasiswa, lamaran, kontrak, dan verifikasi.
  Landing, footer publik, dan halaman 404 tetap ke `/proyek`.
- **Halaman publik dipadatkan.** Hero diganti kepala satu baris (judul dan
  jumlah), panel saringan di kolom kiri diganti bilah mendatar, dan grid memakai
  kartu 280px dengan jarak lebih rapat sehingga muat tiga kolom di 1440px.
- **Chip kategori dibangun dari data**, bukan daftar tetap: kategori di backend
  adalah teks bebas per proyek, jadi satu-satunya daftar yang jujur diambil dari
  proyek yang benar-benar ada. Saat sebuah kategori sedang dipilih, chip tetap
  dibangun dari daftar penuh supaya pengguna bisa pindah kategori.
- **Bilah "buka di aplikasi"** muncul di halaman publik untuk mahasiswa yang
  sudah masuk, sebagai jalan pulang ke versi dalam aplikasi.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 24 lolos, termasuk uji baru untuk chip, penanda dilamar, tidak adanya footer, dan detail yang tetap di dalam shell |
| `next build` | Lolos, 52 rute |
| Tangkapan layar 1440 dan 375, terang dan gelap | Sembilan proyek contoh tampil tiga kolom di 1440 tanpa menggulir; di 375 tombol cari jadi ikon supaya kolomnya tetap terbaca |

### Yang tetap dan perlu diketahui

- `GET /projects` masih tanpa paginasi, jadi kedua halaman memuat seluruh proyek
  terbuka sekaligus dan mengatakannya apa adanya di bawah daftar.
- Halaman cari di dalam aplikasi hanya untuk mahasiswa. Pemilik usaha memakai
  halaman publik bila ingin melihat pasar.
- Satu uji E2E ("ringkasan galat pendaftaran") sempat gagal sekali karena
  kompilasi rute pertama di mode dev, lalu lolos pada dua jalan berikutnya.

## Perbaikan sebelum uji alur (18 September 2026)

### Bug: halaman cari runtuh setelah membuka beranda

`useAsync` berbagi cache per kunci. Beranda mahasiswa dan daftar lamaran
menyimpan `{ data, sample }` di kunci `lamaran-saya`, sedangkan halaman cari
yang baru menyimpan arraynya saja di kunci yang sama. Membuka beranda lalu cari
membuat halaman kedua membaca bentuk yang salah dan seluruh halaman jatuh ke
layar galat (`(lamaran.data ?? []).map is not a function`).

Perbaikannya: halaman cari memakai bentuk yang sama dengan pemakai kunci
lainnya, ditambah penjagaan `Array.isArray`. Uji E2E baru menjalankan urutan
persis itu, karena bug ini hanya muncul lewat urutan kunjungan.

### Logo di sidebar tidak lagi bisa ditekan

Di dalam aplikasi, satu-satunya jalan keluar adalah tombol keluar. Logo yang
menautkan ke landing membuat orang merasa tersesat dari akunnya, jadi di shell
aplikasi logonya kini elemen biasa. Logo di header publik tetap tautan.

### Tag kategori ditahan

Penanda proyek sekarang hanya tingkat (pemula, menengah, mahir). Kategori
dihilangkan dari chip saringan, kartu proyek, detail proyek, daftar proyek
admin, dan tabel keuangan admin. Kolom kategori di formulir proyek baru ikut
disembunyikan; backend masih mewajibkan kolom itu terisi, jadi frontend
mengirim nilai tetap `umum` sampai kategorinya dipakai lagi.

### Tamu diajak mendaftar, bukan disuruh masuk

Tamu yang membuka detail proyek sebelumnya hanya ditawari "Masuk untuk
melamar", padahal yang datang dari pencarian belum tentu punya akun. Sekarang
tombol utamanya "Daftar untuk melamar", dengan tautan masuk di bawahnya. Daftar
proyek publik tetap bisa dibuka tanpa akun supaya masih bisa diindeks.

### Auto-leveling: jalan, tapi ambangnya tidak masuk akal

Fiturnya berjalan dan dipicu dua tempat: saat hasil kerja disetujui
(`ContractsService`) dan saat rating baru masuk (`ReviewsService`), lengkap
dengan notifikasi. Dua masalah diperbaiki:

| Sebelum | Sesudah |
|---|---|
| Menengah butuh 25 proyek selesai dan rating 3,5 | 3 proyek selesai dan rating 4,0 |
| Mahir butuh 50 proyek selesai dan rating 4,0 | 10 proyek selesai dan rating 4,5 |
| Tier dihitung ulang dari nol, jadi bisa turun diam-diam saat rating merosot | Tier tidak pernah turun; penurunan jadi keputusan admin, bukan efek samping |

Empat uji jest baru mengunci aturan ini di `reviews.service.spec.ts`.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 25 lolos, termasuk uji urutan beranda lalu cari |
| Jest backend | 42 lolos (4 uji tier baru) |
| `next build` | Lolos, 52 rute |

Satu hal belum diperiksa langsung: tampilan tombol daftar di halaman detail
publik, karena halaman itu dirender server dan butuh backend menyala. Akan
terlihat begitu kamu menjalankan kedua server.

## Detail proyek bisnis, aturan sesi, dan telusur alur (18 September 2026)

### Detail proyek untuk pemilik usaha

Proyek yang baru dipasang dulu langsung membuka daftar pelamar yang pasti masih
kosong, jadi pemiliknya tidak pernah melihat hasil tulisannya sendiri. Sekarang
ada rute `/bisnis/proyek/[id]`: isinya sama persis dengan yang dibaca mahasiswa
(brief, hasil yang diminta, keahlian, anggaran, tenggat), hanya panel sampingnya
yang berbeda. Bukan tombol lamar, melainkan jumlah pelamar dan jalan ke daftar
pelamar di bawah halaman yang sama.

- `IsiDetailProyek` kini menerima `aksi` dan `catatan`, jadi kedua sisi memakai
  satu komponen dan brief-nya tidak mungkin berbeda.
- Daftar pelamar dipindah ke komponen `DaftarPelamar` supaya bisa ditanam di
  halaman detail.
- Rute lama `/bisnis/proyek/[id]/pelamar` jadi pengalihan ke `#pelamar`, karena
  backend mengirim deep link `/projects/:id/applications` di notifikasi.
- Daftar "Proyek saya" dan alur setelah memasang proyek menunjuk ke detail.

### Aturan sesi: beranda publik berarti sudah keluar

Sesi masuk berlaku di dalam aplikasi. Begitu seseorang sampai ke beranda
publik, sesinya ditutup (`AkhiriSesi`): token refresh dicabut di backend, token
lokal dihapus, dan muncul kabar singkat kenapa. Halaman publik lain (daftar
proyek, detail proyek, bantuan) tidak menutup sesi, karena tautan proyek sering
dibagikan dan membukanya bukan tanda seseorang ingin keluar.

Ikutannya: tombol "Ke berandaku" dihapus dari header publik, dan tombol pulang
di halaman 404 serta layar galat kini mengarah ke beranda peran selama sesinya
ada, supaya salah alamat tidak berujung keluar akun.

### Kolom isian otomatis Chrome

Kolom yang diisi otomatis (kata sandi tersimpan) diwarnai biru bawaan Chrome
dan tidak bisa ditimpa background biasa. Ditutup dengan bayangan dalam setebal
kolom plus `-webkit-text-fill-color`, jadi kolomnya tetap memakai warna tema.

### Telusur alur tiga peran

Tiga puluh dua halaman ditelusuri satu per satu dengan API tiruan, memeriksa
judul, keadaan galat, tautan mati, dan galat konsol.

| Peran | Halaman | Hasil |
|---|---|---|
| Pemilik usaha | 10 | Semua tampil, tanpa tautan mati, tanpa galat konsol |
| Mahasiswa | 12 | Sama |
| Admin | 10 | Satu halaman runtuh, lalu diperbaiki |

Temuannya: `/admin/keuangan` memetakan `daily_trend` langsung, jadi ringkasan
keuangan tanpa bidang itu menjatuhkan seluruh halaman. Responsnya kini
dinormalkan di `admin.finances()`, sama seperti `admin.me()`, dan ada uji E2E
yang menguncinya.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 29 lolos |
| Jest backend | 42 lolos |
| `next build` | Lolos, 52 rute |

## Tombol beranda, panel admin, dan uji yang goyah (18 September 2026)

- **Tombol utama di beranda ke pendaftaran.** "Cari Proyek" tidak lagi membuka
  `/proyek` melainkan `/daftar/mahasiswa`. Melamar mensyaratkan akun mahasiswa,
  jadi tamu memang harus mendaftar dulu, dan tombolnya kini sepasang dengan
  "Pasang Proyek" yang sudah mengarah ke `/daftar/bisnis`. Halaman `/proyek`
  tetap ada dan bisa diindeks.
- **Pita "Panel admin" dihapus.** Judul dan penjelasannya sudah ada di topbar,
  dan pita setinggi 170 piksel itu mendorong antrean serta grafik ke bawah
  layar. Sekarang ringkasan admin langsung membuka dengan kartu angka, antrean
  "Perlu ditindak", dan dua grafik tanpa menggulir.
- **Uji pendaftaran yang kadang gagal diperbaiki.** Penyebabnya bukan produk:
  di mode dev, rute yang pertama kali dibuka masih dikompilasi, jadi klik bisa
  mendahului hidrasi dan formulirnya terkirim biasa tanpa validasi klien.
  Ujinya kini mengulang klik sampai validasinya muncul.

### Akun admin

Hanya ada satu akun admin di database: `uji-admin-0914@example.com` (nama "Uji
Admin", dibuat 14 September 2026). Kata sandinya ada di berkas kredensial uji
milik sesi, bukan di repositori, dan tidak pernah ditulis ke dokumen ini.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 30 lolos |
| `next build` | Lolos, 52 rute |

## Pintu masuk panel admin (18 September 2026)

Admin sebelumnya masuk lewat halaman yang sama dengan mahasiswa dan usaha,
lengkap dengan panel cerita escrow, tombol "Daftar Gratis", dan navigasi
pemasaran. Untuk pengurus platform bingkai itu salah: akun admin tidak dibuat
sendiri, dan tidak ada yang perlu dijual di layar itu.

- Rute baru `/masuk/admin` di grup `(panel)`, dengan tata letaknya sendiri:
  tanpa header publik dan tanpa footer, hanya pengatur bahasa dan tema.
- Satu kartu tenang: lencana "Panel admin", judul, dua kolom, satu tombol,
  catatan bahwa setiap tindakan tercatat di jejak audit, dan tautan kembali ke
  halaman masuk biasa.
- **Peran diperiksa sebelum sesi ditulis.** Akun bukan admin yang kata sandinya
  benar tetap ditolak di pintu ini dengan alasan yang jelas, bukan dibiarkan
  masuk lalu mendarat di layar "halaman ini untuk admin".
- Penjaga rute mengarahkan `/admin/**` tanpa sesi ke pintu ini, membawa
  `?lanjut=` sehingga admin kembali ke halaman yang tadi dituju.

### Akun admin

Ada satu akun admin di database: `uji-admin-0914@example.com` ("Uji Admin",
dibuat 14 September 2026). Kata sandinya tidak ditulis di repositori maupun di
dokumen ini.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 31 lolos, termasuk uji pintu admin menolak akun biasa |
| `next build` | Lolos, 53 rute |

## Enam perbaikan tampilan dan penghapusan rute publik proyek (18 September 2026)

| Permintaan | Yang dikerjakan |
|---|---|
| Formulir lamaran jangan di kolom kanan | Satu kolom: ringkasan proyek di atas, formulir di bawah, lebar dibatasi 760px. Kolom "kenapa kamu cocok" jadi selebar halaman, dan tanggal serta penawaran berdampingan |
| Centang baca di obrolan | Pesan sendiri membawa satu centang (sampai di server) atau dua centang biru (sudah dibuka lawan bicara). Backend sudah menandai `is_read` saat ruang dibuka, jadi tidak perlu endpoint baru |
| Kredit Icons8 di footer | Dilepas dari footer publik |
| Rentang anggaran memakai "sampai" | Diganti strip: `Rp 50.000 - Rp 100.000`, di kedua bahasa |
| "Lihat sebagai mahasiswa" dan rute `/proyek` | Tautan dilepas dari sisi bisnis, dan seluruh rute publik proyek dihapus |
| Halaman cari proyek kurang rapi | Hitungan jadi keterangan biasa, tombol saring jadi tenang, kartu setinggi isinya sendiri |
| Lencana bertitik hijau | Lencana "sedang dibuka" diganti keterangan biasa. Titik hijau berdenyut menarik mata ke tempat yang tidak menuntut tindakan |

### Penghapusan rute `/proyek`

Rute publik proyek beserta detailnya dihapus. Ikutannya dirapikan supaya tidak
ada tautan yang berakhir di 404:

- Tautan di footer publik, halaman 404, kartu contoh di beranda, daftar proyek
  admin, ringkasan admin, detail lamaran, dan pembatalan lamaran.
- `robots.ts` dan `sitemap.ts`: proyek tidak lagi diumumkan ke mesin pencari,
  karena memang butuh akun untuk dibuka.
- `next.config.ts`: deep link backend `/projects/:id` kini mengarah ke
  `/mahasiswa/cari/:id`, dan `/projects` dihapus.

### Telusur ulang setelah penghapusan

Empat puluh halaman ditelusuri ulang per peran (bisnis, mahasiswa, admin, tamu):
tidak ada galat konsol, tidak ada tautan mati, dan tidak ada satu pun tautan
tersisa yang menuju `/proyek`. Satu yang sempat tertinggal, tautan "buka halaman
publik" di detail proyek versi aplikasi, ikut dihapus.

### Catatan lisensi ikon

Lisensi gratis Icons8 mewajibkan tautan atribusi yang terlihat. Kreditnya sudah
dilepas dari footer sesuai permintaan, dan catatannya tetap ada di DECISIONS.md.
Kalau atribusi memang tidak ingin ditampilkan di mana pun, pilihan yang bersih
adalah mengganti enam ikon PNG itu dengan padanan Lucide yang sudah disiapkan
sebagai cadangan di `icon-gambar.ts`.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 32 lolos |
| `next build` | Lolos, 51 rute |

## Lencana status, panel anggaran, kepala obrolan, dan profil pemasang (18 September 2026)

| Permintaan | Yang dikerjakan |
|---|---|
| Lencana "Aktif" jangan bertitik hijau dan jangan berbentuk pil | Lencana status jadi kotak bersudut lembut, huruf kecil berjarak, tanpa titik indikator. Berlaku di seluruh aplikasi karena satu komponen |
| Panel anggaran kurang rapi | Nilai turun dari ukuran h2 ke h4 dan angkanya proporsional, jadi rentang dua nominal muat satu baris di panel 320px. Label jadi overline, jarak dalam dirapikan |
| Nama lawan bicara terasa tidak nyambung di topbar | Kepala percakapan menempel di kotak obrolan: tombol kembali, avatar, nama, dan keterangan "Pertanyaan sebelum kontrak". Topbar kembali menyebut bagian aplikasinya, yaitu "Pesan" |
| Tombol kembali memakai PNG yang diberikan | `kembali-50.png` masuk ke set ikon dan dialiaskan dari `ArrowLeft`, jadi keenam tombol kembali di aplikasi ikut berubah tanpa disentuh satu per satu |
| Profil pemasang proyek tidak ada dan tidak bisa diklik | Panel samping detail proyek kini membuka dengan baris "Pemasang proyek": avatar, nama, dan tanda panah menuju `/pengguna/[id]`. Nama di kepala halaman juga jadi tautan |

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 33 lolos |
| `next build` | Lolos, 51 rute |

## Pencarian cepat, kartu proyek, dan centang baca (18 September 2026)

### Pencarian cepat, ditulis ulang bukan dipasang

Rujukan yang diberikan pemilik produk adalah komponen Apple Spotlight berbasis
shadcn, Tailwind, dan framer-motion. Ketiganya tidak dipakai proyek ini, dan
memasang Tailwind hanya untuk satu komponen berarti dua sistem gaya hidup
berdampingan sementara lint token kehilangan cengkeramannya. Yang diambil
rancangan interaksinya, ditulis ulang dengan CSS Module dan token yang sudah
ada, tanpa dependensi baru:

- `SpotlightCari`: lapisan di tengah layar, hasil muncul sambil diketik, tiap
  baris membawa judul, nama usaha, tingkat, dan anggaran.
- Dibuka dengan Ctrl atau Cmd+K, atau dengan menyentuh kolom cari di halaman.
  Panah memilih, Enter membuka, Escape menutup, dan Enter tanpa hasil memakai
  kata kuncinya sebagai saringan halaman.
- Latar di belakangnya diberi `inert` seperti modal, jadi pembaca layar tidak
  menyusuri halaman yang tertutup.
- Pencocokan berjalan di klien karena daftar proyek terbuka memang dimuat
  seluruhnya, sehingga mengetik tidak memicu satu permintaan per huruf.

### Kartu proyek dibuat lebih tegas

Bayangan lembut diganti garis: pita aksen di tepi kiri menyala saat kartu
disorot, judul naik ke ukuran h4, nominal anggaran jadi elemen terkuat di
kartu, dan chip tingkat memakai bentuk yang sama dengan lencana status.

### Centang obrolan

Selalu dua centang. Abu-abu berarti terkirim, biru berarti sudah dibuka lawan
bicara. Yang berubah warnanya, bukan jumlahnya, sesuai kebiasaan aplikasi pesan
yang sudah dikenal.

### Evaluasi menyeluruh

Empat puluh empat halaman ditelusuri ulang per peran, memeriksa kegagalan
render, tautan mati, dan scroll horizontal:

| Peran | Halaman | Masalah | Galat konsol |
|---|---|---|---|
| Pemilik usaha | 12 | tidak ada | tidak ada |
| Mahasiswa | 14 | tidak ada | tidak ada |
| Admin | 10 | tidak ada | tidak ada |
| Tamu | 8 | tidak ada | tidak ada |

Keadaan proyek: 23.047 baris, 51 rute, 55 komponen, 27 uji unit, 35 uji E2E,
nol TODO, nol `any`, nol console tertinggal. Dependensi produksi tetap empat:
next, react, react-dom, lucide-react.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 35 lolos |
| `next build` | Lolos, 51 rute |

## Spotlight disesuaikan rujukan, dan uji alur uang (18 September 2026)

### Pencarian cepat dibuat sesuai rujukannya

Versi pertama hanya mengambil sebagian rancangan. Setelah dibandingkan ulang
dengan komponen rujukan, lima ciri ditambahkan:

| Ciri rujukan | Sebelum | Sesudah |
|---|---|---|
| Lapisan di tengah layar | menempel atas | benar-benar di tengah |
| Bentuk kapsul membulat | panel radius biasa | kapsul 30px |
| Pintasan bulat muncul saat disorot | tidak ada | empat pintasan meluncur keluar dari balik kapsul |
| Efek gooey saat pintasan memisah | tidak ada | saringan SVG pada lapisan bentuk |
| Placeholder mengikuti yang sedang disorot | statis | berganti dan beranimasi |
| Hasil hanya muncul saat mengetik | tampil walau kosong | mengikuti rujukan |

Saringan gooey sengaja dipasang pada lapisan bentuk (kapsul dan lingkaran tanpa
teks), bukan pada seluruh isi seperti rujukannya: `feGaussianBlur` dengan
`stdDeviation` besar akan melelehkan huruf. Dua hal tetap ditambahkan di luar
rujukan karena rujukannya hanya bisa dipakai tetikus: navigasi keyboard penuh
dan `inert` pada isi halaman di belakang.

### Uji ujung ke ujung untuk alur uang

Empat uji baru menutup dua alur yang sebelumnya tercatat sebagai celah:

| Uji | Yang dijaga |
|---|---|
| Bisnis menyetor dana | Tagihan dibuat dengan nominal yang sama persis dengan kesepakatan kontrak, pantulan dari Xendit mendarat di halaman hasil, dan halaman itu menanyakan status ke backend alih-alih memercayai parameter di URL |
| Bisnis melepas dana | Konfirmasi pelepasan tidak bisa ditutup dengan mengklik di luar kotak, dan persetujuan benar-benar terkirim ke backend |
| Verifikasi KTM, kolom kosong | Tidak ada satu berkas pun terlanjur diunggah saat formulirnya belum lengkap |
| Verifikasi KTM, pengajuan lengkap | Dua berkas naik dengan jenisnya berurutan (ktm lalu selfie), dan pengajuan membawa kampus, nomor induk, serta kedua tautan berkas |

Uji pertama memakai alamat pantulan lokal sebagai pengganti domain Xendit, jadi
seluruh rantai frontend teruji tanpa menyentuh Xendit dan tanpa memindahkan
uang.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 39 lolos |
| `next build` | Lolos, 51 rute |

Dengan ini celah uji yang tercatat di audit mutu (R-02) tertutup: pembayaran
escrow, pelepasan dana, penarikan dana, unggah hasil kerja, dan verifikasi KTM
semuanya sudah punya uji ujung ke ujung.

## Putaran 18 September 2026: kolom cari yang mengembang

Kolom pencarian di `/mahasiswa/cari` diganti dengan kolom yang mengembang:
lingkaran ikon saat diam, kapsul selebar 340px saat ditekan, dengan tombol
tutup, pintasan Ctrl K yang bisa ditekan tetikus, dan chip tingkat yang
bergeser mengikuti lebar kolomnya.

| Bagian | Keadaan sekarang |
|---|---|
| Membuka | Ditekan sekali, kolomnya melebar dan langsung menerima ketikan |
| Menutup | Escape, tombol tutup, atau menekan di luar saat kolomnya kosong |
| Ketikan belum dikirim | Menekan di luar tidak menghapusnya, kolomnya tetap terbuka |
| Kata kunci berlaku | Menahan kolomnya terbuka sampai dihapus, jadi saringan tidak pernah bekerja diam diam |
| Keyboard | Kolom yang terlipat dilewati Tab; cincin fokus digambar ke dalam kapsul supaya tidak terpotong |
| Layar 375px | Kolom mengisi barisnya dan chip pindah ke baris berikutnya, tetap terlihat dan tetap bisa ditekan |

### Ronda seluruh halaman

Empat peran (tamu, mahasiswa, bisnis, admin) dibuka di dua lebar (1440 dan
375), semuanya dengan API tiruan: **118 kunjungan halaman**. Yang diperiksa di
tiap halaman adalah galat konsol, batas galat React, dan scroll mendatar.

| Hasil | Jumlah |
|---|---|
| Render gagal | 0 |
| Galat konsol | 0 |
| Scroll mendatar di 375px | 0 |

Ronda pertama sempat menjatuhkan tiga halaman, dan setelah ditelusuri dua di
antaranya berasal dari urutan rute di berkas tiruannya sendiri, bukan dari
produk. Meski begitu keduanya menunjuk titik rapuh yang nyata: halaman langsung
memanggil `.map` atau `.filter` pada apa pun yang datang dari backend. Itu
persis penyebab halaman cari proyek pernah tumbang. Tiga pengerasan dipasang:

| Tempat | Perubahan |
|---|---|
| `src/lib/data/work.ts` | `ambil()` mengembalikan daftar kosong kalau yang datang seharusnya daftar tapi bukan daftar. Ini menutup seluruh pemakainya sekaligus: lamaran, kontrak, pembayaran, pelamar proyek, ulasan, hasil kerja |
| `src/lib/data/projects.ts` | `listProjects()` diperlakukan sama |
| `/pengguna/[id]` | Profil tanpa bidang `user` ditangani sebagai layar gagal biasa, bukan dibiarkan menjatuhkan halaman di baris pertama yang membaca nama |

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos |
| Vitest | 27 lolos |
| Playwright | 40 lolos |
| `next build` | Lolos, 51 rute |
| Ronda 4 peran x 2 lebar | 118 halaman, 0 masalah |

## Bilah tab dan baris di panel admin

Dua perbaikan atas catatan pemilik produk di halaman `/admin/proyek`.

**Bilah tab** (Semua sampai Ditutup) sekarang memakai satu penanda yang meluncur
ke tab yang dipilih. Sebelumnya tiap tab menggambar latar putihnya sendiri, jadi
perpindahannya berupa satu latar hilang dan satu latar muncul. Perpindahannya
diukur dari kotak tab aktif dan ditulis langsung ke gaya penanda, jadi tidak ada
render tambahan tiap kali tab ditekan.

Satu bug ikut ketahuan saat diuji: penandanya melompat, bukan meluncur. Tab yang
baru terpilih berubah jadi tebal sehingga lebarnya berubah, `ResizeObserver` ikut
terpicu, dan penempatan ulangnya mematikan transisi. Sekarang hanya penempatan
paling pertama yang tanpa transisi. Diukur setelah perbaikan, penandanya bergerak
308 lalu 382, 886, 944, dan mendarat di 954 tanpa melewati tujuannya.

**Baris proyek** dibuat tiga kolom tetap: nominal rata kanan, lencana status rata
kiri, lalu tombolnya.

| | Sebelum | Sesudah |
|---|---|---|
| Awal kolom lencana | 1489, 1476, 1484, 1401 (bergeser tiap baris) | 1401 di semua baris |
| Tepi kanan nominal | 1483, 1440, 1385, 1420 | 1385 di semua baris |
| Jarak antarkolom | 6px | 16px |

Penyebabnya ketiganya hanya satu deret rata kanan, jadi lencana yang lebih
panjang ("Dalam sengketa" berbanding "Aktif") mendorong nominal di barisnya
sendiri sampai 54px, dan daftar itu tidak punya garis tegak untuk diikuti mata.

Uji baru mengunci keduanya: penanda tab harus menempel pada kotak tab yang aktif
setelah berpindah, dan saringannya benar-benar bekerja, bukan sekadar penandanya
yang pindah.

## Kartu proyek dan empat token yang tidak pernah ada

Pemilik produk menunjuk kartu yang terlihat tidak rapi saat judulnya panjang.
Menelusurinya membuka satu rantai cacat yang lebih besar daripada kartunya.

### Kartu

| Keluhan | Sebabnya | Perbaikan |
|---|---|---|
| Kartu bergoyang saat judul panjang pendek | Judul satu baris dan dua baris membuat baris penanda berhenti sejajar | Judul dipotong dua baris, tingginya dipesan di blok kepala, dan `text-wrap: balance` membagi katanya rata |
| Pita hampa di bawah tag | Sisa ruang dari tinggi yang dipesan tadi | Diisi ringkasan brief dua baris, dibatasi garis pemisah di atasnya |
| Baris kaki tidak seragam | Panjang nominal berbeda, jadi setiap kartu membungkus di tempat yang berlainan | Kaki jadi dua baris dengan isi tetap: nominal sendirian, lalu jumlah pelamar dengan Detail dan Lamar |

Perbaikan kaki yang pertama ternyata belum cukup. Nominal dan jumlah pelamar
masih berbagi satu baris, jadi "Rp 250.000 - Rp 400.000" terpenggal jadi dua
baris di kartu sempit ("Rp 250.000 - Rp" lalu "400.000") dan kakinya membengkak
jadi tiga baris sementara tetangganya dua. Tiga hal yang menyelesaikannya:

| Perubahan | Alasan |
|---|---|
| `white-space: nowrap` pada nominal dan jumlah pelamar | Keduanya angka yang dibaca sekali lihat; dipenggal di tengah, keduanya kehilangan bentuknya |
| Nominal mendapat barisnya sendiri | Dengan begitu susunan kaki tidak lagi bergantung pada panjang isinya, jadi selalu dua baris |
| `grid-auto-rows: 1fr` di grid kartu | Setiap baris grid dulu mengukur dirinya sendiri, jadi baris kedua bisa lebih pendek daripada baris pertama |

Diukur di sembilan lebar (1600 sampai 375) untuk kedua bahasa, dengan nominal
delapan digit di dua sisi dan jumlah pelamar tiga digit: seluruh kartu di tiap
lebar punya satu tinggi yang sama, garis kaki di ketinggian yang sama, tanpa
satu pun teks yang terpenggal atau meluber.

Terukur di 1440px, keenam kartu sekarang setinggi 332px dengan baris penanda di
+166 dan garis kaki di +233, sama persis, berapa pun panjang judulnya.

### Token yang dipakai tapi tidak pernah didefinisikan

Judul kartu memakai `var(--text-h4)`, dan ternyata skala tipografi memang
berhenti di `--text-h3`. Deklarasi yang memakai token tak dikenal tidak sah, dan
propertinya jatuh diam diam ke nilai warisan. Penelusuran menemukan empat nama
yang tidak pernah ada, dipakai di 23 tempat:

| Token | Dipakai | Akibatnya | Jadi |
|---|---|---|---|
| `--text-h4` | 7 | Judul kartu, kolom pencarian cepat, dan tiga judul lain memakai ukuran teks biasa | `--text-h3` |
| `--text-secondary` | 13 | Teks jatuh ke warna warisan | `--text-base` |
| `--bg-muted` | 7 | Chip kategori, penanda Ctrl K, dan tombol Esc tampil tanpa latar sama sekali | `--bg-subtle` |
| `--surface` | 2 | Panel tanpa latar | `--bg-surface` |
| `--tracking-tight` | 1 | Spasi huruf judul profil tidak berlaku | `--tracking-heading` |

Yang paling luas akibatnya bukan itu, melainkan tabrakan nama: `--text-body`
didefinisikan dua kali, sebagai warna di `colors.css` dan sebagai ukuran di
`typography.css`. Karena `typography.css` diimpor belakangan, yang menang adalah
ukurannya, sehingga `body { color: var(--text-body) }` tidak sah dan **seluruh
teks dasar aplikasi memakai hitam murni**, bukan tinta hangat sistem. Yang warna
sekarang bernama `--text-base`. Terukur setelah perbaikan, warna teks dasar
menjadi `rgb(51, 41, 31)` di tema terang dan `rgb(237, 228, 219)` di tema gelap.

`npm run lint:css` sekarang menolak token yang tidak terdefinisi, jadi cacat
sekelas ini tidak bisa lolos lagi. Properti kustom yang dioper komponen lewat
atribut style (mis. `--urutan`) dikumpulkan dari berkas TSX-nya supaya tidak
dilaporkan palsu. Satu sisa ditemukan sekalian: `--geser` di pencarian cepat
tidak pernah dioper siapa pun, jadi hanya nilai cadangannya yang terpakai.

### Satu temuan sampingan

Gelembung pesan masuk memakai nama pengirim dari respons backend. Pesan yang
tiba lewat realtime tidak selalu membawa objek pengirimnya, jadi pesan yang sama
bisa tertulis "pihak lain" sekarang lalu bernama sungguhan setelah halaman
dimuat ulang. Nama lawan bicara dari percakapannya kini dipakai sebagai cadangan.

### Pemeriksaan

| Pemeriksaan | Hasil |
|---|---|
| `npm run check` | Lolos, 330 token semuanya terdefinisi |
| Vitest | 27 lolos |
| Playwright | 43 lolos |
| `next build` | Lolos, 51 rute |

## Cara menyambungkan ke backend

1. Di backend, isi `.env`: `FRONTEND_URL=http://localhost:3001` dan
   `APP_URL=http://localhost:3001`. Tanpa yang pertama, CORS menolak karena
   whitelist mode dev hanya mengenal port 5173 dan 5500. Tanpa yang kedua,
   tautan email dan pantulan Xendit mengarah ke port yang salah.
2. Di frontend, set `NEXT_PUBLIC_USE_MOCK=0` di `.env.local`.
3. Jalankan backend di port 3000 dan frontend di 3001.

Setelah itu seluruh penanda "data contoh" hilang dengan sendirinya, dan setiap
halaman beralih ke API sungguhan tanpa perubahan kode.
