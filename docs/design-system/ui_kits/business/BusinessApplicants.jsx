const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, Checkbox, RadioCard, FileDropzone, EmptyState, SearchField, Money, Rating, ContractStepper, MediaSlot } = window.StairsLifeDesignSystem_075594;

const KATEGORI_B = ["Desain grafis", "Web & aplikasi", "Penulisan", "Video & animasi", "Sosial media", "Fotografi", "Data & riset", "Jasa"];
const TIPE_KERJA = ["Proyek sekali jalan", "Part-time", "Freelance", "Magang", "Harian / event"];
const LOKASI_B = ["Remote", "Onsite — Malang", "Hybrid — Malang", "Onsite — Surabaya"];

/* ---------------- B3 — Buat / edit lowongan ---------------- */
function BizBuatLowongan({ notify, setRute, terverifikasi }) {
  const [judul, setJudul] = React.useState("Barista part-time akhir pekan");
  const [kategori, setKategori] = React.useState("Jasa");
  const [tipe, setTipe] = React.useState("Part-time");
  const [lokasi, setLokasi] = React.useState("Onsite — Malang");
  const [deskripsi, setDeskripsi] = React.useState("Kedai kami buka Sabtu–Minggu 08.00–17.00. Kamu akan menyeduh manual brew dan espresso, melayani pesanan, dan menjaga kebersihan bar. Pelatihan dua hari pertama dibayar penuh.");
  const [kualifikasi, setKualifikasi] = React.useState("Mahasiswa aktif, bisa bekerja akhir pekan, ramah ke pelanggan. Pengalaman barista bukan syarat wajib — kami melatih dari nol.");
  const [posisi, setPosisi] = React.useState("2");
  const [gajiMin, setGajiMin] = React.useState("900000");
  const [nego, setNego] = React.useState(false);
  const [deadline, setDeadline] = React.useState("2026-09-20");
  const [pertanyaan, setPertanyaan] = React.useState(["Hari apa saja kamu bisa masuk?"]);
  const [err, setErr] = React.useState("");
  const [pratinjau, setPratinjau] = React.useState(false);

  const tanggal = deadline ? new Date(deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const gaji = Number(gajiMin) || 0;

  const ajukan = () => {
    if (judul.trim().length < 10) { setErr("Judul minimal 10 karakter supaya mahasiswa paham isi pekerjaannya."); return; }
    setErr("");
    notify({ tone: "success", title: "Lowongan diajukan", description: "Masuk antrean review admin. Biasanya tayang dalam 1 hari kerja." });
    setRute("b2");
  };

  return (
    <>
      <div className="bz-split">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="lg" style={{ gap: 15 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>1 · Informasi dasar</h3>
            <Input label="Judul lowongan" required value={judul} error={err} onChange={(e) => { setJudul(e.target.value); if (err) setErr(""); }}
              hint="Sebutkan posisinya dan pola kerjanya, mis. “Barista part-time akhir pekan”." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14 }}>
              <Select label="Kategori" required value={kategori} onChange={(e) => setKategori(e.target.value)} options={KATEGORI_B} />
              <Select label="Tipe kerja" required value={tipe} onChange={(e) => setTipe(e.target.value)} options={TIPE_KERJA} />
              <Select label="Lokasi" required value={lokasi} onChange={(e) => setLokasi(e.target.value)} options={LOKASI_B} />
              <Input label="Jumlah posisi" required numeric value={posisi} onChange={(e) => setPosisi(e.target.value.replace(/\D/g, ""))} />
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 15 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>2 · Deskripsi &amp; kualifikasi</h3>
            <Textarea label="Deskripsi pekerjaan" required rows={5} maxLength={1200} showCount value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              hint="Tulis apa yang dikerjakan sehari-hari, jam kerjanya, dan siapa yang akan jadi atasannya." />
            <Textarea label="Kualifikasi" required rows={4} maxLength={600} showCount value={kualifikasi} onChange={(e) => setKualifikasi(e.target.value)}
              hint="Pisahkan mana yang wajib dan mana yang nilai tambah. Syarat berlebihan membuat pelamar mundur." />
          </Card>

          <Card padding="lg" style={{ gap: 15 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>3 · Gaji &amp; tenggat</h3>
            <Checkbox label="Gaji dinegosiasikan" checked={nego} onChange={(e) => setNego(e.target.checked)}
              description="Lowongan tanpa nominal mendapat 60% lebih sedikit pelamar. Cantumkan angka bila memungkinkan." />
            {!nego && (
              <Input label="Gaji per bulan" required numeric prefix="Rp" value={gajiMin} onChange={(e) => setGajiMin(e.target.value.replace(/\D/g, ""))}
                hint={gaji ? "Rp " + gaji.toLocaleString("id-ID") : "Masukkan nominal tanpa titik"} />
            )}
            <Input label="Tutup lamaran" required type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} hint={"Terbaca sebagai " + tanggal + " · lowongan kedaluwarsa otomatis 30 hari setelah tayang"} />
          </Card>

          <Card padding="lg" style={{ gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
              <h3 style={{ fontSize: "var(--text-h3)" }}>4 · Pertanyaan tambahan</h3>
              <span className="sl-caption">opsional · maks. 3</span>
            </div>
            {pertanyaan.map((q, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <Input label={"Pertanyaan " + (i + 1)} value={q} style={{ flex: 1, minWidth: 0 }}
                  onChange={(e) => setPertanyaan((v) => v.map((x, j) => (j === i ? e.target.value : x)))} />
                <IconButton label="Hapus pertanyaan" onClick={() => setPertanyaan((v) => v.filter((_, j) => j !== i))}><Icon name="Trash2" size={16} /></IconButton>
              </div>
            ))}
            {pertanyaan.length < 3 && (
              <Button size="sm" variant="secondary" style={{ alignSelf: "flex-start" }} iconLeft={<Icon name="Plus" size={15} />}
                onClick={() => setPertanyaan((v) => [...v, ""])}>Tambah pertanyaan</Button>
            )}
            <span className="sl-caption" style={{ lineHeight: 1.5 }}>Jawaban muncul di halaman detail pelamar, jadi kamu bisa menyaring tanpa perlu wawancara dulu.</span>
          </Card>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Button onClick={ajukan} disabled={!terverifikasi}>Ajukan untuk tayang</Button>
            <Button variant="secondary" onClick={() => notify({ tone: "info", title: "Draft disimpan", description: "Ada di tab Draft pada halaman Kelola lowongan." })}>Simpan draft</Button>
            <Button variant="ghost" onClick={() => setPratinjau(true)}>Pratinjau sebagai mahasiswa</Button>
            <span className="sl-caption" style={{ marginLeft: "auto" }}>
              {terverifikasi ? "Tayang 30 hari, tanpa biaya posting" : "Perlu verifikasi bisnis sebelum bisa tayang"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Ringkasan</span>
            <b style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-body-lg)", color: "var(--text-strong)", lineHeight: 1.25 }}>{judul || "Judul lowongan"}</b>
            <span className="sl-caption">{tipe} · {lokasi}</span>
            {nego ? <b className="sl-body" style={{ color: "var(--text-muted)" }}>Gaji nego</b> : <Money value={gaji} size="md" />}
            <span className="sl-caption">Tutup {tanggal} · {posisi || 1} posisi</span>
            <Tag>{kategori}</Tag>
          </Card>

          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Biaya layanan</span>
            <b style={{ fontFamily: "var(--font-sans)", fontVariantNumeric: "tabular-nums", fontSize: "var(--text-money-lg)", fontWeight: 700, color: "var(--text-strong)", lineHeight: 1.1 }}>5%</b>
            <span className="sl-caption" style={{ lineHeight: 1.5 }}>Dipotong satu kali dari nilai kontrak, hanya saat dana dilepas ke mahasiswa. Memposting lowongan tidak dikenakan biaya.</span>
            <Button size="sm" variant="secondary" onClick={() => setRute("b9")}>Rincian biaya</Button>
          </Card>

          <Card padding="md" style={{ gap: 10 }}>
            <span className="sl-overline">Sebelum diajukan</span>
            {[["Judul menyebut posisi & pola kerja", judul.length >= 10],
              ["Deskripsi minimal 100 karakter", deskripsi.length >= 100],
              ["Nominal gaji dicantumkan", !nego && gaji > 0],
              ["Tenggat diisi", !!deadline]].map(([t, ok]) => (
              <span key={t} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ flex: "none", color: ok ? "var(--success)" : "var(--text-subtle)", display: "flex", marginTop: 1 }}><Icon name={ok ? "CheckCircle2" : "Circle"} size={15} /></span>
                <span className="sl-caption" style={{ lineHeight: 1.5 }}>{t}</span>
              </span>
            ))}
          </Card>
        </div>
      </div>

      <Modal open={pratinjau} onClose={() => setPratinjau(false)} title="Pratinjau sebagai mahasiswa" description="Inilah yang akan dilihat pelamar di halaman detail lowongan."
        footer={<Button variant="secondary" onClick={() => setPratinjau(false)}>Tutup pratinjau</Button>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>{judul}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 8 }}>
              <Avatar name="Kopi Senja Malang" size="sm" shape="rounded" verified />
              <span className="sl-caption">Kopi Senja Malang · Terverifikasi · 7 proyek selesai</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 14, padding: "13px 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
            <FaktaB label="Gaji" value={nego ? "Nego" : "Rp " + gaji.toLocaleString("id-ID")} />
            <FaktaB label="Tipe" value={tipe} />
            <FaktaB label="Lokasi" value={lokasi} />
            <FaktaB label="Tutup" value={tanggal} />
          </div>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.65 }}>{deskripsi}</p>
          <div>
            <span className="sl-overline">Kualifikasi</span>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.65, marginTop: 5 }}>{kualifikasi}</p>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ---------------- B5 / B7 — Daftar pelamar ---------------- */
