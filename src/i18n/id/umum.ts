/* Teks yang dipakai lintas halaman: aksi umum, peran, tingkat, tema,
   bahasa, dan pesan kesalahan jaringan. */
export const umum = {
  meta: {
    situs: "StairsLife",
    deskripsi:
      "Platform freelance mahasiswa Indonesia. Kerjakan proyek nyata dari UMKM, dibayar lewat escrow yang ditahan sampai hasilnya disetujui.",
  },
  aksi: {
    masuk: "Masuk",
    daftarGratis: "Daftar Gratis",
    keluar: "Keluar",
    batal: "Batal",
    tutup: "Tutup",
    kembali: "Kembali",
    lihatSemua: "Lihat semua",
    muatUlang: "Muat ulang",
    keBeranda: "Ke berandaku",
    keDompet: "Ke dompet",
    keProyekSaya: "Ke proyek saya",
    keProfil: "Ke profil",
    keDetailProyek: "Ke detail proyek",
    bukaMenu: "Buka menu",
    tutupMenu: "Tutup menu",
    lewatiKeKonten: "Lewati ke konten utama",
  },
  bahasa: {
    label: "Bahasa",
    pilih: "Pilih bahasa",
    nama: { id: "Indonesia", en: "English" },
  },
  tema: {
    sistem: "Tema mengikuti sistem. Ganti ke terang.",
    terang: "Tema terang. Ganti ke gelap.",
    gelap: "Tema gelap. Ikuti sistem.",
  },
  peran: {
    mahasiswa: "Mahasiswa",
    bisnis: "Bisnis",
    admin: "Admin",
  },
  tingkat: {
    pemula: "Pemula",
    menengah: "Menengah",
    mahir: "Mahir",
  },
  galat: {
    jaringan: "Tidak bisa menghubungi server.",
    lambat: "Server tidak menjawab tepat waktu. Periksa koneksimu, lalu coba lagi.",
    berkasBesar: (nama: string, mb: number) => `${nama} lebih dari ${mb} MB. Kecilkan ukurannya dulu.`,
    server: "Server sedang bermasalah. Coba lagi beberapa saat lagi.",
    layanan: "Layanan sedang tidak tersedia. Coba lagi beberapa saat lagi.",
    umum: "Terjadi kesalahan pada server.",
    muatUlangHalaman: "Coba muat ulang halaman ini.",
    modeContoh: "Mode contoh aktif, jadi aksi ini tidak dikirim ke server.",
    akunDibekukan: "Akun kamu sedang dibekukan.",
  },
  dataContoh: {
    judul: "Data contoh",
    isi: "Backend belum tersambung, jadi yang tampil di sini adalah data contoh, bukan data sungguhan.",
  },
  memuat: "Memuat",
  offline: {
    judul: "Kamu sedang offline",
    isi: "Perubahan terakhir mungkin belum tersimpan. Halaman ini memperbarui sendiri begitu koneksi kembali.",
  },
  keluar: {
    judul: (nama: string) => `Sampai jumpa, ${nama}`,
    isi: "Menutup sesimu dan menghapus data masuk dari perangkat ini.",
  },
  masuk: {
    memeriksa: "Memeriksa akunmu",
    memeriksaIsi: "Sebentar, email dan kata sandimu sedang dicocokkan.",
    judul: (nama: string) => `Selamat datang, ${nama}`,
    isi: "Menyiapkan berandamu.",
    daftarJudul: (nama: string) => `Akunmu sudah jadi, ${nama}`,
  },
};
