const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, Checkbox, FileDropzone, EmptyState, SearchField, Money, MetricCard, Rating } = window.StairsLifeDesignSystem_075594;

const rpb = (n) => (n ? "Rp " + Number(n).toLocaleString("id-ID") : "Nego");

const LOWONGAN_BIZ = [
  { id: "L-3391", judul: "Desain logo & brand kit untuk kedai kopi", st: "menunggu_moderasi", pelamar: 0, baru: 0, gaji: 2500000, posting: "01 Sep 2026", deadline: "20 Sep 2026", dilihat: 0, kategori: "Desain grafis", tipe: "Proyek · remote", posisi: 1 },
  { id: "L-3380", judul: "Konten Instagram 12 post", st: "aktif", pelamar: 12, baru: 5, gaji: 1200000, posting: "24 Agu 2026", deadline: "15 Sep 2026", dilihat: 184, kategori: "Sosial media", tipe: "Part-time · hybrid", posisi: 2 },
  { id: "L-3372", judul: "Fotografer produk katalog", st: "aktif", pelamar: 8, baru: 2, gaji: 1800000, posting: "19 Agu 2026", deadline: "10 Sep 2026", dilihat: 141, kategori: "Fotografi", tipe: "Freelance", posisi: 1 },
  { id: "L-3355", judul: "Penerjemah menu ID–EN", st: "ditutup", pelamar: 5, baru: 0, gaji: 600000, posting: "02 Agu 2026", deadline: "20 Agu 2026", dilihat: 96, kategori: "Penulisan", tipe: "Freelance · remote", posisi: 1 },
  { id: "L-3341", judul: "Ilustrasi maskot toko", st: "kedaluwarsa", pelamar: 3, baru: 0, gaji: 900000, posting: "18 Jul 2026", deadline: "18 Agu 2026", dilihat: 74, kategori: "Desain grafis", tipe: "Proyek · remote", posisi: 1 },
  { id: "L-3320", judul: "Barista part-time akhir pekan", st: "draft", pelamar: 0, baru: 0, gaji: 900000, posting: "—", deadline: "—", dilihat: 0, kategori: "Jasa", tipe: "Part-time · onsite", posisi: 2 },
];

const PELAMAR_BIZ = [
  { id: 1, nama: "Rani Pratiwi", institusi: "Universitas Brawijaya", jurusan: "DKV", semester: 6, st: "seleksi", tgl: "01 Sep 2026", untuk: "L-3380", rating: 4.8, ulasan: 23, verified: true,
    surat: "Saya sudah mengerjakan brand kit untuk dua kedai kopi di Malang dan biasa menyiapkan aset sampai versi kemasan. Untuk lowongan ini saya akan mulai dari riset visual kompetitor lokal, lalu tiga alternatif arah sebelum masuk ke penghalusan." },
  { id: 2, nama: "Dimas Ardi", institusi: "Universitas Negeri Malang", jurusan: "Teknik Informatika", semester: 8, st: "terkirim", tgl: "01 Sep 2026", untuk: "L-3380", rating: 4.6, ulasan: 11, verified: true,
    surat: "Saya mengelola akun Instagram komunitas kampus dengan 12 ribu pengikut. Terbiasa menyiapkan kalender konten mingguan dan menulis caption sendiri." },
  { id: 3, nama: "Sekar Ayu", institusi: "Politeknik Negeri Malang", jurusan: "Manajemen Informatika", semester: 4, st: "dilihat", tgl: "31 Agu 2026", untuk: "L-3372", rating: 4.9, ulasan: 7, verified: false,
    surat: "Saya memotret produk untuk toko keluarga sejak SMA dan punya peralatan lighting sendiri. Bisa mengerjakan di studio maupun on-site." },
  { id: 4, nama: "Bayu Saputra", institusi: "Universitas Brawijaya", jurusan: "Ilmu Komunikasi", semester: 6, st: "diterima", tgl: "28 Agu 2026", untuk: "L-3372", rating: 4.7, ulasan: 15, verified: true,
    surat: "Pernah menangani foto katalog untuk 40 SKU dalam dua hari. Saya biasa menyiapkan shot list sebelum sesi supaya tidak ada produk yang terlewat." },
  { id: 5, nama: "Nadya Kirana", institusi: "Universitas Negeri Malang", jurusan: "Sastra Inggris", semester: 4, st: "ditolak", tgl: "26 Agu 2026", untuk: "L-3355", rating: 4.2, ulasan: 3, verified: true,
    surat: "Saya menerjemahkan menu dan materi promosi untuk dua restoran di Malang." },
];

