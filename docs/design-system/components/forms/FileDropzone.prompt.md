Area unggah berkas (drag-and-drop + klik) untuk portofolio, serah terima hasil, KTM verifikasi, dan bukti sengketa.

```jsx
<FileDropzone label="Hasil akhir" hint="PNG, JPG, PDF, atau ZIP · maksimal 25 MB"
  files={[{ name: "logo-kopi-senja-final.zip", size: "18,2 MB" }]}
  onFiles={setBerkas} onRemove={hapus} />
```

Aturan: sebutkan format dan batas ukuran di `hint` — jangan biarkan pengguna menebak. Saat gagal, `error` menjelaskan penyebab dan langkah berikutnya.
