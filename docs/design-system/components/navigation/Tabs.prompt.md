Tab dalam halaman: daftar lamaran, tab kontrak, filter riwayat pembayaran.

```jsx
<Tabs items={[
  { value: "semua", label: "Semua", count: 12 },
  { value: "diseleksi", label: "Diseleksi", count: 3 },
  { value: "ditolak", label: "Ditolak" },
]} onChange={setTab} />

<Tabs variant="pill" fullWidth items={[{value:"masuk",label:"Dana masuk"},{value:"keluar",label:"Penarikan"}]} />
```
