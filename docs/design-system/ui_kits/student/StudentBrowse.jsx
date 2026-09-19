const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, Checkbox, EmptyState, SearchField, Money, MetricCard, Rating, ContractStepper, SkeletonCard } = window.StairsLifeDesignSystem_075594;

const LOWONGAN_M = [
  { id: 1, kode: "L-3380", judul: "Konten Instagram 12 post", bisnis: "Rimbun Plant House", verified: true, gaji: 1200000, satuan: "per bulan", tipe: "Part-time", lokasi: "Hybrid — Malang", kategori: "Sosial media", tutup: "15 Sep 2026", posting: "2 hari lalu", pelamar: 12, posisi: 2, tags: ["Instagram", "Copywriting", "Canva"],
    deskripsi: "Kami butuh satu orang yang mengurus Instagram dan TikTok toko: 12 posting per bulan, riset tren tanaman hias, dan menulis caption. Kamu bekerja dari mana saja, tapi seminggu sekali datang ke toko untuk sesi foto bareng tim.",
    kualifikasi: "Mahasiswa aktif semester 3 ke atas. Terbiasa memakai Canva atau Figma. Punya akun media sosial yang aktif — kami akan melihatnya. Pengalaman mengelola akun bisnis jadi nilai tambah, bukan syarat." },
  { id: 2, kode: "L-3372", judul: "Fotografer produk katalog", bisnis: "Tahu Pong Semarang", verified: true, gaji: 1800000, satuan: "per proyek", tipe: "Freelance", lokasi: "Onsite — Semarang", kategori: "Fotografi", tutup: "10 Sep 2026", posting: "5 hari lalu", pelamar: 8, posisi: 1, tags: ["Fotografi produk", "Lightroom", "Studio"],
    deskripsi: "Memotret 40 SKU produk untuk katalog cetak dan marketplace. Studio dan lighting kami sediakan. Sesi dijadwalkan dua hari penuh, editing seminggu setelahnya.",
    kualifikasi: "Punya kamera sendiri, bisa mengedit di Lightroom, dan pernah menangani foto produk. Portofolio wajib dilampirkan." },
  { id: 3, kode: "L-3391", judul: "Desain logo & brand kit untuk kedai kopi", bisnis: "Kopi Senja Malang", verified: true, gaji: 2500000, satuan: "per proyek", tipe: "Proyek", lokasi: "Remote", kategori: "Desain grafis", tutup: "20 Sep 2026", posting: "Baru", pelamar: 0, posisi: 1, tags: ["Logo", "Branding", "Illustrator"],
    deskripsi: "Kedai kami buka Oktober di Malang. Butuh logo, palet warna, dan penerapan di kemasan kopi bubuk serta papan nama. Dua kali revisi, berkas akhir AI + PDF + PNG.",
    kualifikasi: "Mahasiswa DKV atau setara. Punya portofolio branding minimal dua proyek. Bisa mengerjakan di Illustrator." },
  { id: 4, kode: "L-3365", judul: "Barista part-time akhir pekan", bisnis: "Kopi Senja Malang", verified: true, gaji: 900000, satuan: "per bulan", tipe: "Part-time", lokasi: "Onsite — Malang", kategori: "Jasa", tutup: "18 Sep 2026", posting: "1 minggu lalu", pelamar: 21, posisi: 2, tags: ["Barista", "Pelayanan"],
    deskripsi: "Sabtu–Minggu 08.00–17.00. Menyeduh manual brew dan espresso, melayani pesanan, menjaga kebersihan bar. Pelatihan dua hari pertama dibayar penuh.",
    kualifikasi: "Mahasiswa aktif, bisa bekerja akhir pekan, ramah ke pelanggan. Pengalaman barista bukan syarat wajib." },
  { id: 5, kode: "L-3359", judul: "Penulis artikel SEO tanaman hias", bisnis: "Rimbun Plant House", verified: true, gaji: 50000, satuan: "per artikel", tipe: "Freelance", lokasi: "Remote", kategori: "Penulisan", tutup: "25 Sep 2026", posting: "1 minggu lalu", pelamar: 14, posisi: 3, tags: ["SEO", "Riset", "Penulisan"],
    deskripsi: "Menulis 10 artikel 500–700 kata tentang perawatan tanaman hias. Riset mandiri, bebas plagiarisme, satu revisi per artikel.",
    kualifikasi: "Bisa menulis dengan bahasa yang mudah dibaca. Paham dasar SEO. Sertakan dua contoh tulisan." },
];

