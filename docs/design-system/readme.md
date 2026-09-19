# StairsLife Design System

Sistem desain untuk **StairsLife** — marketplace freelance yang mempertemukan mahasiswa Indonesia dengan bisnis/UMKM. Web app responsif (desktop + browser mobile) dengan tiga peran: **mahasiswa** (mencari proyek), **bisnis** (memposting proyek), dan **admin** (moderasi).

Alur inti produk: posting proyek → lamaran → kontrak → **pembayaran escrow** → serah terima → ulasan. Ditambah chat real-time, sengketa, verifikasi identitas mahasiswa, dan dompet/penarikan dana.

Target implementasi: **Next.js 15 App Router + Tailwind CSS**. Bahasa antarmuka: **Indonesia**. Light mode dan dark mode wajib, default mengikuti preferensi sistem.

---

## Konteks & sumber

Ini **perombakan total (redesign dari nol)**, bukan penyegaran. Frontend lama (vanilla JS + Vite) dibuang dan dibangun ulang. Satu-satunya yang dipertahankan dari identitas lama: nama "StairsLife" dan bentuk logo mark (3 balok bertingkat = tangga).

**Yang sengaja TIDAK dipakai** (identitas visual lama — jangan dihidupkan kembali):
electric violet `#5B5BF5`, periwinkle, deep-indigo, ink-950 `#0E0D3D`, aksen citron-lime, mint/teal; font Schibsted Grotesk + Manrope; set-piece "aurora mesh", kartu gelap gradasi ink→indigo, glassmorphism, warm-wash CTA.

**Sumber yang diberikan untuk sistem ini:**
- `uploads/logo-mark.svg` — logo mark 3 balok (asli, `fill="currentColor"`); disalin ke `assets/logo-mark.svg`.
- Foto lockup logo yang dikirim di chat, dipakai sebagai acuan bentuk dan proporsi. Wordmark-nya kemudian di-set ulang dengan Bricolage Grotesque menjadi `assets/logo-lockup.svg` — vektor penuh, bukan hasil ekstraksi raster.
- Brief produk & data contoh di chat (proyek Kopi Senja Malang, mahasiswa Rani Pratiwi, nominal dompet).
- Tidak ada tautan Figma, repo GitHub, atau codebase yang dilampirkan. Tidak ada deck. Semua nilai visual di sistem ini adalah keputusan baru, bukan hasil ekstraksi dari produk lama.

**Keputusan arah yang dipilih pengguna:** palet & tipografi arah "Bata" (terakota + pasir, Bricolage Grotesque + Archivo); logo diwarnai ulang mengikuti palet baru (larangan ungu tetap berlaku); mode default mengikuti sistem; kepadatan "nyaman"; radius lembut 8px; **tanpa ilustrasi** — empty state memakai ikon besar + copy ramah.

---

## Prinsip

1. **Tenang, kredibel, presisi.** Produk ini memegang uang orang lewat escrow. Kejelasan menang atas ekspresi visual.
2. **Energi lewat aksen, bukan seluruh palet.** Satu warna hidup (terakota) untuk aksi utama dan momen keberhasilan. Bodi antarmuka tetap netral.
3. **Mudah dipindai > menarik perhatian.** Kalau harus memilih, selalu pilih mudah dipindai.
4. **Status uang selalu terlihat.** Di setiap tahap, pengguna tahu di mana dananya dan apa syarat berpindahnya.
5. **Dua permukaan, satu sistem.** Landing/onboarding/register boleh lega dan berani; dashboard/kontrak/escrow/dompet/admin tenang dan padat data.

---

## CONTENT FUNDAMENTALS

**Bahasa.** Indonesia sehari-hari yang sopan, tanpa jargon perbankan dan tanpa bahasa gaul yang cepat basi. Hindari campur-campur Inggris kecuali istilah yang sudah jadi milik pengguna: *escrow*, *chat*, *upload*, *deadline*, *portofolio*, *review*.

