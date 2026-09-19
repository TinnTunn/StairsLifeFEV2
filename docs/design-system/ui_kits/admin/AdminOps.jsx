const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, Checkbox, Switch, EmptyState, SearchField, Money, MetricCard, RadioCard } = window.StairsLifeDesignSystem_075594;

/* ---------------- A9 — Laporan & aduan ---------------- */
const LAPORAN = [
  { id: "R-517", konten: "L-3384 · Fotografer — hubungi WA", jenis: "Lowongan", pelapor: "Sekar Ayu", alasan: "Mengarahkan ke luar platform", tgl: "01 Sep 2026", st: "baru",
    detail: "Bisnis meminta saya menghubungi WhatsApp dan membayar biaya pendaftaran Rp 50.000 sebelum wawancara. Saya belum mentransfer." },
  { id: "R-516", konten: "Toko Serba Ada 88", jenis: "Bisnis", pelapor: "Dimas Ardi", alasan: "Terindikasi penipuan", tgl: "31 Agu 2026", st: "baru",
    detail: "Nomor telepon bisnis tidak aktif dan alamatnya tidak ditemukan di lokasi yang dicantumkan." },
  { id: "R-511", konten: "Nadya Kirana", jenis: "Mahasiswa", pelapor: "Rimbun Plant House", alasan: "Tidak hadir setelah diterima", tgl: "27 Agu 2026", st: "ditangani",
    detail: "Sudah diterima dan menyepakati jadwal, tapi tidak hadir dan tidak bisa dihubungi selama seminggu." },
];

function AdminLaporan({ notify }) {
  const [tab, setTab] = React.useState("baru");
  const [buka, setBuka] = React.useState(null);
  const rows = LAPORAN.filter((l) => tab === "semua" || l.st === tab);

  return (
    <>
      <Card padding="lg" style={{ gap: 14 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "baru", label: "Belum ditangani", count: 2 },
          { value: "ditangani", label: "Ditangani", count: 1 },
          { value: "semua", label: "Semua", count: LAPORAN.length },
        ]} />
        {rows.length === 0 ? (
          <EmptyState icon={<Icon name="ShieldCheck" size={30} strokeWidth={1.5} />} title="Tidak ada laporan di tab ini" description="Laporan baru dari pengguna akan muncul di sini." />
        ) : (
          <DataTable
            columns={[
              { key: "id", header: "ID", width: 84 },
              { key: "konten", header: "Konten dilaporkan", render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.konten}<span className="sl-caption" style={{ display: "block" }}>{r.jenis} · dilaporkan {r.pelapor}</span></span> },
              { key: "alasan", header: "Alasan", width: 210 },
              { key: "tgl", header: "Tanggal", width: 120 },
              { key: "st", header: "Status", width: 130, render: (r) => <StatusBadge status={r.st === "baru" ? "menunggu_moderasi" : "selesai"} label={r.st === "baru" ? "Belum ditangani" : "Ditangani"} size="sm" /> },
              { key: "aksi", header: "", width: 96, align: "right", render: (r) => <Button size="sm" variant="ghost" onClick={() => setBuka(r)}>Periksa</Button> },
            ]}
            rows={rows}
          />
        )}
      </Card>

      <Modal open={!!buka} onClose={() => setBuka(null)} title={buka ? "Laporan " + buka.id : ""} description={buka ? buka.jenis + " · " + buka.konten : ""}
        footer={<><Button variant="ghost" onClick={() => { notify({ tone: "info", title: "Laporan diabaikan", description: "Ditandai tidak terbukti. Pelapor diberi tahu." }); setBuka(null); }}>Abaikan</Button><Button variant="destructive" onClick={() => { notify({ tone: "success", title: "Tindakan diambil", description: buka.konten + " diturunkan dan pelapor diberi tahu." }); setBuka(null); }}>Tindak lanjuti</Button></>}>
        {buka && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
              <Fakta label="Pelapor" value={buka.pelapor} />
              <Fakta label="Alasan" value={buka.alasan} />
              <Fakta label="Dilaporkan" value={buka.tgl} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span className="sl-overline">Keterangan pelapor</span>
              <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6, padding: "11px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>{buka.detail}</p>
            </div>
            <Select label="Tindakan" options={["Turunkan konten", "Suspend akun terlapor", "Peringatan tertulis", "Tidak terbukti — abaikan"]} />
            <Textarea label="Catatan penanganan" rows={3} maxLength={400} showCount placeholder="Rekam apa yang diperiksa dan dasar keputusannya." />
          </div>
        )}
      </Modal>
    </>
  );
}

