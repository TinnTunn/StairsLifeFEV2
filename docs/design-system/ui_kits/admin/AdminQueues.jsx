const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, EmptyState, MetricCard, LineChart, DonutChart, Money, MediaSlot } = window.StairsLifeDesignSystem_075594;

const rp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const ANTREAN_MHS = [
  { id: "V-1042", nama: "Rani Pratiwi", email: "rani@student.ub.ac.id", institusi: "Universitas Brawijaya", jurusan: "Desain Komunikasi Visual", nim: "215150401111023", angkatan: "2023", diajukan: "01 Sep 2026", umur: "1 hari" },
  { id: "V-1041", nama: "Dimas Ardi", email: "dimas@student.um.ac.id", institusi: "Universitas Negeri Malang", jurusan: "Teknik Informatika", nim: "190533631021", angkatan: "2022", diajukan: "31 Agu 2026", umur: "2 hari" },
  { id: "V-1039", nama: "Sekar Ayu", email: "sekar@student.polinema.ac.id", institusi: "Politeknik Negeri Malang", jurusan: "Manajemen Informatika", nim: "1841720045", angkatan: "2024", diajukan: "30 Agu 2026", umur: "3 hari" },
];

const ANTREAN_BIS = [
  { id: "V-2018", nama: "Kopi Senja Malang", email: "hello@kopisenja.id", institusi: "Kuliner · Kedai kopi", jurusan: "NIB 8120114820931", nim: "Jl. Soekarno Hatta 42, Malang", angkatan: "PT perorangan", diajukan: "01 Sep 2026", umur: "1 hari" },
  { id: "V-2017", nama: "Rimbun Plant House", email: "admin@rimbun.co", institusi: "Retail · Toko tanaman", jurusan: "NIB 8120114820117", nim: "Jl. Ijen 8, Malang", angkatan: "UMKM", diajukan: "31 Agu 2026", umur: "2 hari" },
];

const MODERASI = [
  { id: "L-3391", judul: "Desain logo & brand kit untuk kedai kopi", bisnis: "Kopi Senja Malang", gaji: "Rp 2.500.000", tipe: "Proyek · remote", kategori: "Desain grafis", diajukan: "01 Sep 2026",
    isi: "Kedai kami buka Oktober di Malang. Butuh logo, palet warna, dan penerapan di kemasan kopi bubuk serta papan nama. Dua kali revisi, berkas akhir AI + PDF + PNG.", tanda: [] },
  { id: "L-3390", judul: "Admin sosial media — dibayar per posting", bisnis: "Batik Ayu Nusantara", gaji: "Rp 75.000 / posting", tipe: "Part-time · hybrid", kategori: "Sosial media", diajukan: "01 Sep 2026",
    isi: "Mengelola Instagram dan TikTok, 12 posting per bulan. Wajib punya laptop sendiri dan kuota internet.", tanda: [{ t: "Gaji di bawah rata-rata kategori", tone: "warning" }] },
  { id: "L-3388", judul: "Fotografer produk — bayaran menarik!!! hubungi WA", bisnis: "Toko Serba Ada 88", gaji: "Nego", tipe: "Freelance", kategori: "Fotografi", diajukan: "31 Agu 2026",
    isi: "Butuh fotografer produk, bayaran menarik, hubungi langsung WA 08xx untuk info lebih lanjut. Bisa dibayar setelah hasil disetujui.", tanda: [{ t: "Mengarahkan ke kontak luar platform", tone: "danger" }, { t: "Nominal gaji tidak dicantumkan", tone: "warning" }] },
  { id: "L-3385", judul: "Penulis artikel SEO 500 kata", bisnis: "Rimbun Plant House", gaji: "Rp 50.000 / artikel", tipe: "Freelance · remote", kategori: "Penulisan", diajukan: "30 Agu 2026",
    isi: "Menulis 10 artikel tentang perawatan tanaman hias. Riset mandiri, bebas plagiarisme.", tanda: [{ t: "Duplikat lowongan L-3201", tone: "warning" }] },
];

