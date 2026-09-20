# DECISIONS.md

Satu baris alasan untuk setiap keputusan visual besar. Arah desainnya ada di
`DESIGN.md`. Berkas ini menjawab "kenapa", bukan "apa".

## Arah V2 dengan palet logo (15 September 2026)

Bagian ini **menggantikan** baris-baris lama di bawahnya yang bertentangan
(Bricolage Grotesque dan Archivo, kartu tanpa shadow, larangan gradien, kaca,
aurora, dan spring, serta rujukan aturan antislop). Baris lama dibiarkan sebagai
riwayat.

| Keputusan | Alasan |
|---|---|
| Plugin antislop dilepas dari proyek dan dari `CLAUDE.md` | Keputusan pemilik produk: aturannya mengunci tampilan ke gaya datar yang dinilai terasa mati dibanding V2 |
| Gaya visual mengikuti FE V2 (aurora, kaca, bento, badge pil, sheen, spring) | Pemilik produk memilih V2 sebagai acuan tampilan karena lebih hidup dan sudah dikenal pengguna |
| Violet V2 diganti terakota `--brand` dan kilau `--spark` | Warna logo kayu dan terakota adalah identitas yang dipertahankan; violet adalah warna brand lama |
| Latar aurora memakai tinta kayu `#1A120D` dengan cahaya terakota | Padanan langsung aurora navy-violet V2 dalam palet logo, dan warnanya sama di kedua tema |
| Schibsted Grotesk 800 untuk judul, Manrope untuk teks | Mengikuti V2 atas pilihan pemilik produk; keduanya lewat `next/font` sehingga tetap ter-self-host |
| Kartu memakai `--shadow-card` dan terangkat saat hover | Bentuk kartu V2; bayangan lembut hangat `rgba(40,24,14,…)` supaya tidak kotor di atas pasir |
| Kolom input 48px, garis 1.5px, fokus garis brand plus cincin glow | Bentuk input V2. Lapisan garis brand 1px di dalam cincin menjaga indikator fokus tetap di atas 3:1, karena glow sendirian terlalu pucat |
| Tombol mendapat varian `white`, `outlineWhite`, dan ukuran `xl`; aturan kepatuhan di `.oxlintrc.json` diperluas | Tombol di atas aurora butuh isian putih; aturan lama hanya mengenal empat varian design system V3 |
| Nominal besar berhuruf display memakai `proportional-nums` | Digit tabular Schibsted membuat `Rp 71.000` terbaca `Rp 71 . 000` |
| Kartu sapaan aurora di beranda mahasiswa dan bisnis | Pengganti "dash-greeting" V2 yang membawa satu aksi utama, jadi tombol yang sama di topbar dihapus di beranda bisnis |
| Panel "siapa memegang uangnya sekarang" jadi panel aurora | Pertanyaan paling menentukan di produk ini tetap jadi titik fokus pertama halaman kontrak |
| Testimoni dan angka pengguna dari V2 tetap tidak dipakai | Belum ada pengguna nyata; panel auth menampilkan alur satu kontrak yang benar-benar terjadi, bukan kutipan karangan |
| Nav publik: Cara Kerja, Fitur, Tentang Kami (tanpa Biaya) | Permintaan pemilik produk; informasi komisi 5 persen tetap tampil di hero, pita statistik, dan halaman daftar bisnis |

## Dwibahasa (15 September 2026)

| Keputusan | Alasan |
|---|---|
| Indonesia bawaan, Inggris opsional | Pengguna utama mahasiswa dan UMKM Indonesia |
| Bahasa disimpan di cookie `sl-bahasa`, bukan localStorage atau segmen URL | Server perlu tahu bahasanya saat merender halaman publik supaya tidak ada kedipan, dan rute yang dipatok backend (`/verify-email`, `/payment/result`) tidak perlu diubah |
| Kamus per area, kamus Inggris bertipe `typeof` kamus Indonesia | Kunci yang lupa diterjemahkan menggagalkan `tsc`, bukan muncul sebagai teks kosong di produksi |
| Pengganti bahasa dua tombol lebar tetap; kolom nav header lebar tetap; tombol header punya lebar minimum | Posisi komponen tidak boleh bergeser saat bahasa berganti. Diukur: pusat tautan nav 331 / 456,5 / 582,5 px di kedua bahasa |
| Rupiah tetap `Rp 2.500.000` di bahasa Inggris | Mata uangnya rupiah; mengganti pemisah ribuan ke koma membuat nominal yang sama terbaca berbeda dengan nota dan tagihan Xendit |
| Pesan dari backend tidak diterjemahkan | Pesan itu dibuat server; pesan buatan klien (jaringan, 5xx, akun dibekukan) ikut bahasa aktif |
| Rute `/kit` 404 di build produksi | Halaman internal pemeriksa komponen, bukan untuk pengguna, jadi teksnya sengaja tidak masuk kamus |

## Admin, akun, dan navigasi (15 September 2026)

| Keputusan | Alasan |
|---|---|
| Panel admin memakai shell aplikasi yang sama dengan mahasiswa dan bisnis | Satu pola navigasi untuk semua peran; perbedaannya hanya isi sidebar dan bottom nav |
| Setiap aksi admin yang memindahkan uang atau mengubah status akun lewat modal konfirmasi | Memproses penarikan, memutus sengketa, dan membekukan akun tidak bisa ditarik kembali dari frontend |
| Grafik tren admin berupa batang satu seri dengan tabel di `<details>` | Satu ukuran per grafik, jadi tidak perlu legenda; tabel memberi jalan bagi pembaca layar dan untuk angka persis |
| Keluar menampilkan layar penutup minimal 700ms | Tanpa jeda, halaman terautentikasi sempat berkedip kosong atau melempar ke `/masuk` sebelum sampai di beranda |
| Ubah profil hanya mengirim kolom yang berubah | Backend memakai `forbidNonWhitelisted`, dan mengirim ulang semua kolom berisiko menimpa nilai dengan string kosong |
| Filter dan halaman daftar disimpan di query URL dengan `replaceState` | Back dari detail kembali ke tab yang sama, tanpa membuat satu entri riwayat per klik tab |
| Posisi gulir dikelola sendiri, termasuk kontainer di dalam shell | Browser hanya mengingat gulir jendela, dan pemulihan bawaannya berjalan sebelum halaman tujuan selesai dirender |
| Halaman masuk dan daftar mengalihkan pengguna yang sudah masuk | Back setelah login tidak boleh menampilkan formulir yang sudah tidak berlaku |
| Ikon seksi Nilai digambar ulang sebagai SVG, bukan PNG Icons8 | PNG 48px lembek saat diperbesar, dan lisensi gratisnya mewajibkan tautan atribusi |
| Titik hijau badge dan chip fakta di hero dihapus | Permintaan pemilik produk; hero lebih bersih dan informasi komisi tetap ada di pita statistik |

## Perbaikan audit (15 September 2026)

