Pagination untuk tabel dan daftar panjang.

```jsx
<Pagination page={1} pageCount={25} total={248} perPage={10} onChange={setPage} />
```

Aturan: selalu isi `total` + `perPage` agar pengguna tahu posisinya ("1–10 dari 248"). Tombol berukuran 40px; di mobile cukup panah + halaman aktif.
