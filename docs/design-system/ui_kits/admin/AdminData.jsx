const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, Checkbox, EmptyState, SearchField, Money, Rating } = window.StairsLifeDesignSystem_075594;

const MAHASISWA = [
  { id: 1, nama: "Rani Pratiwi", email: "rani@student.ub.ac.id", institusi: "Universitas Brawijaya", jurusan: "DKV", vs: "terverifikasi", lamaran: 11, daftar: "14 Feb 2026" },
  { id: 2, nama: "Dimas Ardi", email: "dimas@student.um.ac.id", institusi: "Universitas Negeri Malang", jurusan: "Teknik Informatika", vs: "menunggu_verifikasi", lamaran: 4, daftar: "31 Agu 2026" },
  { id: 3, nama: "Sekar Ayu", email: "sekar@student.polinema.ac.id", institusi: "Politeknik Negeri Malang", jurusan: "Manajemen Informatika", vs: "menunggu_verifikasi", lamaran: 2, daftar: "30 Agu 2026" },
  { id: 4, nama: "Bayu Saputra", email: "bayu@student.ub.ac.id", institusi: "Universitas Brawijaya", jurusan: "Ilmu Komunikasi", vs: "terverifikasi", lamaran: 7, daftar: "02 Mar 2026" },
  { id: 5, nama: "Nadya Kirana", email: "nadya@student.um.ac.id", institusi: "Universitas Negeri Malang", jurusan: "Sastra Inggris", vs: "verifikasi_ditolak", lamaran: 0, daftar: "28 Agu 2026" },
  { id: 6, nama: "Fajar Wibowo", email: "fajar@student.polinema.ac.id", institusi: "Politeknik Negeri Malang", jurusan: "Teknik Elektro", vs: "disuspend", lamaran: 3, daftar: "11 Apr 2026" },
];

const BISNIS = [
  { id: 1, nama: "Kopi Senja Malang", kategori: "Kuliner", vs: "terverifikasi", lowongan: 7, daftar: "09 Jan 2026" },
  { id: 2, nama: "Rimbun Plant House", kategori: "Retail", vs: "terverifikasi", lowongan: 4, daftar: "22 Feb 2026" },
  { id: 3, nama: "Batik Ayu Nusantara", kategori: "Fesyen", vs: "menunggu_verifikasi", lowongan: 1, daftar: "31 Agu 2026" },
  { id: 4, nama: "Toko Serba Ada 88", kategori: "Retail", vs: "verifikasi_ditolak", lowongan: 1, daftar: "29 Agu 2026" },
  { id: 5, nama: "Tahu Pong Semarang", kategori: "Kuliner", vs: "terverifikasi", lowongan: 3, daftar: "17 Mei 2026" },
];

const LOWONGAN_ALL = [
  { id: "L-3391", judul: "Desain logo & brand kit untuk kedai kopi", bisnis: "Kopi Senja Malang", st: "menunggu_moderasi", pelamar: 0, gaji: 2500000, posting: "01 Sep 2026" },
  { id: "L-3380", judul: "Konten Instagram 12 post", bisnis: "Rimbun Plant House", st: "aktif", pelamar: 12, gaji: 1200000, posting: "24 Agu 2026" },
  { id: "L-3372", judul: "Fotografer produk katalog", bisnis: "Tahu Pong Semarang", st: "aktif", pelamar: 8, gaji: 1800000, posting: "19 Agu 2026" },
  { id: "L-3355", judul: "Penerjemah menu ID–EN", bisnis: "Kopi Senja Malang", st: "ditutup", pelamar: 5, gaji: 600000, posting: "02 Agu 2026" },
  { id: "L-3341", judul: "Ilustrasi maskot toko", bisnis: "Rimbun Plant House", st: "kedaluwarsa", pelamar: 3, gaji: 900000, posting: "18 Jul 2026" },
  { id: "L-3384", judul: "Fotografer — hubungi WA", bisnis: "Toko Serba Ada 88", st: "ditolak_admin", pelamar: 0, gaji: 0, posting: "31 Agu 2026" },
];

const rpx = (n) => (n ? "Rp " + n.toLocaleString("id-ID") : "Nego");

function Toolbar({ children, kanan }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", flex: "none" }}>
      {children}
      <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{kanan}</span>
    </div>
  );
}

