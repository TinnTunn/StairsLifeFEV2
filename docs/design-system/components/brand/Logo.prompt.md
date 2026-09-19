Lockup StairsLife — pakai ini, jangan `<img>` ke berkas lockup raster.

```jsx
{/* header aplikasi, sidebar */}
<Logo size={22} basePath="../../assets" />

{/* di permukaan tinta (panel brand, footer) */}
<Logo size={28} color="var(--ink-text)" basePath="../../assets" />

{/* favicon-scale atau konteks padat data — mark saja, kayu datar */}
<Logo size={18} wordmark={false} wood="flat" basePath="../../assets" />
```

Kenapa teks hidup, bukan gambar: wordmark yang di-render sebagai teks tetap tajam di segala ukuran, ikut warna induknya, dan tidak perlu dua berkas untuk mode terang dan gelap. Berkas raster lockup lama diekstrak dari foto dan pecah di atas 132px.

Untuk keperluan di luar web:

- **Cetak dan pihak ketiga** → `assets/logo-lockup-print.png` (3216×768, wordmark tinta) atau `logo-lockup-print-dark.png` (wordmark krem). Bentuk hurufnya sudah terkunci, jadi tidak bisa berubah di mesin mana pun. Setara 300 DPI pada lebar 27 cm — cukup untuk kartu nama sampai poster A2.
- **Vektor sejati untuk ukuran raksasa** → `assets/logo-lockup.svg`, tapi jalankan **Type → Create Outlines** di Illustrator lebih dulu. Tanpa itu, mesin yang tidak punya Bricolage Grotesque akan mengganti fontnya dan logonya salah bentuk.

Varian kayu: `teak` untuk semua pemakaian normal, `walnut` untuk cetak di latar terang berukuran besar, `flat` di bawah 22px karena serat tidak terbaca dan hanya membuat balok kelihatan kotor.

`flat` dirender sebagai SVG inline dengan `fill="currentColor"` — itulah gunanya varian ini, jadi baloknya ikut warna teks di sekitarnya. Jangan pernah memuat `assets/logo-mark.svg` lewat `<img src>`: elemen `<img>` tidak mewarisi `color` dari induknya, sehingga `currentColor` jatuh ke hitam — warna yang tidak ada di palet ini.