**Sapaan.** Sistem menyapa pengguna dengan **"kamu"** (mahasiswa maupun pemilik UMKM — ini menjaga tone hangat dan setara). Sistem menyebut dirinya **"StairsLife"**, bukan "kami" yang samar, terutama saat menjelaskan siapa yang menahan dana: "Dana ditahan StairsLife sampai kamu setuju." Untuk pihak lain, pakai nama aslinya ("Kopi Senja Malang", "Rani"), bukan "klien"/"pekerja".

**Casing.** Sentence case di mana-mana — judul, tombol, label, header tabel. ALL CAPS hanya pada overline 10px (`--text-overline`) untuk kepala kelompok. Jangan Title Case Setiap Kata.

**Tombol** memakai kata kerja + objek bila perlu: "Lamar proyek", "Bayar ke escrow", "Setujui & lepas dana", "Tarik dana", "Ajukan sengketa". Hindari "Submit", "OK", "Kirim" tanpa objek.

**Nominal & tanggal.** Uang: `Rp 2.500.000` (spasi setelah Rp, titik ribuan, tanpa desimal). Tanggal: `12 Sep 2026`. Waktu: `14:32`. Desimal & rating pakai koma: `4,8`. Angka besar di UI tidak disingkat (jangan "2,5jt") kecuali di grafik.

**Nada per momen:**
- *Sukses:* menyatakan yang sudah terjadi + nominalnya. "Dana masuk ke dompetmu. Rp 2.500.000 dari Kopi Senja Malang sudah tersedia."
- *Menunggu:* beri ekspektasi waktu. "Menunggu review Kopi Senja Malang. Biasanya dalam 2 hari kerja."
- *Error:* jelaskan penyebab dan jalan keluar, jangan menyalahkan. "Rekening BCA ····7890 tidak aktif. Coba rekening lain." Bukan "Invalid account".
- *Kosong:* kondisi apa adanya + ekspektasi + satu aksi. "Belum ada lamaran masuk. Proyekmu baru tayang 2 jam lalu; lamaran pertama biasanya datang dalam sehari."
- *Berisiko:* sebutkan konsekuensi terhadap dana sebelum tombol. "Setelah disetujui, Rp 2.500.000 langsung dilepas dan tidak bisa ditarik kembali."

**Yang dihindari:** emoji (tidak dipakai sama sekali di UI), tanda seru berlebihan, "Oops!", "Yuk!", huruf kapital untuk penekanan, bahasa menggurui ("Seperti yang kamu tahu…"), dan janji yang tak bisa dijamin ("aman 100%").

---

## VISUAL FOUNDATIONS

**Palet.** Netral **pasir/kertas hangat** (`--sand-25` `#FCF8F2` sampai `--sand-950` `#231D18`) sebagai bodi antarmuka — hangat, bukan abu netral, jauh dari kesan bank. Satu aksen: **terakota** `--clay-600` `#B4531F` untuk aksi utama, status escrow, dan elemen aktif. Semantik: hijau `#16704F` (aman/selesai), kuning `#A16207` (menunggu), merah `#B42318` (sengketa/gagal), biru `#1D4ED8` (info netral, **hanya** untuk tautan bantuan dan toast informasi — tidak pernah untuk status proyek). Maksimal dua warna latar per layar (kertas + putih permukaan). **Tidak ada ungu/indigo/violet** di seluruh sistem.

**Badge status.** Chip kecil, radius 4px, garis rambut 1px sewarna keluarga isiannya, titik 5px — bukan pill besar tanpa garis. Sembilan tahap semuanya hidup di dalam palet hangat; “Sedang dikerjakan” justru memakai chip garis netral karena itu tahap yang paling sering muncul dan tidak perlu berebut perhatian. Hanya “Selesai” berlatar penuh (hijau solid). Chip tint berwarna dingin di atas permukaan hangat adalah pola yang sengaja dihindari: warnanya tidak berasal dari palet dan membuat antarmuka terlihat seperti tempelan dari sistem lain.

