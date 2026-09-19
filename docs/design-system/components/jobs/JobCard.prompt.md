Kartu lowongan. Jangan menyusun kartu lowongan sendiri dari `Card` — konsistensi kartu ini menentukan rasa produk karena ia muncul di enam halaman berbeda.

```jsx
{/* daftar publik & hasil pencarian */}
<JobCard job={lowongan} onOpen={() => buka(lowongan)} onSave={() => simpan(lowongan)} saved={tersimpan} />

{/* baris lebar di halaman tersimpan */}
<JobCard variant="list" job={lowongan} applied onOpen={buka} />

{/* rekomendasi di sidebar dashboard */}
<JobCard variant="compact" job={lowongan} onOpen={buka} />

{/* dengan tombol lamar langsung */}
<JobCard job={lowongan} actions={<Button size="sm" onClick={lamar}>Lamar</Button>} />
```

Aturan: gaji selalu ditulis penuh (`Rp 2.500.000 – Rp 3.500.000`) atau `Nego`, tidak pernah disingkat. Untuk mahasiswa yang sudah login, `applied` wajib diisi — pelamar perlu tahu mana yang sudah dilamar sebelum membuka. Tag dipotong di empat; sisanya tidak ditampilkan karena baris tag yang membungkus merusak tinggi grid.
