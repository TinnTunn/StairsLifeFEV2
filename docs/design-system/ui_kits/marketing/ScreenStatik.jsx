const { Card, Button, Icon, Tabs, EmptyState, SearchField, Avatar, StatusBadge, Tag } = window.StairsLifeDesignSystem_075594;

/* ---------------- P11 — Halaman statis ---------------- */
const STATIK = {
  tentang: {
    judul: "Tentang StairsLife",
    lead: "Kami menghubungkan mahasiswa Indonesia dengan bisnis lokal yang butuh bantuan nyata — bukan magang tanpa bayaran.",
    bagian: [
      { h: "Kenapa ini ada", p: "Banyak mahasiswa punya keahlian yang bisa langsung dipakai, tapi tidak punya jalan masuk ke pekerjaan berbayar. Di sisi lain, UMKM butuh desain, konten, dan foto produk tapi tidak sanggup menyewa agensi. StairsLife mempertemukan keduanya di satu tempat yang bisa dipercaya." },
      { h: "Bagaimana kami menjaga kepercayaan", p: "Setiap mahasiswa diverifikasi lewat KTM, setiap bisnis lewat dokumen legalitas, dan setiap lowongan direview admin sebelum tayang. Bisnis tidak pernah boleh meminta uang dari pelamar — kalau itu terjadi, laporkan dan kami periksa dalam satu hari kerja." },
      { h: "Kami tidak memotong honor mahasiswa", p: "Mendaftar, memposting lowongan, dan melamar semuanya gratis. StairsLife mengambil biaya layanan 5% dari nilai kontrak, dipotong sekali saat dana dilepas dari escrow ke mahasiswa — jadi kami baru mendapat pemasukan setelah pekerjaan benar-benar selesai dan dibayar." },
    ],
  },
  cara: {
    judul: "Cara kerja",
    lead: "Tiga langkah untuk mahasiswa, tiga langkah untuk bisnis.",
    bagian: [
      { h: "Untuk mahasiswa", p: "Daftar dengan email kampus, unggah KTM untuk verifikasi, lalu lamar lowongan yang cocok. Bisnis melihat nama, jurusan, rating, dan CV-mu — nomor teleponmu baru terbuka setelah kamu diterima." },
      { h: "Untuk bisnis", p: "Daftar dan unggah dokumen legalitas. Buat lowongan dengan nominal gaji yang jelas, lalu ajukan untuk review. Setelah tayang, pelamar masuk ke satu daftar yang bisa kamu saring dan putuskan bersama-sama." },
      { h: "Kalau ada masalah", p: "Laporkan lowongan atau pengguna lewat tombol laporkan. Tim moderasi memeriksa setiap laporan dalam satu hari kerja dan bisa menurunkan lowongan atau menangguhkan akun." },
    ],
  },
  faq: {
    judul: "Pertanyaan yang sering diajukan",
    lead: "Kalau jawabanmu tidak ada di sini, hubungi kami lewat halaman Kontak.",
    tanya: [
      ["Apakah StairsLife gratis untuk mahasiswa?", "Ya, selamanya. Kamu tidak dikenakan biaya untuk mendaftar, melamar, atau menerima pekerjaan. Kami tidak memotong honormu."],
      ["Kenapa saya harus mengunggah KTM?", "Verifikasi melindungi bisnis dari akun palsu, dan melindungi kamu dari bersaing dengan pelamar yang tidak nyata. Prosesnya biasanya selesai dalam satu hari kerja."],
      ["Berapa lama bisnis membalas lamaran?", "Rata-rata dua hari. Status lamaranmu bergerak dari Terkirim ke Dilihat, lalu Seleksi atau keputusan akhir — kamu selalu tahu posisinya."],
      ["Bisnis meminta saya transfer biaya pendaftaran. Normal?", "Tidak, dan itu dilarang. Jangan transfer apa pun. Laporkan lowongannya lewat tombol laporkan — kami memeriksa dalam satu hari kerja."],
      ["Kenapa lowongan saya ditolak admin?", "Alasan paling sering: mengarahkan pelamar ke WhatsApp atau kontak di luar platform, nominal gaji tidak dicantumkan, atau deskripsi terlalu kabur. Perbaiki lalu ajukan ulang — tidak ada biaya dan tidak ada batasan jumlah pengajuan."],
      ["Bisakah saya membatalkan lamaran?", "Bisa, selama bisnis belum memutuskan. Membatalkan tidak memengaruhi ratingmu."],
    ],
  },
  ketentuan: {
    judul: "Ketentuan Layanan",
    lead: "Berlaku sejak 1 September 2026. Versi lengkap disusun tim legal — ringkasan di bawah bukan pengganti dokumen resmi.",
    bagian: [
      { h: "Akun dan verifikasi", p: "Satu orang atau satu badan usaha hanya boleh memiliki satu akun. Data yang kamu kirim harus benar dan bisa dipertanggungjawabkan. Kami dapat menangguhkan akun yang memakai dokumen palsu." },
      { h: "Kewajiban bisnis", p: "Lowongan wajib memuat pekerjaan yang nyata dan bayaran yang jelas. Bisnis dilarang meminta uang dari pelamar dengan alasan apa pun, dan dilarang mengarahkan pelamar ke kontak di luar platform sebelum lamaran diterima." },
      { h: "Kewajiban mahasiswa", p: "Kirim lamaran hanya untuk pekerjaan yang benar-benar kamu minati dan sanggup kerjakan. Menghilang setelah diterima dapat menurunkan ratingmu dan dilaporkan bisnis." },
      { h: "Peran StairsLife", p: "Kami menyediakan tempat bertemu dan memoderasi konten. Kesepakatan kerja terjadi antara mahasiswa dan bisnis. Kami tidak menjadi pihak dalam kesepakatan itu dan tidak menjamin hasil kerja maupun pembayaran." },
    ],
  },
  privasi: {
    judul: "Kebijakan Privasi",
    lead: "Apa yang kami simpan, kenapa, dan apa yang bisa kamu kendalikan.",
    bagian: [
      { h: "Data yang kami simpan", p: "Nama, email, nomor telepon, data kampus, KTM, CV, dan riwayat lamaran. Untuk bisnis: data PIC, dokumen legalitas, dan riwayat transaksi." },
      { h: "Siapa yang bisa melihat apa", p: "Bisnis yang kamu lamar melihat nama, institusi, jurusan, rating, dan CV-mu. Nomor telepon dan emailmu baru terbuka setelah kamu diterima. KTM hanya dilihat admin untuk verifikasi, tidak pernah oleh bisnis." },
      { h: "Berapa lama disimpan", p: "Data akun disimpan selama akunmu aktif. Setelah dihapus, profil hilang dalam tujuh hari; riwayat transaksi bisnis disimpan lima tahun sesuai ketentuan pembukuan." },
      { h: "Hak kamu", p: "Kamu bisa mengunduh datamu, memperbaiki yang salah, dan menghapus akun kapan saja dari halaman Pengaturan." },
    ],
  },
  kontak: {
    judul: "Hubungi kami",
    lead: "Tim kami di Malang, jam kerja Senin–Jumat 09.00–17.00 WIB.",
    bagian: [
      { h: "Dukungan pengguna", p: "bantuan@stairslife.id — dijawab dalam satu hari kerja. Sertakan ID lowongan atau lamaran supaya lebih cepat." },
      { h: "Laporan penyalahgunaan", p: "laporan@stairslife.id — untuk lowongan penipuan, permintaan uang, atau akun palsu. Diprioritaskan dan diperiksa dalam satu hari kerja." },
      { h: "Kerja sama & media", p: "hello@stairslife.id" },
      { h: "Alamat", p: "Jl. Veteran 12, Lowokwaru, Malang, Jawa Timur 65145" },
    ],
  },
};