/* ---------------- A10 — Arus dana & komisi ----------------
   Pemasukan platform hanya komisi 5% dari nilai kontrak, dipotong saat dana
   dilepas dari escrow. Tidak ada pembelian paket dan tidak ada QRIS. */

const A_ARUS = [
  { id: "KT-2419", tgl: "10 Sep 2026", bisnis: "Kopi Senja Malang", mhs: "Rani Pratiwi", nilai: 2500000, st: "escrow_ditahan" },
  { id: "KT-2402", tgl: "24 Agu 2026", bisnis: "Rimbun Plant House", mhs: "Dimas Ardi", nilai: 1200000, st: "selesai" },
  { id: "KT-2388", tgl: "19 Agu 2026", bisnis: "Tahu Pong Semarang", mhs: "Bayu Saputra", nilai: 1800000, st: "selesai" },
  { id: "KT-2371", tgl: "12 Agu 2026", bisnis: "Warung Ibu Tri", mhs: "Sekar Ayu", nilai: 850000, st: "selesai" },
  { id: "KT-2355", tgl: "02 Agu 2026", bisnis: "Kopi Senja Malang", mhs: "Nadya Kirana", nilai: 600000, st: "sengketa" },
];

function AdminTransaksi({ notify, setRute }) {
  const [tab, setTab] = React.useState("semua");
  const rows = A_ARUS.filter((r) => tab === "semua" || r.st === tab);
  const lepas = A_ARUS.filter((r) => r.st === "selesai");
  const totalLepas = lepas.reduce((s, r) => s + r.nilai, 0);
  const komisi = Math.round(totalLepas * 0.05);
  const ditahan = A_ARUS.filter((r) => r.st === "escrow_ditahan").reduce((s, r) => s + r.nilai, 0);
  const sengketa = A_ARUS.filter((r) => r.st === "sengketa").reduce((s, r) => s + r.nilai, 0);

  return (
    <>
      <div className="ad-grid">
        <MetricCard label="Ditahan di escrow" value={"Rp " + ditahan.toLocaleString("id-ID")} icon={<Icon name="ShieldCheck" size={19} />} />
        <MetricCard label="Dilepas bulan ini" value={"Rp " + totalLepas.toLocaleString("id-ID")} delta={12} iconTone="success" icon={<Icon name="ArrowLeftRight" size={19} />} />
        <MetricCard label="Komisi 5% diterima" value={"Rp " + komisi.toLocaleString("id-ID")} delta={12} icon={<Icon name="Receipt" size={19} />} />
        <MetricCard label="Tertahan sengketa" value={"Rp " + sengketa.toLocaleString("id-ID")} iconTone="warning" icon={<Icon name="Scale" size={19} />} />
      </div>

      <Card padding="lg" style={{ gap: 14 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "semua", label: "Semua", count: A_ARUS.length },
          { value: "escrow_ditahan", label: "Ditahan", count: 1 },
          { value: "selesai", label: "Dilepas", count: 3 },
          { value: "sengketa", label: "Sengketa", count: 1 },
        ]} />
        <Toolbar kanan={<Button size="sm" variant="secondary" iconLeft={<Icon name="Download" size={15} />}>Ekspor rekonsiliasi</Button>}>
          <SearchField placeholder="Cari ID kontrak, bisnis, atau mahasiswa" label="Cari arus dana" collapsedWidth={220} expandedWidth={340} />
        </Toolbar>
        <DataTable
          columns={[
            { key: "id", header: "Kontrak", width: 100 },
            { key: "tgl", header: "Tanggal", width: 120 },
            { key: "bisnis", header: "Pihak", wrap: true, render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.bisnis}<span className="sl-caption" style={{ display: "block" }}>→ {r.mhs}</span></span> },
            { key: "nilai", header: "Nilai kontrak", numeric: true, width: 140, render: (r) => <Money value={r.nilai} size="sm" tone={r.st === "escrow_ditahan" ? "held" : r.st === "selesai" ? "in" : undefined} /> },
            { key: "komisi", header: "Komisi 5%", numeric: true, width: 130, render: (r) => <span className="sl-tabular sl-body-sm" style={{ color: r.st === "selesai" ? "var(--text-strong)" : "var(--text-subtle)" }}>{r.st === "selesai" ? "Rp " + Math.round(r.nilai * 0.05).toLocaleString("id-ID") : "Belum"}</span> },
            { key: "st", header: "Status", width: 165, render: (r) => <StatusBadge status={r.st} size="sm" /> },
            { key: "aksi", header: "", width: 100, align: "right", render: (r) => r.st === "sengketa" ? <Button size="sm" variant="secondary" onClick={() => setRute && setRute("a15")}>Putuskan</Button> : <Button size="sm" variant="ghost">Rincian</Button> },
          ]}
          rows={rows}
        />
        <span className="sl-caption" style={{ lineHeight: 1.5 }}>
          Komisi baru tercatat setelah dana benar-benar dilepas ke mahasiswa. Kontrak dalam sengketa tidak menghasilkan komisi sampai ada putusan.
        </span>
      </Card>
    </>
  );
}

