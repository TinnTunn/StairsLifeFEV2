Rating bintang untuk profil mahasiswa, profil bisnis, dan form ulasan.

```jsx
<Rating value={4.8} count={23} />
<Rating value={nilai} editable onChange={setNilai} size="lg" label="Seberapa puas kamu dengan hasilnya?" />
```

Aturan: angka rating ditulis dengan koma ("4,8"), bukan titik. Bintang memakai kuning peringatan (`--warning`), bukan terakota — agar tidak tertukar dengan aksi utama.

Mode `editable` adalah kontrol sungguhan, bukan span ber-onClick: `role="radiogroup"` dengan lima `role="radio"`, roving tabIndex, panah/Home/End untuk memilih, Space/Enter untuk mengunci, dan area sentuh 44px per bintang. Jangan menggantinya dengan versi buatan sendiri — pada alur ulasan bintang adalah kolom wajib, jadi versi yang hanya bisa diklik mouse membuat langkah terakhir alur kontrak tidak bisa diselesaikan dengan papan tombol.
