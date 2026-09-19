Satu-satunya kolom pencarian di StairsLife. Jangan memakai `Input` dengan ikon kaca pembesar untuk fungsi cari — selalu komponen ini, supaya animasi melebarnya konsisten di seluruh produk.

```jsx
{/* topbar / toolbar: melebar dari 216 → 380 */}
<SearchField label="Cari ID kontrak atau pengguna" placeholder="Cari ID kontrak atau pengguna" onSubmit={cari} />

{/* halaman pencarian & panel sempit: mengisi lebar induk */}
<SearchField fullWidth size="lg" placeholder="Cari proyek, keahlian, atau bisnis" onChange={(e) => setQ(e.target.value)} />

{/* tanpa efek gooey (mis. di dalam tabel padat) */}
<SearchField gooey={false} collapsedWidth={180} expandedWidth={300} />
```

Perilaku: klik ikon atau fokus → terbuka; Esc mengosongkan dan menutup; blur dengan kolom kosong menutup kembali; tombol × muncul begitu ada isi. Ikon berubah jadi terakota saat terbuka.

Catatan: pill 999px di sini adalah pengecualian yang disengaja — bentuk melingkar itu bagian dari gerakannya. Kontrol lain tetap radius 8px.