| Keputusan | Alasan |
|---|---|
| Sesi refresh disimpan di `verification_tokens` dengan tipe `refresh_session` | Pemilik produk tidak mengizinkan perubahan skema; tabel itu sudah punya hash, kedaluwarsa, dan `used_at` yang dibutuhkan pencabutan |
| Refresh token sekali pakai, tanpa mencabut semua sesi saat token lama dipakai ulang | Dua tab yang me-refresh bersamaan akan terbaca sebagai pencurian dan mengeluarkan pengguna; frontend membaca token yang sudah diperbarui tab lain sebagai gantinya |
| Kode galat ditentukan di satu filter, dari kode eksplisit atau pola pesan | Ratusan `throw` di service tidak perlu disentuh; pesan baru tanpa kode tetap aman karena jatuh ke kode per status |
| Kata sandi salah dibalas 400, bukan 401 | Frontend menganggap 401 sebagai token kedaluwarsa dan akan me-refresh lalu mengulang permintaan |
| Admin tanpa peran = akses penuh; anggota peran dicocokkan dengan id atau email | Semua admin yang ada belum tercantum di peran mana pun (data lama menyimpan nama tampilan); akses ditutup berarti panel mati untuk semua |
| Komisi dan batas tarik tidak pernah ditebak di layar | Angka uang yang salah lebih merusak daripada kalimat tanpa angka; bila pengaturan tidak terbaca, layar menulis itu |
| Chat dan notifikasi memakai polling REST | Endpoint REST backend sudah menandai dibaca dan memancarkan event; polling tidak menambah koneksi terbuka dan aturan CSP untuk socket |
| Satu layout `(aplikasi)` untuk semua halaman berakun, judul lewat portal ke topbar | Shell yang dipasang per halaman membongkar sidebar dan posisi gulir di setiap klik; portal membuat halaman tetap menentukan judul dan aksinya sendiri |
| Aksi halaman dirender dua kali (topbar dan atas isi), satu disembunyikan per lebar layar | Di 375px topbar hanya muat menu, logo, judul, dan lonceng |
| Cache `useAsync` per pengguna, dibuang saat sesi berganti, tidak dipakai untuk saldo | Daftar boleh tampil sebentar sebelum diperbarui; saldo yang berubah setelah tampil membingungkan |
| CSP `style-src 'unsafe-inline'` tanpa nonce | Komponen memakai atribut style untuk variabel CSS; nonce tidak berlaku untuk atribut, dan risiko gaya inline jauh di bawah skrip |
| Pemilih tanggal buatan sendiri, bukan `<input type="date">` | Input bawaan menampilkan format bahasa browser, bukan bahasa antarmuka, dan berbeda di setiap browser |
| Hapus akun = anonimkan, bukan hapus baris | Kontrak, pembayaran, ulasan, dan penarikan merujuk ke pengguna dan wajib disimpan sebagai catatan transaksi |
| Selama sengketa aktif, approve, reject, dan release escrow ditolak backend | Dana hanya boleh bergerak lewat putusan admin; mengunci tombol di frontend saja tidak cukup |
| Pihak lawan boleh membuka berkas bukti sengketa | Pihak yang dituduh berhak melihat bukti yang dipakai untuk memutus dananya |
| Uji E2E memakai API tiruan | Database uji dipakai bersama; uji yang membuat kontrak, sengketa, atau penarikan sungguhan tidak bisa diulang tanpa mengotori data dan menyentuh Xendit |

## Ikon Icons8 pilihan pemilik produk (15 September 2026)

| Keputusan | Alasan |
|---|---|
| Enam PNG Icons8 (verified, lock, contract, comment, level, wallet) dipakai lewat komponen `Icon` sebagai mask CSS berwarna `currentColor` | Ikut warna status dan tema gelap seperti ikon Lucide; PNG hitam yang ditempel apa adanya hilang di latar gelap |
| BadgeCheck, Lock, Wallet, MessageSquare otomatis memakai PNG di seluruh aplikasi; kontrak dan tingkat dipanggil eksplisit (`Kontrak`, `Level`) | FileText juga berarti berkas dan Star juga berarti rating; mengganti keduanya secara global memberi makna yang salah |
| Batas ukuran per ikon, di luar batas jatuh ke padanan Lucide | Sumbernya bitmap 30 sampai 64px. Simulasi di layar 2x: kontrak buram di atas 24px, komentar dan level tidak terbaca di bawah 20px, dompet terlalu tipis di bawah 16px |
| Tautan "Sebagian ikon oleh Icons8" di footer publik | Syarat lisensi gratis Icons8 |
| Karena BadgeCheck otomatis menjadi lencana terverifikasi, ikon itu tidak dipakai untuk makna lain (jurusan memakai BookOpen, keahlian proyek memakai ListChecks) | Lencana terisi di samping "Jurusan" terbaca sebagai status verifikasi, padahal bukan |

## Layar proses masuk (15 September 2026)

| Keputusan | Alasan |
|---|---|
| Masuk dan daftar memakai layar penuh berputar yang sama dengan layar keluar (`LayarProses`) | Satu bahasa visual untuk perpindahan sesi; spinner di tombol saja terlalu kecil untuk jeda pemeriksaan kata sandi di jaringan lambat |
| Layar "Memeriksa akunmu" baru muncul setelah 350 ms; sebelum itu cukup spinner di tombol | Permintaan cepat tidak berkedip menampilkan layar penuh sepersekian detik |
| Setelah berhasil, layar tetap tampil sampai halaman tujuan menggantikan formulir, dan penanda `tandaiMasuk` menahan pengalih "sudah masuk" | Tanpa penanda, pengalih di halaman auth balapan dengan formulir dan membuang tujuan `?lanjut=` |
| Saat "kurangi gerak" aktif, spinner tetap berputar pelan | Spinner adalah tanda proses berjalan, bukan hiasan; menghentikannya membuat halaman tampak macet |

## Ketahanan dan kabar ke pengguna (17 September 2026)

| Keputusan | Alasan |
|---|---|
| Unggahan ikut alur pembaruan token, dan batas ukurannya diperiksa di klien | Unggahan terjadi di ujung formulir panjang; ditolak di sana berarti pekerjaan yang sudah diketik ikut hilang |
| Batas waktu permintaan 25 detik, unggahan 5 menit | Backend yang menggantung lebih sering daripada yang menolak, dan tanpa batas waktu kerangka pemuatan berputar selamanya |
| Kegagalan jaringan diterjemahkan di klien API, bukan di tiap halaman | Tanpa itu pesan "Failed to fetch" dari browser sampai ke layar apa adanya dalam bahasa Inggris |
| Bentuk respons dinormalkan di lapisan api, ditambah batas galat per seksi | Backend masih berubah; satu bidang hilang seharusnya mengosongkan satu kartu, bukan menjatuhkan seluruh rute |
| Judul tab lewat `generateMetadata` per rute, bukan `document.title` di komponen | Metadata Next menimpa judul yang disetel dari klien, jadi cara itu kalah balapan |
| Portofolio menampilkan riwayat dan ulasan, tanpa penghasilan dan tanpa tautan berkas | Angka pendapatan orang lain bukan urusan calon pemberi kerja, dan berkas hasil kerja milik klien sebelumnya |

## Halaman cari proyek (18 September 2026)

