Tabel untuk riwayat pembayaran, daftar kontrak, dan antrean moderasi admin.

```jsx
<DataTable
  columns={[
    { key: "tanggal", header: "Tanggal", numeric: true, width: 120 },
    { key: "proyek", header: "Proyek" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} size="sm" /> },
    { key: "nominal", header: "Nominal", numeric: true, render: (r) => <Money value={r.nominal} size="sm" tone={r.tone} sign /> },
  ]}
  rows={transaksi}
  onRowClick={buka}
/>
```

Aturan: kolom nominal dan tanggal SELALU `numeric` (rata kanan, tabular) — inilah yang membuat kolom uang bisa dipindai. Di mobile, tabel bergeser horizontal; jangan mengecilkan teks di bawah 14px.

Isi sel default **nowrap**: tanggal, nominal, dan status tidak boleh terpecah di tengah nilai. Tandai `wrap: true` hanya pada kolom prosa (judul proyek, alasan penolakan).

`minWidth` tabel dihitung otomatis dari jumlah `width` kolom (kolom tanpa `width` dihitung 140px), jadi tabel lebar menggeser horizontal alih-alih memeras kolomnya. Beri `width` pada setiap kolom sempit supaya perhitungan itu tepat — tanpa itu, tabel 7 kolom akan memeras tanggal jadi dua baris dan tinggi baris membengkak dari 52px ke 83px.
