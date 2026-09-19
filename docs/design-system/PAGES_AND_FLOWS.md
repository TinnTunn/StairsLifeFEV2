# PAGES_AND_FLOWS.md

Dokumen konteks untuk redesign frontend (Next.js). Dipakai sebagai input ke Claude Design.

> **Catatan penting:** endpoint API di dokumen ini masih **usulan** karena backend NestJS belum saya lihat. Setelah file backend dikirim, semua endpoint di sini harus disesuaikan dengan controller yang sebenarnya.

---

## 1. Ringkasan Produk

Platform yang mempertemukan **mahasiswa/siswa aktif** dengan **pemilik bisnis** yang membuka lowongan.

Alur inti:

```
Bisnis posting lowongan
  → (moderasi admin, jika diaktifkan)
  → lowongan tayang
  → mahasiswa melihat & melamar
  → bisnis menyeleksi pelamar
  → diterima / ditolak
  → mahasiswa dapat notifikasi
```

## 2. Aktor & Hak Akses

| Aktor | Deskripsi | Syarat akses penuh |
|---|---|---|
| **Mahasiswa** | Pencari lowongan, harus berstatus pelajar/mahasiswa aktif | Email terverifikasi + KTM/kartu pelajar disetujui admin |
| **Pemilik bisnis** | Pemasang lowongan, menyeleksi pelamar | Email terverifikasi + profil bisnis disetujui admin |
| **Admin** | Verifikasi identitas, moderasi konten, kelola sistem | Akun dibuat internal, tidak lewat registrasi publik |
| **Tamu (guest)** | Belum login, boleh melihat-lihat | — |

Aturan akses yang harus tergambar di UI:

- Tamu **boleh** melihat daftar & detail lowongan, **tidak boleh** melamar → tombol lamar mengarah ke login.
- Mahasiswa belum terverifikasi **boleh** login dan melihat, **tidak boleh** melamar → tampilkan banner "Verifikasi identitasmu dulu".
- Bisnis belum terverifikasi **boleh** membuat draft lowongan, **tidak boleh** menayangkan.
- Admin tidak punya tampilan publik; masuk lewat rute terpisah.

## 3. Status (penting untuk desain)

Setiap status di bawah butuh warna badge dan tampilan berbeda. Ini yang paling sering terlewat saat generate UI.

**Status lowongan:** `draft` · `menunggu review` · `aktif` · `ditolak admin` · `ditutup` · `kedaluwarsa`

**Status lamaran:** `terkirim` · `dilihat` · `seleksi` · `diterima` · `ditolak` · `dibatalkan mahasiswa`

**Status verifikasi akun:** `belum diajukan` · `menunggu review` · `terverifikasi` · `ditolak` · `disuspend`

**Status pembayaran:** `menunggu pembayaran` · `menunggu konfirmasi` · `lunas` · `gagal/kedaluwarsa`

## 4. Catatan Pembayaran (QRIS pihak ketiga)

Pembayaran memakai QR pihak ketiga, jadi **tidak ada** form kartu, tidak ada halaman checkout gateway, tidak ada penyimpanan data kartu. Yang perlu didesain hanya:

1. Halaman tampil QR + nominal + hitung mundur kedaluwarsa
2. State "menunggu pembayaran" dengan polling status
3. Konfirmasi berhasil / gagal
4. (Jika konfirmasi manual) form upload bukti transfer + antrean verifikasi di sisi admin

> **Perlu dikonfirmasi:** siapa yang membayar dan untuk apa? Asumsi saya: pemilik bisnis membayar untuk memasang lowongan atau membeli paket. Kalau ternyata bukan, bagian B9–B10 dan A10 perlu diganti.

---

# 5. HALAMAN PUBLIK

### P1 — Landing Page
- **Route:** `/`
- **Tujuan:** menjelaskan platform dalam 5 detik dan mengarahkan ke dua jalur registrasi berbeda
- **Komponen:** hero dengan dua CTA terpisah ("Saya mahasiswa" / "Saya punya bisnis"), search bar lowongan, cara kerja 3 langkah, lowongan terbaru, logo bisnis terdaftar, footer
- **Data:** `GET /jobs?limit=6&sort=newest`, statistik ringkas
- **State:** loading skeleton kartu lowongan, kondisi belum ada lowongan sama sekali

