const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Modal, Textarea, Select, Input, Checkbox, Switch, FileDropzone, EmptyState, Rating, ContractStepper, MediaSlot } = window.StairsLifeDesignSystem_075594;

/* ---------------- M7 — Profil saya ---------------- */
function MhsProfil({ notify, verifikasi }) {
  const [tab, setTab] = React.useState("diri");
  const [keahlian, setKeahlian] = React.useState(["Logo", "Branding", "Illustrator", "Figma"]);
  const SEMUA_KEAHLIAN = ["Logo", "Branding", "Illustrator", "Figma", "Packaging", "Copywriting", "Motion", "Fotografi", "Instagram", "SEO", "Canva", "Lightroom"];
  const tog = (k) => setKeahlian((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]));

  return (
    <>
      <Card padding="lg" style={{ gap: 15 }}>
        <div style={{ display: "flex", gap: 15, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Avatar name="Rani Pratiwi" size="xl" verified={verifikasi === "terverifikasi"} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)" }}>Rani Pratiwi</h2>
              <StatusBadge status={verifikasi} size="sm" />
            </div>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 4 }}>Desain Komunikasi Visual · Universitas Brawijaya · semester 6</p>
            <div style={{ marginTop: 7 }}><Rating value={4.8} count={23} showValue /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 170 }}>
            <Button variant="secondary" fullWidth iconLeft={<Icon name="ExternalLink" size={16} />}>Lihat sebagai bisnis</Button>
            <span className="sl-caption" style={{ textAlign: "center", lineHeight: 1.45 }}>Inilah yang dilihat bisnis saat kamu melamar</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
          {[["Lamaran dikirim", "11"], ["Diterima", "7"], ["Tepat waktu", "91%"], ["Profil dilihat", "47"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span className="sl-overline">{k}</span>
              <b className="sl-tabular" style={{ fontSize: "var(--text-money)", fontWeight: 700, color: "var(--text-strong)", lineHeight: 1.15 }}>{v}</b>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg" style={{ gap: 15 }}>
        <Tabs value={tab} onChange={setTab} items={[
          { value: "diri", label: "Data diri" },
          { value: "kampus", label: "Data kampus" },
          { value: "keahlian", label: "Keahlian", count: keahlian.length },
          { value: "portofolio", label: "Portofolio" },
        ]} />

        {tab === "diri" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14 }}>
              <Input label="Nama lengkap" required defaultValue="Rani Pratiwi" />
              <Input label="Email" required defaultValue="rani@student.ub.ac.id" hint="Email kampus, sudah terverifikasi." />
              <Input label="Nomor telepon" defaultValue="0812 3344 4471" hint="Hanya terlihat bisnis yang menerimamu." />
              <Select label="Kota domisili" defaultValue="Malang" options={["Malang", "Surabaya", "Semarang", "Yogyakarta"]} />
            </div>
            <Textarea label="Tentang saya" rows={4} maxLength={500} showCount
              defaultValue="Mahasiswa DKV yang fokus pada branding untuk usaha kecil. Saya suka mengerjakan proyek dari nol — riset visual, alternatif arah, sampai berkas siap cetak. Terbiasa bekerja dengan tenggat dan revisi terbatas."
              hint="Dua sampai tiga kalimat cukup. Bisnis membaca ini sebelum surat lamaranmu." />
            <Button style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Profil disimpan" })}>Simpan perubahan</Button>
          </>
        )}

        {tab === "kampus" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14 }}>
              <Select label="Institusi" required defaultValue="Universitas Brawijaya" options={["Universitas Brawijaya", "Universitas Negeri Malang", "Politeknik Negeri Malang", "UIN Maulana Malik Ibrahim"]} />
              <Select label="Jurusan" required defaultValue="Desain Komunikasi Visual" options={["Desain Komunikasi Visual", "Teknik Informatika", "Ilmu Komunikasi", "Manajemen Informatika"]} />
              <Input label="NIM" required defaultValue="215150401111023" hint="Harus cocok dengan KTM yang diunggah." />
              <Select label="Semester" required defaultValue="6" options={["1", "2", "3", "4", "5", "6", "7", "8"]} />
              <Input label="Angkatan" numeric defaultValue="2023" />
              <Input label="IPK (opsional)" defaultValue="3,62" />
            </div>
            <span className="sl-caption" style={{ lineHeight: 1.55 }}>Mengubah NIM atau institusi membatalkan verifikasi identitasmu — kamu perlu mengunggah KTM baru.</span>
            <Button style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Data kampus disimpan" })}>Simpan perubahan</Button>
          </>
        )}

        {tab === "keahlian" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span className="sl-overline">Pilih keahlianmu · maksimal 8</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {SEMUA_KEAHLIAN.map((k) => {
                  const on = keahlian.includes(k);
                  return (
                    <button key={k} type="button" onClick={() => tog(k)}
                      style={{ minHeight: 36, padding: "0 13px", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)",
                        background: on ? "var(--primary-soft)" : "var(--bg-surface)",
                        border: "1px solid " + (on ? "var(--primary-border)" : "var(--border-default)"),
                        color: on ? "var(--primary-text)" : "var(--text-muted)",
                        fontWeight: on ? 600 : 500, transition: "var(--transition-color)", whiteSpace: "nowrap" }}>{k}</button>
                  );
                })}
              </div>
              <span className="sl-caption" style={{ lineHeight: 1.5 }}>{keahlian.length} dipilih · keahlian menentukan lowongan mana yang direkomendasikan untukmu.</span>
            </div>
            <Button style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "success", title: "Keahlian disimpan", description: "Rekomendasi lowongan akan menyesuaikan." })}>Simpan keahlian</Button>
          </>
        )}

        {tab === "portofolio" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 11 }}>
              {["Brand kit Kopi Senja", "Menu Warung Ibu Tri", "Packaging kopi bubuk", "Poster Rimbun"].map((t) => (
                <MediaSlot key={t} size="sm" icon={<Icon name="Image" size={20} strokeWidth={1.5} />} label={t}
                  hint="Belum ada gambar" />
              ))}
              <MediaSlot size="sm" tone="primary" icon={<Icon name="Plus" size={20} />} label="Tambah karya"
                hint="JPG atau PNG, sisi terpanjang minimal 1200 px" />
            </div>
            <span className="sl-caption" style={{ lineHeight: 1.55 }}>Karya asli diunggah mahasiswa sendiri. Slot di atas menunjukkan bentuk dan urutannya.</span>
          </>
        )}
      </Card>
    </>
  );
}

