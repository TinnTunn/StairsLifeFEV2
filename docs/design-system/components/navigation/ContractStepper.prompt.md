Stepper progres kontrak — dipakai di halaman kontrak, detail escrow, dan ringkasan dompet. Ini komponen paling penting untuk rasa aman: pengguna harus selalu tahu di mana uangnya berada.

```jsx
<ContractStepper current={2} orientation="vertical" steps={[
  { label: "Kontrak disepakati", meta: "10 Sep 2026" },
  { label: "Dana masuk escrow", meta: "10 Sep 2026", description: "Rp 2.500.000 ditahan StairsLife." },
  { label: "Sedang dikerjakan", meta: "Tenggat 20 Sep 2026" },
  { label: "Serah terima hasil" },
  { label: "Dana dilepas ke dompet" },
]} />
```

Aturan: tahap yang menyangkut dana selalu menyebut nominal di `description`. Tahap selesai = hijau (aman), tahap berjalan = terakota, sengketa = `tone="alert"`. Di mobile pakai `vertical`.

Di atas permukaan brand tetap (`--ink-surface` — panel pendaftaran, footer, blok "Untuk bisnis") pakai `surface="ink"`:

```jsx
<ContractStepper orientation="vertical" surface="ink" current={1} steps={langkah} />
```

Tanpa prop itu stepper memakai token tema: di mode terang labelnya gelap di atas latar gelap, dan di mode gelap ia ikut membalik bersama tema. Aturan ini berlaku untuk semua komponen yang dipasang di permukaan tinta.