/* ---------------- A11 — Master data ---------------- */
const MASTER = {
  "Kategori lowongan": ["Desain grafis", "Web & aplikasi", "Penulisan", "Video & animasi", "Sosial media", "Fotografi", "Data & riset"],
  "Kategori bisnis": ["Kuliner", "Retail", "Fesyen", "Jasa", "Pendidikan", "Kesehatan"],
  Institusi: ["Universitas Brawijaya", "Universitas Negeri Malang", "Politeknik Negeri Malang", "UIN Maulana Malik Ibrahim"],
  Jurusan: ["Desain Komunikasi Visual", "Teknik Informatika", "Ilmu Komunikasi", "Manajemen Informatika", "Sastra Inggris"],
  Keahlian: ["Logo", "Branding", "Illustrator", "Figma", "Packaging", "Copywriting", "Motion", "Fotografi"],
  Lokasi: ["Malang", "Surabaya", "Semarang", "Yogyakarta", "Remote"],
};

function AdminMaster({ notify }) {
  const kunci = Object.keys(MASTER);
  const [tab, setTab] = React.useState(kunci[0]);
  const [data, setData] = React.useState(MASTER);
  const [tambah, setTambah] = React.useState(false);
  const [nama, setNama] = React.useState("");

  return (
    <>
      <Card padding="lg" style={{ gap: 14 }}>
        <Tabs value={tab} onChange={setTab} items={kunci.map((k) => ({ value: k, label: k, count: data[k].length }))} />
        <Toolbar kanan={<Button size="sm" iconLeft={<Icon name="Plus" size={15} />} onClick={() => setTambah(true)}>Tambah</Button>}>
          <span className="sl-caption">{data[tab].length} entri · dipakai di formulir posting dan filter pencarian</span>
        </Toolbar>
        <DataTable
          columns={[
            { key: "nama", header: "Nama" },
            { key: "slug", header: "Slug", width: 200 },
            { key: "pakai", header: "Dipakai", numeric: true, width: 100 },
            { key: "aksi", header: "", width: 150, align: "right", render: (r) => (
              <span style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <Button size="sm" variant="ghost">Ubah</Button>
                <Button size="sm" variant="ghost" onClick={() => { setData((d) => ({ ...d, [tab]: d[tab].filter((x) => x !== r.nama) })); notify({ tone: "info", title: "Entri dihapus", description: r.nama + " dihapus dari " + tab.toLowerCase() + "." }); }}>Hapus</Button>
              </span>
            ) },
          ]}
          rows={data[tab].map((n, i) => ({ id: i, nama: n, slug: n.toLowerCase().replace(/[^a-z0-9]+/g, "-"), pakai: [63, 41, 28, 19, 12, 8, 5][i % 7] }))}
        />
      </Card>

      <Modal open={tambah} onClose={() => setTambah(false)} title={"Tambah " + tab.toLowerCase()} size="sm"
        footer={<><Button variant="ghost" onClick={() => setTambah(false)}>Batal</Button><Button onClick={() => { if (nama.trim()) { setData((d) => ({ ...d, [tab]: [...d[tab], nama.trim()] })); notify({ tone: "success", title: "Entri ditambahkan", description: nama + " sekarang tersedia di formulir." }); setNama(""); setTambah(false); } }}>Simpan</Button></>}>
        <Input label="Nama" required value={nama} onChange={(e) => setNama(e.target.value)} hint="Slug dibuat otomatis dari nama." />
      </Modal>
    </>
  );
}