### P2 — Daftar Lowongan
- **Route:** `/lowongan`
- **Tujuan:** menelusuri dan menyaring semua lowongan aktif
- **Komponen:** search bar, panel filter (kategori, lokasi, tipe kerja, rentang gaji, jadwal), sort, kartu lowongan (logo, judul, nama bisnis, lokasi, gaji, tag, waktu posting), paginasi/infinite scroll
- **Data:** `GET /jobs?search=&category=&location=&type=&page=`
- **State:** loading, hasil kosong (dengan saran hapus filter), error jaringan, filter aktif ditampilkan sebagai chip yang bisa dihapus
- **Responsif:** filter jadi bottom sheet di mobile

### P3 — Detail Lowongan
- **Route:** `/lowongan/[slug]`
- **Tujuan:** informasi lengkap + titik konversi utama (tombol lamar)
- **Komponen:** header (judul, bisnis, lokasi, tipe), panel aksi sticky (tombol lamar + simpan), deskripsi, kualifikasi, benefit, jadwal & durasi, info gaji, kartu profil bisnis, lowongan serupa
- **Data:** `GET /jobs/:slug`
- **State:** tamu (tombol → login), sudah pernah melamar (tombol jadi "Lihat status lamaran"), lowongan ditutup, belum terverifikasi, tidak ditemukan
- **Aksi:** Lamar · Simpan · Bagikan · Laporkan

### P4 — Profil Bisnis Publik
- **Route:** `/bisnis/[slug]`
- **Komponen:** cover, logo, nama, badge terverifikasi, deskripsi, lokasi, kontak, daftar lowongan aktif dari bisnis ini
- **Data:** `GET /businesses/:slug`, `GET /businesses/:slug/jobs`
- **State:** belum ada lowongan aktif

### P5 — Login
- **Route:** `/login`
- **Komponen:** form email + password, toggle lihat password, link lupa password, link daftar
- **Data:** `POST /auth/login`
- **State:** kredensial salah, akun disuspend, email belum diverifikasi, loading tombol
- **Catatan:** setelah login, redirect berdasarkan peran (mahasiswa → `/mahasiswa`, bisnis → `/bisnis`, admin → `/admin`)

### P6 — Pilih Peran Registrasi
- **Route:** `/daftar`
- **Komponen:** dua kartu besar berdampingan — mahasiswa dan pemilik bisnis, masing-masing dengan ringkasan manfaat

### P7 — Registrasi Mahasiswa
- **Route:** `/daftar/mahasiswa`
- **Komponen:** form bertahap (stepper) — (1) akun: nama, email, password; (2) data studi: institusi, jurusan, angkatan, NIM; (3) unggah KTM/kartu pelajar; (4) selesai
- **Data:** `POST /auth/register/student`
- **State:** validasi per langkah, email sudah terpakai, file terlalu besar/format salah, preview gambar KTM
- **Aksi:** simpan sebagai draft antar langkah

### P8 — Registrasi Bisnis
- **Route:** `/daftar/bisnis`
- **Komponen:** stepper — (1) akun penanggung jawab; (2) data bisnis: nama, kategori, alamat, deskripsi, kontak; (3) unggah dokumen (NIB/izin usaha/foto tempat); (4) selesai
- **Data:** `POST /auth/register/business`

### P9 — Verifikasi Email
- **Route:** `/verifikasi-email` dan `/verifikasi-email/[token]`
- **State:** menunggu (dengan tombol kirim ulang + hitung mundur), berhasil, token kedaluwarsa, token tidak valid

### P10 — Lupa & Reset Password
- **Route:** `/lupa-password`, `/reset-password/[token]`
- **State:** email terkirim, token kedaluwarsa, password berhasil diubah, indikator kekuatan password

### P11 — Halaman Statis
- **Route:** `/tentang`, `/cara-kerja`, `/faq`, `/syarat-ketentuan`, `/kebijakan-privasi`, `/kontak`
- **Komponen:** layout artikel sederhana, FAQ dengan accordion, form kontak

### P12 — Halaman Error
- **Route:** `not-found.tsx`, `error.tsx`
- **Komponen:** ilustrasi, pesan jelas, tombol kembali ke beranda

---

# 6. HALAMAN MAHASISWA