/* ---------------- M8 — Dokumen & CV ---------------- */
function MhsDokumen({ notify }) {
  const [cv, setCv] = React.useState([
    { name: "CV-Rani-Pratiwi-2026.pdf", size: "1,2 MB", utama: true, tgl: "20 Agu 2026" },
    { name: "CV-Rani-Desain-2026.pdf", size: "0,9 MB", utama: false, tgl: "02 Jul 2026" },
  ]);
  const [baru, setBaru] = React.useState([]);

  const jadikanUtama = (n) => {
    setCv((v) => v.map((x) => ({ ...x, utama: x.name === n })));
    notify({ tone: "success", title: "CV utama diubah", description: n + " kini dikirim otomatis saat melamar." });
  };

  return (
    <>
      <Card padding="lg" style={{ gap: 14 }}>
        <div>
          <h3 style={{ fontSize: "var(--text-h3)", color: "var(--text-strong)" }}>CV kamu</h3>
          <p className="sl-caption" style={{ marginTop: 3, lineHeight: 1.5 }}>CV utama dikirim otomatis setiap kali melamar. Kamu bisa menyimpan beberapa versi untuk bidang berbeda.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cv.map((f) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: f.utama ? "var(--primary-soft)" : "var(--bg-subtle)", border: "1px solid " + (f.utama ? "var(--primary-border)" : "var(--border-subtle)"), borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
              <span style={{ flex: "none", color: f.utama ? "var(--primary-text)" : "var(--text-subtle)", display: "flex" }}><Icon name="FileText" size={18} /></span>
              <span style={{ flex: 1, minWidth: 140, display: "flex", flexDirection: "column" }}>
                <b className="sl-body-sm" style={{ color: f.utama ? "var(--primary-text)" : "var(--text-strong)" }}>{f.name}</b>
                <span className="sl-caption" style={{ color: f.utama ? "var(--primary-text)" : undefined }}>{f.size} · diunggah {f.tgl}</span>
              </span>
              {f.utama ? <StatusBadge status="aktif" label="CV utama" size="sm" /> : <Button size="sm" variant="ghost" onClick={() => jadikanUtama(f.name)}>Jadikan utama</Button>}
              <Button size="sm" variant="ghost" iconLeft={<Icon name="Download" size={14} />}>Unduh</Button>
              {!f.utama && <Button size="sm" variant="ghost" onClick={() => setCv((v) => v.filter((x) => x.name !== f.name))}>Hapus</Button>}
            </div>
          ))}
        </div>
        <FileDropzone label="Unggah CV baru" hint="PDF saja · maksimal 5 MB · nama berkas sebaiknya memuat namamu" accept=".pdf"
          files={baru} onRemove={(f) => setBaru((v) => v.filter((x) => x.name !== f.name))}
          onFiles={(fs) => { setBaru([]); setCv((v) => [...v, ...fs.map((f) => ({ name: f.name, size: (f.size / 1048576).toFixed(1).replace(".", ",") + " MB", utama: false, tgl: "02 Sep 2026" }))]); notify({ tone: "success", title: "CV diunggah" }); }} />
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Berkas pendukung</h3>
        <DataTable
          columns={[
            { key: "nama", header: "Berkas", render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.nama}<span className="sl-caption" style={{ display: "block" }}>{r.jenis}</span></span> },
            { key: "ukuran", header: "Ukuran", numeric: true, width: 100 },
            { key: "tgl", header: "Diunggah", width: 120 },
            { key: "aksi", header: "", width: 150, align: "right", render: () => <span style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}><Button size="sm" variant="ghost">Unduh</Button><Button size="sm" variant="ghost">Hapus</Button></span> },
          ]}
          rows={[
            { id: 1, nama: "Portofolio-Rani-2026.pdf", jenis: "Portofolio", ukuran: "4,8 MB", tgl: "20 Agu 2026" },
            { id: 2, nama: "Sertifikat-Adobe-Illustrator.pdf", jenis: "Sertifikat", ukuran: "0,6 MB", tgl: "12 Jul 2026" },
            { id: 3, nama: "Transkrip-Sem5.pdf", jenis: "Transkrip nilai", ukuran: "0,4 MB", tgl: "02 Jul 2026" },
          ]}
        />
        <Button size="sm" variant="secondary" style={{ alignSelf: "flex-start" }} iconLeft={<Icon name="Upload" size={15} />}>Unggah berkas</Button>
      </Card>
    </>
  );
}

