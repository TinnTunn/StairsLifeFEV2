const { Card, Money, StatusBadge, Tag, Avatar, Button, IconButton, Icon, Tabs, DataTable, Modal, Textarea, Select, Input, FileDropzone, EmptyState, ContractStepper, ChatBubble, MediaSlot, Rating } = window.StairsLifeDesignSystem_075594;

const rpS = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

/* ============================================================
   Sengketa escrow — sisi pengguna (mahasiswa & bisnis).
   Layar ini menjawab satu pertanyaan yang paling menentukan
   kepercayaan: uang saya sekarang di mana, dan kapan diputus.
   ============================================================ */

const SENGKETA = {
  id: "SGK-118",
  kontrak: "KT-2419",
  proyek: "Desain logo & brand kit untuk kedai kopi",
  lawan: "Kopi Senja Malang",
  nominal: 2500000,
  diajukan: "02 Sep 2026",
  olehSaya: true,
  alasan: "Hasil tidak sesuai brief",
  tahap: 2,
  slaHari: 3,
  sisaJam: 34,
  buktiSaya: [
    { name: "brief-awal.pdf", size: "0,4 MB", tgl: "02 Sep" },
    { name: "perbandingan-hasil.png", size: "1,1 MB", tgl: "02 Sep" },
  ],
  buktiLawan: [{ name: "riwayat-revisi.pdf", size: "0,7 MB", tgl: "03 Sep" }],
  kronologi: [
    { dari: "saya", teks: "Saya mengajukan sengketa karena tiga dari empat aset yang diminta di brief tidak diserahkan.", waktu: "02 Sep · 14:12" },
    { dari: "sistem", teks: "Dana Rp 2.500.000 dibekukan di escrow. Kedua pihak tidak bisa menarik dana sampai putusan keluar.", waktu: "02 Sep · 14:12" },
    { dari: "mereka", teks: "Aset keempat sudah kami kirim lewat chat pada 30 Agustus. Kami lampirkan riwayat revisinya.", waktu: "03 Sep · 09:40" },
    { dari: "admin", teks: "Kami sedang memeriksa bukti kedua pihak. Putusan keluar paling lambat 05 Sep 2026.", waktu: "03 Sep · 11:02" },
  ],
};

function KronologiBaris({ k, lawan }) {
  const sistem = k.dari === "sistem" || k.dari === "admin";
  if (sistem) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
        <span style={{ flex: "none", color: k.dari === "admin" ? "var(--primary-text)" : "var(--money-held)", display: "flex", marginTop: 1 }}>
          <Icon name={k.dari === "admin" ? "Scale" : "Lock"} size={15} />
        </span>
        <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="sl-body-sm" style={{ color: "var(--text-body)", lineHeight: 1.55 }}>{k.teks}</span>
          <span className="sl-caption">{k.dari === "admin" ? "Tim moderasi StairsLife" : "Sistem"} · {k.waktu}</span>
        </span>
      </div>
    );
  }
  return <ChatBubble side={k.dari === "saya" ? "right" : "left"} author={k.dari === "saya" ? "Kamu" : lawan} text={k.teks} time={k.waktu} />;
}