| Keputusan | Alasan |
|---|---|
| Dua rute: `/proyek` publik untuk tamu dan mesin pencari, `/mahasiswa/cari` di dalam shell untuk yang sudah masuk | Endpoint proyek memang tanpa guard sehingga halamannya bisa diindeks, tapi pengguna yang sudah masuk tidak boleh dilempar keluar aplikasi lengkap dengan footer publik hanya untuk mencari proyek |
| Isi detail proyek satu komponen dipakai kedua rute | Brief yang menentukan keputusan melamar tidak boleh berbeda antara versi publik dan versi aplikasi |
| Kepala halaman ringkas, bukan hero | Isi halaman ini adalah daftarnya; hero setinggi sepertiga layar menunda hal yang justru dicari orang |
| Saringan jadi bilah mendatar dengan chip, bukan panel di kolom kiri | Kolom kiri memakan lebar yang seharusnya jadi kartu, dan tiga saringan tidak butuh panel sendiri |
| Chip kategori diambil dari kategori yang ada di data | Kategori backend adalah teks bebas, jadi daftar tetap akan menawarkan saringan yang hasilnya kosong |

## Penanda proyek dan tingkat (18 September 2026)

| Keputusan | Alasan |
|---|---|
| Kategori proyek ditahan; penanda yang dipakai hanya tingkat | Kategori berupa teks bebas per proyek, jadi penandanya tidak konsisten antar proyek dan menyaring dengannya sering mengembalikan hasil yang tidak diharapkan. Ditahan sampai ada daftar kategori yang benar-benar dikelola |
| Frontend tetap mengirim `category: "umum"` saat memasang proyek | Kolomnya masih wajib di backend. Mengubahnya butuh perubahan skema, dan itu di luar batas yang disepakati |
| Logo di shell aplikasi bukan tautan | Di dalam aplikasi, keluar hanya lewat tombol keluar; logo yang bisa ditekan membawa orang ke halaman pemasaran dan terasa seperti kehilangan sesi |
| Tamu diajak mendaftar lebih dulu di detail proyek, bukan disuruh masuk | Pengunjung dari mesin pencari belum tentu punya akun, dan melamar memang mensyaratkan akun mahasiswa |
| Tier naik di 3 dan 10 proyek, dan tidak pernah turun | Ambang lama praktis tidak pernah tercapai sehingga fiturnya tidak pernah terlihat; penurunan diam-diam karena satu rating buruk adalah hukuman yang tidak diumumkan |

## Batas antara aplikasi dan halaman publik (18 September 2026)

| Keputusan | Alasan |
|---|---|
| Beranda publik menutup sesi yang masih terbuka | Sesi masuk berlaku di dalam aplikasi. Satu akun yang berada di dua dunia sekaligus membuat pengguna tidak pernah yakin apakah masih masuk atau tidak |
| Halaman publik lain tidak menutup sesi | Tautan proyek sering dibagikan; membukanya bukan tanda seseorang ingin keluar dari akunnya |
| Tidak ada tombol "ke berandaku" di header publik | Jembatan kembali ke aplikasi menampilkan keadaan yang sudah tidak berlaku begitu beranda menutup sesi |
| Tombol pulang di 404 dan layar galat mengarah ke beranda peran | Salah alamat tidak boleh berujung keluar akun |
| Detail proyek bisnis memakai komponen isi yang sama dengan sisi mahasiswa | Brief yang menentukan keputusan melamar harus identik di kedua sisi; yang berbeda hanya aksinya |

## Tombol utama beranda dan panel admin (18 September 2026)

| Keputusan | Alasan |
|---|---|
| "Cari Proyek" di beranda menuju pendaftaran mahasiswa | Melamar mensyaratkan akun, jadi mengirim tamu ke daftar proyek hanya menunda langkah yang tetap harus dia ambil. Sepasang dengan "Pasang Proyek" yang menuju pendaftaran bisnis |
| Ringkasan admin tanpa pita sambutan | Panel operasional: ruang teratas milik antrean yang harus ditindak, bukan kalimat pemasaran yang mengulang judul di topbar |

## Pintu masuk panel admin (18 September 2026)

| Keputusan | Alasan |
|---|---|
| Halaman masuk admin terpisah di `/masuk/admin`, dengan grup rute dan tata letaknya sendiri | Halaman masuk biasa membingkai produk untuk mahasiswa dan usaha; tombol "Daftar Gratis" di pintu admin menyesatkan karena akun admin tidak dibuat sendiri |
| Peran diperiksa sebelum sesi ditulis | Masuk di pintu admin dengan akun biasa bukan setengah berhasil, melainkan pintu yang salah; menuliskan sesinya hanya memindahkan kebingungan ke halaman berikutnya |
| Jejak audit disebut di pintu masuk, bukan di dalam panel | Pengurus perlu tahu tindakannya tercatat sebelum mulai bekerja |

## Proyek hanya di dalam aplikasi (18 September 2026)

| Keputusan | Alasan |
|---|---|
| Rute publik `/proyek` dihapus seluruhnya | Melamar mensyaratkan akun, dan tombol utama beranda sudah mengarah ke pendaftaran; halaman publiknya tinggal jadi jalan samping yang membingungkan |
| Sitemap dan robots tidak lagi mengumumkan proyek | Halaman yang butuh akun tidak pantas dijanjikan ke mesin pencari |
| Rentang anggaran memakai strip, bukan kata "sampai" | Angka uang lebih cepat dibaca sebagai rentang; kata sambung membuat barisnya panjang dan sering membungkus dua baris di kartu |
| Tanpa lencana bertitik hijau berdenyut | Titik berdenyut adalah bahasa peringatan; jumlah proyek yang sedang dibuka bukan hal yang menuntut tindakan |
| Centang baca di obrolan memakai `is_read` yang sudah ada | Backend menandai pesan lawan terbaca saat ruang dibuka, jadi penanda ini jujur tanpa menambah endpoint |
| Kredit Icons8 dilepas dari footer | Permintaan pemilik produk. Konsekuensi lisensinya dicatat di EVALUASI.md: bila atribusi tidak ditampilkan di mana pun, ikonnya sebaiknya diganti padanan Lucide |

## Lencana status dan kepala percakapan (18 September 2026)

| Keputusan | Alasan |
|---|---|
| Lencana status berbentuk kotak bersudut lembut, tanpa titik warna | Titik kecil berwarna adalah bahasa lampu indikator "sedang menyala sekarang", padahal status di sini keterangan keadaan; warnanya sudah dibawa latar dan teks |
| Nilai anggaran memakai ukuran h4 dan angka proporsional | Rentang memuat dua nominal dan pemisahnya; ukuran judul halaman memecahnya jadi dua baris tepat di tengah rentang, dan tabular-nums merenggangkan titik ribuan |
| Kepala percakapan menempel di kotak obrolan, bukan di topbar | Nama lawan bicara milik percakapan itu; topbar menyebut bagian aplikasi. Dipisah jauh, keduanya terasa tidak berhubungan |
| Ikon kembali dialiaskan dari `ArrowLeft` | Satu perubahan di daftar ikon mengganti seluruh tombol kembali, tanpa menyentuh enam berkas |
| Pemasang proyek tampil sebagai baris yang bisa dibuka profilnya | Sebelum melamar, orang menimbang siapa yang memasang proyeknya, bukan hanya briefnya |

## Pencarian cepat dan kartu proyek (18 September 2026)