const LAMARAN_M = [
  { id: 1, kode: "APP-4412", untuk: "Konten Instagram 12 post", bisnis: "Rimbun Plant House", st: "seleksi", tgl: "01 Sep 2026", gaji: 1200000, tahap: 2,
    surat: "Saya mengelola akun Instagram komunitas kampus dengan 12 ribu pengikut. Terbiasa menyiapkan kalender konten mingguan dan menulis caption sendiri. Untuk lowongan ini saya akan mulai dengan audit akun dan tiga arah visual sebelum produksi." },
  { id: 2, kode: "APP-4398", untuk: "Fotografer produk katalog", bisnis: "Tahu Pong Semarang", st: "dilihat", tgl: "30 Agu 2026", gaji: 1800000, tahap: 1,
    surat: "Saya memotret produk untuk toko keluarga sejak SMA dan punya peralatan lighting sendiri. Bisa mengerjakan di studio maupun on-site." },
  { id: 3, kode: "APP-4371", untuk: "Ilustrasi menu & papan harga", bisnis: "Warung Ibu Tri", st: "diterima", tgl: "20 Agu 2026", gaji: 850000, tahap: 3,
    surat: "Saya pernah membuat ilustrasi menu untuk dua warung di Malang, termasuk versi cetak dan versi papan." },
  { id: 4, kode: "APP-4350", untuk: "Penerjemah menu ID–EN", bisnis: "Kopi Senja Malang", st: "ditolak", tgl: "12 Agu 2026", gaji: 600000, tahap: 3,
    surat: "Saya menerjemahkan materi promosi untuk dua restoran di Malang.", alasan: "Kami memilih pelamar yang punya sertifikat TOEFL. Tulisanmu bagus — coba lagi untuk lowongan konten kami berikutnya." },
  { id: 5, kode: "APP-4341", untuk: "Ilustrasi maskot toko", bisnis: "Rimbun Plant House", st: "dibatalkan", tgl: "05 Agu 2026", gaji: 900000, tahap: 0,
    surat: "Saya tertarik membuat maskot untuk toko tanaman." },
];

const rpm = (n) => (n ? "Rp " + Number(n).toLocaleString("id-ID") : "Nego");

function FaktaM({ label, value, sub, tone }) {
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

function KartuLowongan({ l, tersimpan, simpan, onBuka, dilamar }) {
  const sudah = dilamar && dilamar.includes(l.id);
  return (
    <Card interactive padding="lg" style={{ gap: 11 }} onClick={() => onBuka(l)}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: "var(--text-h3)", color: "var(--text-strong)", lineHeight: 1.3 }}>{l.judul}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
            <Avatar name={l.bisnis} size="xs" shape="rounded" verified={l.verified} />
            <span className="sl-caption">{l.bisnis} · {l.lokasi}</span>
          </div>
        </div>
        <IconButton label={tersimpan.includes(l.id) ? "Hapus dari tersimpan" : "Simpan lowongan"}
          onClick={(e) => { e.stopPropagation(); simpan(l.id); }}>
          <Icon name="Bookmark" size={17} fill={tersimpan.includes(l.id) ? "currentColor" : "none"} />
        </IconButton>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <Money value={l.gaji} size="md" />
        <span className="sl-caption">{l.satuan}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {l.tags.map((t) => <Tag key={t} size="sm">{t}</Tag>)}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", paddingTop: 9, borderTop: "1px solid var(--border-subtle)" }}>
        <span className="sl-caption">{l.tipe}</span>
        <span className="sl-caption">{l.pelamar} pelamar</span>
        <span className="sl-caption">Tutup {l.tutup}</span>
        <span className="sl-caption" style={{ marginLeft: "auto" }}>{sudah ? <b style={{ color: "var(--success-text)" }}>Sudah dilamar</b> : l.posting}</span>
      </div>
    </Card>
  );
}