### M1 — Dashboard
- **Route:** `/mahasiswa`
- **Tujuan:** ringkasan aktivitas melamar
- **Komponen:** sapaan, banner status verifikasi (jika belum), kartu statistik (total lamaran, dalam seleksi, diterima), daftar lamaran terbaru, rekomendasi lowongan, progres kelengkapan profil
- **Data:** `GET /me/dashboard`
- **State:** pengguna baru yang belum melamar apa pun (empty state dengan CTA cari lowongan)

### M2 — Cari Lowongan (login)
- **Route:** `/mahasiswa/lowongan`
- Sama seperti P2, tambahan: tombol simpan aktif, penanda "sudah dilamar" di kartu, rekomendasi berdasarkan jurusan

### M3 — Form Lamaran
- **Route:** `/mahasiswa/lowongan/[slug]/lamar`
- **Komponen:** ringkasan lowongan yang dilamar, pilih CV dari dokumen tersimpan atau unggah baru, surat lamaran/motivasi (textarea dengan penghitung karakter), pertanyaan tambahan dari bisnis (jika ada), checklist kelengkapan profil, tombol kirim
- **Data:** `POST /applications`
- **State:** profil belum lengkap (blokir + arahkan ke lengkapi profil), belum unggah CV, sudah pernah melamar, lowongan keburu ditutup, konfirmasi sebelum kirim
- **Setelah kirim:** halaman/modal sukses dengan arahan ke daftar lamaran

### M4 — Lamaran Saya
- **Route:** `/mahasiswa/lamaran`
- **Komponen:** tab per status (Semua · Terkirim · Seleksi · Diterima · Ditolak), kartu/baris lamaran dengan badge status, filter tanggal, sort
- **Data:** `GET /me/applications?status=`
- **State:** kosong per tab, loading

### M5 — Detail Lamaran
- **Route:** `/mahasiswa/lamaran/[id]`
- **Komponen:** status besar di atas, timeline riwayat status (dikirim → dilihat → seleksi → hasil), detail lowongan, berkas yang dikirim, catatan/pesan dari bisnis, info kontak bisnis (muncul hanya jika diterima)
- **Data:** `GET /me/applications/:id`
- **Aksi:** batalkan lamaran (hanya jika status masih terkirim/dilihat) — dengan dialog konfirmasi

### M6 — Lowongan Tersimpan
- **Route:** `/mahasiswa/tersimpan`
- **Komponen:** grid kartu lowongan, tombol hapus dari simpanan, penanda jika lowongan sudah ditutup
- **State:** kosong

### M7 — Profil Saya
- **Route:** `/mahasiswa/profil`
- **Komponen:** tab atau section — foto profil, data diri, pendidikan (institusi, jurusan, semester, IPK), keahlian (tag input), pengalaman (list yang bisa ditambah/hapus), portofolio/link, bio
- **Data:** `GET /me`, `PATCH /me`
- **State:** mode baca vs mode edit, indikator persentase kelengkapan, autosave atau tombol simpan dengan peringatan perubahan belum disimpan

### M8 — Dokumen & CV
- **Route:** `/mahasiswa/dokumen`
- **Komponen:** daftar dokumen terunggah (nama, tipe, ukuran, tanggal), tombol unggah dengan drag-and-drop, preview PDF, tandai sebagai CV utama, hapus
- **State:** kosong, sedang unggah (progress bar), format tidak didukung, melebihi kuota

### M9 — Status Verifikasi
- **Route:** `/mahasiswa/verifikasi`
- **Komponen:** status besar dengan penjelasan, preview KTM yang diunggah, alasan penolakan (jika ditolak) + tombol unggah ulang, estimasi waktu review
- **State:** belum diajukan, menunggu, terverifikasi, ditolak

### M10 — Notifikasi
- **Route:** `/mahasiswa/notifikasi` + dropdown di navbar
- **Komponen:** daftar notifikasi dengan ikon per jenis, penanda belum dibaca, tandai semua dibaca, filter jenis
- **Jenis notifikasi:** lamaran dilihat, masuk seleksi, diterima, ditolak, verifikasi disetujui/ditolak, lowongan baru sesuai minat

