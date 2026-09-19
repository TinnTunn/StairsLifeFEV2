const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, Checkbox, Switch, RadioCard, FileDropzone, EmptyState, Money, MetricCard, Rating } = window.StairsLifeDesignSystem_075594;

/* ---------------- B8 — Profil bisnis ---------------- */
function BizProfil({ notify, terverifikasi, setTerverifikasi }) {
  const [tab, setTab] = React.useState("profil");
  const [berkas, setBerkas] = React.useState(terverifikasi ? [{ name: "NIB-KopiSenja.pdf", size: "1,8 MB" }] : []);
  const [nama, setNama] = React.useState("Kopi Senja Malang");
  const [tentang, setTentang] = React.useState("Kedai kopi spesialti di Malang, buka sejak 2024. Kami menyeduh biji dari petani Jawa Timur dan sering bekerja sama dengan mahasiswa desain untuk materi promosi.");

  return (
    <>
      <Card padding="lg" style={{ gap: 15 }}>
        <div style={{ display: "flex", gap: 15, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Avatar name={nama} size="xl" shape="rounded" verified={terverifikasi} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)" }}>{nama}</h2>
              <StatusBadge status={terverifikasi ? "terverifikasi" : berkas.length ? "menunggu_verifikasi" : "belum_diajukan"} size="sm" />
            </div>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 4 }}>Kuliner · Kedai kopi · Malang</p>
            <div style={{ marginTop: 7 }}><Rating value={4.7} count={9} showValue /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 170 }}>
            <Button variant="secondary" fullWidth iconLeft={<Icon name="ExternalLink" size={16} />}>Lihat profil publik</Button>
            <span className="sl-caption" style={{ textAlign: "center", lineHeight: 1.45 }}>Inilah yang dilihat mahasiswa sebelum melamar</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
          <FaktaB label="Lowongan tayang" value="3 lowongan" />
          <FaktaB label="Total pelamar" value="28 orang" />
          <FaktaB label="Diterima" value="7 mahasiswa" />
          <FaktaB label="Bergabung" value="09 Jan 2026" />
        </div>
      </Card>

      <Card padding="lg" style={{ gap: 15 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "profil", label: "Profil publik" },
          { value: "verifikasi", label: "Verifikasi", count: terverifikasi ? undefined : 1 },
          { value: "kontak", label: "Kontak & alamat" },
        ]} />

        {tab === "profil" && (
          <>
            <Input label="Nama bisnis" required value={nama} onChange={(e) => setNama(e.target.value)} hint="Tampil di setiap lowongan dan di profil publik." />
            <Textarea label="Tentang bisnis" required rows={4} maxLength={600} showCount value={tentang} onChange={(e) => setTentang(e.target.value)}
              hint="Mahasiswa membaca ini sebelum memutuskan melamar. Sebutkan bidang usaha dan cara kerja timmu." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
              <Select label="Kategori usaha" required defaultValue="Kuliner" options={["Kuliner", "Retail", "Fesyen", "Jasa", "Pendidikan", "Kesehatan"]} />
              <Input label="Situs web" defaultValue="kopisenja.id" prefix="https://" />
              <Input label="Instagram" defaultValue="kopisenja.mlg" prefix="@" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span className="sl-overline">Logo bisnis</span>
              <div style={{ display: "flex", gap: 13, alignItems: "center", flexWrap: "wrap" }}>
                <MediaSlot ratio="1 / 1" size="sm" icon={<Icon name="ImagePlus" size={20} strokeWidth={1.5} />}
                  style={{ width: 96, flex: "none" }} />
                <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                  <Button size="sm" variant="secondary">Unggah logo</Button>
                  <span className="sl-caption" style={{ lineHeight: 1.45 }}>PNG atau JPG, minimal 400×400 px. Tampil di setiap lowonganmu.</span>
                </span>
              </div>
            </div>
            <Button style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Profil disimpan", description: "Perubahan langsung terlihat di semua lowongan aktifmu." })}>Simpan perubahan</Button>
          </>
        )}

        {tab === "verifikasi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {terverifikasi ? (
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--success-soft)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-md)" }}>
                <span style={{ flex: "none", color: "var(--success-text)", display: "flex", marginTop: 1 }}><Icon name="ShieldCheck" size={18} /></span>
                <span style={{ minWidth: 0 }}>
                  <b className="sl-body-sm" style={{ color: "var(--success-text)", display: "block" }}>Bisnis terverifikasi sejak 11 Jan 2026</b>
                  <span className="sl-caption" style={{ color: "var(--success-text)" }}>Lencana terverifikasi tampil di setiap lowonganmu. Mahasiswa 3× lebih sering melamar ke bisnis terverifikasi.</span>
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--warning-soft)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)" }}>
                <span style={{ flex: "none", color: "var(--warning-text)", display: "flex", marginTop: 1 }}><Icon name="AlertTriangle" size={18} /></span>
                <span style={{ minWidth: 0 }}>
                  <b className="sl-body-sm" style={{ color: "var(--warning-text)", display: "block" }}>Belum bisa menayangkan lowongan</b>
                  <span className="sl-caption" style={{ color: "var(--warning-text)" }}>Unggah dokumen legalitas untuk membuka penayangan. Review biasanya selesai dalam 1 hari kerja.</span>
                </span>
              </div>
            )}
            <FileDropzone label="Dokumen legalitas" hint="NIB, SIUP, atau NPWP badan usaha · PDF/JPG maksimal 10 MB" accept=".pdf,.jpg,.png"
              files={berkas} onRemove={(f) => setBerkas((v) => v.filter((x) => x.name !== f.name))}
              onFiles={(fs) => setBerkas((v) => [...v, ...fs.map((f) => ({ name: f.name, size: (f.size / 1048576).toFixed(1).replace(".", ",") + " MB" }))])} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
              <Input label="Nomor NIB" defaultValue={terverifikasi ? "8120114820931" : ""} hint="13 digit, tanpa spasi" />
              <Select label="Badan usaha" defaultValue="PT perorangan" options={["PT perorangan", "PT", "CV", "UMKM / usaha mikro", "Koperasi"]} />
            </div>
            {!terverifikasi && (
              <Button style={{ alignSelf: "flex-start" }} disabled={!berkas.length}
                onClick={() => { setTerverifikasi(true); notify({ tone: "success", title: "Dokumen dikirim", description: "Masuk antrean review admin. Kamu akan dapat email begitu diputuskan." }); }}>
                Kirim untuk verifikasi
              </Button>
            )}
          </div>
        )}

        {tab === "kontak" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
              <Input label="Email PIC" required defaultValue="hello@kopisenja.id" hint="Untuk notifikasi pelamar dan tagihan." />
              <Input label="Telepon PIC" required defaultValue="0341 445 7712" />
              <Input label="Nama PIC" required defaultValue="Sinta Damayanti" />
              <Select label="Kota" required defaultValue="Malang" options={["Malang", "Surabaya", "Semarang", "Yogyakarta"]} />
            </div>
            <Textarea label="Alamat lengkap" required rows={2} defaultValue="Jl. Soekarno Hatta 42, Lowokwaru, Malang, Jawa Timur 65141"
              hint="Dipakai untuk lowongan onsite dan verifikasi. Tidak ditampilkan penuh ke publik." />
            <Button style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Kontak disimpan" })}>Simpan perubahan</Button>
          </>
        )}
      </Card>
    </>
  );
}