| Keputusan | Alasan |
|---|---|
| Rancangan Spotlight ditulis ulang dengan CSS Module, bukan memasang Tailwind, shadcn, dan framer-motion | Satu komponen tidak sepadan dengan dua sistem gaya yang hidup berdampingan; lint token juga kehilangan cengkeramannya begitu kelas utilitas masuk |
| Pencocokan pencarian di klien | Daftar proyek terbuka memang dimuat seluruhnya karena backend belum punya paginasi, jadi mengetik tidak perlu memicu satu permintaan per huruf |
| Kartu proyek memakai pita aksen di tepi, bukan bayangan tebal | Bayangan pada setiap kartu membuat seluruh grid terasa berat; pita hanya menyala pada kartu yang sedang dituju |
| Dua centang selalu, warnanya yang berubah | Mengubah jumlah centang menuntut orang menghitung; warna terbaca sekilas dan sudah jadi kebiasaan dari aplikasi pesan lain |
| Kolom cari di halaman Cari proyek mengembang dari lingkaran ikon | Kolom panjang yang hampir selalu kosong memakan baris teratas, padahal yang dicari orang di halaman ini adalah banyaknya kartu proyek yang terlihat sekaligus. Rancangan expandable dari pemilik produk ditulis ulang dengan CSS Module, alasannya sama dengan Spotlight di baris pertama tabel ini |
| Chip tingkat bergeser karena tata letak, bukan animasi terpisah | Lebar kolomnya yang beranimasi, dan chip di sebelahnya mengikuti bingkai demi bingkai. Satu dorongan kecil bertingkat (2px per chip, tunda 40ms) ditambahkan supaya barisnya terbaca seperti didorong, bukan seperti balok kaku yang pindah |
| Kata kunci yang sedang berlaku menahan kolomnya tetap terbuka | Saringan yang bekerja tapi tidak terlihat membuat hasil yang sedikit tampak seperti kesalahan. Keadaannya diturunkan dari URL, bukan disalin ke state lewat efek |
| Di layar sempit chip pindah ke baris berikutnya, tidak disembunyikan | Menyembunyikan saringan yang masih aktif hanya karena kolomnya melebar akan menyembunyikannya juga dari keyboard dan pembaca layar. Basis flex tetap 200px yang menentukan kapan chip membungkus, bukan panjang teksnya, jadi bahasa Inggris dan Indonesia berperilaku sama |
| Kolom yang terlipat dilewati Tab, tapi tetap ada di DOM | Yang mewakili pencarian di urutan keyboard adalah tombol ikonnya, dan kolom yang dilepas dari DOM membuat pola `key` mengikuti URL kehilangan gunanya |
| Tab memakai satu penanda yang meluncur, bukan latar yang muncul di masing-masing tab | Latar yang timbul lalu hilang membuat mata kehilangan jejak tab mana yang ditinggalkan. Satu penanda yang berpindah bisa diikuti dari tab lama ke tab baru |
| Posisi penanda ditulis lewat ref, bukan state | Mengukur lalu menyimpan ukuran ke state berarti satu render tambahan tiap perpindahan tab, dan itu juga yang dilarang aturan `react-hooks/set-state-in-effect` |
| Penanda tab memakai `--ease-entrance`, bukan `--ease-spring` | Penanda yang melewati tujuannya lalu mundur bertabrakan dengan dial MOTION 1. Durasinya `--duration-base`, yang memang ditandai motion.css sebagai durasi untuk tab |
| Sisi kanan baris proyek admin jadi tiga kolom tetap | Sebagai deret rata kanan, kolom nominal bergeser sampai 54px dari baris ke baris mengikuti panjang lencana status, dan jaraknya hanya 6px. Sekarang nominal rata kanan dan lencana rata kiri pada tepi yang sama di seluruh daftar, berjarak 16px |
| Kartu proyek disusun ulang mengikuti rujukan rancangan pemilik produk | Avatar bundar, judul besar, satu baris penanda (tingkat, tenggat, kategori), lalu kaki berisi anggaran, jumlah pelamar, Detail, dan Lamar |
| Ikon simpan di pojok kartu tidak dipasang meski ada di rujukan | Backend belum punya endpoint simpan proyek sama sekali (celah B di rencana). Tombol yang tidak menyimpan apa pun lebih buruk daripada tombol yang tidak ada |
| Warna kartu tetap palet proyek ini, bukan biru tua di rujukan | DESIGN.md memang menetapkan gaya FE V2 yang diwarnai ulang dengan terakota dan kayu, jadi yang diikuti dari rujukan adalah susunannya |
| Penanda tingkat memakai sudut sedang, bukan pil | Diminta pemilik produk. Bentuk pil membuatnya terbaca sebagai lencana status, padahal tingkat bukan status |
| Chip kategori kembali tampil, menggantikan chip keahlian | Ada di rujukan, isinya bidang `category` yang memang dikirim backend, dan satu chip lebih tenang daripada empat chip keahlian. Penahanan tag sebelumnya memang ditujukan ke deretan chip itu |
| Label "Detail" di kaki kartu bukan tautan kedua | Seluruh kartu sudah jadi tautan detail lewat ::after judulnya. Sebagai span, kliknya tetap sampai ke tautan itu tapi pembaca layar tidak mendengar tujuan yang sama dua kali |
| Bilah "Sesimu ditutup" di beranda ditiadakan | Diminta pemilik produk. Aturannya tetap: membuka beranda menutup sesi, dan keadaan "belum masuk" sudah terbaca dari tombol Masuk dan Daftar di headernya |
| Komponen `Input` menyamakan dirinya dengan isian otomatis peramban | Peramban mengisi formulir tanpa memancarkan event apa pun, jadi kolom terkendali React terlihat terisi sementara state pemiliknya kosong, lalu tombol kirim menolak dengan "belum diisi". Ditangani sekali di komponennya, bukan di tiap formulir |
| Sinyalnya animasi kosong `sl-autofill` di CSS global | Satu-satunya cara peramban memberi tahu kolom baru saja diisi otomatis. Namanya global supaya tidak diacak CSS Module dan tetap dikenali dari JavaScript. Pemeriksaan bertingkat menyusul sebagai jaring pengaman |
| Prop `uang` di `Input`, bukan komponen nominal terpisah | Penangan yang sudah ada menyaring non-digit, jadi cukup tampilannya yang dikelompokkan dan penangannya tidak perlu diubah satu pun. Posisi karet dihitung dari jumlah digit di kiri, bukan indeks huruf, karena titiknya berpindah saat mengetik |
| Baris daftar proyek menampilkan rentang, bukan batas atas | Pemilik proyek menulis dua angka; menampilkan satu membuat daftar terbaca seperti harga pasti |
| Pilihan atas pelamar tinggal terima atau tolak | Diminta pemilik produk. "Masukkan seleksi" menambah satu keadaan antara yang tidak mengubah apa pun bagi kedua pihak, sementara tombol tolak yang sebelumnya tidak ada justru yang dibutuhkan |
| Tombol chat pelamar tersedia di keadaan apa pun | Percakapan soal revisi dan jadwal berlanjut setelah lamaran diputus, jadi tautannya tidak ikut hilang bersama tombol terima dan tolak |
| `color-scheme` mengikuti tema aplikasi, bukan hanya sistem | Warna yang digambar peramban sendiri (isian otomatis, scrollbar, pemilih tanggal) diambil dari sini, bukan dari token kita. Saat pengguna memaksa tema yang berbeda dari sistemnya, keduanya bertolak belakang dan teks isian otomatis jadi putih di atas kertas putih |
| Rupa isian otomatis dikunci lewat `-webkit-text-fill-color` dan bayangan dalam | Chrome memaksakan warnanya lewat aturan internal yang menang atas `color` biasa, dan latarnya tidak bisa dimatikan langsung |
| Token ukuran yang dipakai sebagai warna kini ditolak lint | 33 deklarasi `color: var(--text-body)` selama ini tidak sah tanpa satu pun peringatan, karena `--text-body` adalah ukuran font. Pemilahannya diturunkan dari berkas tempat token itu lahir, bukan dari daftar yang ditulis tangan |
| Efek fokus `Modal` hanya bergantung pada `open` | `onClose` dan `dismissible` ditulis pemanggil sebagai nilai inline, jadi identitasnya baru tiap render. Selama keduanya jadi dependensi, satu ketikan di dalam modal memasang ulang efeknya dan melempar fokus keluar dari kolom. Keduanya kini disimpan di ref |
| Daftar pelamar dimuat ulang dengan `muatUlang`, bukan mengganti dependensi | Mengganti dependensi dianggap permintaan baru: data lama dibuang, kerangka muncul, dan seluruh anak komponen dilepas bersama state-nya. `muatUlang` memang dibuat untuk ini, menahan data lama tetap tampil |
| Menerima pelamar menutup proyeknya di backend, bukan menunggu kontrak dibuat | Menerima sudah menolak semua pelamar lain, jadi di sela sebelum kontrak dibuat proyek itu tidak lagi terbuka. Sebelumnya masih muncul di daftar publik dan masih bisa dilamar |
| Centang biru chat tanya jawab butuh kolom baru, dan kolomnya ditambah | Frontend sudah benar sejak awal; yang tidak ada adalah `is_read` di `support_messages`. Migrasinya menandai seluruh riwayat lama sebagai sudah dibaca, karena memunculkan ratusan "belum dibaca" untuk percakapan lampau adalah kabar palsu |
| Satu komponen `TautanKembali` untuk seluruh halaman turunan | Sebelumnya tiga halaman menyalin gaya yang sama, tiga halaman lain memakai gaya tautan seksi yang berwarna brand dan tebal, dan sisanya tidak punya jalan pulang sama sekali |
| Tujuannya ditulis tetap, bukan `history.back()` | Halaman turunan sering dibuka langsung dari notifikasi atau tautan email, dan di situ riwayat perambannya kosong. Labelnya menyebut tujuan, supaya orang tahu ke mana ia mendarat |
| Profil publik jadi pengecualian dan memakai riwayat | Halaman itu dicapai dari detail proyek maupun dari kartu pelamar, jadi tujuan tetap mana pun akan salah separuh waktu. Tetap ditulis sebagai tautan supaya klik tengah dan pembaca layar tetap dapat tujuan yang jelas |
| Menyembunyikan saldo menutup ketiga angka sekaligus | Menutup satu kartu sementara dua kartu di sebelahnya tetap terbuka tidak menyembunyikan apa pun. Pilihannya ikut berlaku di beranda, karena angka yang sama tampil di sana |
| Pilihan itu disimpan di localStorage, bukan di akun | Ini kenyamanan per perangkat. Menyembunyikan saldo di laptop kantor tidak berarti ingin tersembunyi juga di ponsel sendiri |
| Jenis mutasi dompet yang tidak dikenal tidak lagi menjatuhkan halaman | Ditemukan saat menguji: satu baris mutasi berjenis asing membuat seluruh halaman dompet mati. Backend bisa menambah jenis kapan saja, dan itu tidak boleh membuat orang kehilangan akses ke saldonya |
| Tombol tutup saldo juga ada di beranda, menempati petak ikon kartunya | Angka saldo yang pertama terlihat saat aplikasi dibuka ada di beranda, jadi di sanalah orang ingin menutupnya. Ditaruh di petak ikon, bukan di sebelahnya, supaya kartu itu tetap sebangun dengan tiga kartu statistik lain |
| Tiga label identitas di profil disamakan dengan lencana status | Sebelumnya bentuknya pil, kotak, lalu pil lagi, dengan dua ukuran huruf dan dua gaya huruf. Sekarang ketiganya sebangun dan hanya warnanya yang membedakan |
| Rekam jejak dibaca dari endpoint publik yang sama, bukan endpoint sendiri | Yang dilihat pemiliknya jadi persis yang dilihat calon pemberi kerja, termasuk apa yang sengaja tidak ditampilkan. Kalau keduanya memakai sumber berbeda, cepat atau lambat keduanya bercerita berbeda tentang orang yang sama |
| Portofolio dan ulasan di profil sendiri hanya bisa dibaca | Isinya tumbuh sendiri dari kontrak yang selesai dan ulasan yang diterima. Begitu bisa disunting, ia berhenti jadi bukti dan berubah jadi klaim |
| Ulasan ditampilkan juga kepada pemiliknya | Tiga alasan: itu yang dibaca orang lain tentang dia, ulasan menentukan kenaikan tingkat, dan orang tidak bisa memperbaiki atau menyanggah yang tidak pernah dilihatnya |
| Ulasan yang sudah tampil di kartu portofolio tidak diulang di "Ulasan lain" | Backend mengirim seluruh ulasan di satu daftar sementara tiap kartu portofolio sudah membawa ulasannya sendiri. Dicocokkan lewat waktu, nilai, dan isinya, bukan hanya waktu, supaya beda format tanggal tidak membuat duplikatnya lolos |