/* ---------------- A5 — Manajemen mahasiswa ---------------- */
function AdminMahasiswa({ notify, bukaPengguna }) {
  const [tab, setTab] = React.useState("semua");
  const [inst, setInst] = React.useState("Semua institusi");
  const [hal, setHal] = React.useState(1);

  const rows = MAHASISWA
    .filter((m) => tab === "semua" || m.vs === tab)
    .filter((m) => inst === "Semua institusi" || m.institusi === inst);

  return (
    <Card padding="lg" style={{ gap: 14 }}>
      <Tabs value={tab} onChange={setTab} items={[
        { value: "semua", label: "Semua", count: MAHASISWA.length },
        { value: "terverifikasi", label: "Terverifikasi", count: 2 },
        { value: "menunggu_verifikasi", label: "Menunggu", count: 2 },
        { value: "verifikasi_ditolak", label: "Ditolak", count: 1 },
        { value: "disuspend", label: "Disuspend", count: 1 },
      ]} />
      <Toolbar kanan={<><Button size="sm" variant="secondary" iconLeft={<Icon name="Download" size={15} />} onClick={() => notify({ tone: "success", title: "Ekspor disiapkan", description: rows.length + " baris diekspor ke CSV." })}>Ekspor CSV</Button></>}>
        <SearchField placeholder="Cari nama atau email" label="Cari mahasiswa" collapsedWidth={200} expandedWidth={320} />
        <Select value={inst} onChange={(e) => setInst(e.target.value)} size="sm" options={["Semua institusi", "Universitas Brawijaya", "Universitas Negeri Malang", "Politeknik Negeri Malang"]} />
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={<Icon name="UserSearch" size={30} strokeWidth={1.5} />} title="Tidak ada mahasiswa yang cocok" description="Coba hapus salah satu filter." />
      ) : (
        <>
          <DataTable
            columns={[
              { key: "nama", header: "Nama", render: (r) => (
                <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                  <Avatar name={r.nama} size="xs" />
                  <span style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.nama}</b>
                    <span className="sl-caption" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{r.email}</span>
                  </span>
                </span>
              ) },
              { key: "institusi", header: "Institusi", render: (r) => <span className="sl-body-sm">{r.institusi}<span className="sl-caption" style={{ display: "block" }}>{r.jurusan}</span></span> },
              { key: "vs", header: "Verifikasi", width: 150, render: (r) => <StatusBadge status={r.vs} size="sm" /> },
              { key: "lamaran", header: "Lamaran", numeric: true, width: 90 },
              { key: "daftar", header: "Terdaftar", width: 120 },
              { key: "aksi", header: "", width: 108, align: "right", render: (r) => <Button size="sm" variant="ghost" onClick={() => bukaPengguna({ ...r, tipe: "mahasiswa" })}>Detail</Button> },
            ]}
            rows={rows}
          />
          <Pagination page={hal} total={7} onChange={setHal} label={rows.length + " dari 1.284 mahasiswa"} />
        </>
      )}
    </Card>
  );
}

/* ---------------- A6 — Manajemen bisnis ---------------- */
function AdminBisnis({ bukaPengguna, notify }) {
  const [tab, setTab] = React.useState("semua");
  const [hal, setHal] = React.useState(1);
  const rows = BISNIS.filter((b) => tab === "semua" || b.vs === tab);

  return (
    <Card padding="lg" style={{ gap: 14 }}>
      <Tabs value={tab} onChange={setTab} items={[
        { value: "semua", label: "Semua", count: BISNIS.length },
        { value: "terverifikasi", label: "Terverifikasi", count: 3 },
        { value: "menunggu_verifikasi", label: "Menunggu", count: 1 },
        { value: "verifikasi_ditolak", label: "Ditolak", count: 1 },
      ]} />
      <Toolbar kanan={<Button size="sm" variant="secondary" iconLeft={<Icon name="Download" size={15} />} onClick={() => notify({ tone: "success", title: "Ekspor disiapkan", description: rows.length + " baris diekspor ke CSV." })}>Ekspor CSV</Button>}>
        <SearchField placeholder="Cari nama bisnis" label="Cari bisnis" collapsedWidth={200} expandedWidth={320} />
      </Toolbar>
      <DataTable
        columns={[
          { key: "nama", header: "Bisnis", render: (r) => (
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <Avatar name={r.nama} size="xs" shape="rounded" verified={r.vs === "terverifikasi"} />
              <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.nama}</b>
            </span>
          ) },
          { key: "kategori", header: "Kategori", width: 110 },
          { key: "vs", header: "Verifikasi", width: 150, render: (r) => <StatusBadge status={r.vs} size="sm" /> },
          { key: "lowongan", header: "Lowongan", numeric: true, width: 100 },
          { key: "aksi", header: "", width: 108, align: "right", render: (r) => <Button size="sm" variant="ghost" onClick={() => bukaPengguna({ ...r, tipe: "bisnis" })}>Detail</Button> },
        ]}
        rows={rows}
      />
      <Pagination page={hal} total={4} onChange={setHal} label={rows.length + " dari 176 bisnis"} />
    </Card>
  );
}