function BizPelamar({ bukaPelamar, notify, semua, terverifikasi }) {
  const [tab, setTab] = React.useState("semua");
  const [pilih, setPilih] = React.useState([]);
  const [inst, setInst] = React.useState("Semua institusi");
  const [low, setLow] = React.useState("Semua lowongan");
  const [aktif, setAktif] = React.useState(null);
  const [hal, setHal] = React.useState(1);

  const rows = PELAMAR_BIZ
    .filter((p) => tab === "semua" || p.st === tab)
    .filter((p) => inst === "Semua institusi" || p.institusi === inst)
    .filter((p) => !semua || low === "Semua lowongan" || p.untuk === low);

  const toggle = (id) => setPilih((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  const massal = (aksi) => {
    notify({ tone: aksi === "tolak" ? "info" : "success", title: pilih.length + " pelamar " + (aksi === "tolak" ? "ditolak" : aksi === "seleksi" ? "masuk seleksi" : "diterima"), description: "Semuanya menerima notifikasi dan email." });
    setPilih([]);
  };

  if (!PELAMAR_BIZ.length) {
    return <Card padding="none"><EmptyState size="lg" icon={<Icon name="Users" size={34} strokeWidth={1.5} />} title="Belum ada pelamar" description="Lowongan baru biasanya menerima lamaran pertama dalam 24 jam." /></Card>;
  }

  return (
    <>
      {pilih.length > 0 && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "11px 15px", background: "var(--primary-soft)", border: "1px solid var(--primary-border)", borderRadius: "var(--radius-md)", flexWrap: "wrap", position: "sticky", top: 0, zIndex: 5 }}>
          <b className="sl-body-sm" style={{ color: "var(--primary-text)" }}>{pilih.length} pelamar dipilih</b>
          <span style={{ marginLeft: "auto", display: "flex", gap: 7, flexWrap: "wrap" }}>
            <Button size="sm" variant="secondary" onClick={() => massal("seleksi")}>Masukkan seleksi</Button>
            <Button size="sm" variant="secondary" onClick={() => massal("terima")}>Terima</Button>
            <Button size="sm" variant="ghost" onClick={() => massal("tolak")}>Tolak</Button>
            <Button size="sm" variant="ghost" onClick={() => setPilih([])}>Batal</Button>
          </span>
        </div>
      )}

      <div className="bz-split">
        <Card padding="lg" style={{ gap: 14 }}>
          <Tabs value={tab} onChange={setTab} items={[
            { value: "semua", label: "Semua", count: PELAMAR_BIZ.length },
            { value: "terkirim", label: "Baru", count: 1 },
            { value: "dilihat", label: "Dilihat", count: 1 },
            { value: "seleksi", label: "Seleksi", count: 1 },
            { value: "diterima", label: "Diterima", count: 1 },
            { value: "ditolak", label: "Ditolak", count: 1 },
          ]} />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", flex: "none" }}>
            <SearchField placeholder="Cari nama pelamar" label="Cari pelamar" collapsedWidth={190} expandedWidth={300} />
            <Select size="sm" value={inst} onChange={(e) => setInst(e.target.value)} options={["Semua institusi", "Universitas Brawijaya", "Universitas Negeri Malang", "Politeknik Negeri Malang"]} />
            {semua && <Select size="sm" value={low} onChange={(e) => setLow(e.target.value)} options={["Semua lowongan", "L-3380", "L-3372", "L-3355"]} />}
          </div>

          {rows.length === 0 ? (
            <EmptyState icon={<Icon name="UserSearch" size={30} strokeWidth={1.5} />} title="Tidak ada pelamar yang cocok" description="Coba hapus salah satu filter." />
          ) : (
            <>
              <DataTable
                columns={[
                  { key: "pilih", header: "", width: 40, render: (r) => <Checkbox checked={pilih.includes(r.id)} onChange={() => toggle(r.id)} aria-label={"Pilih " + r.nama} /> },
                  { key: "nama", header: "Pelamar", render: (r) => (
                    <button type="button" onClick={() => setAktif(r)} style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0, border: 0, background: "transparent", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}>
                      <Avatar name={r.nama} size="xs" verified={r.verified} />
                      <span style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
                        <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.nama}</b>
                        <span className="sl-caption">{r.jurusan} · sem {r.semester}</span>
                      </span>
                    </button>
                  ) },
                  ...(semua ? [{ key: "untuk", header: "Melamar untuk", width: 120 }] : []),
                  { key: "institusi", header: "Institusi", width: 190 },
                  { key: "tgl", header: "Melamar", width: 115 },
                  { key: "st", header: "Status", width: 130, render: (r) => <StatusBadge status={r.st} size="sm" /> },
                ]}
                rows={rows}
              />
              <Pagination page={hal} total={3} onChange={setHal} label={rows.length + " dari 28 pelamar"} />
            </>
          )}
        </Card>

        <Card padding="lg" style={{ gap: 13 }}>
          {aktif ? (
            <>
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <Avatar name={aktif.nama} size="lg" verified={aktif.verified} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b className="sl-body" style={{ color: "var(--text-strong)", display: "block" }}>{aktif.nama}</b>
                  <span className="sl-caption">{aktif.jurusan} · {aktif.institusi}</span>
                  <div style={{ marginTop: 5 }}><Rating value={aktif.rating} count={aktif.ulasan} size="sm" showValue /></div>
                </div>
              </div>
              <StatusBadge status={aktif.st} size="sm" style={{ alignSelf: "flex-start" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span className="sl-overline">Surat lamaran</span>
                <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{aktif.surat}</p>
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", paddingTop: 4 }}>
                <Button size="sm" onClick={() => bukaPelamar(aktif)} disabled={!terverifikasi}>Buka detail</Button>
                <Button size="sm" variant="secondary" iconLeft={<Icon name="Download" size={15} />}>Unduh CV</Button>
              </div>
            </>
          ) : (
            <EmptyState icon={<Icon name="MousePointerClick" size={28} strokeWidth={1.5} />} title="Pilih satu pelamar" description="Klik nama di tabel untuk melihat surat lamaran dan rating tanpa meninggalkan halaman ini." />
          )}
        </Card>
      </div>
    </>
  );
}