## Warna

| Keputusan | Alasan |
|---|---|
| Netral pasir hangat, bukan abu netral | Produk memegang uang orang; pasir hangat menjauhkan kesan bank yang dingin tanpa kehilangan kredibilitas |
| Terakota `--clay-600` sebagai satu-satunya aksen | Satu warna hidup untuk aksi utama membuat langkah berikutnya selalu terbaca di layar padat data |
| Empat warna semantik (hijau, kuning, merah, biru) di luar aksen | Ini skala fungsional untuk status uang, bukan perluasan palet brand: pengguna harus tahu dana ditahan, menunggu, atau bersengketa tanpa membaca teks dulu (antislop R-29 memberi jalan keluar "clear design system"; 441 token berdokumen adalah sistem itu) |
| Setiap warna status selalu berpasangan dengan teks atau ikon | Warna sendirian gagal untuk pengguna buta warna dan hilang di mode forced-colors |
| Biru hanya untuk tautan bantuan dan toast informasi | Kalau biru ikut menandai status proyek, empat keluarga status kehilangan batas dan skala semantiknya jadi hiasan |
| Tanpa ungu, indigo, violet | Warna brand lama; menghidupkannya membuat produk terbaca sebagai versi lama |
| Isian semantik selalu dipasangkan dengan token teksnya | Di mode gelap isian menerang, dan putih di atas `--danger` gelap hanya 3,6:1 sehingga gagal AA |

## Tipografi