/* ---------------- B9 — Biaya layanan ----------------
   StairsLife tidak menjual paket posting. Pemasukan platform hanya komisi 5%
   dari nilai kontrak, dipotong sekali saat dana dilepas dari escrow — jadi
   layar ini menjelaskan biaya, bukan menagihnya. */

function BizBiaya({ notify, setRute }) {
  const KONTRAK = [
    { id: "KT-2419", proyek: "Desain logo & brand kit", mhs: "Rani Pratiwi", nilai: 2500000, st: "escrow_ditahan", tgl: "10 Sep 2026" },
    { id: "KT-2402", proyek: "Konten Instagram 12 post", mhs: "Dimas Ardi", nilai: 1200000, st: "selesai", tgl: "24 Agu 2026" },
    { id: "KT-2388", proyek: "Fotografer produk katalog", mhs: "Bayu Saputra", nilai: 1800000, st: "selesai", tgl: "19 Agu 2026" },
  ];
  const selesai = KONTRAK.filter((k) => k.st === "selesai");
  const totalDilepas = selesai.reduce((s, k) => s + k.nilai, 0);
  const totalBiaya = Math.round(totalDilepas * 0.05);
  const ditahan = KONTRAK.filter((k) => k.st === "escrow_ditahan").reduce((s, k) => s + k.nilai, 0);

  return (
    <>
      <div className="bz-grid">
        <MetricCard label="Ditahan di escrow" value={"Rp " + ditahan.toLocaleString("id-ID")} icon={<Icon name="ShieldCheck" size={19} />} />
        <MetricCard label="Sudah dilepas" value={"Rp " + totalDilepas.toLocaleString("id-ID")} iconTone="success" icon={<Icon name="CheckCircle2" size={19} />} />
        <MetricCard label="Biaya layanan terbayar" value={"Rp " + totalBiaya.toLocaleString("id-ID")} iconTone="neutral" icon={<Icon name="Receipt" size={19} />} />
        <MetricCard label="Lowongan aktif" value="3" iconTone="neutral" icon={<Icon name="Briefcase" size={19} />} />
      </div>

      <Card padding="lg" style={{ gap: 15 }}>
        <div>
          <h3 style={{ fontSize: "var(--text-h3)", color: "var(--text-strong)" }}>Bagaimana biaya dihitung</h3>
          <p className="sl-caption" style={{ marginTop: 3, lineHeight: 1.5 }}>Satu potongan di akhir, tanpa biaya di muka.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11, padding: "14px 16px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
          <span className="sl-overline">Contoh kontrak Rp 2.500.000</span>
          {[["Kamu setor ke escrow", "Rp 2.500.000", false],
            ["Biaya layanan StairsLife 5%", "− Rp 125.000", false],
            ["Diterima mahasiswa", "Rp 2.375.000", true]].map(([k, v, kuat]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", paddingTop: kuat ? 11 : 0, borderTop: kuat ? "1px solid var(--border-subtle)" : "none" }}>
              <span className="sl-body-sm" style={{ color: kuat ? "var(--text-body)" : "var(--text-muted)" }}>{k}</span>
              <b className="sl-tabular sl-body-sm" style={{ color: "var(--text-strong)", fontWeight: kuat ? 700 : 600, whiteSpace: "nowrap" }}>{v}</b>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14 }}>
          {[["CircleSlash", "Tidak ada biaya posting", "Posting lowongan sebanyak yang kamu butuhkan."],
            ["CalendarX", "Tidak ada langganan", "Tidak ada tagihan bulanan dan tidak diperpanjang otomatis."],
            ["Undo2", "Batal = tanpa biaya", "Kalau kontrak dibatalkan sebelum dana dilepas, dana kembali penuh."]].map(([ikon, j, t]) => (
            <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flex: "none", marginTop: 1, color: "var(--success)", display: "flex" }}><Icon name={ikon} size={17} /></span>
              <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{j}</b>
                <span className="sl-caption" style={{ lineHeight: 1.5 }}>{t}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
          <h3 style={{ fontSize: "var(--text-h3)" }}>Biaya per kontrak</h3>
          <Button size="sm" variant="ghost" onClick={() => setRute && setRute("b10")}>Riwayat lengkap</Button>
        </div>
        <DataTable
          columns={[
            { key: "id", header: "Kontrak", width: 100 },
            { key: "proyek", header: "Proyek", wrap: true, render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.proyek}<span className="sl-caption" style={{ display: "block" }}>{r.mhs}</span></span> },
            { key: "nilai", header: "Nilai kontrak", numeric: true, width: 140, render: (r) => <Money value={r.nilai} size="sm" tone={r.st === "escrow_ditahan" ? "held" : undefined} /> },
            { key: "biaya", header: "Biaya 5%", numeric: true, width: 130, render: (r) => <span className="sl-tabular sl-body-sm" style={{ color: r.st === "selesai" ? "var(--text-strong)" : "var(--text-subtle)" }}>{r.st === "selesai" ? "Rp " + Math.round(r.nilai * 0.05).toLocaleString("id-ID") : "Belum ditagih"}</span> },
            { key: "st", header: "Status", width: 165, render: (r) => <StatusBadge status={r.st} size="sm" /> },
          ]}
          rows={KONTRAK}
        />
        <span className="sl-caption" style={{ lineHeight: 1.5 }}>Biaya baru muncul di kolom ini setelah kamu menyetujui hasil kerja dan dana dilepas ke mahasiswa.</span>
      </Card>
    </>
  );
}

/* ---------------- B10 — Riwayat pembayaran ----------------
   Bukan pembelian paket: yang dicatat di sini adalah dana yang kamu setor ke
   escrow dan dilepas ke mahasiswa, beserta biaya layanan 5% yang dipotong
   saat pelepasan. */

function BizTransaksi() {
  const [tab, setTab] = React.useState("semua");
  const SEMUA = [
    { id: "KT-2419", tgl: "10 Sep 2026", proyek: "Desain logo & brand kit", mhs: "Rani Pratiwi", nilai: 2500000, st: "escrow_ditahan" },
    { id: "KT-2402", tgl: "24 Agu 2026", proyek: "Konten Instagram 12 post", mhs: "Dimas Ardi", nilai: 1200000, st: "selesai" },
    { id: "KT-2388", tgl: "19 Agu 2026", proyek: "Fotografer produk katalog", mhs: "Bayu Saputra", nilai: 1800000, st: "selesai" },
    { id: "KT-2355", tgl: "02 Agu 2026", proyek: "Penerjemah menu ID–EN", mhs: "Nadya Kirana", nilai: 600000, st: "ditolak" },
  ];
  const rows = SEMUA.filter((r) => tab === "semua" || (tab === "berjalan" ? r.st === "escrow_ditahan" : r.st === tab));
  const totalBiaya = SEMUA.filter((r) => r.st === "selesai").reduce((s, r) => s + Math.round(r.nilai * 0.05), 0);

  return (
    <Card padding="lg" style={{ gap: 14 }}>
      <Tabs value={tab} onChange={setTab} items={[
        { value: "semua", label: "Semua", count: SEMUA.length },
        { value: "berjalan", label: "Ditahan escrow", count: 1 },
        { value: "selesai", label: "Selesai", count: 2 },
        { value: "ditolak", label: "Dibatalkan", count: 1 },
      ]} />
      <DataTable
        columns={[
          { key: "id", header: "Kontrak", width: 100 },
          { key: "tgl", header: "Tanggal", width: 120 },
          { key: "proyek", header: "Proyek", wrap: true, render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.proyek}<span className="sl-caption" style={{ display: "block" }}>{r.mhs}</span></span> },
          { key: "nilai", header: "Nilai kontrak", numeric: true, width: 140, render: (r) => <Money value={r.nilai} size="sm" tone={r.st === "escrow_ditahan" ? "held" : undefined} /> },
          { key: "biaya", header: "Biaya 5%", numeric: true, width: 130, render: (r) => <span className="sl-tabular sl-body-sm" style={{ color: r.st === "selesai" ? "var(--text-strong)" : "var(--text-subtle)" }}>{r.st === "selesai" ? "Rp " + Math.round(r.nilai * 0.05).toLocaleString("id-ID") : r.st === "ditolak" ? "Tidak ditagih" : "Belum ditagih"}</span> },
          { key: "st", header: "Status", width: 165, render: (r) => <StatusBadge status={r.st} size="sm" /> },
          { key: "aksi", header: "", width: 100, align: "right", render: (r) => r.st === "selesai" ? <Button size="sm" variant="ghost" iconLeft={<Icon name="Download" size={14} />}>Kuitansi</Button> : <Button size="sm" variant="ghost">Lihat</Button> },
        ]}
        rows={rows}
      />
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", paddingTop: 4 }}>
        <span className="sl-caption" style={{ lineHeight: 1.5, maxWidth: "58ch" }}>
          Kuitansi biaya layanan dikirim otomatis ke email PIC setiap dana dilepas. Kontrak yang dibatalkan sebelum pelepasan tidak dikenakan biaya apa pun.
        </span>
        <span style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
          <span className="sl-overline">Total biaya layanan</span>
          <b className="sl-tabular" style={{ fontSize: "var(--text-money)", fontWeight: 700, color: "var(--text-strong)" }}>Rp {totalBiaya.toLocaleString("id-ID")}</b>
        </span>
      </div>
    </Card>
  );
}