function StatikHalaman({ go }) {
  const [tab, setTab] = React.useState("tentang");
  const p = STATIK[tab];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--bg-page)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: "var(--width-container)", margin: "0 auto", padding: "0 var(--pad-page-x)", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
          <button type="button" onClick={() => go("login")} style={{ display: "flex", alignItems: "center", gap: 9, flex: 1, minWidth: 0, border: 0, background: "transparent", cursor: "pointer", padding: 0 }}>
            <img src="../../assets/logo-mark-wood.svg" width="22" height="22" alt="" style={{ display: "block", flex: "none" }} />
            <b style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>StairsLife</b>
          </button>
          <Button size="sm" variant="ghost" onClick={() => go("login")}>Masuk</Button>
          <Button size="sm" onClick={() => go("peran")}>Daftar gratis</Button>
        </div>
      </nav>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px var(--pad-page-x) 72px", display: "flex", flexDirection: "column", gap: 24 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "tentang", label: "Tentang" },
          { value: "cara", label: "Cara kerja" },
          { value: "faq", label: "FAQ" },
          { value: "ketentuan", label: "Ketentuan" },
          { value: "privasi", label: "Privasi" },
          { value: "kontak", label: "Kontak" },
        ]} />

        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-display-2)", color: "var(--text-strong)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{p.judul}</h1>
          <p className="sl-body-lg" style={{ color: "var(--text-muted)", marginTop: 10, lineHeight: 1.65, maxWidth: "62ch" }}>{p.lead}</p>
        </div>

        {p.tanya ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {p.tanya.map(([q, a]) => (
              <Card key={q} padding="lg" style={{ gap: 8 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", color: "var(--text-strong)" }}>{q}</h2>
                <p className="sl-body" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{a}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {p.bagian.map((b) => (
              <div key={b.h} style={{ display: "flex", flexDirection: "column", gap: 7, paddingBottom: 22, borderBottom: "1px solid var(--border-subtle)" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>{b.h}</h2>
                <p className="sl-body" style={{ color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "68ch" }}>{b.p}</p>
              </div>
            ))}
          </div>
        )}

        <Card padding="lg" style={{ gap: 11, alignItems: "flex-start" }}>
          <span className="sl-overline">Butuh bantuan lain?</span>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>Tulis ke bantuan@stairslife.id dengan menyertakan ID lowongan atau lamaran. Kami menjawab dalam satu hari kerja.</p>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- P12 — Halaman error ---------------- */
function ErrorHalaman({ kode, go }) {
  const isi = {
    e404: { angka: "404", ikon: "Compass", judul: "Halaman ini tidak ada", teks: "Alamatnya mungkin salah tulis, atau lowongan yang kamu cari sudah ditutup. Coba cari dari daftar lowongan.", aksi: "Cari lowongan", tone: "neutral" },
    e403: { angka: "403", ikon: "Lock", judul: "Kamu tidak punya akses ke halaman ini", teks: "Halaman ini hanya untuk peran lain — misalnya panel bisnis atau panel admin. Kalau kamu yakin ini keliru, hubungi bantuan@stairslife.id.", aksi: "Kembali ke dashboard", tone: "warning" },
    e500: { angka: "500", ikon: "ServerCrash", judul: "Ada yang salah di sisi kami", teks: "Bukan salahmu. Tim kami sudah diberi tahu otomatis. Coba muat ulang beberapa saat lagi — data yang sudah kamu simpan tetap aman.", aksi: "Muat ulang halaman", tone: "danger" },
  }[kode];
  const bg = { neutral: "var(--bg-sunken)", warning: "var(--warning-soft)", danger: "var(--danger-soft)" }[isi.tone];
  const fg = { neutral: "var(--text-muted)", warning: "var(--warning-text)", danger: "var(--danger-text)" }[isi.tone];

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "40px 20px", background: "var(--bg-page)" }}>
      <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <img src="../../assets/logo-mark-wood.svg" width="24" height="24" alt="" style={{ display: "block" }} />
          <b style={{ fontFamily: "var(--font-display)", fontSize: 17, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>StairsLife</b>
        </span>
        <span style={{ width: 64, height: 64, display: "grid", placeItems: "center", borderRadius: "var(--radius-lg)", background: bg, color: fg }}>
          <Icon name={isi.ikon} size={30} strokeWidth={1.5} />
        </span>
        <div>
          <span className="sl-tabular" style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, color: "var(--text-subtle)", letterSpacing: "-0.03em", lineHeight: 1 }}>{isi.angka}</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em", marginTop: 10 }}>{isi.judul}</h1>
          <p className="sl-body" style={{ color: "var(--text-muted)", marginTop: 9, lineHeight: 1.65 }}>{isi.teks}</p>
        </div>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "center" }}>
          <Button onClick={() => go("login")}>{isi.aksi}</Button>
          <Button variant="ghost" onClick={() => go("statik")}>Pusat bantuan</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StatikHalaman, ErrorHalaman, STATIK });
