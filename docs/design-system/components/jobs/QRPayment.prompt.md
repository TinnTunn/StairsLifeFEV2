Pembayaran QRIS untuk menyetor dana kontrak ke escrow — satu-satunya titik uang masuk di produk.

```jsx
<QRPayment amount={2500000} orderId="ESC-20260912-004" secondsLeft={840}
  status={trx.status} onConfirm={cekStatus} onRegenerate={buatQRBaru} />
```

State: `menunggu_pembayaran` (QR + hitung mundur + instruksi), `menunggu_konfirmasi` (QR redup, pesan sedang dicocokkan), `lunas` (centang hijau menggantikan QR), `gagal` (QR kelabu + tombol buat ulang). Hitung mundur berjalan sendiri; cukup kirim `secondsLeft` dari server sekali.

Kotak QR-nya **placeholder pola**, bukan kode yang bisa dipindai — ganti dengan gambar dari penyedia saat implementasi. Nominal selalu penuh dan punya tombol salin, karena pengguna sering perlu mengetiknya manual di aplikasi bank.

Jangan pakai komponen ini untuk paket, langganan, atau biaya posting — model itu tidak ada di StairsLife. Nominalnya selalu nilai kontrak yang disepakati dengan mahasiswa, dan `orderId` memakai awalan `ESC-` supaya jelas dana masuk ke escrow, bukan ke pendapatan platform.