/* ---------------- B11 — Notifikasi ---------------- */
const NOTIF_BIZ = [
  { id: 1, ikon: "Users", tone: "primary", judul: "5 pelamar baru di Konten Instagram 12 post", waktu: "12 menit lalu", baru: true, jenis: "pelamar" },
  { id: 2, ikon: "ShieldCheck", tone: "success", judul: "Lowongan Fotografer produk katalog disetujui admin", waktu: "2 jam lalu", baru: true, jenis: "lowongan" },
  { id: 3, ikon: "AlertTriangle", tone: "warning", judul: "Konten Instagram 12 post tutup 3 hari lagi", waktu: "5 jam lalu", baru: true, jenis: "lowongan" },
  { id: 4, ikon: "XCircle", tone: "danger", judul: "Lowongan Fotografer — hubungi WA ditolak admin", waktu: "Kemarin", baru: true, jenis: "lowongan", sub: "Alasan: mengarahkan pelamar ke kontak luar platform" },
  { id: 5, ikon: "ArrowLeftRight", tone: "success", judul: "Dana Rp 1.200.000 dilepas ke Dimas Ardi", waktu: "24 Agu 2026", baru: true, jenis: "pembayaran", sub: "Biaya layanan Rp 60.000 dipotong" },
  { id: 6, ikon: "UserCheck", tone: "success", judul: "Bayu Saputra menerima tawaranmu", waktu: "28 Agu 2026", baru: false, jenis: "pelamar" },
  { id: 7, ikon: "Megaphone", tone: "neutral", judul: "Biaya layanan tetap 5% dari nilai kontrak", waktu: "24 Agu 2026", baru: false, jenis: "sistem" },
];

