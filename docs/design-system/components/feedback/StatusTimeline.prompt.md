Riwayat status yang sudah terjadi, dengan cap waktu dan pelaku.

```jsx
<StatusTimeline items={[
  { label: "Lamaran dikirim", time: "10 Sep 2026 · 09:14" },
  { label: "Dilihat bisnis", time: "10 Sep 2026 · 16:02", by: "Kopi Senja Malang" },
  { label: "Masuk seleksi", time: "12 Sep 2026 · 11:30", tone: "active", description: "Kamu akan dihubungi untuk wawancara singkat." },
  { label: "Hasil akhir", tone: "todo" },
]} />
```

Pakai ini untuk riwayat, `ContractStepper` untuk tahap yang akan datang. Keduanya tidak boleh dipakai bergantian: stepper memberi kesan "ini jalurnya", timeline memberi kesan "ini yang sudah terjadi".