**Kontras.** Diukur, bukan dikira-kira. Teks body `#33291F` pada kertas `#FCF8F2` = 12,4:1. Muted `#6A5D53` = 6,0:1. Subtle `#7B6B5B` = 4,8:1 pada kertas dan 5,1:1 pada putih — nilai ini sengaja digelapkan dari `#857567` (4,2:1) yang gagal AA untuk caption 11–12px. Terakota `#B4531F` dengan teks putih = 5,0:1. Semua teks ≥ 4,5:1 (WCAG AA), termasuk caption, label sumbu grafik, dan teks sekunder tabel. Di mode gelap terakota dinaikkan ke `#E0763A` dengan teks gelap `#26130A`, dan subtle jadi `#948477` (4,9:1 di atas permukaan gelap).

Aturan turunan: **jangan menambah warna teks netral baru.** Hanya empat tingkat — strong, body, muted, subtle. Apa pun yang lebih terang dari subtle gagal AA pada kertas.

**Isian semantik solid selalu berpasangan.** Setiap warna isian solid punya token teksnya sendiri, dan keduanya berubah bersama tema: `--primary` → `--text-on-primary`, `--danger` → `--text-on-danger`, `--success` → `--text-on-success`, `--warning` → `--text-on-warning`. Di mode terang keempatnya putih; di mode gelap isiannya menerang sehingga teksnya menjadi gelap (`#26130A`, `#2A0D0A`, `#05170F`, `#241703`). **Jangan pernah menulis `color: "#fff"` di atas isian semantik** — putih di atas `--danger` mode gelap hanya 3,6:1 dan gagal AA. Aturan ini berlaku untuk tombol destruktif, bulatan pesan error, centang terverifikasi, badge hitung belum-dibaca, dan titik stepper.

Rasio per mode (terang / gelap): primary 5,0 / 5,8 · danger 6,6 / 5,0 · success 6,1 / 6,3 · warning **4,9** / 6,4. Satu angka tidak bisa benar untuk kedua mode.

Pasangan paling ketat di seluruh sistem adalah **`--warning` terang** `#A16207` + putih di 4,9:1 — hanya 0,4 di atas ambang AA. Yang paling ketat di mode gelap adalah `--danger` `#E4594C` di 5,0:1, nilai yang sengaja diterangkan dari `#D8483C` (4,2:1, gagal AA). **Jangan menggelapkan kuning mode terang atau merah mode gelap, dan jangan memberi tint pada teks di atas keduanya** — keduanya sudah nyaris menyentuh ambang, jadi perubahan sekecil apa pun menjatuhkannya.

**Jangan pernah meredam teks dengan alpha di atas latar berwarna.** Tulis `--text-on-*` pada opasitas penuh, bukan `opacity: .75` atau `color-mix` untuk membuat tingkat kedua. Alasannya terukur: putih 92% di atas `--warning` #A16207 membaur menjadi #F7F2EB = 4,44:1 dan gagal AA — padahal putih penuh 4,9:1 dan lolos. Kalau butuh dua tingkat teks di atas isian berwarna, **ganti permukaannya**, jangan turunkan opasitasnya. Ini juga berlaku untuk label 9–11px di atas swatch dan chip.

**Permukaan brand tetap.** Set-piece brand — panel pendaftaran, blok “Untuk bisnis”, footer, pita CTA — **tidak boleh** memakai `--bg-inverse` atau `--primary` sebagai latar. Keduanya berubah bersama tema: `--bg-inverse` artinya “kebalikan tema saat ini”, jadi di mode gelap ia menjadi terang dan setiap anak yang memaku `rgba(255,255,255,…)` ikut hilang; `--primary` di mode gelap menjadi `#E0763A`, dan teks putih di atasnya hanya 3,1:1. Pakai permukaan tetap yang datang lengkap dengan pasangan teksnya:

