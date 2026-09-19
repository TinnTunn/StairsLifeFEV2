Tempat gambar yang belum terisi. Pakai ini, bukan `<div>` bergaris putus-putus.

```jsx
<MediaSlot ratio="1 / 1" size="lg" tone="primary"
  icon={<Icon name="QrCode" size={30} strokeWidth={1.5} />}
  label="Kode QRIS muncul di sini"
  hint="Dibuat penyedia pembayaran saat integrasi" />

<MediaSlot icon={<Icon name="Image" size={22} strokeWidth={1.5} />}
  label="Brand kit Kopi Senja"
  action={<Button size="sm" variant="secondary">Unggah karya</Button>} />
```

Kenapa bukan garis putus-putus: pola itu di web berarti "gambar gagal dimuat", jadi pengguna menyangka ada yang rusak. Ikon di dalam bulatan terang dengan latar pasir terbaca sebagai "tempatnya di sini, belum diisi" — dan itu memang keadaan yang sebenarnya.

`label` menyebut **apa yang seharusnya ada**, bukan instruksi. "Kode QRIS muncul di sini", bukan "Tidak ada gambar". `tone="primary"` hanya untuk slot yang sedang diminta diisi pengguna sekarang.
