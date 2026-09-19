const { Card, Money, StatusBadge, Tag, Avatar, Button, IconButton, Icon, Tabs, DataTable, Pagination, Modal, Textarea, Select, Input, RadioCard, EmptyState, ContractStepper, ChatBubble, MetricCard, MediaSlot } = window.StairsLifeDesignSystem_075594;

const rpD = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

/* ============================================================
   A15 — Panel sengketa escrow (admin).
   Berbeda dari A9: A9 memutus KONTEN (lowongan, akun), ini memutus
   UANG. Layar sendiri karena butuh bukti kedua pihak berdampingan,
   riwayat dana, dan tiga pilihan putusan dengan nominal eksplisit.
   ============================================================ */

const SENGKETA_ADMIN = [
  { id: "SGK-118", kontrak: "KT-2419", proyek: "Desain logo & brand kit untuk kedai kopi",
    mahasiswa: "Rani Pratiwi", bisnis: "Kopi Senja Malang", nominal: 2500000,
    diajukan: "02 Sep 2026", oleh: "mahasiswa", alasan: "Hasil tidak sesuai brief",
    umur: "4 hari", sla: "lewat", buktiM: 2, buktiB: 1,
    ringkasM: "Tiga dari empat aset yang diminta di brief tidak diserahkan. Saya lampirkan brief awal dan perbandingan hasil.",
    ringkasB: "Aset keempat sudah dikirim lewat chat pada 30 Agustus. Riwayat revisi kami lampirkan." },
  { id: "SGK-117", kontrak: "KT-2402", proyek: "Konten Instagram 12 post — Batik Ayu",
    mahasiswa: "Dimas Ardi", bisnis: "Batik Ayu Nusantara", nominal: 1800000,
    diajukan: "04 Sep 2026", oleh: "bisnis", alasan: "Tenggat terlewat lebih dari 7 hari",
    umur: "2 hari", sla: "aman", buktiM: 1, buktiB: 3,
    ringkasM: "Saya terlambat empat hari karena laptop rusak, tapi seluruh 12 post sudah diserahkan.",
    ringkasB: "Tenggat 28 Agustus, hasil baru masuk 01 September. Kampanye promo kami sudah lewat." },
  { id: "SGK-115", kontrak: "KT-2388", proyek: "Video profil UMKM — Tahu Pong Semarang",
    mahasiswa: "Sekar Ayu", bisnis: "Tahu Pong Semarang", nominal: 3200000,
    diajukan: "05 Sep 2026", oleh: "mahasiswa", alasan: "Bisnis tidak merespons serah terima",
    umur: "1 hari", sla: "aman", buktiM: 3, buktiB: 0,
    ringkasM: "Hasil sudah diserahkan 30 Agustus dan saya menagih review empat kali lewat chat, tidak dibalas.",
    ringkasB: "Belum ada tanggapan dari bisnis." },
];

function PihakKolom({ peran, nama, ringkas, bukti, nominal, sorot }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11, padding: 15, background: sorot ? "var(--bg-subtle)" : "var(--bg-surface)", border: "1px solid " + (sorot ? "var(--border-default)" : "var(--border-subtle)"), borderRadius: "var(--radius-md)", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={nama} size="sm" shape={peran === "bisnis" ? "rounded" : "circle"} verified />
        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{nama}</b>
          <span className="sl-caption">{peran === "bisnis" ? "Bisnis" : "Mahasiswa"}{sorot ? " · pengaju" : ""}</span>
        </span>
      </div>
      <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{ringkas}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 9, paddingTop: 9, borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex" }}><Icon name="Paperclip" size={14} /></span>
        <span className="sl-caption" style={{ flex: 1 }}>{bukti} berkas bukti</span>
        {bukti > 0 && <Button size="sm" variant="ghost">Periksa</Button>}
      </div>
    </div>
  );
}

