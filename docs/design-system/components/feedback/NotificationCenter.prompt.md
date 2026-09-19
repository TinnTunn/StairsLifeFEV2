Lonceng notifikasi di topbar — satu-satunya tempat kejadian penting berkumpul lintas halaman.

```jsx
<NotificationCenter
  live
  items={[
    { id: 1, icon: <Icon name="Eye" size={16} />, tone: "primary", unread: true,
      title: "Rimbun Plant House melihat lamaranmu", time: "18 menit lalu", href: "m5" },
    { id: 2, icon: <Icon name="XCircle" size={16} />, tone: "danger", unread: true,
      title: "Lamaran Penerjemah menu tidak dilanjutkan",
      description: "Kopi Senja Malang meninggalkan catatan", time: "Kemarin", href: "m5" },
  ]}
  onOpenItem={(n) => setRute(n.href)}
  onSeeAll={() => setRute("m10")}
/>
```

Aturan: panel ini untuk **melihat cepat**, halaman notifikasi penuh tetap ada untuk riwayat dan filter — selalu sediakan `onSeeAll` yang menuju ke sana. Titik terakota di lonceng hanya muncul kalau ada yang belum dibaca; jumlahnya tidak ditulis di lonceng (angkanya ada di judul panel), karena badge angka di ikon kecil sulit dibaca dan menambah bentuk asing di topbar.

`live` menyorot item teratas selama 1,4 detik saat daftar bertambah. Itu satu-satunya gerakan yang diizinkan — jangan menggeser atau menyisipkan baris dengan animasi masuk, karena pengguna sedang membaca daftar di bawahnya.

Isi `title` harus menyebut **apa yang berubah**, bukan kategori: "Rimbun Plant House melihat lamaranmu", bukan "Pembaruan lamaran".