- Tinta: `--ink-surface` `#231D18` — teks `--ink-text` (13,7:1), `--ink-text-muted` (8,2:1), `--ink-text-subtle` (5,1:1), aksen `--ink-accent` (8,0:1), centang `--ink-success` (9,4:1), isian `--ink-fill`, garis `--ink-border`.
- Terakota: `--clay-surface` `#B4531F` — teks **hanya** `--clay-surface-text` `#FFFFFF` (5,0:1). Teks bertint apa pun jatuh di bawah 4,5:1, jadi di permukaan ini tidak ada tingkat teks sekunder: kalau butuh dua tingkat, ganti permukaannya.

Komponen yang dipasang di atas permukaan tinta butuh mode sendiri — mis. `<ContractStepper surface="ink">`. Tanpa itu komponen memakai token tema dan di mode terang menghasilkan teks gelap di atas latar gelap.

**Papan tombol & pembaca layar.** Setiap kontrol yang bisa diklik harus benar-benar bisa difokuskan, bukan `<span>` ber-`onClick`. Cincin fokus global sudah didefinisikan di `tokens/base.css` untuk `button, a, input, select, textarea, [tabindex]` — jangan menulis `outline: none` di atasnya. Yang perlu perhatian khusus:

- `Rating` mode `editable` adalah `role="radiogroup"` dengan lima `role="radio"`, roving tabIndex, panah/Home/End, dan Space/Enter. Di alur ulasan bintang adalah kolom wajib, jadi versi yang hanya bisa diklik mouse membuat langkah terakhir alur kontrak mustahil diselesaikan tanpa mouse.
- `Modal` menutup dengan Esc kecuali `dismissible={false}` (dipakai untuk keputusan dana, di mana admin harus memilih).
- `SearchField` mengosongkan dan menutup dengan Esc.
- Area sentuh 44px berlaku juga untuk kontrol kecil seperti bintang dan tombol ikon — perbesar area, bukan glyph-nya.

**Tipografi.** Display **Bricolage Grotesque** (600, tracking −0.03em) hanya untuk judul dan hero. Teks & UI **Archivo** (400/500/600/700). Tidak ada font mono: nominal memakai Archivo + `font-variant-numeric: tabular-nums`, sehingga kolom uang selalu rata. Ukuran: display 44→68px, h1 28→32px, h2 22px, h3 18px, body 15px (aplikasi) / 17px (landing), label 13px, caption 12px, overline 10px.

**Latar & set-piece.** Tanpa gradasi, tanpa mesh, tanpa glassmorphism, tanpa foto full-bleed di aplikasi. Landing memakai blok warna datar (kertas, pasir, terakota) dan tipografi besar sebagai set-piece; pola/tekstur tidak dipakai. Aksen grafis satu-satunya adalah **bentuk balok tangga dari logo** sebagai blok datar — bukan ilustrasi bergambar. Empty state: ikon Lucide besar dalam lingkaran pasir, tanpa ilustrasi (keputusan sistem — bila nanti ilustrator masuk, ganti di `EmptyState`).

**Kartu.** Putih (`--bg-surface`), garis 1px `--border-subtle`, radius 12px, **tanpa shadow**. Hover (kartu yang bisa diklik): naik 1px + garis menguat + shadow-xs. Kartu terpilih: garis terakota. Footer kartu berlatar pasir `--bg-subtle` dengan garis pemisah. Tidak ada aksen garis kiri berwarna, tidak ada kartu bergradasi.

**Radius.** 4px (checkbox, badge), 6px (chip/tag), **8px (tombol, input, select)**, 12px (kartu, modal desktop), 16px (bottom sheet), 24px (blok landing). Pill hanya untuk chip, avatar, dan indikator bulat — tombol tidak pernah pill.

