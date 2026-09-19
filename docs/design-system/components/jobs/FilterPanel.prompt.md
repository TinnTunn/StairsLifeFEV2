Panel filter untuk daftar lowongan. Satu komponen, dua bentuk: hilangkan prop `open` untuk sidebar desktop, kirim boolean untuk bottom sheet mobile.

```jsx
{/* desktop: sidebar tetap */}
<FilterPanel groups={GRUP} value={filter} onChange={setFilter} onReset={() => setFilter({})} />

{/* mobile: bottom sheet */}
<FilterPanel open={buka} onClose={() => setBuka(false)} resultCount={hasil.length}
  groups={GRUP} value={filter} onChange={setFilter} onReset={() => setFilter({})} />
```

```js
const GRUP = [
  { key: "kategori", label: "Kategori", multi: true, options: [{ label: "Desain", count: 24 }, { label: "Pemasaran", count: 18 }] },
  { key: "tipe", label: "Tipe kerja", options: ["Penuh waktu", "Paruh waktu", "Magang", "Remote"] },
];
```

Chip filter aktif selalu tampil di atas grup — tanpa itu pengguna tidak tahu filter apa yang sedang menyembunyikan hasil, dan menyimpulkan produknya kosong.

Pilihan dalam satu grup dirender **dua kolom** otomatis. Satu kolom membuat sembilan pilihan memakan ~500px tinggi dan pengguna harus scroll hanya untuk melihat filter yang tersedia. Pakai `columns: 1` hanya bila labelnya panjang (nama institusi, misalnya).

Batas lebar: track minimum 104px, jadi dua kolom butuh 220px ruang isi. Panel yang lebih sempit dari itu akan jatuh ke satu kolom tanpa peringatan — beri wadahnya minimal **264px** (padding kartu 2×20px sudah dihitung), dan 300px kalau labelnya sepanjang "Desain grafis".