| Keputusan | Alasan |
|---|---|
| Bricolage Grotesque untuk display | Karakternya lebih hangat dan bersudut daripada grotesk netral, cocok untuk produk yang ingin terasa manusiawi, bukan korporat |
| Archivo untuk seluruh UI dan angka | Tinggi-x besar dan tabular figures membuat kolom rupiah rata tanpa perlu font mono terpisah |
| Tanpa font mono | Satu-satunya kebutuhan mono di produk ini adalah nominal, dan itu sudah dijawab tabular-nums Archivo |
| Keduanya lewat `next/font/google`, bukan tag CDN | Font ter-self-host saat build: tidak ada permintaan ke server pihak ketiga dan tidak ada pergeseran layout saat font tiba |
| Bukan Inter, Geist, atau Space Grotesk | Ketiganya pilihan default model dan tidak membawa karakter apa pun ke produk ini (antislop R-06) |

## Bentuk dan kedalaman

| Keputusan | Alasan |
|---|---|
| Radius berskala (4, 6, 8, 12, 16, 24px), bukan satu nilai | Radius dipakai sebagai penanda hierarki: badge kecil, tombol sedang, kartu besar, blok landing paling besar |
| Pill hanya untuk chip, avatar, dan indikator bulat | Tombol pill membuat semua elemen terbaca satu tingkat dan menghapus hierarki radius (antislop R-11) |
| Kartu memakai garis 1px, tanpa shadow | Halaman ini penuh kartu; kalau semuanya berbayang, tidak ada yang benar-benar mengapung dan hierarkinya hilang (antislop R-12) |
| Shadow hanya untuk dropdown, toast, dan modal | Ketiganya benar-benar melayang di atas konten, jadi bayangan menandai lapisan, bukan menghias |
| Tiga pengecualian shadow sejak 14 September 2026: header publik saat halaman di-scroll, kartu proyek saat di-hover, kartu hero | Ketiganya juga menandai lapisan: isi yang lewat di bawah header, kartu yang terangkat karena seluruh areanya tautan, dan kartu yang mengapung di panel tinta. Saat diam, kartu tetap tanpa shadow |
| Warna shadow hangat `rgba(60,42,28,...)` | Bayangan hitam netral di atas permukaan pasir terbaca kotor dan keabu-abuan |
| Blur hanya pada overlay modal | Satu-satunya tempat blur menjawab kebutuhan nyata (memisahkan lapisan keputusan dari konten); dosis di atas itu jadi glassmorphism (antislop R-10) |

## Ikon

| Keputusan | Alasan |
|---|---|
| Lucide dipakai, tapi sebagai keputusan | Garis tunggal dengan ujung membulat sejalan dengan pasir hangat dan sudut lembut sistem ini; set bersudut tajam akan berbenturan dengan radius 8 sampai 12px |
| Stroke dikunci 1.75, bukan default 2 | Default Lucide terlalu tebal berdampingan dengan Archivo 15px dan membuat ikon berebut dengan teks |
| Ikon selalu `aria-hidden`, makna dibawa teks | Ikon dekoratif yang diumumkan pembaca layar menambah kebisingan tanpa menambah informasi |
| Sparkle, Star sebagai hiasan, Lightning, Diamond, Robot, Orb tidak dipakai | Itu kosakata ikon default AI dan tidak satu pun relevan dengan proyek, kontrak, atau dana (antislop R-04). `Star` tetap dipakai, tapi hanya di `Rating`, tempat bintang memang berarti rating |
| Tanpa ilustrasi, empty state memakai ikon besar dalam lingkaran pasir | Tidak ada aset ilustrasi di sumber, dan ilustrasi stok generik akan jadi satu-satunya elemen di produk yang bukan milik produk ini |

## Layout dan gerak

| Keputusan | Alasan |
|---|---|
| Mobile-first dengan breakpoint 360 / 768 / 1280 | Titik itu diambil dari tempat konten benar-benar patah (kolom tabel tidak lagi terbaca, kartu terlalu sempit), bukan dari daftar lebar perangkat |
| Sidebar jadi drawer off-canvas di bawah 1024px, bukan disembunyikan | Rute seperti Tersimpan, Dokumen, dan Pengaturan hanya ada di sidebar; menyembunyikannya membuat halaman itu tidak terjangkau di perangkat utama pengguna |
| Bottom nav hanya 5 slot | Lebih dari itu target sentuh turun di bawah 44px pada layar 360px |
| `100dvh`, bukan `100vh` | `100vh` menghitung chrome browser, jadi seksi setinggi layar meluber di browser mobile |
| ~~Motion dial 1 (hover dan transisi saja)~~ diganti MOTION 2 pada 14 September 2026 | Pemilik produk menilai V3 terasa diam dibanding V2. Alasan lamanya tetap dijaga di layar uang: angka tidak pernah dianimasikan, dan area aplikasi hanya mendapat animasi masuk singkat, bukan koreografi scroll |
| Hero landing di panel tinta, bukan di atas kertas | Satu titik fokus yang kuat di layar pertama. Tinta dipilih karena sudah jadi set-piece brand yang warnanya tidak berubah antar tema, dan footer tinta menjadi pasangan penutupnya |
| Kartu proyek di hero berisi proyek asli dari database | Kartu di V2 berisi proyek karangan. Kalau belum ada proyek, kartunya tampil dengan label "Contoh tampilan kartu proyek" yang terlihat (antislop R-38) |
| Kartu hero memakai `--shadow-lg` | Kartu itu benar-benar mengapung di atas panel, alasan yang sama dengan shadow pada modal dan toast. Kartu lain tetap tanpa shadow |
| Anak tangga dari logo di hero, CTA, dan panel masuk | Satu motif identitas yang diulang, menggantikan orb aurora V2. Blok datar tanpa gradasi, sesuai DESIGN.md |
| Kartu hero miring mengikuti kursor, bukan melayang terus | Loop tanpa pemicu hanya jadi gangguan (antislop R-19). Miring hanya terjadi saat pengguna menggerakkan kursor, dan tidak ada di layar sentuh |
| Alur escrow di landing bergerak tahap demi tahap sekali | Gerak itu memperlihatkan hal yang paling ingin diketahui pengunjung: siapa memegang uangnya di setiap tahap. Ada tombol putar ulang untuk yang ingin melihatnya lagi |
| Tidak ada angka statistik, bar logo kampus, atau badge "platform khusus mahasiswa" dari V2 | Angkanya tidak bersumber dan bar logo adalah klaim yang tidak bisa dibuktikan (antislop R-17, R-18, R-36) |
| Halaman masuk dan daftar terbelah dua, panel disembunyikan di bawah 1024px | Panel menjawab keraguan soal uang sebelum orang mendaftar. Di layar kecil, form harus jadi hal pertama yang terlihat |
| Ukuran judul fluid dengan `clamp()` | Ukuran bertingkat di 768 dan 1280 membuat zoom in dan zoom out tidak berubah apa pun sampai lebar melewati breakpoint, lalu melompat sekaligus |
| Kontainer melebar ke 1280px di layar 1536px ke atas, 1400px di 1920px | Di 1920px, kontainer 1152px hanya mengisi 60 persen layar dan halamannya terasa seperti pita di tengah |
| Perpindahan status escrow 520ms, lebih lambat dari gerak lain | Perubahan yang menyangkut uang perlu terbaca, bukan sekadar terjadi |
| Tanpa animasi masuk pada angka saldo | Saldo yang berhitung naik membuat angka final ambigu selama animasi berjalan |

