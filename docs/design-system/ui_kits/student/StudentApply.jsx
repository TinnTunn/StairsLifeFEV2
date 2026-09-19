const { Card, StatusBadge, Tag, Avatar, Button, Icon, IconButton, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, Checkbox, FileDropzone, EmptyState, Money, Rating, ContractStepper } = window.StairsLifeDesignSystem_075594;

/* ---------------- P3 — Detail lowongan (sisi mahasiswa) ---------------- */
function MhsDetailLowongan({ lowongan, setRute, tersimpan, simpan, dilamar, verifikasi, notify }) {
  const l = lowongan || LOWONGAN_M[0];
  const [tab, setTab] = React.useState("deskripsi");
  const sudah = dilamar.includes(l.id);

  return (
    <>
      <button type="button" onClick={() => setRute("m2")}
        style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", cursor: "pointer", alignSelf: "flex-start" }}>
        <Icon name="ArrowLeft" size={16} />Kembali ke pencarian
      </button>

      <div className="mh-split">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="lg" style={{ gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{l.judul}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 9 }}>
                  <Avatar name={l.bisnis} size="sm" shape="rounded" verified={l.verified} />
                  <span className="sl-caption">{l.bisnis} · {l.verified ? "Terverifikasi" : "Belum terverifikasi"} · {l.lokasi}</span>
                </div>
              </div>
              <IconButton label={tersimpan.includes(l.id) ? "Hapus dari tersimpan" : "Simpan lowongan"} onClick={() => simpan(l.id)}>
                <Icon name="Bookmark" size={18} fill={tersimpan.includes(l.id) ? "currentColor" : "none"} />
              </IconButton>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {l.tags.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
              <FaktaM label="Gaji" value={rpm(l.gaji)} sub={l.satuan} />
              <FaktaM label="Tipe kerja" value={l.tipe} />
              <FaktaM label="Posisi tersedia" value={l.posisi + " orang"} />
              <FaktaM label="Tutup lamaran" value={l.tutup} />
              <FaktaM label="Sudah melamar" value={l.pelamar + " mahasiswa"} />
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 14 }}>
            <Tabs value={tab} onChange={setTab} items={[
              { value: "deskripsi", label: "Deskripsi" },
              { value: "kualifikasi", label: "Kualifikasi" },
              { value: "bisnis", label: "Tentang bisnis" },
            ]} />
            {tab === "deskripsi" && <p className="sl-body" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{l.deskripsi}</p>}
            {tab === "kualifikasi" && <p className="sl-body" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{l.kualifikasi}</p>}
            {tab === "bisnis" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={l.bisnis} size="lg" shape="rounded" verified={l.verified} />
                  <div style={{ minWidth: 0 }}>
                    <b className="sl-body" style={{ color: "var(--text-strong)", display: "block" }}>{l.bisnis}</b>
                    <Rating value={4.7} count={9} size="sm" showValue />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
                  <FaktaM label="Lowongan diposting" value="7 lowongan" />
                  <FaktaM label="Mahasiswa diterima" value="7 orang" />
                  <FaktaM label="Rata-rata membalas" value="Dalam 6 jam" />
                  <FaktaM label="Laporan pengguna" value="Belum pernah" />
                </div>
                <Button variant="secondary" size="sm" style={{ alignSelf: "flex-start" }} iconLeft={<Icon name="ExternalLink" size={15} />}>Lihat profil bisnis</Button>
              </div>
            )}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span className="sl-overline">Gaji ditawarkan</span>
              <Money value={l.gaji} size="lg" />
              <span className="sl-caption">{l.satuan} · dibayar langsung oleh bisnis</span>
            </div>
            {sudah ? (
              <>
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "11px 13px", background: "var(--success-soft)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ flex: "none", color: "var(--success-text)", display: "flex", marginTop: 1 }}><Icon name="CheckCircle2" size={17} /></span>
                  <span className="sl-body-sm" style={{ color: "var(--success-text)", lineHeight: 1.55 }}>Lamaranmu sudah terkirim. Bisnis biasanya membalas dalam 2 hari.</span>
                </div>
                <Button variant="secondary" fullWidth onClick={() => setRute("m4")}>Lihat lamaran saya</Button>
              </>
            ) : verifikasi !== "terverifikasi" ? (
              <>
                <Button fullWidth disabled>Lamar lowongan ini</Button>
                <span className="sl-caption" style={{ textAlign: "center", lineHeight: 1.5 }}>Verifikasi identitas dulu untuk bisa melamar.</span>
                <Button variant="secondary" fullWidth onClick={() => setRute("m9")}>Unggah KTM</Button>
              </>
            ) : (
              <>
                <Button fullWidth onClick={() => setRute("m3")}>Lamar lowongan ini</Button>
                <Button variant="secondary" fullWidth iconLeft={<Icon name="Bookmark" size={16} />} onClick={() => { simpan(l.id); notify({ tone: "info", title: tersimpan.includes(l.id) ? "Dihapus dari tersimpan" : "Lowongan disimpan", description: "Ada di halaman Tersimpan." }); }}>
                  {tersimpan.includes(l.id) ? "Hapus dari tersimpan" : "Simpan dulu"}
                </Button>
                <span className="sl-caption" style={{ textAlign: "center" }}>Melamar tidak dikenakan biaya</span>
              </>
            )}
          </Card>

          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Jangan sampai tertipu</span>
            {[["ShieldCheck", "Semua lowongan direview admin sebelum tayang."],
              ["Ban", "Bisnis tidak boleh meminta uang dengan alasan apa pun."],
              ["Flag", "Menemukan yang mencurigakan? Laporkan, kami periksa dalam 1 hari kerja."]].map(([ikon, teks]) => (
              <div key={teks} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flex: "none", color: "var(--primary)", display: "flex", marginTop: 1 }}><Icon name={ikon} size={16} /></span>
                <span className="sl-caption" style={{ lineHeight: 1.55 }}>{teks}</span>
              </div>
            ))}
            <Button size="sm" variant="ghost" style={{ alignSelf: "flex-start" }} onClick={() => notify({ tone: "info", title: "Laporan terkirim", description: "Tim kami memeriksa lowongan ini dalam 1 hari kerja." })}>Laporkan lowongan ini</Button>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ---------------- M3 — Form lamaran ---------------- */