function EscrowSengketa({ notify, peran, setRute }) {
  const mahasiswa = peran !== "bisnis";
  const s = SENGKETA;
  const [tambah, setTambah] = React.useState(false);
  const [tarik, setTarik] = React.useState(false);
  const [bukti, setBukti] = React.useState(s.buktiSaya);
  const [pesan, setPesan] = React.useState("");
  const [ditarik, setDitarik] = React.useState(false);

  const langkah = [
    { label: "Sengketa diajukan", meta: s.diajukan },
    { label: "Dana dibekukan", meta: s.diajukan },
    { label: "Bukti dikumpulkan", meta: "Batas 04 Sep" },
    { label: "Diputus admin", meta: "Paling lambat 05 Sep" },
    { label: "Dana dilepas sesuai putusan" },
  ];

  if (ditarik) {
    return (
      <Card padding="none">
        <EmptyState size="lg" icon={<Icon name="CheckCircle2" size={34} strokeWidth={1.5} />}
          title="Sengketa ditarik" description={"Dana " + rpS(s.nominal) + " kembali ke status escrow ditahan dan kontrak berjalan normal. Kamu masih bisa mengajukan sengketa lagi sebelum dana dilepas."}
          action={<Button onClick={() => setRute("kontrak")}>Buka kontrak</Button>} />
      </Card>
    );
  }

  return (
    <>
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--status-escrow-bg)", border: "1px solid var(--status-escrow-bd)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
        <span style={{ flex: "none", color: "var(--money-held)", display: "flex", marginTop: 1 }}><Icon name="Lock" size={18} /></span>
        <span style={{ flex: 1, minWidth: 220 }}>
          <b className="sl-body-sm" style={{ color: "var(--status-escrow-fg)", display: "block" }}>{rpS(s.nominal)} dibekukan sampai putusan keluar</b>
          <span className="sl-caption" style={{ color: "var(--status-escrow-fg)" }}>
            Sejak {s.diajukan}. Tidak ada pihak yang bisa menarik dana ini — termasuk StairsLife.
          </span>
        </span>
        <span style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <b className="sl-tabular" style={{ fontSize: "var(--text-money)", fontWeight: 700, color: "var(--status-escrow-fg)", lineHeight: 1.1 }}>{s.sisaJam} jam</b>
          <span className="sl-caption" style={{ color: "var(--status-escrow-fg)" }}>sisa SLA {s.slaHari} hari kerja</span>
        </span>
      </div>

      <div className="sg-split">
        <style>{".sg-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,320px);gap:var(--gap-card);align-items:start}@media(max-width:900px){.sg-split{grid-template-columns:minmax(0,1fr)}}"}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="lg" style={{ gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <span className="sl-overline">{s.id} · kontrak {s.kontrak}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em", marginTop: 4 }}>{s.proyek}</h2>
                <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 5 }}>
                  {s.olehSaya ? "Diajukan olehmu" : "Diajukan " + s.lawan} pada {s.diajukan} · alasan: {s.alasan}
                </p>
              </div>
              <StatusBadge status="sengketa" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="sl-overline">Dana dibekukan</span>
                <Money value={s.nominal} size="md" tone="held" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="sl-overline">Pihak lain</span>
                <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{s.lawan}</b>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="sl-overline">Batas putusan</span>
                <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>05 Sep 2026</b>
              </div>
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
              <h3 style={{ fontSize: "var(--text-h3)" }}>Kronologi</h3>
              <span className="sl-caption">Semua pesan terlihat admin</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {s.kronologi.map((k, i) => <KronologiBaris key={i} k={k} lawan={s.lawan} />)}
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-end", paddingTop: 6 }}>
              <Input placeholder="Tambahkan keterangan…" value={pesan} style={{ flex: 1, minWidth: 0 }} onChange={(e) => setPesan(e.target.value)} />
              <Button disabled={!pesan.trim()} onClick={() => { setPesan(""); notify({ tone: "success", title: "Keterangan terkirim", description: "Admin dan pihak lain bisa melihatnya." }); }}>Kirim</Button>
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flex: "none" }}>
              <h3 style={{ fontSize: "var(--text-h3)" }}>Bukti</h3>
              <span className="sl-caption">Batas unggah 04 Sep 2026</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="sl-overline">Bukti kamu · {bukti.length}</span>
                {bukti.map((f) => (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                    <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex" }}><Icon name="Paperclip" size={15} /></span>
                    <span className="sl-body-sm" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                    <span className="sl-caption sl-tabular">{f.size}</span>
                  </div>
                ))}
                <Button size="sm" variant="secondary" style={{ alignSelf: "flex-start" }} iconLeft={<Icon name="Upload" size={15} />} onClick={() => setTambah(true)}>Tambah bukti</Button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="sl-overline">Bukti {s.lawan} · {s.buktiLawan.length}</span>
                {s.buktiLawan.map((f) => (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                    <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex" }}><Icon name="Paperclip" size={15} /></span>
                    <span className="sl-body-sm" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                    <Button size="sm" variant="ghost">Lihat</Button>
                  </div>
                ))}
                <span className="sl-caption" style={{ lineHeight: 1.5 }}>Kamu bisa melihat bukti pihak lain supaya bisa menanggapinya — begitu juga sebaliknya.</span>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="md" style={{ gap: 12 }}>
            <span className="sl-overline">Tahap sengketa</span>
            <ContractStepper orientation="vertical" current={s.tahap} steps={langkah} />
          </Card>

          <Card padding="md" style={{ gap: 11 }}>
            <span className="sl-overline">Kemungkinan putusan</span>
            {[["ArrowDownToLine", mahasiswa ? "Dana dilepas penuh ke kamu" : "Dana dikembalikan penuh ke kamu", rpS(s.nominal)],
              ["Split", "Dibagi sebagian sesuai bagian pekerjaan yang selesai", "sebagian"],
              ["Undo2", mahasiswa ? "Dana dikembalikan ke bisnis" : "Dana dilepas ke mahasiswa", rpS(0)]].map(([ikon, teks, nom]) => (
              <div key={teks} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex", marginTop: 1 }}><Icon name={ikon} size={15} /></span>
                <span style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
                  <span className="sl-caption" style={{ lineHeight: 1.5 }}>{teks}</span>
                  <span className="sl-caption sl-tabular" style={{ color: "var(--text-subtle)" }}>{nom}</span>
                </span>
              </div>
            ))}
            <span className="sl-caption" style={{ lineHeight: 1.5, paddingTop: 4, borderTop: "1px solid var(--border-subtle)" }}>
              Putusan admin final. Dana bergerak otomatis dalam 1×24 jam setelah putusan.
            </span>
          </Card>

          {s.olehSaya && (
            <Card padding="md" style={{ gap: 11 }}>
              <span className="sl-overline">Sudah sepakat di luar?</span>
              <span className="sl-caption" style={{ lineHeight: 1.55 }}>
                Kalau kamu dan {s.lawan} sudah menemukan jalan tengah, tarik sengketanya. Dana kembali ke status escrow ditahan dan kontrak berjalan lagi.
              </span>
              <Button variant="secondary" fullWidth onClick={() => setTarik(true)}>Tarik sengketa</Button>
            </Card>
          )}
        </div>
      </div>

      <Modal open={tambah} onClose={() => setTambah(false)} title="Tambah bukti" description={s.id + " · batas unggah 04 Sep 2026"}
        footer={<><Button variant="ghost" onClick={() => setTambah(false)}>Batal</Button><Button onClick={() => { setTambah(false); notify({ tone: "success", title: "Bukti diunggah", description: "Admin dan pihak lain bisa melihatnya." }); }}>Unggah</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FileDropzone label="Berkas bukti" hint="Tangkapan layar chat, brief, atau berkas hasil kerja · maksimal 10 MB per berkas" accept=".pdf,.jpg,.png" multiple
            files={[]} onFiles={(fs) => setBukti((v) => [...v, ...fs.map((f) => ({ name: f.name, size: (f.size / 1048576).toFixed(1).replace(".", ",") + " MB", tgl: "Hari ini" }))])} />
          <Textarea label="Keterangan bukti" rows={3} maxLength={400} showCount placeholder="Jelaskan apa yang ditunjukkan berkas ini dan bagian mana yang perlu diperhatikan admin." />
        </div>
      </Modal>

      <Modal open={tarik} onClose={() => setTarik(false)} title="Tarik sengketa?" size="sm" description={s.id}
        footer={<><Button variant="ghost" onClick={() => setTarik(false)}>Batal</Button><Button onClick={() => { setTarik(false); setDitarik(true); notify({ tone: "success", title: "Sengketa ditarik", description: "Dana kembali ke status escrow ditahan." }); }}>Ya, tarik</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            {rpS(s.nominal)} kembali ke status escrow ditahan dan kontrak berjalan normal. Kamu masih bisa mengajukan sengketa lagi selama dana belum dilepas.
          </p>
          <Select label="Alasan menarik (opsional)" options={["Sudah sepakat dengan pihak lain", "Hasil sudah diperbaiki", "Salah mengajukan", "Alasan lain"]} />
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { EscrowSengketa, SENGKETA, rpS });