**Garis & shadow.** Garis mengerjakan pekerjaan yang biasanya diberikan ke shadow. Shadow hanya untuk lapisan yang benar-benar mengapung: dropdown (`--shadow-sm`), toast (`--shadow-md`), modal (`--shadow-lg`). Warna shadow hangat (`rgba(60,42,28,…)`), bukan hitam netral.

**Transparansi & blur.** Nyaris tidak dipakai. Overlay modal `rgba(35,29,24,.48)` dengan `backdrop-filter: blur(2px)` — satu-satunya blur di sistem. Tidak ada panel semi-transparan di atas konten data.

**Hover, press, focus.** Hover: warna satu langkah lebih gelap (primary → `--primary-hover`), atau latar `--bg-hover` untuk elemen netral — bukan perubahan opacity. Press: `translateY(1px)` + warna `--primary-active`, 80ms. Focus: `outline 3px` `--focus-ring` (terakota 32% alpha) dengan offset 2px — terlihat jelas di kedua mode. Baris tabel hover: latar `--bg-hover`, tanpa perubahan ukuran.

**Gerak.** Halus dan singkat: 140ms untuk warna/hover, 200ms untuk panel/tab/toast, 320ms untuk modal dan bottom sheet, 520ms khusus perpindahan status escrow (perubahan yang menyangkut uang bergerak lebih lambat agar terbaca). Easing `cubic-bezier(.2,0,0,1)`. Tanpa bounce, tanpa spring, tanpa animasi masuk pada angka saldo. `prefers-reduced-motion` memangkas semua durasi ke 1ms.

**Layout.** Mobile-first, breakpoint 360 / 768 / 1280. Mobile: satu kolom, padding 16px, bottom nav 60px + safe area, tombol utama sticky di bawah. 768: dua kolom, top bar. 1280: sidebar 248px + konten maksimum 1152px, padding 32px. Elemen fixed: sidebar (desktop), bottom nav dan sticky action bar (mobile), toast di tengah-bawah mobile / atas desktop.

**Kepadatan.** "Nyaman": baris tabel 52px, sel 12/16px, tinggi kontrol 36/44/52px, target sentuh minimum 44px di semua viewport.

**Citra.** Tidak ada foto stok di sistem ini. Bila nanti dipakai, arahnya: hangat, cahaya alami, subjek nyata (mahasiswa, kedai, warung), tanpa filter dingin dan tanpa grain berat — supaya menyatu dengan netral pasir.

---

## ICONOGRAPHY

Tidak ada aset ikon di sumber yang diberikan (tidak ada codebase, sprite, atau icon font). Sistem ini memakai **Lucide** dari CDN — **substitusi yang perlu dikonfirmasi**: `https://unpkg.com/lucide@0.469.0/dist/umd/lucide.js`. Alasan pemilihan: garis tunggal, stroke seragam, ujung membulat, netral secara merek, dan tersedia sebagai paket npm `lucide-react` untuk implementasi Next.js.

**Aturan pakai.** Ukuran 16px (inline dalam teks), **20px (default UI)**, 24px (navigasi), 28–36px (empty state). Stroke 1.75 (jangan di bawah 1.5). Warna mengikuti `currentColor`; ikon di item nav aktif memakai `--primary`, ikon netral `--text-subtle`. Ikon selalu dekoratif (`aria-hidden`) — makna dibawa teks pendampingnya. Jangan mencampur ikon garis dengan ikon isi. **Emoji tidak pernah dipakai sebagai ikon**, dan karakter unicode (✓, ×, →) hanya dipakai di dalam elemen yang sudah punya arti (centang di checkbox, × pada tag) — bukan sebagai ikon mandiri.

**Ikon inti produk:** `ShieldCheck` (escrow/aman), `Wallet` (dompet), `FileText` (kontrak), `Briefcase` (proyek), `Send` (lamaran), `Users` (pelamar), `MessageSquare` (chat), `Star` (rating), `BadgeCheck` (terverifikasi), `Scale` (sengketa), `Upload`/`Paperclip` (berkas), `LayoutDashboard`, `Search`, `Bell`, `Home`, `ChevronRight`, `Inbox` (kosong).

