# UI Kit — Panel Admin

Permukaan moderasi internal. Paling padat data di seluruh produk: tabel, angka, dan status — tanpa dekorasi.

Buka `index.html`. Navigasi kiri berpindah antara **Ikhtisar**, **Verifikasi identitas**, **Moderasi proyek**, **Sengketa escrow**, dan **Pengguna**.

## Isi

| Rute | Isi |
|---|---|
| Ikhtisar | Kartu metrik bertren (MetricCard), grafik garis dana dilepas 6 bulan (LineChart), donut antrean moderasi (DonutChart), dan tabel aliran dana 7 hari |
| Verifikasi identitas | Tab menunggu/ditolak/semua, tabel pengguna dengan aksi Setujui / Tolak per baris |
| Moderasi proyek | Kartu laporan proyek dengan alasan, aksi Loloskan / Turunkan |
| Sengketa escrow | Antrean sengketa (ID, pihak, dana ditahan, umur kasus), panel bukti percakapan, modal keputusan tiga opsi (lepas ke mahasiswa / bagi dua / kembalikan ke bisnis) |
| Pengguna | Sengaja dibiarkan kosong dengan disclaimer — layar ini tidak ada di sumber desain |

## Catatan desain

- Keputusan sengketa memakai `Modal` dengan `dismissible={false}` dan `tone="danger"`: admin harus memilih, tidak bisa menutup dengan Esc.
- Nominal yang ditahan selalu memakai `tone="held"` (terakota) dan yang dilepas `tone="in"` (hijau), konsisten dengan sisi pengguna.
- Bukti percakapan memakai `ChatBubble` yang sama dengan chat pengguna, termasuk catatan sistem escrow — jejak audit dan tampilan chat adalah satu hal yang sama.