function BizNotifikasi({ notify }) {
  const [tab, setTab] = React.useState("semua");
  const [dibaca, setDibaca] = React.useState([]);
  const rows = NOTIF_BIZ.filter((n) => tab === "semua" || (tab === "baru" ? n.baru && !dibaca.includes(n.id) : n.jenis === tab));
  const tone = { primary: ["var(--primary-soft)", "var(--primary-text)"], success: ["var(--success-soft)", "var(--success-text)"], warning: ["var(--warning-soft)", "var(--warning-text)"], danger: ["var(--danger-soft)", "var(--danger-text)"], neutral: ["var(--bg-sunken)", "var(--text-muted)"] };

  return (
    <Card padding="lg" style={{ gap: 14 }}>
      <Tabs value={tab} onChange={setTab} items={[
        { value: "semua", label: "Semua", count: NOTIF_BIZ.length },
        { value: "baru", label: "Belum dibaca", count: 5 - dibaca.length },
        { value: "pelamar", label: "Pelamar", count: 2 },
        { value: "lowongan", label: "Lowongan", count: 3 },
        { value: "pembayaran", label: "Pembayaran", count: 1 },
      ]} />
      <div style={{ display: "flex", justifyContent: "flex-end", flex: "none" }}>
        <Button size="sm" variant="ghost" onClick={() => { setDibaca(NOTIF_BIZ.map((n) => n.id)); notify({ tone: "info", title: "Semua ditandai dibaca" }); }}>Tandai semua dibaca</Button>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={<Icon name="BellOff" size={30} strokeWidth={1.5} />} title="Tidak ada notifikasi di tab ini" description="Notifikasi baru muncul saat ada pelamar, keputusan admin, atau pembayaran." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {rows.map((n) => {
            const belum = n.baru && !dibaca.includes(n.id);
            const [bg, fg] = tone[n.tone];
            return (
              <button key={n.id} type="button" onClick={() => setDibaca((v) => [...v, n.id])}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", minHeight: 56, padding: "12px 14px", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-sans)",
                  background: belum ? "var(--bg-subtle)" : "transparent",
                  border: "1px solid " + (belum ? "var(--border-default)" : "var(--border-subtle)"),
                  borderRadius: "var(--radius-md)", transition: "var(--transition-color)" }}>
                <span style={{ flex: "none", width: 32, height: 32, display: "grid", placeItems: "center", borderRadius: "var(--radius-sm)", background: bg, color: fg }}><Icon name={n.ikon} size={16} /></span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <b className="sl-body-sm" style={{ color: "var(--text-strong)", fontWeight: belum ? 600 : 500, lineHeight: 1.4 }}>{n.judul}</b>
                  {n.sub && <span className="sl-caption" style={{ lineHeight: 1.45 }}>{n.sub}</span>}
                  <span className="sl-caption">{n.waktu}</span>
                </span>
                {belum && <span aria-label="Belum dibaca" style={{ flex: "none", width: 6, height: 6, borderRadius: "var(--radius-full)", background: "var(--primary)", marginTop: 6 }} />}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ---------------- B12 — Pengaturan akun ---------------- */
function BizPengaturan({ notify }) {
  const [pref, setPref] = React.useState({ pelamar: true, moderasi: true, kedaluwarsa: true, pembayaran: true, promo: false });
  const [hapus, setHapus] = React.useState(false);
  const set = (k) => (e) => setPref((v) => ({ ...v, [k]: e.target.checked }));

  return (
    <>
      <Card padding="lg" style={{ gap: 15 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Keamanan</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
          <Input label="Password saat ini" type="password" defaultValue="········" />
          <Input label="Password baru" type="password" hint="Minimal 8 karakter, kombinasi huruf dan angka." />
          <Input label="Ulangi password baru" type="password" />
        </div>
        <Button style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Password diperbarui", description: "Kamu akan diminta masuk ulang di perangkat lain." })}>Ubah password</Button>
      </Card>

      <Card padding="lg" style={{ gap: 15 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Notifikasi email</h3>
        <Switch label="Pelamar baru" checked={pref.pelamar} onChange={set("pelamar")} description="Satu email per lowongan per hari, bukan per pelamar." />
        <Switch label="Keputusan moderasi lowongan" checked={pref.moderasi} onChange={set("moderasi")} description="Saat admin menyetujui atau menolak lowongan." />
        <Switch label="Lowongan akan kedaluwarsa" checked={pref.kedaluwarsa} onChange={set("kedaluwarsa")} description="Peringatan 3 hari sebelum lowongan berhenti tayang." />
        <Switch label="Pembayaran & tagihan" checked={pref.pembayaran} onChange={set("pembayaran")} description="Invoice dan konfirmasi pembayaran. Sebaiknya tetap aktif." />
        <Switch label="Tips & promo StairsLife" checked={pref.promo} onChange={set("promo")} description="Maksimal sekali sebulan." />
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Sesi aktif</h3>
        <DataTable
          columns={[
            { key: "perangkat", header: "Perangkat" },
            { key: "lokasi", header: "Lokasi", width: 150 },
            { key: "akhir", header: "Terakhir aktif", width: 150 },
            { key: "aksi", header: "", width: 100, align: "right", render: (r) => r.ini ? <span className="sl-caption">Perangkat ini</span> : <Button size="sm" variant="ghost">Keluarkan</Button> },
          ]}
          rows={[
            { id: 1, perangkat: "Chrome · Windows 11", lokasi: "Malang, ID", akhir: "Sekarang", ini: true },
            { id: 2, perangkat: "Safari · iPhone 14", lokasi: "Malang, ID", akhir: "Kemarin 21:14" },
          ]}
        />
      </Card>

      <Card padding="lg" style={{ gap: 13, borderColor: "var(--danger-border)" }}>
        <h3 style={{ fontSize: "var(--text-h3)", color: "var(--danger-text)", flex: "none" }}>Hapus akun</h3>
        <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "70ch" }}>
          Lowongan aktif akan diturunkan dan pelamar diberi tahu. Riwayat transaksi disimpan 5 tahun sesuai ketentuan pembukuan, tapi profil bisnismu hilang permanen.
        </p>
        <Button variant="destructive" style={{ alignSelf: "flex-start" }} onClick={() => setHapus(true)}>Hapus akun bisnis</Button>
      </Card>

      <Modal open={hapus} onClose={() => setHapus(false)} title="Hapus akun bisnis?" size="sm"
        footer={<><Button variant="ghost" onClick={() => setHapus(false)}>Batal</Button><Button variant="destructive" onClick={() => { setHapus(false); notify({ tone: "info", title: "Permintaan hapus dicatat", description: "Akun dihapus dalam 7 hari. Masuk kembali untuk membatalkan." }); }}>Ya, hapus</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>3 lowongan aktif akan diturunkan dan 28 pelamar diberi tahu bahwa prosesnya dihentikan.</p>
          <Input label="Tulis HAPUS untuk mengonfirmasi" placeholder="HAPUS" />
          <Checkbox label="Saya paham tindakan ini tidak bisa dibatalkan setelah 7 hari" />
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { BizProfil, BizBiaya, BizTransaksi, BizNotifikasi, BizPengaturan, NOTIF_BIZ });
