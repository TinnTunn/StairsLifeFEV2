Semua nominal rupiah di produk lewat komponen ini — supaya format dan warna arus dana konsisten.

```jsx
<Money value={4150000} size="lg" label="Saldo tersedia" />
<Money value={2500000} tone="held" label="Tertahan di escrow" />
<Money value={-150000} size="sm" tone="out" sign />   {/* − Rp 150.000 */}
formatRupiah(2500000) // "Rp 2.500.000"
```

Aturan: `tone="held"` khusus dana escrow, `tone="in"` untuk dana masuk ke dompet. Jangan pakai hijau untuk saldo biasa — hijau berarti "sudah aman/diterima".