Bila StairsLife nanti punya set ikon sendiri, ganti isi `components/actions/Icon.jsx` — seluruh sistem memanggil ikon lewat komponen itu.

---

## Aset

## Indeks

**Mulai dari `index.html` di root** — hub berisi navigasi kiri ke semua UI kit, template, kartu komponen, kartu fondasi, dan berkas perbandingan, dengan pratinjau langsung di sebelahnya. Ada pengalih lebar (penuh / 768 / 390) dan pengalih mode terang–gelap, jadi seluruh sistem bisa diperiksa tanpa berpindah halaman.

`assets/`
- `logo-mark.svg` — mark 3 balok datar, `fill="currentColor"`. **Hanya untuk favicon dan SVG inline** — jangan dipakai lewat `<img src>`: `<img>` tidak mewarisi `color` dari induknya, jadi `currentColor` selalu jatuh ke hitam. Untuk ikon di dalam markup pakai `logo-mark-wood.svg` yang fill-nya eksplisit.
- `logo-mark-wood.svg` — **mark kayu utama, tone teak** `#C09154` dengan serat halus. Serat dibuat dengan filter noise di dalam SVG (bukan gambar raster), jadi tetap tajam di segala ukuran. Teak dipilih karena bekerja di mode terang **dan** gelap dengan satu file: walnut gelap hampir lenyap di sidebar gelap `#1C1613`, sehingga akan menuntut aset kedua.
- `logo-mark-wood-teak.svg` — sama dengan di atas (alias eksplisit).
- `logo-mark-wood-walnut.svg` — varian walnut pekat `#53331D` untuk cetak dan merchandise, di mana latarnya selalu terang dan ukurannya besar.
- **`logo-lockup.svg`** — lockup vektor: mark kayu + wordmark sebagai `<text>` dengan `fill="currentColor"`. Untuk **web dan skala apa pun di browser**.
- **`logo-lockup-print.png`** (3216×768) dan **`logo-lockup-print-dark.png`** — lockup untuk **cetak dan pihak ketiga**. Dirender di browser dengan Bricolage Grotesque yang benar-benar dimuat, jadi bentuk hurufnya persis; 3216px setara 300 DPI pada lebar 27 cm, cukup untuk kartu nama sampai poster A2. Versi `-dark` berwordmark krem untuk latar gelap dan terakota.
- Di dalam antarmuka, **jangan** `<img>` ke berkas lockup — pakai komponen **`Logo`** (`components/brand/`), yang merender wordmark sebagai teks hidup dalam `--font-display`.
- `assets/lockup-export.html` adalah papan render yang menghasilkan kedua PNG di atas. Ubah warna wordmark di dalamnya lalu ambil ulang lewat snapshot bila perlu varian lain.

**Kenapa ada dua bentuk.** SVG dengan `<text>` sempurna di browser, tapi bergantung pada font yang terpasang di mesin yang membukanya — dikirim ke percetakan tanpa Bricolage Grotesque, hurufnya diganti dan logonya salah bentuk. PNG resolusi tinggi tidak punya masalah itu: bentuk hurufnya sudah terkunci. Untuk cetak ukuran raksasa (spanduk, mural) yang butuh vektor sejati, buka SVG-nya di Illustrator dan jalankan **Type → Create Outlines** lebih dulu.

Berkas `logo-lockup*.png` lama (hasil ekstraksi dari foto) sudah tidak dipakai di sistem dan hanya tersisa di `explorations/` sebagai bahan pembanding.