/* ---------------- A7 — Detail pengguna ---------------- */
function AdminDetailPengguna({ pengguna, setRute, notify }) {
  const p = pengguna || { ...MAHASISWA[0], tipe: "mahasiswa" };
  const mhs = p.tipe === "mahasiswa";
  const [tab, setTab] = React.useState("profil");
  const [suspend, setSuspend] = React.useState(false);
  const [catatan, setCatatan] = React.useState("Pernah menghubungi bisnis di luar platform, sudah diperingatkan 12 Agu 2026.");
  const disuspend = p.vs === "disuspend";

  return (
    <>
      {disuspend && (
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "12px 15px", background: "var(--danger-soft)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius-md)" }}>
          <span style={{ flex: "none", color: "var(--danger-text)", display: "flex", marginTop: 1 }}><Icon name="Ban" size={18} /></span>
          <span style={{ minWidth: 0 }}>
            <b className="sl-body-sm" style={{ color: "var(--danger-text)", display: "block" }}>Akun disuspend sejak 20 Agu 2026</b>
            <span className="sl-caption" style={{ color: "var(--danger-text)" }}>Alasan: melanggar ketentuan layanan · disuspend oleh Nadia Rahma</span>
          </span>
          <Button size="sm" variant="secondary" style={{ marginLeft: "auto", flex: "none" }} onClick={() => notify({ tone: "success", title: "Akun diaktifkan", description: p.nama + " bisa masuk kembali." })}>Aktifkan</Button>
        </div>
      )}

      <button type="button" onClick={() => setRute(mhs ? "a5" : "a6")}
        style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", cursor: "pointer", alignSelf: "flex-start" }}>
        <Icon name="ArrowLeft" size={16} />Kembali ke daftar {mhs ? "mahasiswa" : "bisnis"}
      </button>

      <Card padding="lg" style={{ gap: 16 }}>
        <div style={{ display: "flex", gap: 15, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Avatar name={p.nama} size="xl" shape={mhs ? "circle" : "rounded"} verified={p.vs === "terverifikasi"} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)" }}>{p.nama}</h3>
              <StatusBadge status={p.vs} size="sm" />
            </div>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 4 }}>
              {mhs ? p.email + " · " + p.institusi + " · " + p.jurusan : p.kategori + " · " + p.lowongan + " lowongan"}
            </p>
            <span className="sl-caption" style={{ display: "block", marginTop: 4 }}>Terdaftar {p.daftar} · {mhs ? p.lamaran + " lamaran" : p.lowongan + " lowongan"}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
            <Button variant="secondary" fullWidth iconLeft={<Icon name="KeyRound" size={16} />} onClick={() => notify({ tone: "info", title: "Tautan reset dikirim", description: "Pengguna menerima email untuk mengatur ulang password." })}>Reset password</Button>
            {!disuspend && <Button variant="destructive" fullWidth onClick={() => setSuspend(true)}>Suspend akun</Button>}
          </div>
        </div>
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "profil", label: "Profil" },
          { value: "aktivitas", label: "Aktivitas" },
          { value: "verifikasi", label: "Riwayat verifikasi" },
          ...(mhs ? [] : [{ value: "transaksi", label: "Transaksi" }]),
          { value: "catatan", label: "Catatan internal" },
        ]} />

        {tab === "profil" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
            {(mhs
              ? [["Email", p.email], ["Institusi", p.institusi], ["Jurusan", p.jurusan], ["NIM", "215150401111023"], ["Angkatan", "2023"], ["Telepon", "Belum diverifikasi"], ["Rating", "4,8 · 23 ulasan"], ["Dokumen", "CV utama + KTM"]]
              : [["Email PIC", "hello@kopisenja.id"], ["Kategori", p.kategori], ["NIB", "8120114820931"], ["Alamat", "Jl. Soekarno Hatta 42, Malang"], ["Badan usaha", "PT perorangan"], ["Lowongan aktif", "3 lowongan"], ["Rating", "4,7 · 9 ulasan"]]
            ).map(([k, v]) => <Fakta key={k} label={k} value={v} />)}
          </div>
        )}

        {tab === "aktivitas" && (
          <DataTable
            columns={[{ key: "waktu", header: "Waktu", width: 130 }, { key: "aksi", header: "Aksi" }, { key: "target", header: "Target" }]}
            rows={mhs ? [
              { id: 1, waktu: "01 Sep · 09:12", aksi: "Mengirim lamaran", target: "L-3380 · Konten Instagram" },
              { id: 2, waktu: "30 Agu · 16:40", aksi: "Mengunggah dokumen", target: "CV-Rani-2026.pdf" },
              { id: 3, waktu: "28 Agu · 11:05", aksi: "Membatalkan lamaran", target: "L-3341 · Ilustrasi maskot" },
            ] : [
              { id: 1, waktu: "01 Sep · 09:18", aksi: "Mengajukan lowongan", target: "L-3391" },
              { id: 2, waktu: "24 Agu · 14:22", aksi: "Dana dilepas dari escrow", target: "KT-2402 · Rp 1.200.000" },
              { id: 3, waktu: "19 Agu · 10:03", aksi: "Menerima pelamar", target: "Rani Pratiwi · L-3372" },
            ]}
          />
        )}

        {tab === "verifikasi" && (
          <DataTable
            columns={[{ key: "tgl", header: "Tanggal", width: 130 }, { key: "hasil", header: "Hasil", width: 160, render: (r) => <StatusBadge status={r.st} size="sm" /> }, { key: "oleh", header: "Diputus oleh", width: 150 }, { key: "alasan", header: "Alasan" }]}
            rows={[
              { id: 1, tgl: "14 Feb 2026", st: "terverifikasi", oleh: "Nadia Rahma", alasan: "—" },
              { id: 2, tgl: "12 Feb 2026", st: "verifikasi_ditolak", oleh: "Nadia Rahma", alasan: "Foto KTM tidak terbaca" },
            ]}
          />
        )}

        {tab === "transaksi" && (
          <DataTable
            columns={[{ key: "id", header: "Kontrak", width: 110 }, { key: "tgl", header: "Tanggal", width: 120 }, { key: "proyek", header: "Proyek" }, { key: "nominal", header: "Nilai", numeric: true, width: 130, render: (r) => <Money value={r.nominal} size="sm" /> }, { key: "komisi", header: "Komisi 5%", numeric: true, width: 120, render: (r) => <span className="sl-tabular sl-body-sm">{"Rp " + Math.round(r.nominal * 0.05).toLocaleString("id-ID")}</span> }, { key: "st", header: "Status", width: 150, render: (r) => <StatusBadge status={r.st} size="sm" /> }]}
            rows={[
              { id: "KT-2402", tgl: "24 Agu 2026", proyek: "Konten Instagram 12 post", nominal: 1200000, st: "selesai" },
              { id: "KT-2388", tgl: "19 Agu 2026", proyek: "Fotografer produk katalog", nominal: 1800000, st: "selesai" },
            ]}
          />
        )}

        {tab === "catatan" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <Textarea label="Catatan internal" rows={4} maxLength={600} showCount value={catatan} onChange={(e) => setCatatan(e.target.value)}
              hint="Hanya terlihat oleh admin. Tidak pernah ditampilkan ke pengguna." />
            <Button size="sm" style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Catatan disimpan" })}>Simpan catatan</Button>
          </div>
        )}
      </Card>

      <Modal open={suspend} onClose={() => setSuspend(false)} title="Suspend akun" description={p.nama}
        footer={<><Button variant="ghost" onClick={() => setSuspend(false)}>Batal</Button><Button variant="destructive" onClick={() => { setSuspend(false); notify({ tone: "info", title: "Akun disuspend", description: p.nama + " tidak bisa masuk sampai diaktifkan kembali." }); }}>Suspend</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Select label="Alasan" required options={["Melanggar ketentuan layanan", "Terindikasi penipuan", "Dokumen palsu", "Permintaan pengguna", "Aktivitas mencurigakan"]} />
          <Textarea label="Catatan" rows={3} maxLength={300} showCount placeholder="Rekam bukti atau nomor laporan terkait." />
          <span className="sl-caption" style={{ lineHeight: 1.55 }}>Pengguna akan langsung keluar dari semua sesi. {mhs ? "Lamaran yang sedang berjalan otomatis dibatalkan." : "Lowongan aktif otomatis diturunkan dari daftar."}</span>
        </div>
      </Modal>
    </>
  );
}