function MhsFormLamaran({ lowongan, setRute, notify, setDilamar }) {
  const l = lowongan || LOWONGAN_M[0];
  const [surat, setSurat] = React.useState("");
  const [cv, setCv] = React.useState("CV-Rani-Pratiwi-2026.pdf");
  const [jawab, setJawab] = React.useState(["", ""]);
  const [tambahan, setTambahan] = React.useState([]);
  const [setuju, setSetuju] = React.useState(false);
  const [err, setErr] = React.useState("");

  const kirim = () => {
    if (surat.trim().length < 40) { setErr("Tulis minimal 40 karakter — bisnis memilih berdasarkan pesan ini, bukan hanya CV."); return; }
    setErr("");
    setDilamar((v) => [...v, l.id]);
    notify({ tone: "success", title: "Lamaran terkirim", description: l.bisnis + " biasanya membalas dalam 2 hari. Kamu akan dapat notifikasi." });
    setRute("m4");
  };

  return (
    <>
      <button type="button" onClick={() => setRute("det")}
        style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", cursor: "pointer", alignSelf: "flex-start" }}>
        <Icon name="ArrowLeft" size={16} />Kembali ke detail lowongan
      </button>

      <div className="mh-split">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="lg" style={{ gap: 15 }}>
            <div>
              <h3 style={{ fontSize: "var(--text-h3)", color: "var(--text-strong)" }}>Surat lamaran</h3>
              <p className="sl-caption" style={{ marginTop: 3, lineHeight: 1.5 }}>Bagian yang paling menentukan. Bisnis membacanya sebelum membuka CV.</p>
            </div>
            <Textarea label="Pesan untuk bisnis" required rows={7} maxLength={800} showCount value={surat} error={err}
              onChange={(e) => { setSurat(e.target.value); if (err) setErr(""); }}
              placeholder="Ceritakan pengalaman yang paling relevan dan bagaimana kamu akan mengerjakannya."
              hint="Sebutkan karya atau pengalaman nyata — bukan sekadar menyatakan minat." />
          </Card>

          <Card padding="lg" style={{ gap: 15 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>CV &amp; lampiran</h3>
            <Select label="CV yang dikirim" required value={cv} onChange={(e) => setCv(e.target.value)}
              options={["CV-Rani-Pratiwi-2026.pdf", "CV-Rani-Desain-2026.pdf"]} hint="Kelola berkas di halaman Dokumen & CV." />
            <FileDropzone label="Lampiran tambahan (opsional)" hint="Portofolio atau contoh karya · PDF/JPG/PNG maksimal 10 MB" accept=".pdf,.jpg,.png" multiple
              files={tambahan} onRemove={(f) => setTambahan((v) => v.filter((x) => x.name !== f.name))}
              onFiles={(fs) => setTambahan((v) => [...v, ...fs.map((f) => ({ name: f.name, size: (f.size / 1048576).toFixed(1).replace(".", ",") + " MB" }))])} />
          </Card>

          <Card padding="lg" style={{ gap: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
              <h3 style={{ fontSize: "var(--text-h3)" }}>Pertanyaan dari bisnis</h3>
              <span className="sl-caption">wajib dijawab</span>
            </div>
            <Textarea label="Hari apa saja kamu bisa masuk?" required rows={2} maxLength={200} showCount value={jawab[0]} onChange={(e) => setJawab((v) => [e.target.value, v[1]])} />
            <Textarea label="Pernah mengelola akun media sosial bisnis?" required rows={2} maxLength={200} showCount value={jawab[1]} onChange={(e) => setJawab((v) => [v[0], e.target.value])} />
          </Card>

          <Card padding="lg" style={{ gap: 13 }}>
            <Checkbox label="Data yang saya kirim benar dan bisa dipertanggungjawabkan" checked={setuju} onChange={(e) => setSetuju(e.target.checked)}
              description="Bisnis akan melihat nama, institusi, jurusan, rating, dan CV yang kamu pilih. Kontakmu baru terbuka setelah kamu diterima." />
          </Card>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Button onClick={kirim} disabled={!setuju}>Kirim lamaran</Button>
            <Button variant="ghost" onClick={() => setRute("det")}>Batal</Button>
            <span className="sl-caption" style={{ marginLeft: "auto" }}>Tidak ada biaya melamar</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 10 }}>
            <span className="sl-overline">Kamu melamar untuk</span>
            <b style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-body-lg)", color: "var(--text-strong)", lineHeight: 1.25 }}>{l.judul}</b>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={l.bisnis} size="xs" shape="rounded" verified={l.verified} />
              <span className="sl-caption">{l.bisnis}</span>
            </div>
            <Money value={l.gaji} size="md" />
            <span className="sl-caption">{l.satuan} · tutup {l.tutup}</span>
          </Card>

          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Yang dikirim otomatis</span>
            {[["User", "Rani Pratiwi · DKV Universitas Brawijaya"], ["BadgeCheck", "Identitas terverifikasi"], ["Star", "Rating 4,8 dari 23 ulasan"], ["Briefcase", "11 proyek selesai di StairsLife"]].map(([ikon, teks]) => (
              <span key={teks} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex", marginTop: 1 }}><Icon name={ikon} size={15} /></span>
                <span className="sl-caption" style={{ lineHeight: 1.5 }}>{teks}</span>
              </span>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

/* ---------------- M4 — Lamaran saya ---------------- */
function MhsLamaran({ bukaLamaran, setRute }) {
  const [tab, setTab] = React.useState("semua");
  const rows = LAMARAN_M.filter((l) => tab === "semua" || l.st === tab);

  if (!LAMARAN_M.length) {
    return <Card padding="none"><EmptyState size="lg" icon={<Icon name="Send" size={34} strokeWidth={1.5} />} title="Belum ada lamaran" description="Mulai dari mencari lowongan yang cocok dengan keahlianmu." action={<Button onClick={() => setRute("m2")}>Cari lowongan</Button>} /></Card>;
  }

  return (
    <Card padding="lg" style={{ gap: 14 }}>
      <Tabs value={tab} onChange={setTab} items={[
        { value: "semua", label: "Semua", count: LAMARAN_M.length },
        { value: "terkirim", label: "Terkirim" },
        { value: "dilihat", label: "Dilihat", count: 1 },
        { value: "seleksi", label: "Seleksi", count: 1 },
        { value: "diterima", label: "Diterima", count: 1 },
        { value: "ditolak", label: "Ditolak", count: 1 },
      ]} />
      {rows.length === 0 ? (
        <EmptyState icon={<Icon name="Inbox" size={30} strokeWidth={1.5} />} title="Tidak ada lamaran di tab ini" description="Coba tab lain untuk melihat lamaran dengan status berbeda." />
      ) : (
        <DataTable
          columns={[
            { key: "untuk", header: "Lowongan", render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.untuk}<span className="sl-caption" style={{ display: "block" }}>{r.bisnis} · {r.kode}</span></span> },
            { key: "gaji", header: "Gaji", numeric: true, width: 130, render: (r) => <Money value={r.gaji} size="sm" /> },
            { key: "tgl", header: "Dilamar", width: 120 },
            { key: "st", header: "Status", width: 150, render: (r) => <StatusBadge status={r.st} size="sm" /> },
            { key: "aksi", header: "", width: 96, align: "right", render: (r) => <Button size="sm" variant="ghost" onClick={() => bukaLamaran(r)}>Detail</Button> },
          ]}
          rows={rows}
        />
      )}
      <span className="sl-caption" style={{ lineHeight: 1.5 }}>Lamaran yang sudah dikirim tidak bisa diubah. Kamu bisa membatalkannya selama belum diputuskan bisnis.</span>
    </Card>
  );
}

/* ---------------- M5 — Detail lamaran ---------------- */
function MhsDetailLamaran({ lamaran, setRute, notify }) {
  const l = lamaran || LAMARAN_M[0];
  const [batal, setBatal] = React.useState(false);
  const bisaBatal = ["terkirim", "dilihat", "seleksi"].includes(l.st);

  const langkah = [
    { label: "Lamaran dikirim", meta: l.tgl },
    { label: "Dilihat bisnis", meta: l.tahap >= 1 ? "30 Agu 2026" : "" },
    { label: "Tahap seleksi", meta: l.tahap >= 2 ? "01 Sep 2026" : "" },
    { label: l.st === "ditolak" ? "Tidak dilanjutkan" : l.st === "dibatalkan" ? "Dibatalkan olehmu" : "Diterima", meta: l.tahap >= 3 ? "02 Sep 2026" : "", tone: l.st === "ditolak" ? "alert" : undefined },
  ];

  return (
    <>
      <button type="button" onClick={() => setRute("m4")}
        style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", cursor: "pointer", alignSelf: "flex-start" }}>
        <Icon name="ArrowLeft" size={16} />Kembali ke lamaran saya
      </button>

      {l.st === "diterima" && (
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--success-soft)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
          <span style={{ flex: "none", color: "var(--success-text)", display: "flex", marginTop: 1 }}><Icon name="PartyPopper" size={18} /></span>
          <span style={{ flex: 1, minWidth: 200 }}>
            <b className="sl-body-sm" style={{ color: "var(--success-text)", display: "block" }}>Kamu diterima!</b>
            <span className="sl-caption" style={{ color: "var(--success-text)" }}>Kontak {l.bisnis} sudah terbuka di bawah. Hubungi mereka untuk menyepakati jadwal mulai.</span>
          </span>
        </div>
      )}

      <div className="mh-split">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="lg" style={{ gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <span className="sl-overline">{l.kode} · dilamar {l.tgl}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em", marginTop: 4 }}>{l.untuk}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 8 }}>
                  <Avatar name={l.bisnis} size="sm" shape="rounded" verified />
                  <span className="sl-caption">{l.bisnis}</span>
                </div>
              </div>
              <StatusBadge status={l.st} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
              <FaktaM label="Gaji ditawarkan" value={rpm(l.gaji)} />
              <FaktaM label="Status" value={<StatusBadge status={l.st} size="sm" />} />
              <FaktaM label="Kontak bisnis" value={l.st === "diterima" ? "hello@rimbun.co · 0341···7712" : "Terbuka setelah diterima"} />
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 13 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Surat lamaran yang kamu kirim</h3>
            <p className="sl-body" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{l.surat}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex" }}><Icon name="FileText" size={16} /></span>
              <span className="sl-body-sm" style={{ flex: 1, minWidth: 0 }}>CV-Rani-Pratiwi-2026.pdf</span>
              <span className="sl-caption sl-tabular">1,2 MB</span>
            </div>
          </Card>

          {l.alasan && (
            <Card padding="lg" style={{ gap: 10 }}>
              <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Catatan dari bisnis</h3>
              <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.65, padding: "12px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>{l.alasan}</p>
            </Card>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 12 }}>
            <span className="sl-overline">Perjalanan lamaran</span>
            <ContractStepper orientation="vertical" current={l.tahap} steps={langkah} />
          </Card>

          {l.st === "diterima" && (
            <UlasanDuaArah notify={notify} peran="mahasiswa" nama={l.bisnis} lowongan={l.untuk} />
          )}

          {bisaBatal && (
            <Card padding="md" style={{ gap: 11 }}>
              <span className="sl-overline">Berubah pikiran?</span>
              <span className="sl-caption" style={{ lineHeight: 1.55 }}>Kamu bisa membatalkan lamaran selama bisnis belum memutuskan. Membatalkan tidak memengaruhi ratingmu.</span>
              <Button variant="secondary" fullWidth onClick={() => setBatal(true)}>Batalkan lamaran</Button>
            </Card>
          )}
        </div>
      </div>

      <Modal open={batal} onClose={() => setBatal(false)} title="Batalkan lamaran ini?" size="sm" description={l.untuk + " · " + l.bisnis}
        footer={<><Button variant="ghost" onClick={() => setBatal(false)}>Tidak</Button><Button variant="destructive" onClick={() => { setBatal(false); notify({ tone: "info", title: "Lamaran dibatalkan", description: l.bisnis + " diberi tahu bahwa kamu menarik lamaranmu." }); setRute("m4"); }}>Ya, batalkan</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{l.bisnis} akan diberi tahu. Kamu masih bisa melamar lowongan ini lagi selama belum ditutup.</p>
          <Select label="Alasan (opsional)" options={["Sudah dapat pekerjaan lain", "Jadwal tidak cocok", "Gaji tidak sesuai", "Salah melamar", "Alasan lain"]} />
        </div>
      </Modal>
    </>
  );
}

/* ---------------- M6 — Lowongan tersimpan ---------------- */
function MhsTersimpan({ tersimpan, simpan, bukaLowongan, setRute, dilamar }) {
  const rows = LOWONGAN_M.filter((l) => tersimpan.includes(l.id));
  if (!rows.length) {
    return <Card padding="none"><EmptyState size="lg" icon={<Icon name="Bookmark" size={34} strokeWidth={1.5} />} title="Belum ada lowongan tersimpan" description="Tekan ikon penanda di kartu lowongan untuk menyimpannya dan melamar nanti." action={<Button onClick={() => setRute("m2")}>Cari lowongan</Button>} /></Card>;
  }
  return (
    <>
      <span className="sl-caption">{rows.length} lowongan tersimpan · yang akan tutup dalam 3 hari ditandai</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "var(--gap-card)" }}>
        {rows.map((l) => <KartuLowongan key={l.id} l={l} tersimpan={tersimpan} simpan={simpan} onBuka={bukaLowongan} dilamar={dilamar} />)}
      </div>
    </>
  );
}

Object.assign(window, { MhsDetailLowongan, MhsFormLamaran, MhsLamaran, MhsDetailLamaran, MhsTersimpan });