/* ---------------- M9 — Status verifikasi ---------------- */
function MhsVerifikasi({ verifikasi, setVerifikasi, notify }) {
  const [berkas, setBerkas] = React.useState(verifikasi === "terverifikasi" ? [{ name: "KTM-Rani-Pratiwi.jpg", size: "1,4 MB" }] : []);
  const tahap = verifikasi === "terverifikasi" ? 3 : berkas.length ? 2 : 1;

  return (
    <>
      {verifikasi === "terverifikasi" ? (
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--success-soft)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-md)" }}>
          <span style={{ flex: "none", color: "var(--success-text)", display: "flex", marginTop: 1 }}><Icon name="ShieldCheck" size={18} /></span>
          <span style={{ minWidth: 0 }}>
            <b className="sl-body-sm" style={{ color: "var(--success-text)", display: "block" }}>Identitas terverifikasi sejak 14 Feb 2026</b>
            <span className="sl-caption" style={{ color: "var(--success-text)" }}>Kamu bisa melamar semua lowongan. Lencana terverifikasi tampil di profilmu.</span>
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--warning-soft)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)" }}>
          <span style={{ flex: "none", color: "var(--warning-text)", display: "flex", marginTop: 1 }}><Icon name="AlertTriangle" size={18} /></span>
          <span style={{ minWidth: 0 }}>
            <b className="sl-body-sm" style={{ color: "var(--warning-text)", display: "block" }}>Belum bisa mengirim lamaran</b>
            <span className="sl-caption" style={{ color: "var(--warning-text)" }}>Verifikasi melindungi bisnis dari akun palsu. Prosesnya biasanya selesai dalam 1 hari kerja.</span>
          </span>
        </div>
      )}

      <div className="mh-split">
        <Card padding="lg" style={{ gap: 15 }}>
          <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Unggah KTM</h3>
          <FileDropzone label="Kartu Tanda Mahasiswa" hint="Foto atau pindaian KTM · JPG/PNG/PDF maksimal 10 MB" accept=".jpg,.png,.pdf"
            files={berkas} onRemove={(f) => setBerkas((v) => v.filter((x) => x.name !== f.name))}
            onFiles={(fs) => setBerkas(fs.map((f) => ({ name: f.name, size: (f.size / 1048576).toFixed(1).replace(".", ",") + " MB" })))} />
          <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: "13px 15px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <span className="sl-overline">Agar tidak ditolak</span>
            {["Seluruh kartu terlihat, tidak terpotong di tepi", "Nama, NIM, dan institusi terbaca jelas", "Tidak ada pantulan cahaya atau bayangan menutupi teks", "Data harus sama dengan yang kamu isi di Data kampus"].map((t) => (
              <span key={t} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ flex: "none", color: "var(--success)", display: "flex", marginTop: 1 }}><Icon name="Check" size={14} /></span>
                <span className="sl-caption" style={{ lineHeight: 1.5 }}>{t}</span>
              </span>
            ))}
          </div>
          {verifikasi !== "terverifikasi" && (
            <Button style={{ alignSelf: "flex-start" }} disabled={!berkas.length}
              onClick={() => { setVerifikasi("terverifikasi"); notify({ tone: "success", title: "KTM dikirim", description: "Masuk antrean review admin. Kamu akan dapat email begitu diputuskan." }); }}>
              Kirim untuk verifikasi
            </Button>
          )}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 12 }}>
            <span className="sl-overline">Tahap verifikasi</span>
            <ContractStepper orientation="vertical" current={tahap} steps={[
              { label: "Email kampus terverifikasi", meta: "14 Feb 2026" },
              { label: "KTM diunggah", meta: berkas.length ? "14 Feb 2026" : "" },
              { label: "Direview admin", meta: verifikasi === "terverifikasi" ? "14 Feb 2026" : "1 hari kerja" },
              { label: "Terverifikasi", meta: verifikasi === "terverifikasi" ? "14 Feb 2026" : "" },
            ]} />
          </Card>

          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Riwayat pengajuan</span>
            {[["14 Feb 2026", "terverifikasi", "—"], ["12 Feb 2026", "verifikasi_ditolak", "Foto KTM tidak terbaca"]].map(([tgl, st, alasan]) => (
              <div key={tgl} style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 9, borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="sl-caption sl-tabular">{tgl}</span>
                  <StatusBadge status={st} size="sm" />
                </span>
                {alasan !== "—" && <span className="sl-caption" style={{ lineHeight: 1.45 }}>Alasan: {alasan}</span>}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

/* ---------------- M10 — Notifikasi ---------------- */
const NOTIF_MHS = [
  { id: 1, ikon: "Eye", tone: "primary", judul: "Rimbun Plant House melihat lamaranmu", waktu: "18 menit lalu", baru: true, jenis: "lamaran" },
  { id: 2, ikon: "UserCheck", tone: "success", judul: "Lamaranmu masuk tahap seleksi", waktu: "1 jam lalu", baru: true, jenis: "lamaran", sub: "Konten Instagram 12 post · Rimbun Plant House" },
  { id: 3, ikon: "Sparkles", tone: "primary", judul: "3 lowongan baru cocok dengan keahlianmu", waktu: "5 jam lalu", baru: true, jenis: "lowongan" },
  { id: 4, ikon: "Clock", tone: "warning", judul: "Fotografer produk katalog tutup 3 hari lagi", waktu: "Kemarin", baru: true, jenis: "lowongan", sub: "Lowongan yang kamu simpan" },
  { id: 5, ikon: "ShieldCheck", tone: "success", judul: "Identitasmu berhasil diverifikasi", waktu: "14 Feb 2026", baru: true, jenis: "akun" },
  { id: 6, ikon: "XCircle", tone: "danger", judul: "Lamaran Penerjemah menu tidak dilanjutkan", waktu: "12 Agu 2026", baru: true, jenis: "lamaran", sub: "Kopi Senja Malang meninggalkan catatan" },
  { id: 7, ikon: "Megaphone", tone: "neutral", judul: "Cara agar lamaranmu lebih sering dilihat", waktu: "12 Agu 2026", baru: false, jenis: "sistem" },
];

function MhsNotifikasi({ notify, bukaLamaran }) {
  const [tab, setTab] = React.useState("semua");
  const [dibaca, setDibaca] = React.useState([]);
  const rows = NOTIF_MHS.filter((n) => tab === "semua" || (tab === "baru" ? n.baru && !dibaca.includes(n.id) : n.jenis === tab));
  const tone = { primary: ["var(--primary-soft)", "var(--primary-text)"], success: ["var(--success-soft)", "var(--success-text)"], warning: ["var(--warning-soft)", "var(--warning-text)"], danger: ["var(--danger-soft)", "var(--danger-text)"], neutral: ["var(--bg-sunken)", "var(--text-muted)"] };

  return (
    <Card padding="lg" style={{ gap: 14 }}>
      <Tabs value={tab} onChange={setTab} items={[
        { value: "semua", label: "Semua", count: NOTIF_MHS.length },
        { value: "baru", label: "Belum dibaca", count: 6 - dibaca.length },
        { value: "lamaran", label: "Lamaran", count: 3 },
        { value: "lowongan", label: "Lowongan", count: 2 },
        { value: "akun", label: "Akun", count: 1 },
      ]} />
      <div style={{ display: "flex", justifyContent: "flex-end", flex: "none" }}>
        <Button size="sm" variant="ghost" onClick={() => { setDibaca(NOTIF_MHS.map((n) => n.id)); notify({ tone: "info", title: "Semua ditandai dibaca" }); }}>Tandai semua dibaca</Button>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={<Icon name="BellOff" size={30} strokeWidth={1.5} />} title="Tidak ada notifikasi di tab ini" description="Kami beri tahu saat bisnis melihat lamaranmu atau ada lowongan yang cocok." />
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

/* ---------------- M11 — Pengaturan akun ---------------- */
function MhsPengaturan({ notify }) {
  const [pref, setPref] = React.useState({ status: true, cocok: true, tutup: true, pesan: true, promo: false });
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
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Notifikasi</h3>
        <Switch label="Perubahan status lamaran" checked={pref.status} onChange={set("status")} description="Saat bisnis melihat, menyeleksi, menerima, atau menolak lamaranmu." />
        <Switch label="Lowongan yang cocok" checked={pref.cocok} onChange={set("cocok")} description="Maksimal satu ringkasan per hari berdasarkan keahlian di profilmu." />
        <Switch label="Lowongan tersimpan akan tutup" checked={pref.tutup} onChange={set("tutup")} description="Peringatan 3 hari sebelum lowongan berhenti menerima lamaran." />
        <Switch label="Pesan dari bisnis" checked={pref.pesan} onChange={set("pesan")} description="Hanya dari bisnis yang sudah menerimamu. Sebaiknya tetap aktif." />
        <Switch label="Tips & promo StairsLife" checked={pref.promo} onChange={set("promo")} description="Maksimal sekali sebulan." />
      </Card>

      <Card padding="lg" style={{ gap: 15 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Privasi</h3>
        <Switch label="Profil bisa ditemukan bisnis" defaultChecked description="Bisnis boleh menemukan profilmu lewat pencarian dan mengundangmu melamar. Nomor telepon dan emailmu tetap tertutup sampai kamu diterima — itu tidak bisa dimatikan." />
        <Switch label="Tampilkan IPK di profil" description="Sebagian bisnis memakainya sebagai pertimbangan, sebagian tidak peduli." />
      </Card>

      <Card padding="lg" style={{ gap: 14 }}>
        <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Sesi aktif</h3>
        <DataTable
          columns={[
            { key: "perangkat", header: "Perangkat" },
            { key: "lokasi", header: "Lokasi", width: 140 },
            { key: "akhir", header: "Terakhir aktif", width: 150 },
            { key: "aksi", header: "", width: 100, align: "right", render: (r) => r.ini ? <span className="sl-caption">Perangkat ini</span> : <Button size="sm" variant="ghost">Keluarkan</Button> },
          ]}
          rows={[
            { id: 1, perangkat: "Chrome · Android 14", lokasi: "Malang, ID", akhir: "Sekarang", ini: true },
            { id: 2, perangkat: "Chrome · Windows 11", lokasi: "Malang, ID", akhir: "Kemarin 19:32" },
          ]}
        />
      </Card>

      <Card padding="lg" style={{ gap: 13, borderColor: "var(--danger-border)" }}>
        <h3 style={{ fontSize: "var(--text-h3)", color: "var(--danger-text)", flex: "none" }}>Hapus akun</h3>
        <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "70ch" }}>
          Lamaran yang sedang berjalan akan dibatalkan dan bisnis diberi tahu. Ulasan yang pernah kamu terima tetap ada di profil bisnis, tapi tanpa nama.
        </p>
        <Button variant="destructive" style={{ alignSelf: "flex-start" }} onClick={() => setHapus(true)}>Hapus akun saya</Button>
      </Card>

      <Modal open={hapus} onClose={() => setHapus(false)} title="Hapus akun?" size="sm"
        footer={<><Button variant="ghost" onClick={() => setHapus(false)}>Batal</Button><Button variant="destructive" onClick={() => { setHapus(false); notify({ tone: "info", title: "Permintaan hapus dicatat", description: "Akun dihapus dalam 7 hari. Masuk kembali untuk membatalkan." }); }}>Ya, hapus</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>3 lamaran aktif akan dibatalkan. Rating 4,8 dan riwayat 11 proyek hilang permanen.</p>
          <Input label="Tulis HAPUS untuk mengonfirmasi" placeholder="HAPUS" />
          <Checkbox label="Saya paham tindakan ini tidak bisa dibatalkan setelah 7 hari" />
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { MhsProfil, MhsDokumen, MhsVerifikasi, MhsNotifikasi, MhsPengaturan, NOTIF_MHS });
