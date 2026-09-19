`StatusBadge` = satu-satunya cara menampilkan status proyek/kontrak. `Tag` = label netral (keahlian, kategori, filter aktif).

```jsx
<StatusBadge status="escrow_ditahan" />
<StatusBadge status="selesai" size="sm" />
<StatusBadge status="sengketa" />
<Tag>Logo</Tag> <Tag tone="primary">Branding</Tag> <Tag tone="outline" onRemove={reset}>Illustrator</Tag>
```

Status yang tersedia: `draft`, `aktif`, `menunggu_pembayaran`, `escrow_ditahan`, `dikerjakan`, `menunggu_review`, `selesai`, `sengketa`, `ditolak`.

Aturan: jangan pernah menulis label status manual di dalam `Tag` — konsistensi warna status adalah bagian dari rasa aman produk. Semua status hidup di dalam palet hangat (tidak ada biru); `dikerjakan` sengaja berupa chip garis netral, dan hanya `selesai` yang berlatar penuh.

Notifikasi di `Sidebar` bukan badge: angkanya tampil sebagai angka tabular di rel kanan selebar 22px, sejajar vertikal antar baris, dan hanya menyala terakota/merah saat butuh tindakan. Saat sidebar terlipat, angka berubah jadi titik 5px di sudut ikon.

Tidak ada titik bulat di dalam badge. Status sudah dibedakan oleh warna isian, garis, dan labelnya sendiri — titik 5px hanya menambah satu bentuk lagi tanpa menambah informasi, dan di badge kecil ia justru memakan ruang teks.
