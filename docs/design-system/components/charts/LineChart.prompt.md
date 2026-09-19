Grafik khusus panel admin — jangan dipakai di layar mahasiswa/bisnis, yang cukup dengan angka dan status.

```jsx
<MetricCard label="Ditahan di escrow" value="Rp 18.450.000" delta={12}
  icon={<Icon name="ShieldCheck" size={19} />} />

<LineChart tone="primary" data={[
  { label: "Apr", value: 24_000_000 }, { label: "Mei", value: 31_400_000 }, { label: "Jun", value: 41_200_000 },
]} valueFormat={(v) => (v / 1e6).toFixed(0) + " jt"} />

<DonutChart centerValue="17" centerLabel="antrean" data={[
  { label: "Verifikasi identitas", value: 3, color: "var(--primary)" },
  { label: "Moderasi proyek", value: 2, color: "var(--warning)" },
  { label: "Sengketa escrow", value: 2, color: "var(--danger)" },
  { label: "Selesai hari ini", value: 10, color: "var(--success)" },
]} />
```

Aturan arah tren: naik tidak selalu baik. Metrik yang membaik saat turun (sengketa terbuka, waktu tanggap, pembatalan) harus memakai `invertDelta`, jika tidak kabar baik akan tampil merah dengan panah turun.

```jsx
<MetricCard label="Sengketa terbuka" value="2" delta={-3} invertDelta iconTone="warning" icon={<Icon name="Scale" size={19} />} />
```

Aturan warna: irisan donut hanya memakai token semantik/status yang sudah ada — **tanpa biru**, karena biru bukan bagian dari keluarga status dan di atas netral hangat terlihat seperti komponen dari sistem lain. Kategori keempat memakai `var(--primary)` terakota.

Aturan: satu warna garis per grafik (tanpa gradasi warna-warni); irisan donut hanya memakai token semantik/status yang sudah ada; nominal besar disingkat "jt"/"M" **hanya di dalam grafik** — di teks dan tabel tetap `Rp 18.450.000` penuh. Legend donut selalu menyertakan persen, karena mata tidak bisa membaca sudut dengan akurat.