### M11 — Pengaturan Akun
- **Route:** `/mahasiswa/pengaturan`
- **Komponen:** ubah email, ubah password, preferensi notifikasi (toggle per jenis), bahasa, hapus akun (zona berbahaya, dengan konfirmasi ketik ulang)

---

# 7. HALAMAN PEMILIK BISNIS

### B1 — Dashboard
- **Route:** `/bisnis`
- **Tujuan:** melihat kondisi rekrutmen sekilas dan langsung menindak pelamar baru
- **Komponen:** banner status verifikasi, kartu statistik (lowongan aktif, total pelamar, pelamar baru belum dilihat, diterima bulan ini), grafik pelamar per minggu, daftar pelamar terbaru dengan aksi cepat, lowongan yang akan kedaluwarsa
- **Data:** `GET /business/dashboard`
- **State:** belum punya lowongan (empty state dengan CTA buat lowongan), belum terverifikasi (fitur terkunci)

### B2 — Kelola Lowongan
- **Route:** `/bisnis/lowongan`
- **Komponen:** tabel/daftar dengan kolom (judul, status, jumlah pelamar, tanggal posting, deadline), tab per status, filter, search, aksi baris (lihat pelamar, edit, duplikat, tutup, hapus), tombol buat lowongan
- **Data:** `GET /business/jobs?status=`
- **State:** kosong, loading, konfirmasi hapus/tutup

### B3 — Buat / Edit Lowongan
- **Route:** `/bisnis/lowongan/baru`, `/bisnis/lowongan/[id]/edit`
- **Komponen:** form panjang bersection — informasi dasar (judul, kategori, tipe kerja, lokasi/remote), deskripsi (rich text), kualifikasi, jumlah posisi, rentang gaji (atau "nego"), jadwal & durasi, deadline lamaran, pertanyaan tambahan untuk pelamar (opsional, dinamis), preview
- **Data:** `POST /business/jobs`, `PATCH /business/jobs/:id`
- **State:** simpan draft, validasi per section, preview sebagai mahasiswa, peringatan meninggalkan halaman, kuota posting habis (arahkan ke B8)
- **Aksi:** Simpan draft · Ajukan untuk tayang

### B4 — Detail Lowongan (sisi bisnis)
- **Route:** `/bisnis/lowongan/[id]`
- **Komponen:** ringkasan lowongan, statistik (dilihat, dilamar, konversi), status moderasi + alasan penolakan admin jika ada, tombol ke daftar pelamar
- **Aksi:** edit · duplikat · tutup lebih awal · perpanjang

### B5 — Daftar Pelamar
- **Route:** `/bisnis/lowongan/[id]/pelamar`
- **Tujuan:** halaman kerja utama pemilik bisnis — harus efisien untuk menyaring banyak orang
- **Komponen:** tabel pelamar (foto, nama, institusi, jurusan, semester, tanggal melamar, status), tab per status, filter (institusi, jurusan), sort, pencarian nama, checkbox untuk aksi massal, panel preview di sisi kanan saat baris diklik
- **Data:** `GET /business/jobs/:id/applications?status=`
- **State:** belum ada pelamar, loading, aksi massal terpilih (toolbar muncul)
- **Aksi:** shortlist · terima · tolak · unduh CV · aksi massal

### B6 — Detail Pelamar
- **Route:** `/bisnis/pelamar/[id]`
- **Komponen:** header profil (foto, nama, badge terverifikasi, kontak — disembunyikan sampai status diterima), data pendidikan, keahlian, pengalaman, surat lamaran, preview CV (embed PDF), jawaban pertanyaan tambahan, timeline status, kotak catatan internal
- **Data:** `GET /business/applications/:id`
- **Aksi:** Terima · Tolak · Masukkan seleksi · Kirim pesan/catatan — semuanya dengan dialog konfirmasi dan opsi menulis pesan ke pelamar
- **State:** sudah diproses (aksi jadi read-only dengan riwayat keputusan)

### B7 — Semua Pelamar (lintas lowongan)
- **Route:** `/bisnis/pelamar`
- **Komponen:** sama seperti B5 tapi dengan kolom tambahan "melamar untuk", filter per lowongan

