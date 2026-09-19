Karosel kategori untuk landing — chip di atas, satu panel isi di bawah.

```jsx
<FeatureCarousel items={[
  { id: "desain", label: "Desain grafis", icon: <Icon name="Palette" size={16} />, count: 18,
    title: "Logo, brand kit, dan kemasan",
    body: "Paling banyak dicari UMKM yang baru buka. Rata-rata proyek selesai dalam dua minggu.",
    meta: [{ label: "Lowongan aktif", value: "18" }, { label: "Rata-rata nilai", value: "Rp 1.800.000" }],
    action: <Button size="sm">Lihat lowongan desain</Button> },
]} />
```

Perbedaan sengaja dari pola aslinya: **tanpa kartu 3D bertumpuk.** Tumpukan kartu menyembunyikan isi di belakang kartu depan — pengguna tidak tahu ada apa saja sampai menunggu putaran. Di sini semua kategori selalu terbaca sebagai chip, dan yang berganti hanya panelnya. Auto-play jadi bonus, bukan satu-satunya jalan.

Hanya untuk permukaan marketing. Di dalam aplikasi, kategori adalah **filter**, bukan pameran — pakai `FilterPanel` atau `Tabs`.

Dua hal yang mudah salah:

- `aside` opsional, dan kolom kanan 220px **hanya dibuat kalau item itu punya `aside`**. Kalau kolomnya dideklarasikan tanpa syarat, panel tanpa aside menyisakan 220px kosong dan kolom teksnya terperas.
- Nominal ditulis **penuh** (`Rp 1.800.000`), bukan disingkat. Penyingkatan "jt"/"rb" hanya berlaku di dalam grafik, tempat sumbu Y tidak punya ruang — bukan di teks meta.