function FaktaB({ label, value, sub, tone }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
      <span className="sl-overline">{label}</span>
      {/* nowrap: nominal dan tanggal tidak boleh terpecah di tengah nilai.
          Satuan seperti "per bulan" turun ke baris sendiri lewat `sub`. */}
      <b className="sl-body-sm" style={{ color: tone === "danger" ? "var(--danger-text)" : "var(--text-strong)", whiteSpace: "nowrap" }}>{value}</b>
      {sub && <span className="sl-caption" style={{ lineHeight: 1.4 }}>{sub}</span>}
    </div>
  );
}

/* ---------------- B1 — Dashboard ---------------- */
function BizDashboard({ setRute, bukaLowongan, bukaPelamar, terverifikasi }) {
  const aktif = LOWONGAN_BIZ.filter((l) => l.st === "aktif");
  if (!LOWONGAN_BIZ.length) {
    return <Card padding="none"><EmptyState size="lg" icon={<Icon name="Briefcase" size={34} strokeWidth={1.5} />} title="Belum ada lowongan" description="Buat lowongan pertamamu, mahasiswa yang cocok akan diberi tahu." action={<Button onClick={() => setRute("b3")}>Buat lowongan</Button>} /></Card>;
  }
  return (
    <>
      <div className="bz-grid">
        <MetricCard label="Lowongan aktif" value={String(aktif.length)} delta={"+1"} deltaLabel="minggu ini" icon={<Icon name="Briefcase" size={19} />} />
        <MetricCard label="Total pelamar" value="28" delta={16} iconTone="success" icon={<Icon name="Users" size={19} />} />
        <MetricCard label="Belum dilihat" value="7" iconTone="warning" icon={<Icon name="Eye" size={19} />} />
        <MetricCard label="Diterima bulan ini" value="2" delta={100} iconTone="neutral" icon={<Icon name="UserCheck" size={19} />} />
      </div>

      <div className="bz-grid">
        <Card padding="lg" style={{ gap: 12 }}>
          <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Akan kedaluwarsa</h3>
          {aktif.map((l) => (
            <button key={l.id} type="button" onClick={() => bukaLowongan(l)}
              style={{ display: "flex", flexDirection: "column", gap: 4, padding: "11px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}>
              <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{l.judul}</b>
              <span className="sl-caption">Tutup {l.deadline} · {l.pelamar} pelamar</span>
            </button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setRute("b2")} style={{ alignSelf: "flex-start" }}>Kelola semua lowongan</Button>
        </Card>
      </div>

      <Card padding="lg" style={{ gap: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
          <h3 style={{ fontSize: "var(--text-h3)" }}>Pelamar terbaru</h3>
          <Button size="sm" variant="ghost" onClick={() => setRute("b7")}>Lihat semua</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PELAMAR_BIZ.slice(0, 3).map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
              <Avatar name={p.nama} size="sm" verified={p.verified} />
              <span style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column" }}>
                <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{p.nama}</b>
                <span className="sl-caption">{p.jurusan} · {p.institusi}</span>
              </span>
              <StatusBadge status={p.st} size="sm" />
              <Button size="sm" variant="secondary" style={{ flex: "none" }} onClick={() => bukaPelamar(p)} disabled={!terverifikasi}>Periksa</Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ---------------- B2 — Kelola lowongan ---------------- */
function BizKelolaLowongan({ setRute, bukaLowongan, notify, terverifikasi }) {
  const [tab, setTab] = React.useState("semua");
  const [hapus, setHapus] = React.useState(null);
  const rows = LOWONGAN_BIZ.filter((l) => tab === "semua" || l.st === tab);

  return (
    <>
      <Card padding="lg" style={{ gap: 14 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "semua", label: "Semua", count: LOWONGAN_BIZ.length },
          { value: "aktif", label: "Aktif", count: 2 },
          { value: "menunggu_moderasi", label: "Menunggu review", count: 1 },
          { value: "draft", label: "Draft", count: 1 },
          { value: "ditutup", label: "Ditutup", count: 1 },
          { value: "kedaluwarsa", label: "Kedaluwarsa", count: 1 },
        ]} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", flex: "none" }}>
          <SearchField placeholder="Cari judul lowongan" label="Cari lowongan" collapsedWidth={210} expandedWidth={330} />
          <Button size="sm" style={{ marginLeft: "auto" }} iconLeft={<Icon name="Plus" size={15} />} onClick={() => setRute("b3")}>Buat lowongan</Button>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={<Icon name="Briefcase" size={30} strokeWidth={1.5} />} title="Tidak ada lowongan di tab ini" description="Coba tab lain atau buat lowongan baru." action={<Button size="sm" onClick={() => setRute("b3")}>Buat lowongan</Button>} />
        ) : (
          <DataTable
            columns={[
              { key: "judul", header: "Lowongan", render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.judul}<span className="sl-caption" style={{ display: "block" }}>{r.id} · {r.kategori}</span></span> },
              { key: "st", header: "Status", width: 150, render: (r) => <StatusBadge status={r.st} size="sm" /> },
              { key: "pelamar", header: "Pelamar", numeric: true, width: 100, render: (r) => (
                <span className="sl-tabular sl-body-sm">{r.pelamar}{r.baru > 0 && <span style={{ color: "var(--primary-text)", fontWeight: 600 }}> · {r.baru} baru</span>}</span>
              ) },
              { key: "posting", header: "Diposting", width: 115 },
              { key: "deadline", header: "Tutup", width: 115 },
              { key: "aksi", header: "", width: 190, align: "right", render: (r) => (
                <span style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  {r.pelamar > 0 && <Button size="sm" variant="ghost" onClick={() => setRute("b5")}>Pelamar</Button>}
                  <Button size="sm" variant="ghost" onClick={() => bukaLowongan(r)}>Detail</Button>
                  <Button size="sm" variant="ghost" onClick={() => setHapus(r)}>Hapus</Button>
                </span>
              ) },
            ]}
            rows={rows}
          />
        )}
      </Card>

      <Modal open={!!hapus} onClose={() => setHapus(null)} title="Hapus lowongan" description={hapus ? hapus.id + " · " + hapus.judul : ""} size="sm"
        footer={<><Button variant="ghost" onClick={() => setHapus(null)}>Batal</Button><Button variant="destructive" onClick={() => { notify({ tone: "info", title: "Lowongan dihapus", description: hapus.pelamar > 0 ? hapus.pelamar + " pelamar diberi tahu bahwa lowongan ditutup." : "Draft dihapus permanen." }); setHapus(null); }}>Hapus</Button></>}>
        <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
          {hapus && hapus.pelamar > 0
            ? hapus.pelamar + " pelamar sudah masuk. Mereka akan diberi tahu bahwa lowongan ditutup, dan riwayat lamaran mereka tetap tersimpan."
            : "Draft ini belum pernah tayang, jadi tidak ada yang perlu diberi tahu."}
        </p>
      </Modal>
    </>
  );
}

/* ---------------- B4 — Detail lowongan (sisi bisnis) ---------------- */
function BizDetailLowongan({ lowongan, setRute, notify }) {
  const l = lowongan || LOWONGAN_BIZ[1];
  const konversi = l.dilihat ? ((l.pelamar / l.dilihat) * 100).toFixed(1).replace(".", ",") + "%" : "—";

  return (
    <>
      <button type="button" onClick={() => setRute("b2")}
        style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", cursor: "pointer", alignSelf: "flex-start" }}>
        <Icon name="ArrowLeft" size={16} />Kembali ke daftar lowongan
      </button>

      {l.st === "ditolak_admin" && (
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--danger-soft)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius-md)" }}>
          <span style={{ flex: "none", color: "var(--danger-text)", display: "flex", marginTop: 1 }}><Icon name="XCircle" size={18} /></span>
          <span style={{ minWidth: 0 }}>
            <b className="sl-body-sm" style={{ color: "var(--danger-text)", display: "block" }}>Ditolak admin — perlu revisi</b>
            <span className="sl-caption" style={{ color: "var(--danger-text)" }}>Alasan: mengarahkan pelamar ke kontak di luar platform. Hapus nomor WhatsApp dari deskripsi, lalu ajukan ulang.</span>
          </span>
        </div>
      )}

      <div className="bz-split">
        <Card padding="lg" style={{ gap: 15 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <span className="sl-overline">{l.id} · diposting {l.posting}</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em", marginTop: 4 }}>{l.judul}</h2>
            </div>
            <StatusBadge status={l.st} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
            <FaktaB label="Gaji" value={rpb(l.gaji)} sub={l.gaji ? "per proyek" : "dinegosiasikan"} />
            <FaktaB label="Tipe" value={l.tipe} />
            <FaktaB label="Kategori" value={l.kategori} />
            <FaktaB label="Jumlah posisi" value={l.posisi + " orang"} />
            <FaktaB label="Tutup lamaran" value={l.deadline} />
          </div>

          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", paddingTop: 6 }}>
            {l.pelamar > 0 && <Button onClick={() => setRute("b5")}>Lihat {l.pelamar} pelamar</Button>}
            <Button variant="secondary" onClick={() => setRute("b3")}>Edit</Button>
            <Button variant="ghost" onClick={() => notify({ tone: "success", title: "Lowongan diduplikat", description: "Salinan tersimpan sebagai draft, siap diubah." })}>Duplikat</Button>
            {l.st === "aktif" && <Button variant="ghost" onClick={() => notify({ tone: "info", title: "Lowongan ditutup", description: "Tidak menerima lamaran baru. Pelamar yang sudah masuk tetap bisa diproses." })}>Tutup lebih awal</Button>}
            {l.st === "kedaluwarsa" && <Button variant="secondary" onClick={() => notify({ tone: "success", title: "Lowongan diperpanjang", description: "Tayang 30 hari lagi. Tanpa biaya tambahan." })}>Perpanjang 30 hari</Button>}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 12 }}>
            <span className="sl-overline">Statistik</span>
            {[["Dilihat", String(l.dilihat)], ["Dilamar", String(l.pelamar)], ["Konversi", konversi], ["Belum dilihat", String(l.baru)]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <span className="sl-body-sm" style={{ color: "var(--text-muted)" }}>{k}</span>
                <b className="sl-tabular sl-body-sm" style={{ color: "var(--text-strong)" }}>{v}</b>
              </div>
            ))}
            <span className="sl-caption" style={{ lineHeight: 1.5 }}>Konversi di bawah 5% biasanya berarti judul atau nominal gaji perlu diperjelas.</span>
          </Card>

          <Card padding="md" style={{ gap: 10 }}>
            <span className="sl-overline">Status moderasi</span>
            {l.st === "menunggu_moderasi" ? (
              <span className="sl-caption" style={{ lineHeight: 1.55 }}>Diajukan {l.posting}, sedang direview admin. Biasanya selesai dalam 1 hari kerja. Kamu akan dapat notifikasi begitu diputuskan.</span>
            ) : l.st === "ditolak_admin" ? (
              <span className="sl-caption" style={{ lineHeight: 1.55, color: "var(--danger-text)" }}>Ditolak — perbaiki deskripsi lalu ajukan ulang. Tidak ada biaya untuk mengajukan ulang.</span>
            ) : (
              <span className="sl-caption" style={{ lineHeight: 1.55 }}>Disetujui admin dan tayang normal. Perubahan besar pada deskripsi akan memicu review ulang.</span>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { BizDashboard, BizKelolaLowongan, BizDetailLowongan, LOWONGAN_BIZ, PELAMAR_BIZ, FaktaB, rpb });