/* ---------------- M1 — Dashboard ---------------- */
function MhsDashboard({ setRute, bukaLowongan, bukaLamaran, tersimpan, simpan, dilamar, verifikasi }) {
  const aktif = LAMARAN_M.filter((l) => ["terkirim", "dilihat", "seleksi"].includes(l.st));
  return (
    <>
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Halo, Rani</h2>
        <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 4 }}>
          {aktif.length} lamaran sedang diproses. Satu di antaranya sudah masuk tahap seleksi.
        </p>
      </div>

      <div className="mh-grid">
        <MetricCard label="Lamaran aktif" value={String(aktif.length)} icon={<Icon name="Send" size={19} />} />
        <MetricCard label="Diterima" value="1" delta={"+1"} deltaLabel="bulan ini" iconTone="success" icon={<Icon name="UserCheck" size={19} />} />
        <MetricCard label="Tersimpan" value={String(tersimpan.length)} iconTone="neutral" icon={<Icon name="Bookmark" size={19} />} />
        <MetricCard label="Profil dilihat" value="47" delta={22} iconTone="warning" icon={<Icon name="Eye" size={19} />} />
      </div>

      <div className="mh-two">
        <Card padding="lg" style={{ gap: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
            <h3 style={{ fontSize: "var(--text-h3)" }}>Lamaran berjalan</h3>
            <Button size="sm" variant="ghost" onClick={() => setRute("m4")}>Lihat semua</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {aktif.map((l) => (
              <button key={l.id} type="button" onClick={() => bukaLamaran(l)}
                style={{ display: "flex", gap: 12, alignItems: "center", padding: "11px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", flexWrap: "wrap" }}>
                <span style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column" }}>
                  <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{l.untuk}</b>
                  <span className="sl-caption">{l.bisnis} · dilamar {l.tgl}</span>
                </span>
                <StatusBadge status={l.st} size="sm" />
              </button>
            ))}
          </div>
        </Card>

        <Card padding="lg" style={{ gap: 12 }}>
          <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Kelengkapan profil</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <b className="sl-tabular" style={{ fontSize: "var(--text-money-lg)", fontWeight: 700, color: "var(--text-strong)", lineHeight: 1.1 }}>80%</b>
            <span className="sl-caption">4 dari 5 bagian</span>
          </div>
          <span style={{ display: "block", height: 7, background: "var(--bg-sunken)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
            <span style={{ display: "block", width: "80%", height: "100%", background: "var(--primary)" }} />
          </span>
          {[["Data diri", true], ["Verifikasi KTM", verifikasi === "terverifikasi"], ["CV utama", true], ["Keahlian", true], ["Portofolio", false]].map(([t, ok]) => (
            <span key={t} style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <span style={{ flex: "none", color: ok ? "var(--success)" : "var(--text-subtle)", display: "flex" }}><Icon name={ok ? "CheckCircle2" : "Circle"} size={15} /></span>
              <span className="sl-caption" style={{ flex: 1 }}>{t}</span>
              {!ok && <Button size="sm" variant="ghost" onClick={() => setRute(t === "Verifikasi KTM" ? "m9" : "m7")}>Lengkapi</Button>}
            </span>
          ))}
          <span className="sl-caption" style={{ lineHeight: 1.5 }}>Profil lengkap dilihat 2× lebih sering oleh bisnis.</span>
        </Card>
      </div>

      <Card padding="lg" style={{ gap: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
          <h3 style={{ fontSize: "var(--text-h3)" }}>Cocok untukmu</h3>
          <Button size="sm" variant="ghost" onClick={() => setRute("m2")}>Cari lebih banyak</Button>
        </div>
        <span className="sl-caption">Berdasarkan keahlian Logo, Branding, dan Illustrator di profilmu</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "var(--gap-card)" }}>
          {LOWONGAN_M.slice(0, 2).map((l) => (
            <KartuLowongan key={l.id} l={l} tersimpan={tersimpan} simpan={simpan} onBuka={bukaLowongan} dilamar={dilamar} />
          ))}
        </div>
      </Card>
    </>
  );
}

/* ---------------- M2 — Cari lowongan ---------------- */
function MhsCari({ bukaLowongan, tersimpan, simpan, dilamar }) {
  const [q, setQ] = React.useState("");
  const [kat, setKat] = React.useState([]);
  const [tipe, setTipe] = React.useState([]);
  const [lokasi, setLokasi] = React.useState("Semua lokasi");
  const [urut, setUrut] = React.useState("Terbaru");
  const [muat, setMuat] = React.useState(false);
  const [hal, setHal] = React.useState(1);

  const cari = (v) => { setQ(v); setMuat(true); setTimeout(() => setMuat(false), 420); };
  const tog = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  let rows = LOWONGAN_M
    .filter((l) => !q || (l.judul + l.bisnis + l.tags.join(" ")).toLowerCase().includes(q.toLowerCase()))
    .filter((l) => !kat.length || kat.includes(l.kategori))
    .filter((l) => !tipe.length || tipe.includes(l.tipe))
    .filter((l) => lokasi === "Semua lokasi" || l.lokasi.includes(lokasi.replace("Onsite — ", "").replace("Semua lokasi", "")));
  if (urut === "Gaji tertinggi") rows = [...rows].sort((a, b) => b.gaji - a.gaji);
  if (urut === "Paling sedikit pelamar") rows = [...rows].sort((a, b) => a.pelamar - b.pelamar);

  const filterAktif = kat.length + tipe.length + (lokasi !== "Semua lokasi" ? 1 : 0);

  return (
    <div className="mh-filter">
      <Card padding="lg" style={{ gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flex: "none" }}>
          <h3 style={{ fontSize: "var(--text-h3)" }}>Filter</h3>
          {filterAktif > 0 && <Button size="sm" variant="ghost" onClick={() => { setKat([]); setTipe([]); setLokasi("Semua lokasi"); }}>Reset ({filterAktif})</Button>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="sl-overline">Kategori</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(104px,1fr))", gap: "7px 12px" }}>
            {["Desain grafis", "Sosial media", "Fotografi", "Penulisan", "Jasa"].map((k) => (
              <Checkbox key={k} label={k} checked={kat.includes(k)} onChange={() => tog(kat, setKat, k)} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 13, borderTop: "1px solid var(--border-subtle)" }}>
          <span className="sl-overline">Tipe kerja</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(104px,1fr))", gap: "7px 12px" }}>
            {["Part-time", "Freelance", "Proyek", "Magang"].map((t) => (
              <Checkbox key={t} label={t} checked={tipe.includes(t)} onChange={() => tog(tipe, setTipe, t)} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingTop: 13, borderTop: "1px solid var(--border-subtle)" }}>
          <Select label="Lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} options={["Semua lokasi", "Remote", "Malang", "Semarang", "Surabaya"]} />
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <SearchField fullWidth placeholder="Cari lowongan, keahlian, atau bisnis" label="Cari lowongan"
            value={q} onChange={(e) => cari(e.target.value)} style={{ flex: 1, minWidth: 200, width: "auto" }} />
          <Select size="sm" value={urut} onChange={(e) => setUrut(e.target.value)} options={["Terbaru", "Gaji tertinggi", "Paling sedikit pelamar", "Segera tutup"]} />
        </div>
        <span className="sl-caption">{muat ? "Mencari…" : rows.length + " lowongan ditemukan"}</span>

        {muat ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)" }}>
            <SkeletonCard lines={3} /><SkeletonCard lines={3} />
          </div>
        ) : rows.length === 0 ? (
          <Card padding="none">
            <EmptyState size="lg" icon={<Icon name="SearchX" size={32} strokeWidth={1.5} />}
              title="Tidak ada lowongan yang cocok"
              description={"Coba kata kunci lain atau hapus " + (filterAktif ? "filter yang aktif" : "sebagian kata kunci") + ". Kamu juga bisa menyimpan pencarian ini dan kami beri tahu saat ada yang baru."}
              action={<Button onClick={() => { setQ(""); setKat([]); setTipe([]); setLokasi("Semua lokasi"); }}>Reset pencarian</Button>}
              secondaryAction={<Button variant="ghost">Beri tahu saya</Button>} />
          </Card>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)" }}>
              {rows.map((l) => <KartuLowongan key={l.id} l={l} tersimpan={tersimpan} simpan={simpan} onBuka={bukaLowongan} dilamar={dilamar} />)}
            </div>
            <Pagination page={hal} total={6} onChange={setHal} label={rows.length + " dari 63 lowongan aktif"} />
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MhsDashboard, MhsCari, KartuLowongan, FaktaM, LOWONGAN_M, LAMARAN_M, rpm });