function AdminSengketa({ notify }) {
  const [tab, setTab] = React.useState("terbuka");
  const [aktif, setAktif] = React.useState(SENGKETA_ADMIN[0]);
  const [putus, setPutus] = React.useState(false);
  const [pilihan, setPilihan] = React.useState("mahasiswa");
  const [bagi, setBagi] = React.useState("1250000");
  const [alasan, setAlasan] = React.useState("");
  const [err, setErr] = React.useState("");
  const [selesai, setSelesai] = React.useState([]);

  const sisa = SENGKETA_ADMIN.filter((s) => !selesai.includes(s.id));
  const totalDibekukan = sisa.reduce((t, s) => t + s.nominal, 0);
  const s = aktif;
  const nBagi = Number(bagi) || 0;

  const kirimPutusan = () => {
    if (alasan.trim().length < 20) { setErr("Tulis dasar putusan minimal 20 karakter — ini yang dibaca kedua pihak dan menjadi catatan audit."); return; }
    setErr("");
    setPutus(false);
    setSelesai((v) => [...v, s.id]);
    const teks = pilihan === "mahasiswa" ? "Dana dilepas penuh ke " + s.mahasiswa
      : pilihan === "bisnis" ? "Dana dikembalikan penuh ke " + s.bisnis
      : rpD(nBagi) + " ke " + s.mahasiswa + ", sisanya ke " + s.bisnis;
    notify({ tone: "success", title: "Putusan dikirim", description: teks + ". Dana bergerak otomatis dalam 1×24 jam." });
    const berikut = sisa.filter((x) => x.id !== s.id)[0];
    if (berikut) setAktif(berikut);
  };

  if (!sisa.length) {
    return (
      <Card padding="none">
        <EmptyState size="lg" icon={<Icon name="Scale" size={34} strokeWidth={1.5} />}
          title="Tidak ada sengketa terbuka" description="Semua sengketa escrow sudah diputus. Dana yang tertahan sudah bergerak sesuai putusan." />
      </Card>
    );
  }

  return (
    <>
      <div className="ad-grid">
        <MetricCard label="Dana dibekukan sengketa" value={rpD(totalDibekukan)} icon={<Icon name="Lock" size={19} />} />
        <MetricCard label="Sengketa terbuka" value={String(sisa.length)} iconTone="warning" icon={<Icon name="Scale" size={19} />} />
        <MetricCard label="Melewati SLA" value="1" delta={-1} iconTone="warning" icon={<Icon name="AlarmClock" size={19} />} />
        <MetricCard label="Diputus bulan ini" value="7" delta={17} iconTone="success" icon={<Icon name="Gavel" size={19} />} />
      </div>

      <div className="ad-split">
        <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span className="sl-overline">Antrean · {sisa.length}</span>
            <span className="sl-caption">urut terlama</span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {sisa.map((x) => (
              <li key={x.id}>
                <button type="button" onClick={() => setAktif(x)}
                  style={{ width: "100%", display: "flex", flexDirection: "column", gap: 5, padding: "11px 11px", borderRadius: "var(--radius-md)", border: 0, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", background: x.id === aktif.id ? "var(--primary-soft)" : "transparent", transition: "var(--transition-color)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                    <b className="sl-body-sm" style={{ flex: 1, minWidth: 0, color: x.id === aktif.id ? "var(--primary-text)" : "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.id}</b>
                    {x.sla === "lewat" && <span className="sl-caption" style={{ flex: "none", color: "var(--danger-text)", fontWeight: 600 }}>Lewat SLA</span>}
                  </span>
                  <span className="sl-caption" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{x.proyek}</span>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 8, width: "100%" }}>
                    <span className="sl-caption sl-tabular" style={{ flex: 1, color: "var(--money-held)", fontWeight: 600 }}>{rpD(x.nominal)}</span>
                    <span className="sl-caption" style={{ flex: "none" }}>{x.umur}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)", minWidth: 0 }}>
          <Card padding="lg" style={{ gap: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <span className="sl-overline">{s.id} · kontrak {s.kontrak} · diajukan {s.diajukan}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-strong)", marginTop: 4 }}>{s.proyek}</h3>
                <p className="sl-caption" style={{ marginTop: 5 }}>Alasan pengaju: {s.alasan}</p>
              </div>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <StatusBadge status="sengketa" />
                {s.sla === "lewat" && <span className="sl-caption" style={{ color: "var(--danger-text)", fontWeight: 600 }}>Melewati SLA 3 hari</span>}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", background: "var(--status-escrow-bg)", border: "1px solid var(--status-escrow-bd)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
              <span style={{ flex: "none", color: "var(--money-held)", display: "flex" }}><Icon name="Lock" size={17} /></span>
              <span style={{ flex: 1, minWidth: 160 }}>
                <b className="sl-body-sm" style={{ color: "var(--status-escrow-fg)", display: "block" }}>{rpD(s.nominal)} dibekukan di escrow</b>
                <span className="sl-caption" style={{ color: "var(--status-escrow-fg)" }}>Bergerak otomatis 1×24 jam setelah putusan</span>
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 13 }}>
              <PihakKolom peran="mahasiswa" nama={s.mahasiswa} ringkas={s.ringkasM} bukti={s.buktiM} nominal={s.nominal} sorot={s.oleh === "mahasiswa"} />
              <PihakKolom peran="bisnis" nama={s.bisnis} ringkas={s.ringkasB} bukti={s.buktiB} nominal={s.nominal} sorot={s.oleh === "bisnis"} />
            </div>

            <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center" }}>
              <Button onClick={() => setPutus(true)} iconLeft={<Icon name="Gavel" size={16} />}>Putuskan sengketa</Button>
              <Button variant="secondary">Minta keterangan tambahan</Button>
              <Button variant="ghost">Buka kontrak</Button>
              <span className="sl-caption" style={{ marginLeft: "auto" }}>Putusan final, tercatat di log audit</span>
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 13 }}>
            <h3 style={{ fontSize: "var(--text-h3)", flex: "none" }}>Riwayat dana kontrak {s.kontrak}</h3>
            <DataTable
              columns={[
                { key: "tgl", header: "Tanggal", width: 120 },
                { key: "kejadian", header: "Kejadian" },
                { key: "nominal", header: "Nominal", numeric: true, width: 140, render: (r) => <Money value={r.nominal} size="sm" tone={r.tone} /> },
                { key: "saldo", header: "Ditahan", numeric: true, width: 140, render: (r) => <span className="sl-tabular sl-body-sm">{rpD(r.saldo)}</span> },
              ]}
              rows={[
                { id: 1, tgl: "10 Sep 2026", kejadian: "Bisnis menyetor ke escrow", nominal: s.nominal, tone: "in", saldo: s.nominal },
                { id: 2, tgl: "10 Sep 2026", kejadian: "Kontrak dimulai — dana ditahan", nominal: 0, tone: "held", saldo: s.nominal },
                { id: 3, tgl: "30 Agu 2026", kejadian: "Mahasiswa menyerahkan hasil", nominal: 0, tone: "held", saldo: s.nominal },
                { id: 4, tgl: s.diajukan, kejadian: "Sengketa diajukan — dana dibekukan", nominal: 0, tone: "held", saldo: s.nominal },
              ]}
            />
          </Card>
        </div>
      </div>

      <Modal open={putus} onClose={() => setPutus(false)} title="Putuskan sengketa" description={s.id + " · " + rpD(s.nominal) + " dibekukan"}
        footer={<><Button variant="ghost" onClick={() => setPutus(false)}>Batal</Button><Button onClick={kirimPutusan}>Kirim putusan</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-semibold)", color: "var(--text-body)" }}>
              Ke mana dana dilepas? <span style={{ color: "var(--danger-text)" }}>*</span>
            </span>
            <RadioCard name="putusan" label={"Penuh ke " + s.mahasiswa} description="Pekerjaan dinilai selesai sesuai kesepakatan."
              price={rpD(s.nominal)} checked={pilihan === "mahasiswa"} onChange={() => setPilihan("mahasiswa")} />
            <RadioCard name="putusan" label="Dibagi sebagian" description="Sebagian pekerjaan selesai. Tentukan nominal untuk mahasiswa; sisanya kembali ke bisnis."
              price="atur nominal" checked={pilihan === "bagi"} onChange={() => setPilihan("bagi")} />
            <RadioCard name="putusan" label={"Penuh ke " + s.bisnis} description="Pekerjaan dinilai tidak diserahkan atau tidak sesuai kesepakatan."
              price={rpD(s.nominal)} checked={pilihan === "bisnis"} onChange={() => setPilihan("bisnis")} />
          </div>

          {pilihan === "bagi" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: "13px 15px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <Input label={"Untuk " + s.mahasiswa} required numeric prefix="Rp" value={bagi}
                onChange={(e) => setBagi(e.target.value.replace(/\D/g, ""))} hint={nBagi ? rpD(nBagi) : "Masukkan nominal tanpa titik"} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", paddingTop: 9, borderTop: "1px solid var(--border-subtle)" }}>
                <span className="sl-body-sm" style={{ color: "var(--text-muted)" }}>Kembali ke {s.bisnis}</span>
                <b className="sl-tabular sl-body-sm" style={{ color: "var(--text-strong)" }}>{rpD(Math.max(0, s.nominal - nBagi))}</b>
              </div>
              {nBagi > s.nominal && <span style={{ fontSize: "var(--text-caption)", color: "var(--danger-text)" }}>Nominal melebihi dana yang dibekukan.</span>}
            </div>
          )}

          <Textarea label="Dasar putusan" required rows={4} maxLength={600} showCount value={alasan} error={err}
            onChange={(e) => { setAlasan(e.target.value); if (err) setErr(""); }}
            placeholder="Sebutkan bukti mana yang menjadi dasar dan bagian kesepakatan mana yang dilanggar atau dipenuhi."
            hint="Dikirim ke kedua pihak dan tercatat permanen di log audit. Putusan tanpa dasar yang jelas adalah keluhan nomor satu di platform sejenis." />

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "11px 13px", background: "var(--warning-soft)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)" }}>
            <span style={{ flex: "none", color: "var(--warning-text)", display: "flex", marginTop: 1 }}><Icon name="AlertTriangle" size={16} /></span>
            <span className="sl-caption" style={{ color: "var(--warning-text)", lineHeight: 1.55 }}>
              Putusan tidak bisa dibatalkan. Dana bergerak otomatis dalam 1×24 jam dan kedua pihak langsung diberi tahu beserta dasar putusannya.
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { AdminSengketa, SENGKETA_ADMIN, rpD });
