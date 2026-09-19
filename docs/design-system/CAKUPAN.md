# Cakupan halaman terhadap PAGES_AND_FLOWS.md

Sumber: `uploads/PAGES_AND_FLOWS.md` (387 baris, diberikan pengguna 02 Sep 2026).
Total layar: **54 unik** di empat UI kit — mahasiswa 16, bisnis 16, admin 15, publik 11.
Empat layar escrow (`chat`, `kontrak`, `dompet`, `sengketa`) dihitung **sekali**
karena satu implementasi di `ui_kits/shared/` dipakai kedua peran lewat prop
`peran`; kalau dihitung per-peran totalnya 58.

## Keputusan model produk (06 Sep 2026)

**Kedua model diterapkan penuh. Escrow adalah fitur krusial, bukan fase berikutnya.**

Platform ini memegang uang orang lain, jadi escrow menentukan apakah produk ini
dipercaya atau tidak. Konsekuensinya untuk desain: setiap layar yang menyangkut
dana wajib menjawab **siapa memegang uangnya sekarang** tanpa pengguna perlu
mengklik apa pun. Itu sebabnya `Money` punya `tone="held"` tersendiri,
`ContractStepper` menampilkan keenam tahap sekaligus (bukan hanya tahap aktif),
dan status escrow punya keluarga warnanya sendiri di `StatusBadge`.

| Bagian | Peran |
|---|---|
| Job board | Cara orang bertemu: lowongan → moderasi → lamaran → seleksi → diterima |
| Escrow | Cara uang berpindah setelah bertemu: kontrak → dana ditahan → serah terima → dana dilepas → ulasan |

Keduanya satu produk, bukan dua alternatif. Job board berhenti di "diterima";
dari titik itu escrow mengambil alih.

**KOREKSI MODEL PEMASUKAN (07 Sep 2026).** `PAGES_AND_FLOWS.md` menyebut paket
posting berbayar dengan QRIS. Itu **salah** dan sudah dibuang dari seluruh sistem.
Pemasukan StairsLife hanya satu: **komisi 5% dari nilai kontrak, dipotong sekali
saat dana dilepas dari escrow ke mahasiswa.** Platform tidak dapat apa pun sampai
pekerjaan benar-benar selesai dan dibayar.

Konsekuensinya di desain:

- Tidak ada paket, slot, langganan, atau QRIS di mana pun.
- Bisnis memposting lowongan sebanyak yang dibutuhkan, tanpa biaya.
- B9 berubah dari "Paket & pembayaran" menjadi **"Biaya layanan"** — menjelaskan
  biaya, bukan menagihnya.
- B10 berubah dari riwayat pembelian paket menjadi **riwayat pembayaran escrow**
  dengan kolom komisi per kontrak.
- A10 berubah dari transaksi QRIS menjadi **arus dana & komisi**: nilai kontrak,
  komisi 5%, dan status escrow per baris.
- Bagian "Biaya" di landing menampilkan rincian satu kontrak
  (Rp 2.500.000 → biaya Rp 125.000 → mahasiswa terima Rp 2.375.000), bukan kartu paket.
- Komponen `PricingPlans` **dihapus** — ia mengkodekan model bisnis yang salah,
  dan membiarkannya berarti orang lain akan memakainya.
- Kontrak yang dibatalkan atau masih dalam sengketa tidak menghasilkan komisi.

**Tidak ada profil publik vs privat.** Semua bisnis mempublikasikan lowongannya
secara terbuka — itu dasar platformnya. Karena itu tidak ada halaman profil
"publik" terpisah dan tidak ada sakelar privasi untuk bisnis; yang ada hanya
satu profil bisnis, dan isinya memang bisa dilihat siapa saja.

**Chat, ulasan, dan notifikasi real-time dikonfirmasi masuk** (§11 menandainya
"perlu dikonfirmasi"):

| Fitur | Di mana |
|---|---|
| Chat mahasiswa ↔ bisnis | `ui_kits/shared/ChatUlasan.jsx` → `ChatJobBoard`. Rute "Pesan" di kit mahasiswa dan bisnis. **Percakapan hanya terbuka setelah lamaran diterima** |
| Ulasan dua arah | `UlasanDuaArah` di M5 dan B6, muncul saat status `diterima`. Keduanya terbit bersamaan setelah kedua pihak mengirim atau 14 hari berlalu |
| Notifikasi real-time | `NotificationCenter` — lonceng + panel di topbar keempat shell |

`StatusBadge` memuat kelima keluarga status karena kedua bagian produk aktif.

## Escrow — status penuh (06 Sep 2026)

Ketiga lubang yang tercatat sebelumnya sudah ditutup:

| | Layar | Berkas |
|---|---|---|
| E1 | Kontrak & escrow (stepper 6 tahap) | `ui_kits/student/ScreenKontrak.jsx` |
| E2 | Dompet + **mutasi yang bisa diaudit** | `ui_kits/student/ScreenDompet.jsx` |
| E3 | **Sengketa sisi pengguna** | `ui_kits/student/ScreenSengketa.jsx` |
| E4 | **Panel sengketa admin (A15)** | `ui_kits/admin/AdminSengketa.jsx` |

**E3 — sengketa sisi pengguna.** Menjawab satu pertanyaan yang paling menentukan
kepercayaan: uang saya sekarang di mana, dan kapan diputus. Banner atas menyebut
nominal yang dibekukan plus sisa jam SLA; stepper lima tahap; kronologi yang
menggabungkan pesan kedua pihak dengan catatan sistem dan admin; bukti kedua
pihak berdampingan (pengguna bisa melihat bukti lawan supaya bisa menanggapi);
tiga kemungkinan putusan ditulis eksplisit dengan nominalnya. Pengaju bisa
menarik sengketa kalau sudah sepakat di luar.

**E4 — panel sengketa admin (A15).** Terpisah dari A9 dengan alasan tegas:
A9 memutus **konten** (lowongan, akun), A15 memutus **uang**. Layar sendiri
karena butuh bukti kedua pihak berdampingan, riwayat dana kontrak dengan saldo
berjalan, dan tiga pilihan putusan bernominal — termasuk pembagian sebagian
dengan sisa yang dihitung otomatis. Dasar putusan wajib minimal 20 karakter
karena teks itu dikirim ke kedua pihak dan masuk log audit permanen.

**E2 — mutasi dompet yang bisa diaudit.** Setiap baris memuat nomor mutasi,
nomor referensi kontrak/penarikan, waktu sampai jam-menit, dan **dua kolom saldo
berjalan**: saldo tersedia dan dana di escrow, keduanya menunjukkan posisi
*setelah* baris itu terjadi. Tanpa saldo berjalan, selisih tidak bisa dilacak dan
pengguna hanya bisa menebak. Baris bisa diklik untuk melihat nomor referensi bank.

Baris yang tidak menggerakkan uang (dana ditahan, dana dibekukan) ditandai
"tidak bergerak" alih-alih Rp 0 — nol rupiah membaca seperti transaksi gagal.

## Yang sengaja tidak dibangun
- **P4 halaman profil bisnis publik penuh** — tidak ada publik/privat di platform
  ini; semua bisnis mempublikasikan lowongan secara terbuka, dan informasinya
  sudah ada sebagai tab di detail lowongan.
- **Slot gambar** memakai `MediaSlot` (ikon besar + keterangan), bukan gambar
  asli. Tidak ada aset gambar di sumber desain.
## Pola 21st.dev yang dinilai (06 Sep 2026)

Pengguna mengirim sepuluh pola komponen dari 21st.dev. Ukuran penilaiannya satu:
landing boleh ekspresif, tapi dashboard dan escrow harus mudah dipindai.

**Diambil — tiga, semuanya untuk permukaan marketing.** Ditulis ulang dengan token
sistem ini, bukan disalin: aslinya memakai Tailwind + framer-motion dan membawa
palet, radius, serta efek glow sendiri.

| Pola | Jadi | Yang dibuang |
|---|---|---|
| How It Works | `HowItWorks` — bagian "Cara kerja" di landing, 4 tahap escrow | Efek glow; diganti bilah kemajuan |
| Pricing | `PricingPlans` — bagian "Biaya" di landing + B9 | Confetti, angka beranimasi, toggle bulanan/tahunan (StairsLife tidak punya siklus tahunan) |
| Feature Carousel | `FeatureCarousel` — bagian "Bidang pekerjaan" di landing | Kartu 3D bertumpuk; kartu di belakang menyembunyikan isi |

**Ditolak — tujuh:**

- **Global Pulse (globe 3D)** — StairsLife itu Malang, bukan global. Globe dengan
  marker London/New York/Tokyo menceritakan hal yang salah tentang produk ini.
- **Circular Gallery** dan **Coverflow Carousel** — galeri 3D berputar. Portofolio
  perlu dipindai sekaligus, dan memilih pelamar tidak boleh menyembunyikan
  kandidat di balik putaran. Coverflow memang dirancang menyembunyikan item.
- **Container Scroll Animation** — hero dengan kartu miring yang tegak saat scroll.
  Persis jenis set-piece yang brief awal minta dihindari, dan scroll-driven 3D
  berat di HP kelas menengah — audiens utama produk ini.
- **Tubelight Navbar** — nav dengan glow neon. Sistem ini tidak punya glow sama
  sekali, dan bottom nav sudah punya polanya sendiri.
- **Location Tag** — bentuknya pill 999px. Pill adalah pengecualian yang hanya
  diberikan ke `SearchField`, karena bentuk melingkar itu bagian dari gerakannya.
- **Shimmer Text** — isi kodenya salah tempel di berkas sumber (duplikat Circular
  Gallery). Konsepnya pun sudah ada: `Skeleton` memakai shimmer.