/* ---------------- A12 — Log aktivitas ---------------- */
function AdminLog() {
  const [hal, setHal] = React.useState(1);
  return (
    <Card padding="lg" style={{ gap: 14 }}>
      <Toolbar kanan={<Select size="sm" options={["Semua aktor", "Admin", "Sistem", "Bisnis", "Mahasiswa"]} />}>
        <SearchField placeholder="Cari aksi, target, atau IP" label="Cari log" collapsedWidth={220} expandedWidth={340} />
      </Toolbar>
      <DataTable
        columns={[
          { key: "waktu", header: "Waktu", width: 150 },
          { key: "aktor", header: "Aktor", width: 160 },
          { key: "aksi", header: "Aksi" },
          { key: "target", header: "Target" },
          { key: "ip", header: "IP", width: 130 },
        ]}
        rows={[
          { id: 1, waktu: "01 Sep · 09:42:11", aktor: "Nadia Rahma", aksi: "verification.approve", target: "V-1040", ip: "103.94.7.21" },
          { id: 2, waktu: "01 Sep · 09:31:04", aktor: "Sistem", aksi: "job.expire", target: "L-3201", ip: "—" },
          { id: 3, waktu: "01 Sep · 09:18:37", aktor: "Kopi Senja Malang", aksi: "job.submit", target: "L-3391", ip: "36.72.214.8" },
          { id: 4, waktu: "01 Sep · 08:57:52", aktor: "Nadia Rahma", aksi: "job.reject", target: "L-3384", ip: "103.94.7.21" },
          { id: 5, waktu: "01 Sep · 08:40:19", aktor: "Sistem", aksi: "payment.settle", target: "TRX-8836", ip: "—" },
          { id: 6, waktu: "31 Agu · 21:12:03", aktor: "Nadia Rahma", aksi: "user.suspend", target: "Fajar Wibowo", ip: "103.94.7.21" },
          { id: 7, waktu: "31 Agu · 17:44:56", aktor: "Rani Pratiwi", aksi: "application.submit", target: "L-3380", ip: "114.10.32.77" },
        ]}
      />
      <Pagination page={hal} total={128} onChange={setHal} label="7 dari 3.194 entri · disimpan 90 hari" />
    </Card>
  );
}