Aturan varian kayu: pakai kayu bila logo tampil ≥ 22px. Di bawah itu, dan di semua konteks padat data, pakai `logo-mark.svg` datar **sebagai SVG inline** (bukan `<img>`) — serat tidak terbaca dan hanya membuat balok kelihatan kotor. Lockup PNG berhenti di lebar 132px; lebih kecil dari itu pakai mark kayu ditambah wordmark tipografi (Bricolage Grotesque 15,5px, tracking −0,02em). Pasangan latar: **teak + pasir** `#F1E7D9` untuk header dan sidebar aplikasi, **teak + tinta** `#231D18` untuk hero dan cover. Terakota tetap warna tombol dan aksen, **bukan** latar logo — kayu dan terakota bertetangga di roda warna dan akan berebut. Token `--wood-*` hanya untuk logo; **jangan** dipakai sebagai warna permukaan atau teks UI.

Lockup tidak lagi bergantung pada aset raster: wordmark-nya di-set dengan Bricolage Grotesque, jadi `assets/logo-lockup.svg` dan komponen `Logo` sama-sama vektor. Untuk kirim ke percetakan, buka SVG-nya di editor vektor dan ubah teksnya menjadi path lebih dulu — supaya tidak bergantung pada font yang terpasang di mesin percetakan.

**Font (keputusan final: pakai yang gratis).** Bricolage Grotesque + Archivo keduanya Google Fonts dengan SIL Open Font License — bebas dipakai untuk produk komersial, tanpa biaya lisensi. Tidak ada font berbayar di sistem ini dan tidak perlu ada. Untuk produksi Next.js pakai `next/font/google` (bukan tag CDN) supaya font ikut ter-*self-host*, tidak ada permintaan ke server pihak ketiga, dan tidak ada pergeseran layout saat font dimuat:

```js
import { Bricolage_Grotesque, Archivo } from "next/font/google";
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const sans = Archivo({ subsets: ["latin"], variable: "--font-sans" });
```

Sisa catatan lama: `tokens/fonts.css` memuat keduanya dari CDN karena kartu spesimen dan UI kit di repo ini berjalan sebagai HTML statis. Di aplikasi Next.js, ganti dengan potongan di atas. Berkas `.woff2` tidak perlu disimpan di repo — `next/font` mengunduh dan menyimpannya sendiri saat build. Berkas asli `/public/fonts` dan ganti `@import` dengan `@font-face` lokal.

---

## Index

**Root**
- `styles.css` — satu-satunya entry CSS (hanya daftar `@import`).
- `readme.md` — dokumen ini.
- `SKILL.md` — pembungkus agar sistem ini bisa dipakai sebagai Agent Skill.
- `thumbnail.html` — tile sistem di homepage.

**Token** (`tokens/`): `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css`.

**Kartu spesimen** (`guidelines/`): 25 kartu — warna (primary, netral, semantik, status, arus dana, mode gelap, resep permukaan, aturan permukaan, permukaan brand tetap, isian solid & pasangan teks), tipografi (display, judul, teks, angka, meta), spasi (skala, ritme, tinggi kontrol, radius, elevasi, gerak, breakpoint), brand (logo, pemakaian logo, logo kayu).

**Komponen** (`components/`)
- `actions/` — **Button**, **IconButton**, **Icon**
- `forms/` — **Input**, **Textarea**, **Select**, **Checkbox**, **Radio** (+ **RadioCard**), **FileDropzone**, **SearchField**, **Switch**
- `data/` — **Card**, **StatusBadge** (+ **Tag**), **Avatar** (+ **AvatarGroup**), **Rating**, **Money**, **DataTable**, **Pagination**
- `feedback/` — **Modal**, **Toast** (+ **ToastStack**), **EmptyState**, **Skeleton** (+ **SkeletonCard**, **SkeletonTable**), **StatusTimeline**, **VerificationBanner**, **NotificationCenter**, **MediaSlot**
- `brand/` — **Logo**
- `marketing/` — **HowItWorks**, **FeatureCarousel** (khusus landing & onboarding)
- `navigation/` — **Sidebar**, **BottomNav**, **Tabs**, **ContractStepper**
- `jobs/` — **JobCard**, **FilterPanel**, **QRPayment** (setor dana ke escrow, bukan paket)
- `charts/` — **MetricCard**, **LineChart**, **DonutChart** (khusus panel admin)