### B8 — Profil Bisnis
- **Route:** `/bisnis/profil`
- **Komponen:** logo & cover, nama, kategori, deskripsi, alamat + peta, kontak, jam operasional, galeri foto, dokumen legalitas + status verifikasinya, tombol lihat sebagai publik
- **Data:** `GET /business/me`, `PATCH /business/me`
- **State:** perubahan data penting memicu review ulang admin (beri peringatan jelas)

### B9 — Paket & Pembayaran
- **Route:** `/bisnis/paket`, `/bisnis/paket/bayar/[id]`
- **Komponen:** kartu perbandingan paket, sisa kuota posting saat ini, halaman pembayaran menampilkan QR + nominal + hitung mundur + instruksi langkah demi langkah, tombol "saya sudah bayar"
- **State:** menunggu pembayaran (polling status setiap beberapa detik), QR kedaluwarsa (tombol buat ulang), berhasil, gagal, upload bukti manual jika dipakai
- **Catatan desain:** QR harus besar dan mudah dipindai, nominal jelas, ada tombol salin nominal

### B10 — Riwayat Transaksi
- **Route:** `/bisnis/transaksi`
- **Komponen:** tabel (tanggal, paket, nominal, status, invoice), unduh bukti, filter tanggal
- **State:** kosong

### B11 — Notifikasi
- **Route:** `/bisnis/notifikasi`
- **Jenis:** pelamar baru, lowongan disetujui/ditolak admin, lowongan akan kedaluwarsa, verifikasi bisnis disetujui/ditolak, pembayaran berhasil

### B12 — Pengaturan Akun
- **Route:** `/bisnis/pengaturan`
- **Komponen:** ubah email/password, preferensi notifikasi, (opsional) kelola anggota tim dengan peran, hapus akun

---

# 8. HALAMAN ADMIN

Layout admin sebaiknya berbeda dari sisi publik: sidebar tetap, tabel padat, aksi cepat. Prioritaskan kepadatan informasi di atas keindahan.

### A1 — Dashboard Admin
- **Route:** `/admin`
- **Komponen:** kartu statistik (total mahasiswa, bisnis, lowongan aktif, lamaran hari ini), antrean yang butuh tindakan (verifikasi menunggu, lowongan menunggu moderasi, laporan baru) sebagai daftar yang bisa langsung diklik, grafik pertumbuhan pengguna, aktivitas terbaru

### A2 — Antrean Verifikasi Mahasiswa
- **Route:** `/admin/verifikasi/mahasiswa`
- **Komponen:** daftar pengajuan, panel split — kiri daftar, kanan preview KTM ukuran besar + data yang diisi pengguna untuk dicocokkan, tombol Setujui / Tolak dengan alasan (dropdown alasan umum + catatan bebas)
- **State:** antrean kosong, memuat gambar, zoom/rotate gambar KTM
- **Efisiensi:** setelah menyetujui, otomatis lanjut ke pengajuan berikutnya; dukung pintasan keyboard

### A3 — Antrean Verifikasi Bisnis
- **Route:** `/admin/verifikasi/bisnis`
- Sama seperti A2, dengan preview dokumen legalitas dan data bisnis

### A4 — Moderasi Lowongan
- **Route:** `/admin/moderasi/lowongan`
- **Komponen:** daftar lowongan menunggu review, preview isi lowongan, penanda otomatis (kata terlarang, gaji tidak wajar, duplikat), tombol Setujui / Tolak dengan alasan
- **State:** kosong

### A5 — Manajemen Mahasiswa
- **Route:** `/admin/pengguna/mahasiswa`
- **Komponen:** tabel (nama, email, institusi, status verifikasi, jumlah lamaran, tanggal daftar), filter status & institusi, pencarian, ekspor CSV, aksi (lihat detail, suspend, aktifkan, reset password)

### A6 — Manajemen Bisnis
- **Route:** `/admin/pengguna/bisnis`
- **Komponen:** tabel (nama bisnis, kategori, status, jumlah lowongan, paket aktif, tanggal daftar), filter, aksi serupa A5

### A7 — Detail Pengguna
- **Route:** `/admin/pengguna/[id]`
- **Komponen:** seluruh data profil, riwayat aktivitas, riwayat verifikasi, riwayat transaksi (untuk bisnis), catatan internal admin, aksi administratif
- **State:** akun disuspend (banner merah di atas)