/* ---------------- A13 — Pengaturan sistem ---------------- */
function AdminPengaturan({ notify }) {
  const [moderasi, setModerasi] = React.useState(true);
  const [manual, setManual] = React.useState(true);
  const [maintenance, setMaintenance] = React.useState(false);

  return (
    <>
      <Card padding="lg" style={{ gap: 16 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Moderasi &amp; tayang</h3>
        <Switch label="Moderasi lowongan sebelum tayang" checked={moderasi} onChange={(e) => setModerasi(e.target.checked)}
          description="Jika dimatikan, lowongan langsung tayang tanpa review admin. Antrean A4 akan kosong permanen." />
        <Switch label="Tahan komisi saat sengketa" checked={manual} onChange={(e) => setManual(e.target.checked)}
          description="Komisi 5% tidak ditagih sampai sengketa diputus. Kalau dimatikan, komisi dipotong saat dana dilepas apa pun hasilnya." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
          <Input label="Durasi tayang default" numeric suffix="hari" defaultValue="30" hint="Lowongan kedaluwarsa otomatis setelah ini." />
          <Input label="Batas ukuran file" numeric suffix="MB" defaultValue="10" hint="Berlaku untuk CV, KTM, dan bukti transfer." />
          <Input label="Maks. lamaran per hari" numeric defaultValue="15" hint="Per mahasiswa, mencegah lamaran massal." />
        </div>
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Akun admin</h3>
        <DataTable
          columns={[
            { key: "nama", header: "Nama", render: (r) => <span style={{ display: "flex", alignItems: "center", gap: 9 }}><Avatar name={r.nama} size="xs" /><b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.nama}</b></span> },
            { key: "email", header: "Email" },
            { key: "peran", header: "Peran", width: 160 },
            { key: "akhir", header: "Masuk terakhir", width: 150 },
            { key: "aksi", header: "", width: 90, align: "right", render: () => <Button size="sm" variant="ghost">Ubah</Button> },
          ]}
          rows={[
            { id: 1, nama: "Nadia Rahma", email: "nadia@stairslife.id", peran: "Admin moderasi", akhir: "01 Sep · 09:42" },
            { id: 2, nama: "Arif Setiawan", email: "arif@stairslife.id", peran: "Super admin", akhir: "31 Agu · 18:03" },
          ]}
        />
        <Button size="sm" variant="secondary" style={{ alignSelf: "flex-start" }} iconLeft={<Icon name="UserPlus" size={15} />}>Tambah admin</Button>
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Template email</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Verifikasi email pendaftaran", "Verifikasi identitas disetujui", "Verifikasi identitas ditolak", "Lowongan disetujui admin", "Lamaran diterima bisnis", "Pembayaran berhasil"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 44, padding: "8px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <span className="sl-body-sm" style={{ flex: 1, minWidth: 0 }}>{t}</span>
              <Button size="sm" variant="ghost">Ubah</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg" style={{ gap: 14, borderColor: "var(--danger-border)" }}>
        <h3 style={{ fontSize: "var(--text-h3)", color: "var(--danger-text)", flex: "none" }}>Zona berbahaya</h3>
        <Switch label="Mode maintenance" checked={maintenance} onChange={(e) => { setMaintenance(e.target.checked); notify({ tone: e.target.checked ? "warning" : "info", title: e.target.checked ? "Mode maintenance aktif" : "Mode maintenance dimatikan", description: e.target.checked ? "Semua pengguna non-admin melihat halaman pemeliharaan." : "Situs kembali normal." }); }}
          description="Menutup situs untuk semua pengguna kecuali admin. Pakai saat migrasi basis data." />
      </Card>
    </>
  );
}

/* ---------------- A14 — Pengumuman ---------------- */
function AdminPengumuman({ notify }) {
  const [segmen, setSegmen] = React.useState("semua");
  const [judul, setJudul] = React.useState("");
  const [isi, setIsi] = React.useState("");
  const [err, setErr] = React.useState("");

  const jumlah = { semua: 1460, mahasiswa: 1284, bisnis: 176, belum: 5 }[segmen];

  const kirim = () => {
    if (judul.trim().length < 5) { setErr("Judul minimal 5 karakter."); return; }
    setErr("");
    notify({ tone: "success", title: "Pengumuman dikirim", description: "Terkirim ke " + jumlah.toLocaleString("id-ID") + " pengguna." });
    setJudul(""); setIsi("");
  };

  return (
    <>
      <Card padding="lg" style={{ gap: 16 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Buat pengumuman</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-semibold)", color: "var(--text-body)" }}>Segmen penerima</span>
          <RadioCard name="segmen" label="Semua pengguna" description="Mahasiswa dan bisnis, terverifikasi maupun belum." price="1.460 orang" checked={segmen === "semua"} onChange={() => setSegmen("semua")} />
          <RadioCard name="segmen" label="Hanya mahasiswa" description="Cocok untuk pengumuman lowongan baru atau tips melamar." price="1.284 orang" checked={segmen === "mahasiswa"} onChange={() => setSegmen("mahasiswa")} />
          <RadioCard name="segmen" label="Hanya bisnis" description="Cocok untuk perubahan biaya layanan atau kebijakan posting." price="176 akun" checked={segmen === "bisnis"} onChange={() => setSegmen("bisnis")} />
          <RadioCard name="segmen" label="Belum terverifikasi" description="Dorongan untuk melengkapi verifikasi identitas." price="5 orang" checked={segmen === "belum"} onChange={() => setSegmen("belum")} />
        </div>
        <Input label="Judul" required value={judul} error={err} onChange={(e) => { setJudul(e.target.value); if (err) setErr(""); }} placeholder="Contoh: Verifikasi identitas kini selesai dalam 1 hari kerja" />
        <Textarea label="Isi pengumuman" required rows={4} maxLength={600} showCount value={isi} onChange={(e) => setIsi(e.target.value)}
          hint="Muncul di halaman notifikasi dan dikirim sebagai email. Tulis satu hal saja per pengumuman." />
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
          <Button onClick={kirim}>Kirim sekarang</Button>
          <Button variant="secondary" iconLeft={<Icon name="Clock" size={16} />}>Jadwalkan</Button>
          <Button variant="ghost">Pratinjau</Button>
          <span className="sl-caption" style={{ marginLeft: "auto" }}>Akan diterima {jumlah.toLocaleString("id-ID")} pengguna</span>
        </div>
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Riwayat pengumuman</h3>
        <DataTable
          columns={[
            { key: "tgl", header: "Dikirim", width: 130 },
            { key: "judul", header: "Judul" },
            { key: "segmen", header: "Segmen", width: 150 },
            { key: "penerima", header: "Penerima", numeric: true, width: 110 },
            { key: "dibuka", header: "Dibuka", numeric: true, width: 100 },
          ]}
          rows={[
            { id: 1, tgl: "24 Agu 2026", judul: "Biaya layanan tetap 5% dari nilai kontrak", segmen: "Bisnis", penerima: "176", dibuka: "71%" },
            { id: 2, tgl: "12 Agu 2026", judul: "Cara agar lamaranmu lebih sering dilihat", segmen: "Mahasiswa", penerima: "1.180", dibuka: "64%" },
            { id: 3, tgl: "02 Agu 2026", judul: "Pemeliharaan sistem 3 Agu 01.00–03.00", segmen: "Semua pengguna", penerima: "1.284", dibuka: "58%" },
          ]}
        />
      </Card>
    </>
  );
}

Object.assign(window, { AdminLaporan, AdminTransaksi, AdminMaster, AdminLog, AdminPengaturan, AdminPengumuman, LAPORAN, A_ARUS });