`feedback/` juga memuat **StatusTimeline** (riwayat status berkap waktu) dan **VerificationBanner** (banner akun belum terverifikasi).
- `chat/` — **ChatBubble**

Setiap direktori punya `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, dan satu kartu `*.card.html`.

**Intentional additions** (di luar daftar komponen di brief):
- `Icon` — pembungkus glyph Lucide; tanpa ini setiap layar akan menempel SVG sendiri.
- `SearchField` — kolom pencarian yang melebar (pill → tombol ikon bulat + kolom lebar, sambungan gooey); diminta pengguna sebagai pola tunggal untuk semua fungsi cari.
- `MetricCard`, `LineChart`, `DonutChart` — grafik untuk panel admin (kartu metrik bertren, garis+area, donut antrean). Sengaja **hanya** untuk admin: layar mahasiswa dan bisnis cukup dengan angka, status, dan stepper.
- `NotificationCenter` — lonceng + panel notifikasi di topbar. Satu-satunya tempat kejadian penting berkumpul lintas halaman; halaman notifikasi penuh tetap ada untuk riwayat dan filter.
- `MediaSlot` — tempat gambar yang belum terisi (portofolio, KTM, QRIS, bukti transfer). Ikon besar, bukan kotak putus-putus yang terbaca sebagai gambar gagal muat.
- **HowItWorks**, **FeatureCarousel** — dua pola marketing yang diminta pengguna dari 21st.dev, **ditulis ulang** dengan token sistem ini. Yang sengaja dibuang dari pola aslinya: confetti dan angka beranimasi di pricing (halaman yang menagih uang tidak boleh terasa main-main), kartu 3D bertumpuk di carousel (menyembunyikan isi), dan efek glow di stepper (tidak ada glow di sistem ini). Tujuh pola 21st.dev lain ditolak — alasannya tercatat di `CAKUPAN.md`.
- `Switch` — toggle untuk pengaturan yang berlaku seketika (moderasi aktif/nonaktif, mode maintenance, preferensi notifikasi). Dibutuhkan halaman pengaturan admin, bisnis, dan mahasiswa; `Checkbox` tetap untuk pilihan yang baru berlaku setelah Simpan.
- `IconButton` — aksi hanya-ikon di baris tabel, modal, dan toolbar chat.
- `Money` — format `Rp 2.500.000` + nada arus dana; menjaga konsistensi angka di seluruh produk.
- `Tag`, `RadioCard`, `AvatarGroup`, `ToastStack`, `SkeletonCard`, `SkeletonTable` — varian pendamping komponen yang sudah diminta.

**UI kit** (`ui_kits/`): lihat `ui_kits/*/README.md`. Cakupan per aktor dan keputusan model produk ada di **`CAKUPAN.md`**.

`ui_kits/shared/ChatUlasan.jsx` dipakai bersama kit mahasiswa dan bisnis: `ChatJobBoard` (percakapan, hanya terbuka setelah lamaran diterima) dan `UlasanDuaArah` (ulasan yang terbit bersamaan supaya tidak bisa dipakai sebagai alat tekanan).

**Templates** (`templates/`) — titik awal yang bisa disalin proyek lain:
- `templates/landing/Landing.dc.html` — halaman landing (hero, kartu escrow, cara kerja, CTA).
- `templates/dashboard/Dashboard.dc.html` — shell aplikasi (sidebar peran, topbar, ringkasan saldo & escrow, kontrak berjalan).
- `templates/kontrak/Kontrak.dc.html` — halaman kontrak & escrow (stepper enam tahap, rincian termin, pihak dalam kontrak). Prop `tahap` bisa digeser untuk melihat tiap tahap.
- `templates/admin/Admin.dc.html` — panel admin (kartu metrik bertren, grafik dana escrow, donut antrean moderasi, tabel sengketa).