/* ---------------- B6 — Detail pelamar ---------------- */
function BizDetailPelamar({ pelamar, setRute, notify }) {
  const p = pelamar || PELAMAR_BIZ[0];
  const [keputusan, setKeputusan] = React.useState(p.st === "diterima" || p.st === "ditolak" ? p.st : null);
  const [dialog, setDialog] = React.useState(null);
  const [pesan, setPesan] = React.useState("");
  const [catatan, setCatatan] = React.useState("");
  const selesai = keputusan === "diterima" || keputusan === "ditolak";

  const putuskan = () => {
    setKeputusan(dialog);
    notify({
      tone: dialog === "ditolak" ? "info" : "success",
      title: dialog === "diterima" ? "Pelamar diterima" : dialog === "seleksi" ? "Masuk tahap seleksi" : "Pelamar ditolak",
      description: p.nama + " menerima notifikasi" + (pesan ? " beserta pesanmu." : "."),
    });
    setDialog(null); setPesan("");
  };

  return (
    <>
      <button type="button" onClick={() => setRute("b5")}
        style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", cursor: "pointer", alignSelf: "flex-start" }}>
        <Icon name="ArrowLeft" size={16} />Kembali ke daftar pelamar
      </button>

      <div className="bz-split">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="lg" style={{ gap: 15 }}>
            <div style={{ display: "flex", gap: 15, alignItems: "flex-start", flexWrap: "wrap" }}>
              <Avatar name={p.nama} size="xl" verified={p.verified} />
              <div style={{ flex: 1, minWidth: 190 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)" }}>{p.nama}</h2>
                  <StatusBadge status={keputusan || p.st} size="sm" />
                </div>
                <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 4 }}>{p.jurusan} · {p.institusi} · semester {p.semester}</p>
                <div style={{ marginTop: 7 }}><Rating value={p.rating} count={p.ulasan} showValue /></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
              <FaktaB label="Melamar untuk" value={p.untuk} />
              <FaktaB label="Tanggal melamar" value={p.tgl} />
              <FaktaB label="Verifikasi identitas" value={p.verified ? "Terverifikasi" : "Belum terverifikasi"} tone={p.verified ? undefined : "danger"} />
              <FaktaB label="Kontak" value={keputusan === "diterima" ? "rani@student.ub.ac.id · 0812···4471" : "Terbuka setelah diterima"} />
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 13 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Surat lamaran</h3>
            <p className="sl-body" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{p.surat}</p>
          </Card>

          <Card padding="lg" style={{ gap: 13 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Jawaban pertanyaan tambahan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div>
                <span className="sl-overline">Hari apa saja kamu bisa masuk?</span>
                <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6, marginTop: 4 }}>Sabtu dan Minggu penuh, Jumat setelah jam 15.00.</p>
              </div>
              <div>
                <span className="sl-overline">Pernah pakai Adobe Illustrator?</span>
                <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6, marginTop: 4 }}>Ya, sejak semester 2 — untuk tugas kuliah dan proyek lepas.</p>
              </div>
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
              <h3 style={{ fontSize: "var(--text-h3)" }}>CV</h3>
              <Button size="sm" variant="secondary" iconLeft={<Icon name="Download" size={15} />}>Unduh PDF</Button>
            </div>
            <MediaSlot ratio="1 / 1.2" size="lg" style={{ maxHeight: 300 }}
              icon={<Icon name="FileText" size={30} strokeWidth={1.5} />}
              label="CV-Rani-Pratiwi-2026.pdf" hint="1,2 MB · pratinjau PDF terbuka di panel ini" />
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Keputusan</span>
            {selesai ? (
              <>
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "11px 13px", background: keputusan === "diterima" ? "var(--success-soft)" : "var(--bg-subtle)", border: "1px solid " + (keputusan === "diterima" ? "var(--success-border)" : "var(--border-subtle)"), borderRadius: "var(--radius-md)" }}>
                  <span style={{ flex: "none", color: keputusan === "diterima" ? "var(--success-text)" : "var(--text-muted)", display: "flex", marginTop: 1 }}>
                    <Icon name={keputusan === "diterima" ? "CheckCircle2" : "XCircle"} size={17} />
                  </span>
                  <span className="sl-body-sm" style={{ color: keputusan === "diterima" ? "var(--success-text)" : "var(--text-muted)", lineHeight: 1.55 }}>
                    {keputusan === "diterima" ? "Sudah diterima pada 28 Agu 2026. Kontaknya kini terbuka." : "Sudah ditolak pada 26 Agu 2026. Alasan: kualifikasi belum sesuai."}
                  </span>
                </div>
                <span className="sl-caption" style={{ lineHeight: 1.5 }}>Keputusan tidak bisa diubah. Kalau perlu memproses ulang, minta pelamar melamar kembali.</span>
              </>
            ) : (
              <>
                <Button fullWidth onClick={() => setDialog("diterima")}>Terima pelamar</Button>
                <Button variant="secondary" fullWidth onClick={() => setDialog("seleksi")}>Masukkan seleksi</Button>
                <Button variant="ghost" fullWidth onClick={() => setDialog("ditolak")}>Tolak</Button>
                <span className="sl-caption" style={{ lineHeight: 1.5 }}>Kontak pelamar baru terbuka setelah kamu menerimanya — ini melindungi mahasiswa dari kontak di luar platform.</span>
              </>
            )}
          </Card>

          {keputusan === "diterima" && (
            <UlasanDuaArah notify={notify} peran="bisnis" nama={p.nama} lowongan={p.untuk} />
          )}

          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Riwayat status</span>
            <ContractStepper orientation="vertical" current={p.st === "diterima" ? 3 : p.st === "seleksi" ? 2 : p.st === "dilihat" ? 1 : 0}
              steps={[{ label: "Lamaran dikirim", meta: p.tgl }, { label: "Dilihat bisnis", meta: p.st === "terkirim" ? "" : "29 Agu" }, { label: "Tahap seleksi" }, { label: "Keputusan akhir" }]} />
          </Card>

          <Card padding="md" style={{ gap: 10 }}>
            <span className="sl-overline">Catatan internal</span>
            <Textarea rows={3} maxLength={400} showCount value={catatan} onChange={(e) => setCatatan(e.target.value)}
              placeholder="Mis. “portofolio kuat, jadwal perlu dicek lagi”." hint="Tidak pernah terlihat oleh pelamar." />
            <Button size="sm" variant="secondary" style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Catatan disimpan" })}>Simpan</Button>
          </Card>
        </div>
      </div>

      <Modal open={!!dialog} onClose={() => setDialog(null)} size="sm"
        title={dialog === "diterima" ? "Terima pelamar ini?" : dialog === "seleksi" ? "Masukkan ke tahap seleksi?" : "Tolak pelamar ini?"}
        description={p.nama + " · " + p.untuk}
        footer={<><Button variant="ghost" onClick={() => setDialog(null)}>Batal</Button><Button variant={dialog === "ditolak" ? "destructive" : "primary"} onClick={putuskan}>{dialog === "diterima" ? "Terima" : dialog === "seleksi" ? "Masukkan seleksi" : "Tolak"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            {dialog === "diterima" ? "Kontak kamu dan pelamar akan saling terbuka, dan lowongan berkurang satu posisi."
              : dialog === "seleksi" ? "Pelamar diberi tahu bahwa lamarannya masuk tahap seleksi. Kamu masih bisa menerima atau menolak setelahnya."
              : "Pelamar diberi tahu bahwa lamarannya tidak dilanjutkan. Keputusan ini tidak bisa dibatalkan."}
          </p>
          <Textarea label={dialog === "ditolak" ? "Pesan untuk pelamar (opsional)" : "Pesan untuk pelamar"} rows={3} maxLength={400} showCount value={pesan} onChange={(e) => setPesan(e.target.value)}
            placeholder={dialog === "diterima" ? "Mis. jadwal masuk pertama dan siapa yang akan menemui." : dialog === "seleksi" ? "Mis. kapan dan bagaimana wawancaranya." : "Satu kalimat alasan sangat membantu mahasiswa memperbaiki diri."}
            hint={dialog === "ditolak" ? "Penolakan tanpa alasan adalah keluhan nomor satu mahasiswa di platform sejenis." : undefined} />
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { BizBuatLowongan, BizPelamar, BizDetailPelamar });