/* ---------------- A8 — Manajemen lowongan ---------------- */
function AdminLowongan({ notify }) {
  const [tab, setTab] = React.useState("semua");
  const [turunkan, setTurunkan] = React.useState(null);
  const [hal, setHal] = React.useState(1);
  const rows = LOWONGAN_ALL.filter((l) => tab === "semua" || l.st === tab);

  return (
    <>
      <Card padding="lg" style={{ gap: 14 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "semua", label: "Semua", count: LOWONGAN_ALL.length },
          { value: "aktif", label: "Aktif", count: 2 },
          { value: "menunggu_moderasi", label: "Menunggu review", count: 1 },
          { value: "ditutup", label: "Ditutup", count: 1 },
          { value: "kedaluwarsa", label: "Kedaluwarsa", count: 1 },
          { value: "ditolak_admin", label: "Ditolak", count: 1 },
        ]} />
        <Toolbar>
          <SearchField placeholder="Cari judul atau ID lowongan" label="Cari lowongan" collapsedWidth={220} expandedWidth={340} />
        </Toolbar>
        <DataTable
          columns={[
            { key: "id", header: "ID", width: 90 },
            { key: "judul", header: "Lowongan", render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.judul}<span className="sl-caption" style={{ display: "block" }}>{r.bisnis}</span></span> },
            { key: "gaji", header: "Gaji", numeric: true, width: 130, render: (r) => <span className="sl-tabular sl-body-sm">{rpx(r.gaji)}</span> },
            { key: "pelamar", header: "Pelamar", numeric: true, width: 90 },
            { key: "st", header: "Status", width: 150, render: (r) => <StatusBadge status={r.st} size="sm" /> },
            { key: "posting", header: "Diposting", width: 120 },
            { key: "aksi", header: "", width: 128, align: "right", render: (r) => r.st === "aktif" ? <Button size="sm" variant="ghost" onClick={() => setTurunkan(r)}>Turunkan</Button> : <Button size="sm" variant="ghost">Lihat</Button> },
          ]}
          rows={rows}
        />
        <Pagination page={hal} total={9} onChange={setHal} label={rows.length + " dari 341 lowongan"} />
      </Card>

      <Modal open={!!turunkan} onClose={() => setTurunkan(null)} title="Turunkan lowongan" description={turunkan ? turunkan.id + " · " + turunkan.judul : ""}
        footer={<><Button variant="ghost" onClick={() => setTurunkan(null)}>Batal</Button><Button variant="destructive" onClick={() => { notify({ tone: "info", title: "Lowongan diturunkan", description: turunkan.id + " tidak lagi tayang. Bisnis diberi tahu alasannya." }); setTurunkan(null); }}>Turunkan sekarang</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Select label="Alasan" required options={["Melanggar ketentuan layanan", "Laporan pengguna terbukti", "Informasi menyesatkan", "Bisnis disuspend", "Permintaan bisnis"]} />
          <Textarea label="Catatan untuk bisnis" rows={3} maxLength={300} showCount />
          <span className="sl-caption" style={{ lineHeight: 1.55 }}>{turunkan ? turunkan.pelamar : 0} pelamar yang sudah masuk akan diberi tahu bahwa lowongan ditutup.</span>
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { AdminMahasiswa, AdminBisnis, AdminDetailPengguna, AdminLowongan, MAHASISWA, BISNIS, LOWONGAN_ALL, Toolbar, rpx });