const ALASAN_TOLAK_MHS = ["Foto KTM tidak terbaca", "Nama tidak cocok dengan data akun", "Kartu sudah kedaluwarsa", "Dokumen bukan KTM/kartu pelajar", "Terindikasi dokumen palsu"];
const ALASAN_TOLAK_LOW = ["Mengarahkan ke kontak luar platform", "Nominal gaji tidak wajar / tidak dicantumkan", "Deskripsi tidak jelas", "Kategori tidak sesuai", "Duplikat lowongan lain", "Melanggar ketentuan layanan"];

function Fakta({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
      <span className="sl-overline">{label}</span>
      <b className="sl-body-sm" style={{ color: "var(--text-strong)", overflowWrap: "anywhere" }}>{value}</b>
    </div>
  );
}

function DokumenSlot({ label, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span className="sl-overline">{label}</span>
      <MediaSlot ratio="16 / 10" size="lg" tone="primary" icon={<Icon name="FileImage" size={30} strokeWidth={1.5} />}
        label="Dokumen yang diunggah pengguna" hint={hint} />
      <div style={{ display: "flex", gap: 6 }}>
        <Button size="sm" variant="secondary" iconLeft={<Icon name="ZoomIn" size={15} />}>Perbesar</Button>
        <Button size="sm" variant="ghost" iconLeft={<Icon name="RotateCw" size={15} />}>Putar</Button>
        <Button size="sm" variant="ghost" iconLeft={<Icon name="Download" size={15} />}>Unduh</Button>
      </div>
    </div>
  );
}

