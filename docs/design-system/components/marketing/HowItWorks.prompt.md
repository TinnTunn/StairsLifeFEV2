Penjelas alur bertahap untuk landing dan onboarding.

```jsx
<HowItWorks steps={[
  { label: "Bisnis memposting", short: "Lowongan direview admin sebelum tayang",
    icon: <Icon name="FileText" size={21} />,
    body: "Setiap lowongan diperiksa tim kami: nominal gaji harus jelas dan tidak boleh mengarahkan pelamar ke kontak di luar platform.",
    note: "Biasanya tayang dalam 1 hari kerja." },
  { label: "Kamu melamar", short: "Gratis, tanpa batas jumlah",
    icon: <Icon name="Send" size={21} />,
    body: "Kirim surat lamaran dan CV. Bisnis melihat nama, jurusan, dan ratingmu — nomor teleponmu baru terbuka setelah kamu diterima." },
]} />
```

Aturan: **hanya untuk permukaan marketing.** Di dalam aplikasi pakai `ContractStepper`, yang menampilkan keadaan nyata sebuah kontrak, bukan penjelasan tentang cara kerjanya. Mencampur keduanya membuat pengguna menyangka penjelasan itu adalah status akunnya.

Bilah kemajuan di bawah setiap kartu menggantikan efek glow: ia menunjukkan sisa waktu sebelum berpindah tanpa menambah warna atau bayangan baru ke sistem. Auto-play berhenti saat kursor masuk — jangan matikan `autoPlay` kecuali langkahnya lebih dari lima, karena tanpa gerakan pengguna sering tidak sadar kartunya bisa diklik.

`prefers-reduced-motion: reduce` mematikan auto-play sekaligus transisi bilahnya. Pengecekan itu ada di dalam komponen, bukan lewat token: durasi bilah adalah angka milidetik dari prop `interval`, jadi `--duration-*` yang di-nol-kan di `tokens/motion.css` tidak bisa menjangkaunya.
