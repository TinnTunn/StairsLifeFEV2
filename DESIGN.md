# DESIGN.md

Arah desain StairsLife sejak 15 September 2026: **gaya visual FE V2**
(`../StairsLifeFEV2`) dengan **palet logo terakota dan kayu** yang sekarang.
Keputusan pemilik produk: plugin antislop dilepas, bentuk dan energi V2 dipakai
kembali, tapi violet V2 diganti warna logo.

`Dial: ENERGY 4 / RHYTHM 3 / MOTION 3` untuk landing, masuk, dan daftar.
`Dial: ENERGY 3 / RHYTHM 2 / MOTION 2` untuk area aplikasi (kartu sapaan dan
tile bergerak saat masuk, sisanya tenang dan padat data).

Nilai token ada di `src/styles/tema.css` (lapisan V2 di atas token dasar
`src/styles/tokens/`). Keyframe ada di `src/styles/motion.css`.

## Identitas

Marketplace freelance yang mempertemukan mahasiswa Indonesia dengan bisnis dan
UMKM. Alur intinya: posting proyek, lamaran, kontrak, pembayaran escrow, serah
terima, ulasan. Tiga peran: mahasiswa, bisnis, admin.

Yang dipertahankan dari V3: nama, logo mark tiga balok bertingkat bertekstur
kayu, dan palet terakota. Yang diambil dari V2: aurora gelap di hero, kartu
kaca, bento, badge pil, sheen tombol, font dan ketebalan judul, pola animasi.

## Palet

| Peran | Token | Terang | Gelap |
|---|---|---|---|
| Aksen utama | `--brand` | `#B4531F` (clay-600) | `#E0763A` |
| Kilau aksen di permukaan gelap | `--spark` | `#F0A272` | sama |
| Tinta (latar aurora) | `--tinta` | `#1A120D` | sama |
| Teks di atas aurora | `--on-dark`, `--on-dark-muted`, `--on-dark-subtle` | putih 100 / 80 / 58% | sama |
| Rating | `--rating` | `#F5A800` | sama |

Netral pasir hangat tetap jadi bodi antarmuka. Warna semantik (hijau, kuning,
merah, biru) tetap dari token dasar dan selalu berpasangan dengan teks atau
ikon. Tidak ada violet, indigo, atau periwinkle: di V2 posisi itu diisi
terakota.

Gradien yang dipakai: `--grad-aurora` (hero, panel auth, kartu sapaan, panel
escrow), `--grad-brand` (garis atas kartu auth, angka 404), `--grad-cream-mesh`
(kanvas aplikasi dan pita judul halaman publik).

## Tipografi

Judul: **Schibsted Grotesk** 700 sampai 800, tracking rapat (`-0.02em` sampai
`-0.04em`). Teks dan UI: **Manrope** 400 sampai 800. Keduanya lewat
`next/font/google`.

Skala judul memakai `clamp()` supaya ikut zoom dan lebar layar:
`--text-display-1` (hero), `--text-display-2` (judul halaman publik),
`--text-h1`/`h2`/`h3`, `--text-bento-num` (angka stat tile).

Nominal di tabel dan baris memakai `tabular-nums`. Nominal besar dengan huruf
display memakai `proportional-nums`, karena digit tabular Schibsted membuat titik
ribuan tampak renggang.

## Bentuk dan kedalaman

- Radius: `xs 6`, `sm 10` (tombol), `md 12` (kolom input), `lg 16` (kartu),
  `xl 20` (kartu besar, auth, panel), `2xl 28`, pil untuk badge dan chip.
- Kartu: putih, garis 1px, `--shadow-card`; saat hover naik 3px ke
  `--shadow-card-hover`.
- Kolom input: tinggi 48px, garis 1.5px, fokus = garis brand + cincin
  `--brand-glow`.
- Tombol: `primary` terakota dengan sheen saat hover, `secondary` brand-soft,
  `ghost`, `destructive`, serta `white` dan `outlineWhite` khusus di atas aurora.
  Ukuran `sm 38`, `md 44`, `lg 52`, `xl 56`.
- Kaca: `--glass-bg` + `--glass-blur` untuk header publik, topbar aplikasi, dan
  bottom nav; `--glass-bg-dark` untuk kartu di atas aurora.

## Gerak

- Masuk: `sl-naik` (fade-up) berurutan 60 sampai 80ms per elemen, `sl-pop`
  untuk tile, modal, dan pesan galat.
- Hover: kartu terangkat, ikon miring sedikit dengan `--ease-spring`, panah
  bergeser, garis bawah nav tumbuh.
- Latar: orb aurora melayang (`sl-melayang`), titik status berdenyut
  (`sl-denyut`), kilau di anggaran (`sl-sapu`) dan teks aksen auth
  (`sl-kilau-teks`).
- Landing: reveal saat di-scroll lewat `RevealObserver`, tilt kartu hero
  mengikuti kursor, angka stat menghitung naik.
- `prefers-reduced-motion` mematikan semua animasi dan transform hover.

## Bahasa

Dwibahasa: **Indonesia (bawaan)** dan **Inggris**. Semua teks lewat kamus di
`src/i18n/id/*` dan `src/i18n/en/*`; kamus Inggris bertipe `typeof` kamus
Indonesia, jadi kunci yang terlewat menggagalkan build.

- Pilihan disimpan di cookie `sl-bahasa`, dibaca Server Component
  (`ambilKamus()`) dan Client Component (`useBahasa()`).
- Pengganti bahasa adalah dua tombol lebar tetap (ID | EN). Nav header memakai
  kolom lebar tetap dan tombol punya lebar minimum, jadi posisi komponen tidak
  bergeser saat bahasa berganti walau teks Inggris lebih panjang atau pendek.
- Tanggal ikut bahasa (`12 Sep 2026` / `12 Sep 2026`, `Okt` / `Oct`), rupiah
  tetap format Indonesia `Rp 2.500.000` di kedua bahasa.
- Pesan dari backend tetap berbahasa Indonesia apa pun pilihan pengguna.

Nada Indonesia: "kamu", sentence case, StairsLife menyebut dirinya dengan nama
saat menjelaskan siapa memegang dana. Nada Inggris: "you", plain English, istilah
"escrow" dipertahankan.

## Navigasi publik

Header: **Cara Kerja / How It Works**, **Fitur / Features**, **Tentang Kami /
About Us**, masing-masing menggulir ke seksi di beranda. Tidak ada tautan Biaya.

## Aksesibilitas

Teks minimal 4,5:1 di kedua tema, target sentuh minimal 44px, tautan "lewati ke
konten" di setiap halaman, ikon selalu `aria-hidden` dengan makna dibawa teks,
status tidak pernah hanya warna.

## Layout

- Publik: kontainer 1240px (1400px di layar 1920px ke atas).
- Aplikasi: sidebar 248px; di bawah 1024px sidebar jadi drawer dan bottom nav 5
  slot muncul; di bawah 640px pilihan bahasa dan tema pindah ke drawer.
- Auth: split aurora dan formulir mulai 1024px; di bawah itu hanya formulir.
- Stat tile: 4 kolom, 2 kolom di bawah 1100px termasuk di HP, 1 kolom di bawah
  340px.