## Struktur teknis

| Keputusan | Alasan |
|---|---|
| CSS Modules, bukan inline style seperti design system sumber | Inline style tidak bisa memuat media query, sehingga komponen tidak bisa bertanggung jawab atas perilaku mobile-nya sendiri |
| CSS Modules, bukan Tailwind | Token yang berpasangan (`--primary` dengan `--text-on-primary`) gampang terpisah saat ditulis sebagai class utility, dan pemisahan itu justru pelanggaran paling berat di sistem ini |
| Halaman publik dirender di server, area terautentikasi di klien | Endpoint publik backend benar-benar tanpa guard, jadi halaman proyek bisa diindeks mesin pencari tanpa token menyentuh server Next |
| Tema mengikuti sistem, dengan toggle terang dan gelap | Design system menyediakan token lengkap untuk kedua mode, jadi menahan toggle berarti membuang separuh sistem yang sudah ada (antislop R-21) |
| Tanpa mode gelap setengah jadi | Mode yang rusak sebagian lebih buruk daripada tidak ada; keduanya diverifikasi kontrasnya (antislop R-34) |

## Konten

| Keputusan | Alasan |
|---|---|
| Tidak ada testimoni, logo bar, atau angka statistik di landing | Belum ada pengguna nyata; angka dan testimoni karangan merusak kepercayaan lebih parah daripada tidak menampilkannya (antislop R-17, R-18, R-38) |
| Tidak ada klaim "aman", "terenkripsi", atau menyebut OJK | Tidak ada buktinya, dan klaim regulasi keuangan di Indonesia punya konsekuensi hukum (antislop R-36) |
| Placeholder form memakai `Nama lengkap` dan `email@contoh.com` | Nama orang sebagai placeholder terbaca seperti data nyata dan menutupi bahwa kolomnya masih kosong |
| Rute yang backend-nya belum ada diberi label "Segera hadir" yang terlihat | Tautan yang kelihatan hidup tapi tidak menuju ke mana-mana lebih menyesatkan daripada label jujur (antislop R-24, R-26) |
| Landing tidak memakai FAQ | Belum ada pertanyaan nyata dari pengguna; FAQ template merusak kepercayaan lebih parah daripada tidak ada FAQ (antislop R-28) |
| Berkas hasil ditampilkan "Berkas 1, PNG", bukan nama berkas | Backend menyimpan nama acak dan membuang nama asli; menampilkan `1789322960903-1x5lsat9bt4.png` tidak memberi tahu apa pun |
| Setiap klaim tentang perilaku sistem dicocokkan ke kode backend | Tiga copy terbukti salah saat uji sambung: ulasan "terbit bersamaan", hasil verifikasi "lewat email", dan urutan kontrak dan escrow yang terbalik (antislop R-36) |

## Penyimpangan dari design system, dengan alasan terukur

Empat hal di bawah berbeda dari sumbernya. Semuanya ditemukan lewat pengukuran
di halaman yang benar-benar dirender, bukan dari pembacaan kode.

| Yang diubah | Alasan |
|---|---|
| `--focus-ring` jadi terakota solid, bukan terakota 32 persen | Terukur, versi beralpha membaur jadi `rgb(229,195,174)` dan hanya **1,56:1** terhadap kertas serta **1,96:1** di mode gelap. Indikator fokus butuh 3:1. Versi solid mengukur **4,73:1** di kertas dan **6,15:1** di latar gelap. Ini penerapan aturan design system sendiri (jangan meredam dengan alpha di atas latar berwarna) ke bagian yang belum mendapatkannya |
| `Logo` mendapat prop `surface="ink"`, menggantikan `color` dan `basePath` | Wordmark memakai `--text-strong`, yang di mode terang **sama persis** dengan `--ink-surface` di footer. Rasio 1,0, teksnya hilang. Design system sendiri mensyaratkan mode permukaan untuk komponen di atas panel tinta |
| `Checkbox`, `Radio`, `Switch` mendapat gaya `:focus-visible` pada kotak visualnya | Sumbernya menyembunyikan input asli tanpa memberi indikator fokus pada penggantinya, jadi ketiganya tidak terlihat saat dijelajah keyboard |
| Skala padding halaman disambungkan ke breakpoint | Design system mendefinisikan `--pad-page-x-md`, `-dt`, dan `-lg` tapi tidak pernah memakainya di media query, sehingga seluruh sistem memakai nilai 360px di semua lebar |

Dua penyesuaian kecil yang menyertainya: shell aplikasi memakai `--width-container`
(1152px), bukan `--width-content` (720px), karena dashboard membawa grid statistik
dan tabel; dan `JobCard` diganti `ProjectCard` yang mengikuti bentuk `Project` dari
backend, karena entitas di produk ini adalah proyek, bukan lowongan.

## Perbaikan yang tidak terlihat dari kode

| Bug | Kenapa baru ketahuan saat dijalankan |
|---|---|
| Render loop tak berujung di seluruh area terautentikasi | `readSession` mengembalikan objek baru tiap panggilan, dan `useSyncExternalStore` membandingkan snapshot dengan `Object.is`, jadi ia selalu dianggap berubah. Sekarang snapshot di-cache berdasarkan string mentahnya |
| Pengguna yang sudah masuk dilempar ke halaman login tiap muat ulang | Penjaga rute memercayai snapshot render, yang pada hidrasi pertama selalu null. Sekarang sesi dibaca ulang di dalam efek |
| Layar tidak berubah setelah aksi di halaman kontrak | `router.refresh()` hanya menyegarkan Server Component, sedangkan data kontrak dimuat di klien. Mode contoh tidak pernah memunculkannya karena aksinya tidak mengubah apa pun. Sekarang `useAsync` punya `muatUlang` |
| Status akun di sesi tidak pernah berubah setelah login | Mahasiswa yang disetujui admin tetap terkunci. `useSesi` menyegarkannya dari `/users/me` paling sering sekali per menit |
| Objek kosong terbaca sebagai data | Interceptor backend membungkus `{ data: null }` dua kali. Client membuka bungkus itu sampai backend diperbaiki |
| Tautan verifikasi email berujung 404 | Backend menautkan `/verify-email?token=...`, rute frontend bernama `/verifikasi-email`, dan tidak ada redirect. Tautan email selamat datang (`/?tab=verification`, `/?tab=projects`) juga hanya membuka beranda. Ketiganya sekarang dialihkan di `next.config.ts` |
| Judul hero pecah jadi lima baris | Kolomnya dibatasi `46ch`, dan `ch` dihitung dari font elemen pembatasnya (body 15px), bukan dari judul 56px. Batas lebar sekarang dalam rem |
| Tombol buka berkas diblokir browser | `window.open` setelah `await` dianggap popup tanpa klik pengguna. Tab dibuka saat klik, lalu diarahkan setelah signed URL didapat |

## Keputusan produk dari pemilik produk

