Toggle untuk pengaturan yang berlaku langsung — bukan untuk pilihan di dalam formulir.

```jsx
<Switch label="Moderasi lowongan sebelum tayang" checked={moderasi}
  onChange={(e) => setModerasi(e.target.checked)}
  description="Jika dimatikan, lowongan langsung tayang tanpa review admin." />
```

Aturan: `Switch` berlaku seketika (pengaturan sistem, preferensi notifikasi, mode maintenance); `Checkbox` untuk pilihan yang baru berlaku setelah tombol Simpan. `description` sebaiknya menyebut **akibat** menyalakannya, bukan mengulang label.
