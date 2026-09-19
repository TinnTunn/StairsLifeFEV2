Tombol aksi utama StairsLife — pakai `primary` hanya untuk satu aksi terpenting di layar, `secondary` untuk aksi pendamping, `ghost` untuk aksi tersier/inline, `destructive` untuk hal yang tidak bisa dibatalkan (ajukan sengketa, batalkan kontrak).

```jsx
<Button variant="primary" size="lg" fullWidth onClick={lamar}>Lamar proyek</Button>
<Button variant="secondary" iconLeft={<Icon name="Bookmark" />}>Simpan</Button>
<Button variant="ghost" size="sm">Lihat detail</Button>
<Button variant="destructive" loading>Ajukan sengketa</Button>
```

Catatan:
- `size="md"` (44px) adalah default; `sm` (36px) hanya untuk toolbar desktop dan aksi di dalam baris tabel.
- Di mobile, tombol utama form selalu `fullWidth` dan menempel di sticky bar bawah.
- `loading` menonaktifkan klik dan menampilkan spinner; label tetap terlihat agar lebar tombol tidak melompat.
- Jangan menumpuk dua tombol `primary` bersebelahan.