### A8 — Manajemen Lowongan
- **Route:** `/admin/lowongan`
- **Komponen:** semua lowongan lintas status, filter, aksi turunkan/hapus dengan alasan

### A9 — Laporan & Aduan
- **Route:** `/admin/laporan`
- **Komponen:** daftar laporan dari pengguna (konten dilaporkan, pelapor, alasan, tanggal), detail laporan, aksi tindak lanjut, status ditangani/diabaikan

### A10 — Transaksi
- **Route:** `/admin/transaksi`
- **Komponen:** tabel semua transaksi QRIS, filter status & tanggal, total pendapatan, antrean konfirmasi manual (jika bukti diunggah), rekonsiliasi

### A11 — Master Data
- **Route:** `/admin/master`
- **Komponen:** CRUD sederhana untuk kategori lowongan, kategori bisnis, daftar institusi, jurusan, keahlian, lokasi — pakai tabel + modal form

### A12 — Log Aktivitas
- **Route:** `/admin/log`
- **Komponen:** tabel audit (waktu, aktor, aksi, target, IP), filter, pencarian

### A13 — Pengaturan Sistem
- **Route:** `/admin/pengaturan`
- **Komponen:** aktif/nonaktifkan moderasi lowongan, durasi tayang default, batas ukuran file, template email, kelola akun admin, mode maintenance

### A14 — Pengumuman
- **Route:** `/admin/pengumuman`
- **Komponen:** buat broadcast ke segmen pengguna, preview, jadwalkan, riwayat pengumuman

---

# 9. Komponen Bersama

Komponen ini muncul di banyak halaman dan sebaiknya dibuat lebih dulu sebagai bagian dari design system:

- **Navbar publik** — logo, menu, tombol login/daftar; versi mobile dengan drawer
- **Navbar terautentikasi** — search, lonceng notifikasi dengan badge, avatar dropdown
- **Sidebar dashboard** — berbeda isi untuk mahasiswa / bisnis / admin, bisa dilipat
- **Kartu lowongan** — dipakai di minimal 6 halaman, harus punya varian: grid, list, compact
- **Badge status** — satu komponen dengan varian warna untuk semua status di bagian 3
- **Tabel data** — sortable, paginasi, pilih baris, kolom aksi, versi mobile jadi kartu
- **Empty state** — ilustrasi + pesan + CTA
- **Skeleton loader** — untuk kartu, tabel, dan detail
- **Dialog konfirmasi** — varian normal dan destruktif
- **Toast notifikasi** — sukses, error, info
- **Upload file** — drag-and-drop, progress, preview, validasi
- **Filter panel** — sidebar di desktop, bottom sheet di mobile
- **Timeline status** — dipakai di detail lamaran dan detail pelamar
- **Banner verifikasi** — muncul di seluruh area terautentikasi bila belum terverifikasi

---

# 10. Prioritas Pengerjaan

Urutan yang saya sarankan saat menggenerate di Claude Design:

1. **Design system dulu** — warna, tipografi, spacing, lalu komponen bersama di bagian 9
2. **Alur inti mahasiswa** — P2 → P3 → M3 → M4 → M5
3. **Alur inti bisnis** — B3 → B5 → B6
4. **Autentikasi & registrasi** — P5–P10
5. **Dashboard** — M1, B1
6. **Admin** — A1–A4 lebih dulu (yang paling sering dipakai), sisanya belakangan
7. **Halaman pendukung** — profil, pengaturan, statis, error

Jangan generate semua halaman sekaligus. Satu halaman per sesi, dengan konteks design system yang sudah jadi, hasilnya jauh lebih konsisten.

---

# 11. Yang Masih Perlu Dikonfirmasi

- [ ] Siapa yang membayar QRIS dan untuk apa (paket posting? fitur unggulan? lainnya)
- [ ] Apakah moderasi lowongan oleh admin memang ada, atau lowongan langsung tayang
- [ ] Apakah ada fitur chat/pesan langsung antara bisnis dan pelamar
- [ ] Apakah verifikasi mahasiswa lewat KTM manual, atau ada integrasi kampus
- [ ] Apakah satu akun bisnis bisa punya banyak pengguna (tim)
- [ ] Apakah ada rating/review dua arah setelah kerja selesai
- [ ] Bahasa: Indonesia saja atau perlu dwibahasa
