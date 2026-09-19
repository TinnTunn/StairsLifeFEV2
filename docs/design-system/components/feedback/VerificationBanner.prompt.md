Banner verifikasi di area terautentikasi. Tempel di atas konten setiap halaman mahasiswa/bisnis; komponen ini tidak merender apa pun bila status sudah `terverifikasi`, jadi tidak perlu dibungkus kondisional.

```jsx
<VerificationBanner status={akun.verifikasi} role="mahasiswa" onAction={() => setRute("verifikasi")} />

{/* ditolak wajib menyertakan alasan dari admin */}
<VerificationBanner status="ditolak" role="bisnis" reason="Foto NIB terpotong di sisi kanan sehingga nomornya tidak terbaca." onAction={unggahUlang} />
```

Copy-nya sengaja menyebut yang terkunci (melamar untuk mahasiswa, menayangkan untuk bisnis) plus estimasi review 1×24 jam. Jangan diganti dengan "Akun belum terverifikasi" — pengguna tidak tahu konsekuensinya.
