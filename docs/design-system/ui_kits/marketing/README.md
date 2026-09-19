# UI Kit — Landing & Onboarding

Permukaan publik StairsLife: halaman landing dan alur pendaftaran + verifikasi identitas. Ini permukaan yang "boleh lebih ekspresif" — tipografi besar, blok warna datar, dan satu set-piece motif tangga dari logo. Tetap tanpa gradasi, tanpa glassmorphism, tanpa ilustrasi.

Buka `index.html`. Tombol **Daftar gratis** / **Mulai sebagai mahasiswa** membuka alur pendaftaran; setelah langkah ketiga muncul toast dan kembali ke landing.

## Berkas

| Berkas | Isi |
|---|---|
| `ScreenLanding.jsx` | Nav sticky, hero + kartu escrow hidup, "Cara kerja" 3 langkah, blok dua audiens (mahasiswa terang / bisnis tinta), proyek terbaru, CTA terakota, footer |
| `ScreenRegister.jsx` | Tiga langkah: pilih peran (RadioCard) → data akun (validasi email nyata) → verifikasi identitas (dropzone KTM + rekening). Panel kiri memakai `ContractStepper` sebagai indikator progres |

## Catatan desain

- Hero memakai `--text-display-1` (44px di 360px, 68px di 1280px) dan kartu proyek nyata sebagai bukti sosial, bukan mockup kosong.
- Blok "Untuk bisnis", footer, dan panel pendaftaran memakai **permukaan brand tetap** `--ink-surface` — bukan `--bg-inverse`, yang membalik bersama tema dan membuat semua teks di dalamnya hilang di mode gelap. Pita CTA memakai `--clay-surface`, bukan `--primary`, karena `--primary` di mode gelap menjadi #E0763A dan teks putih di atasnya hanya 3,1:1.
- `ContractStepper` di panel pendaftaran memakai `surface="ink"`.
- Motif `Tangga` (tiga balok datar dari logo) hanya dipakai sekali, di CTA. Jangan diulang di banyak seksi.
- Semua tombol utama ≥44px; di mobile tombol hero menjadi tumpukan penuh lebar.
