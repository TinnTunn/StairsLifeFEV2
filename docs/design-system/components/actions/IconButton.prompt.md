Tombol hanya-ikon untuk aksi sekunder yang tidak butuh label: tutup modal, menu baris tabel, lampiran chat, toggle tema.

```jsx
<IconButton label="Tutup" variant="ghost" onClick={close}><Icon name="X" /></IconButton>
<IconButton label="Unduh bukti bayar" variant="outline" size="lg"><Icon name="Download" /></IconButton>
<IconButton label="Hapus lampiran" variant="danger"><Icon name="Trash2" /></IconButton>
```

Catatan: di layar mobile pakai `size="lg"` (44px). `label` tidak boleh dikosongkan.

Ukuran: `sm` 36px hanya untuk baris tabel padat dan toolbar desktop. Untuk apa pun yang disentuh di mobile — termasuk tombol menu, tutup, dan pengalih tema di topbar — pakai default `md` (44px) atau `lg` (52px).
