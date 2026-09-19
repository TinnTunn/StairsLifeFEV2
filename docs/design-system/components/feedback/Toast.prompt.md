Notifikasi singkat setelah aksi selesai.

```jsx
<ToastStack>
  <Toast tone="success" title="Dana masuk ke dompetmu"
    description="Rp 2.500.000 dari kontrak Kopi Senja Malang sudah tersedia."
    action={<Button size="sm" variant="ghost">Lihat dompet</Button>} onClose={tutup} />
  <Toast tone="warning" title="Lamaranmu belum lengkap" description="Tambahkan tautan portofolio agar bisnis lebih yakin." />
</ToastStack>
```

Aturan: judul menyatakan apa yang SUDAH terjadi, bukan perintah. Sebutkan nominal dan pihak terkait. Jangan pakai toast untuk error form — itu tugas `Input error`.