/* ---------------- A1 — Dashboard ---------------- */
function AdminDashboard({ setRute }) {
  const antrean = [
    { r: "a2", ikon: "GraduationCap", label: "Verifikasi mahasiswa", n: 3, sub: "Tertua 3 hari · SLA 2 hari kerja", tone: "warning" },
    { r: "a3", ikon: "Building2", label: "Verifikasi bisnis", n: 2, sub: "Tertua 2 hari", tone: "warning" },
    { r: "a4", ikon: "ShieldAlert", label: "Moderasi lowongan", n: 4, sub: "1 bertanda merah", tone: "danger" },
    { r: "a9", ikon: "Flag", label: "Laporan pengguna", n: 2, sub: "Belum ditangani", tone: "danger" },
    { r: "a10", ikon: "Receipt", label: "Konfirmasi pembayaran manual", n: 1, sub: "Bukti transfer diunggah", tone: "neutral" },
  ];
  return (
    <>
      <div className="ad-grid">
        <MetricCard label="Mahasiswa terdaftar" value="1.284" delta={9} icon={<Icon name="GraduationCap" size={19} />} />
        <MetricCard label="Bisnis terdaftar" value="176" delta={6} iconTone="neutral" icon={<Icon name="Store" size={19} />} />
        <MetricCard label="Lowongan aktif" value="63" delta={4} iconTone="success" icon={<Icon name="Briefcase" size={19} />} />
        <MetricCard label="Lamaran hari ini" value="87" delta={12} iconTone="warning" icon={<Icon name="Send" size={19} />} />
      </div>

      <Card padding="lg" style={{ gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
          <h3 style={{ fontSize: "var(--text-h3)" }}>Butuh tindakan sekarang</h3>
          <span className="sl-caption">12 item · klik untuk membuka antrean</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {antrean.map((a) => (
            <button key={a.r} type="button" onClick={() => setRute(a.r)}
              style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 56, padding: "10px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", transition: "var(--transition-color)" }}>
              <span style={{ flex: "none", width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "var(--radius-sm)", background: a.tone === "danger" ? "var(--danger-soft)" : a.tone === "warning" ? "var(--warning-soft)" : "var(--bg-sunken)", color: a.tone === "danger" ? "var(--danger-text)" : a.tone === "warning" ? "var(--warning-text)" : "var(--text-muted)" }}>
                <Icon name={a.ikon} size={17} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{a.label}</b>
                <span className="sl-caption">{a.sub}</span>
              </span>
              <span className="sl-tabular" style={{ flex: "none", fontSize: "var(--text-money)", fontWeight: 700, color: a.tone === "danger" ? "var(--danger-text)" : "var(--text-strong)" }}>{a.n}</span>
              <Icon name="ChevronRight" size={17} />
            </button>
          ))}
        </div>
      </Card>

      <div className="ad-two">
        <Card padding="lg" style={{ gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
            <h3 style={{ fontSize: "var(--text-h3)", whiteSpace: "nowrap" }}>Pertumbuhan pengguna</h3>
            <span className="sl-caption" style={{ whiteSpace: "nowrap" }}>6 bulan terakhir</span>
          </div>
          <LineChart height={200} data={[{ label: "Apr", value: 420 }, { label: "Mei", value: 588 }, { label: "Jun", value: 731 }, { label: "Jul", value: 902 }, { label: "Agu", value: 1104 }, { label: "Sep", value: 1284 }]} valueFormat={(v) => v.toLocaleString("id-ID")} />
        </Card>
        <Card padding="lg" style={{ gap: 12 }}>
          <h3 style={{ fontSize: "var(--text-h3)" }}>Komposisi antrean</h3>
          <DonutChart size={164} centerValue="12" centerLabel="menunggu" data={[
            { label: "Verifikasi mahasiswa", value: 3, color: "var(--warning)" },
            { label: "Verifikasi bisnis", value: 2, color: "var(--primary)" },
            { label: "Moderasi lowongan", value: 4, color: "var(--money-held)" },
            { label: "Laporan pengguna", value: 2, color: "var(--danger)" },
            { label: "Pembayaran manual", value: 1, color: "var(--success)" },
          ]} />
        </Card>
      </div>

      <Card padding="lg" style={{ gap: 12 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Aktivitas terbaru</h3>
        <DataTable
          columns={[
            { key: "waktu", header: "Waktu", width: 120 },
            { key: "aktor", header: "Aktor" },
            { key: "aksi", header: "Aksi" },
            { key: "target", header: "Target" },
          ]}
          rows={[
            { id: 1, waktu: "09:42", aktor: "Nadia Rahma", aksi: "Menyetujui verifikasi", target: "V-1040 · Bayu Saputra" },
            { id: 2, waktu: "09:31", aktor: "Sistem", aksi: "Lowongan kedaluwarsa", target: "L-3201 · Penulis artikel SEO" },
            { id: 3, waktu: "09:18", aktor: "Kopi Senja Malang", aksi: "Mengajukan lowongan", target: "L-3391" },
            { id: 4, waktu: "08:57", aktor: "Nadia Rahma", aksi: "Menolak lowongan", target: "L-3384 · alasan: kontak luar" },
            { id: 5, waktu: "08:40", aktor: "Sistem", aksi: "Pembayaran lunas", target: "TRX-8821 · Rp 149.000" },
          ]}
        />
      </Card>
    </>
  );
}

/* ---------------- A2 / A3 — Antrean verifikasi (split panel) ---------------- */
function AdminVerifikasi({ notify, bisnis }) {
  const data = bisnis ? ANTREAN_BIS : ANTREAN_MHS;
  const [sisa, setSisa] = React.useState(data);
  const [aktif, setAktif] = React.useState(0);
  const [tolak, setTolak] = React.useState(false);
  const [alasan, setAlasan] = React.useState(ALASAN_TOLAK_MHS[0]);
  const [catatan, setCatatan] = React.useState("");

  const p = sisa[aktif];

  const lanjut = () => setAktif((i) => (i >= sisa.length - 1 ? 0 : i));

  const setuju = () => {
    notify({ tone: "success", title: "Verifikasi disetujui", description: p.nama + " sekarang bisa " + (bisnis ? "menayangkan lowongan." : "melamar lowongan.") });
    setSisa((v) => v.filter((x) => x.id !== p.id));
    lanjut();
  };
  const kirimTolak = () => {
    notify({ tone: "info", title: "Verifikasi ditolak", description: p.nama + " diberi tahu alasannya dan bisa mengunggah ulang." });
    setSisa((v) => v.filter((x) => x.id !== p.id));
    setTolak(false); setCatatan(""); lanjut();
  };

  if (!sisa.length) {
    return (
      <Card padding="none">
        <EmptyState size="lg" icon={<Icon name="CheckCheck" size={34} strokeWidth={1.5} />}
          title="Antrean kosong" description={"Semua pengajuan " + (bisnis ? "bisnis" : "mahasiswa") + " sudah diproses. Antrean baru muncul otomatis."} />
      </Card>
    );
  }

  return (
    <>
      <div className="ad-split">
        <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span className="sl-overline">Antrean · {sisa.length}</span>
            <span className="sl-caption">urut terlama</span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {sisa.map((x, i) => (
              <li key={x.id}>
                <button type="button" onClick={() => setAktif(i)}
                  style={{ width: "100%", minHeight: 60, display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-md)", border: 0, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", background: i === aktif ? "var(--primary-soft)" : "transparent", transition: "var(--transition-color)" }}>
                  <Avatar name={x.nama} size="sm" shape={bisnis ? "rounded" : "circle"} />
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <b className="sl-body-sm" style={{ color: i === aktif ? "var(--primary-text)" : "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.nama}</b>
                    <span className="sl-caption" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.institusi}</span>
                  </span>
                  <span className="sl-caption sl-tabular" style={{ flex: "none" }}>{x.umur}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg" style={{ gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <span className="sl-overline">{p.id} · diajukan {p.diajukan}</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-strong)", marginTop: 3 }}>{p.nama}</h3>
            </div>
            <StatusBadge status="menunggu_verifikasi" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, paddingBottom: 14, borderBottom: "1px solid var(--border-subtle)" }}>
            <Fakta label="Email" value={p.email} />
            <Fakta label={bisnis ? "Kategori" : "Institusi"} value={p.institusi} />
            <Fakta label={bisnis ? "NIB" : "Jurusan"} value={p.jurusan} />
            <Fakta label={bisnis ? "Alamat" : "NIM"} value={p.nim} />
            <Fakta label={bisnis ? "Badan usaha" : "Angkatan"} value={p.angkatan} />
          </div>

          <DokumenSlot label={bisnis ? "Dokumen legalitas yang diunggah" : "KTM / kartu pelajar yang diunggah"}
            hint={bisnis ? "Slot pratinjau NIB. Cocokkan nama badan usaha dan alamat dengan data di atas." : "Slot pratinjau KTM. Cocokkan nama, NIM, dan institusi dengan data di atas."} />

          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
            <Button onClick={setuju} iconLeft={<Icon name="Check" size={16} />}>Setujui</Button>
            <Button variant="secondary" onClick={() => setTolak(true)}>Tolak dengan alasan</Button>
            <Button variant="ghost" onClick={lanjut}>Lewati</Button>
            <span className="sl-caption" style={{ marginLeft: "auto" }}>Pintasan: <b style={{ color: "var(--text-body)" }}>A</b> setujui · <b style={{ color: "var(--text-body)" }}>T</b> tolak · <b style={{ color: "var(--text-body)" }}>→</b> lewati</span>
          </div>
          <span className="sl-caption">Setelah diputuskan, antrean otomatis lanjut ke pengajuan berikutnya.</span>
        </Card>
      </div>

      <Modal open={tolak} onClose={() => setTolak(false)} title="Tolak verifikasi" description={p.nama + " · " + p.id}
        footer={<><Button variant="ghost" onClick={() => setTolak(false)}>Batal</Button><Button variant="destructive" onClick={kirimTolak}>Kirim penolakan</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Select label="Alasan" required value={alasan} onChange={(e) => setAlasan(e.target.value)} options={bisnis ? ["Dokumen legalitas tidak terbaca", "Nama badan usaha tidak cocok", "Dokumen kedaluwarsa", "Bukan dokumen legalitas", "Terindikasi dokumen palsu"] : ALASAN_TOLAK_MHS} />
          <Textarea label="Catatan untuk pengguna" rows={3} maxLength={300} showCount value={catatan} onChange={(e) => setCatatan(e.target.value)}
            placeholder="Jelaskan apa yang perlu diperbaiki agar pengajuan berikutnya lolos." hint="Catatan ini dikirim ke email pengguna." />
        </div>
      </Modal>
    </>
  );
}

/* ---------------- A4 — Moderasi lowongan ---------------- */
function AdminModerasi({ notify }) {
  const [sisa, setSisa] = React.useState(MODERASI);
  const [tolak, setTolak] = React.useState(null);
  const [alasan, setAlasan] = React.useState(ALASAN_TOLAK_LOW[0]);

  if (!sisa.length) {
    return <Card padding="none"><EmptyState size="lg" icon={<Icon name="ShieldCheck" size={34} strokeWidth={1.5} />} title="Tidak ada lowongan menunggu review" description="Lowongan baru akan muncul di sini sebelum tayang." /></Card>;
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)" }}>
        {sisa.map((m) => (
          <Card key={m.id} padding="lg" style={{ gap: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <span className="sl-overline">{m.id} · {m.bisnis} · diajukan {m.diajukan}</span>
                <h3 style={{ fontSize: "var(--text-h3)", color: "var(--text-strong)", marginTop: 3 }}>{m.judul}</h3>
                <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                  <span className="sl-caption sl-tabular">{m.gaji}</span>
                  <span className="sl-caption">{m.tipe}</span>
                  <span className="sl-caption">{m.kategori}</span>
                </div>
              </div>
              <StatusBadge status="menunggu_moderasi" />
            </div>

            <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6, padding: "11px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>{m.isi}</p>

            {m.tanda.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="sl-overline">Penanda otomatis</span>
                {m.tanda.map((t) => (
                  <span key={t.t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-caption)", color: t.tone === "danger" ? "var(--danger-text)" : "var(--warning-text)" }}>
                    <Icon name={t.tone === "danger" ? "AlertOctagon" : "AlertTriangle"} size={15} />{t.t}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              <Button size="sm" onClick={() => { notify({ tone: "success", title: "Lowongan disetujui", description: m.id + " sekarang tayang dan bisa dilamar." }); setSisa((v) => v.filter((x) => x.id !== m.id)); }}>Setujui &amp; tayangkan</Button>
              <Button size="sm" variant="secondary" onClick={() => setTolak(m)}>Tolak</Button>
              <Button size="sm" variant="ghost">Lihat sebagai mahasiswa</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!tolak} onClose={() => setTolak(null)} title="Tolak lowongan" description={tolak ? tolak.id + " · " + tolak.judul : ""}
        footer={<><Button variant="ghost" onClick={() => setTolak(null)}>Batal</Button><Button variant="destructive" onClick={() => { notify({ tone: "info", title: "Lowongan ditolak", description: "Bisnis diberi tahu alasannya dan bisa merevisi lalu mengajukan ulang." }); setSisa((v) => v.filter((x) => x.id !== tolak.id)); setTolak(null); }}>Kirim penolakan</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Select label="Alasan" required value={alasan} onChange={(e) => setAlasan(e.target.value)} options={ALASAN_TOLAK_LOW} />
          <Textarea label="Catatan untuk bisnis" rows={3} maxLength={300} showCount placeholder="Sebutkan bagian mana yang perlu diperbaiki." hint="Bisnis bisa merevisi dan mengajukan ulang tanpa membuat lowongan baru." />
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { AdminDashboard, AdminVerifikasi, AdminModerasi, ANTREAN_MHS, ANTREAN_BIS, MODERASI, Fakta, DokumenSlot, rp });