| Keputusan | Alasan |
|---|---|
| Bisnis tidak diverifikasi | Menyetor dana kontrak ke escrow adalah verifikasinya. Bisnis tidak bisa menerima pelamar tanpa membayar lebih dulu, jadi uang yang benar-benar berpindah membuktikan lebih banyak daripada dokumen yang diunggah. Backend sudah bekerja begitu: `POST /auth/register` menyetel `is_verified: true` untuk akun bisnis, dan itu benar, bukan bug |
| `VerificationBanner` khusus mahasiswa | Turunan dari keputusan di atas. Untuk bisnis, komponen ini hanya menampilkan pembekuan akun; status verifikasi apa pun tidak dirender |

## Pembersihan kode mati dan kebijakan komentar (20 September 2026)

Satu baris penjelas di paling atas tiap berkas kode, tidak ada komentar lain.
Diterapkan ke 333 berkas frontend dan 132 berkas backend; 989 dan 892 komentar dibuang.
Alasannya milik pemilik produk, dan konsekuensinya diterima: alasan di balik keputusan
tidak lagi hidup di sebelah kodenya, jadi berkas inilah satu-satunya tempat alasan itu
disimpan. Menambah komentar penjelas kembali ke kode berarti melanggar aturan ini.

Yang tetap dipertahankan karena bukan dokumentasi melainkan instruksi untuk alat:
direktif `eslint-disable`, `@ts-expect-error`, dan sejenisnya, termasuk yang dibungkus
kurung kurawal di JSX. Penghapusnya memakai parser TypeScript, bukan pencocokan pola,
supaya string, regex, dan komentar JSX tidak salah terbaca.

Berkas di `prisma/migrations/` sengaja tidak disentuh: isinya SQL yang sudah dijalankan
di basis data, dan menyunting catatan yang sudah terpakai tidak menghasilkan apa pun
selain risiko.

| Dibuang | Isi |
|---|---|
| `components/feedback/Toast.tsx` dan gayanya | 169 baris, tidak dirujuk satu berkas pun |
| `AvatarGroup`, `myPayments`, tipe `ChatMessage` | Ekspor yang tidak pernah diimpor siapa pun |
| 32 kelas CSS Module | 13 di antaranya sisa pemindahan rekam jejak ke `RekamJejak` |
| 6 berkas `*.entity.ts` backend | Antarmuka peninggalan sebelum Prisma, 129 baris |
| `PaginationDto`, tipe `XenditDisbursementWebhook` | Tidak dipakai; webhook disbursement sudah punya tipe sendiri di tempat ia dipakai |
| 6 impor dan tipe mati di backend | Terdeteksi ESLint, sebelumnya tertutup 85 galat format |
| `PUBLIC_BASE_URL` di `.env` backend | Tidak dibaca satu baris kode pun, dan akan ikut tersalin ke Railway tanpa guna |

`src/common/cors.util.ts` tidak dibuang meski tidak diimpor siapa pun, melainkan
disambungkan. Logikanya ternyata disalin utuh ke tiga tempat: `main.ts`,
`chat.gateway.ts`, dan `notifications.gateway.ts`. Alasan yang ditulis di sana, bahwa
decorator `@WebSocketGateway()` butuh nilai compile-time, keliru: argumen decorator
dievaluasi saat modul dimuat, jadi pemanggilan fungsi yang diimpor bekerja sama saja.
Berkas yang justru dibuat untuk mencegah pergeseran konfigurasi malah menjadi satu
satunya salinan yang tidak dipakai. Sekarang ketiganya mengimpor dari sana.

## Lockfile dan CI (20 September 2026)

`npm ci` gagal di GitHub Actions dengan `EUSAGE`: `package-lock.json` memuat paket
opsional lintas platform seperti `@img/sharp-wasm32` dan
`@unrs/resolver-binding-wasm32-wasi`, tetapi tidak memuat simpul untuk dependensinya
(`@emnapi/core`, `@emnapi/runtime`). npm menolak membuat simpul bagi dependensi paket
yang tidak berlaku di platform mana pun, namun `npm ci` tetap memvalidasinya.

Membangun ulang lockfile tidak cukup, karena npm mengulang keputusan yang sama.
Jalan keluarnya: `@emnapi/core` dan `@emnapi/runtime` dipasang sebagai devDependency
dengan versi dipatok tepat `1.10.0`, satu satunya versi yang memenuhi permintaan eksak
`@unrs/resolver-binding-wasm32-wasi` sekaligus rentang `^1.7.1` milik
`@napi-rs/wasm-runtime`. Keduanya tidak pernah diimpor kode ini; keberadaannya semata
supaya pohon dependensi di lockfile lengkap. `npm ci` dipertahankan, bukan diganti
`npm install`, karena reproducibility lebih berharga daripada dua baris devDependency.

Langkah `Build` di CI diberi `NEXT_PUBLIC_API_BASE_URL` dan `NEXT_PUBLIC_SITE_URL`
berbentuk produksi (`https://api.contoh.test/api/v1`), terpisah dari env level job.
`scripts/cek-produksi.mjs` menolak localhost dan http saat `CI=true`, dan GitHub Actions
selalu menyetel `CI=true`, jadi build di CI akan berhenti tanpa ini. Env level job tetap
localhost karena dev server yang dipakai uji E2E harus cocok dengan alamat yang dimock
`tests/e2e/api-tiruan.ts`. Berkas itu kini membaca `NEXT_PUBLIC_API_BASE_URL` dengan
localhost sebagai cadangan, supaya keduanya tidak bisa bergeser diam diam.

## Ikon chat dan bintang (20 September 2026)

Ikon chat dan bintang diganti dengan aset baru dari pemilik produk. `Komentar`
sekarang dua balon percakapan, dan kunci `Level` (tiga bintang bergaris) diganti
`Bintang` berisi satu bintang. Nama kuncinya ikut berubah supaya isinya sesuai
namanya; `IconName` bertipe union sehingga `tsc` menolak rujukan yang tertinggal.

Yang perlu diingat kalau aset ini diganti lagi: sistem ikon memakai PNG sebagai
**CSS mask**, jadi hanya kanal alpha yang dipakai dan seluruh warna di berkasnya
dibuang. Bintang emas tetap tampil emas karena warnanya datang dari `currentColor`
milik induknya, bukan dari berkasnya.

Konsekuensinya menggigit ikon chat. Berkas aslinya berisi outline hitam dengan
bagian dalam **putih pekat**, bukan transparan: 55,6% pikselnya opaque, dan alpha
di titik tengah 255. Dipasang apa adanya, mask-nya jadi gumpalan pejal, bukan dua
balon. Alpha-nya dibangun ulang dari kegelapan piksel (`alpha = alpha x (1 - luminance)`),
sehingga garisnya jadi opaque dan bagian dalamnya transparan; cakupan opaque turun
ke 16,8% dan bentuknya kembali seperti gambar aslinya. Bintang tidak butuh
perlakuan ini karena memang bidang pejal.

Ambang `min: 20` dipertahankan untuk keduanya. Di bawah ukuran itu ikon jatuh ke
Lucide (`MessageSquare` dan `Star`), yang berarti tombol dan kartu berikon 16 sampai
18px tidak berubah sama sekali. Yang berubah hanya tempat berukuran 20px ke atas:
sidebar, navigasi bawah, keadaan kosong halaman pesan, dan deretan fitur di beranda.
Bintang di komponen `Rating` juga tidak tersentuh: ia SVG sendiri karena butuh isian
sebagian untuk nilai pecahan, yang tidak bisa dilakukan mask PNG.
