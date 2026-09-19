const { Card, Money, StatusBadge, Tag, Avatar, Rating, Button, Icon, ContractStepper, Modal, Textarea, FileDropzone, Tabs, ChatBubble } = window.StairsLifeDesignSystem_075594;

const LANGKAH_KONTRAK = [
  { label: "Kontrak disepakati", meta: "10 Sep 2026" },
  { label: "Dana masuk escrow", meta: "10 Sep 2026" },
  { label: "Sedang dikerjakan", meta: "Tenggat 20 Sep 2026" },
  { label: "Serah terima" },
  { label: "Review bisnis" },
  { label: "Dana dilepas ke dompet" },
];

function BarisInfo({ label, value, tone }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--border-subtle)" }}>
      <span className="sl-body-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="sl-body-sm sl-tabular" style={{ color: tone || "var(--text-strong)", fontWeight: "var(--weight-medium)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function EscrowKontrak({ peran, notify, setRute }) {
  const mahasiswa = peran !== "bisnis";
  const [tahap, setTahap] = React.useState(2);
  const [modal, setModal] = React.useState(null);
  const [tab, setTab] = React.useState("ringkasan");
  const [berkas, setBerkas] = React.useState([]);

  const serahTerima = () => {
    setTahap(4); setModal(null);
    notify({ tone: "success", title: "Hasil kerja diserahkan", description: "Kopi Senja Malang punya 3 hari untuk review. Dana tetap di escrow sampai disetujui." });
  };
  const setujui = () => {
    setTahap(6); setModal(null);
    notify({ tone: "success", title: "Dana dilepas dari escrow", description: "Rp 2.500.000 masuk ke dompet Rani Pratiwi." });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-block)" }}>
      <style>{".sl-kontrak{display:grid;grid-template-columns:1.55fr 1fr;gap:var(--gap-card);align-items:start}@media(max-width:900px){.sl-kontrak{grid-template-columns:1fr}}"}</style>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="sl-overline">Kontrak SL-2026-0912</span>
          <h2 style={{ fontSize: "var(--text-h1)" }}>Desain logo &amp; brand kit untuk kedai kopi</h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <StatusBadge status={tahap >= 6 ? "selesai" : tahap >= 4 ? "menunggu_review" : "escrow_ditahan"} />
            <span className="sl-caption">Dibuat 10 Sep 2026 · tenggat 20 Sep 2026</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" iconLeft={<Icon name="MessageSquare" size={17} />} onClick={() => setRute("chat")}>Chat</Button>
          <Button variant="destructive" iconLeft={<Icon name="Scale" size={17} />} onClick={() => setModal("sengketa")}>Ajukan sengketa</Button>
        </div>
      </div>

      <div className="sl-kontrak">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)" }}>
          <Card padding="lg" style={{ gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span className="sl-overline">Progres &amp; status dana</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--money-held)" }}><Icon name="ShieldCheck" size={16} /><span className="sl-caption" style={{ color: "var(--text-muted)" }}>Dijamin escrow StairsLife</span></span>
            </div>
            <ContractStepper orientation="vertical" current={tahap} steps={LANGKAH_KONTRAK} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
              {mahasiswa ? (
                <Button disabled={tahap >= 4} onClick={() => setModal("serah")} iconLeft={<Icon name="Upload" size={17} />}>Serahkan hasil kerja</Button>
              ) : (
                <Button disabled={tahap < 4 || tahap >= 6} onClick={() => setModal("setujui")} iconLeft={<Icon name="ShieldCheck" size={17} />}>Setujui &amp; lepas dana</Button>
              )}
              <Button variant="secondary" iconLeft={<Icon name="FileText" size={17} />}>Unduh kontrak (PDF)</Button>
            </div>
          </Card>

          <Card padding="lg" style={{ gap: 12 }}>
            <Tabs value={tab} onChange={setTab} items={[{ value: "ringkasan", label: "Ruang lingkup" }, { value: "berkas", label: "Berkas", count: 3 }, { value: "aktivitas", label: "Aktivitas" }]} />
            {tab === "ringkasan" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p className="sl-body" style={{ color: "var(--text-body)" }}>Logo utama, versi horizontal, dan versi monokrom. Brand kit berisi palet warna, tipografi, dan contoh penerapan di cangkir, papan nama, serta feed Instagram. Dua kali revisi besar termasuk dalam harga.</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{["Logo", "Branding", "Illustrator"].map((t) => <Tag key={t}>{t}</Tag>)}</div>
              </div>
            )}
            {tab === "berkas" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["brief-kopi-senja.pdf", "820 KB", "10 Sep 2026"], ["logo-kopi-senja-v1.pdf", "1,4 MB", "15 Sep 2026"], ["logo-kopi-senja-v2.pdf", "1,8 MB", "17 Sep 2026"]].map(([n, s, d]) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                    <Icon name="FileText" size={17} />
                    <span style={{ flex: 1, minWidth: 0 }}><b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{n}</b><div className="sl-caption">{d}</div></span>
                    <span className="sl-caption sl-tabular">{s}</span>
                    <Button size="sm" variant="ghost" iconLeft={<Icon name="Download" size={15} />}>Unduh</Button>
                  </div>
                ))}
              </div>
            )}
            {tab === "aktivitas" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ChatBubble system>Rp 2.500.000 masuk escrow · 10 Sep 2026 14:02</ChatBubble>
                <ChatBubble system>Revisi pertama dikirim · 17 Sep 2026 09:41</ChatBubble>
                <ChatBubble system>Tenggat diperpanjang 2 hari atas kesepakatan kedua pihak · 18 Sep 2026</ChatBubble>
              </div>
            )}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card)" }}>
          <Card padding="lg" style={{ gap: 10 }}>
            <span className="sl-overline">Rincian dana</span>
            <Money value={2500000} size="lg" tone="held" label="Ditahan di escrow" />
            <div style={{ marginTop: 6 }}>
              <BarisInfo label="Nilai kontrak" value="Rp 2.500.000" />
              <BarisInfo label="Biaya layanan (5%)" value="− Rp 125.000" tone="var(--text-muted)" />
              <BarisInfo label={mahasiswa ? "Diterima kamu" : "Diterima mahasiswa"} value="Rp 2.375.000" tone="var(--money-in)" />
              <BarisInfo label="Metode" value="BCA Virtual Account" />
              <BarisInfo label="Dilepas otomatis" value="3 hari setelah serah terima" />
            </div>
            <p className="sl-caption">Dana tidak bisa ditarik kedua pihak sebelum tahap review selesai atau sengketa diputuskan admin.</p>
          </Card>

          <Card padding="lg" style={{ gap: 12 }}>
            <span className="sl-overline">{mahasiswa ? "Pemberi proyek" : "Mahasiswa"}</span>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar name={mahasiswa ? "Kopi Senja Malang" : "Rani Pratiwi"} size="lg" shape={mahasiswa ? "rounded" : "circle"} verified />
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <b className="sl-body" style={{ color: "var(--text-strong)" }}>{mahasiswa ? "Kopi Senja Malang" : "Rani Pratiwi"}</b>
                <span className="sl-caption">{mahasiswa ? "UMKM · Malang · 7 proyek selesai" : "DKV · Universitas Brawijaya"}</span>
                <Rating value={mahasiswa ? 4.7 : 4.8} count={mahasiswa ? 9 : 23} size="sm" />
              </div>
            </div>
            <Button variant="secondary" fullWidth onClick={() => setRute("chat")} iconLeft={<Icon name="MessageSquare" size={17} />}>Kirim pesan</Button>
          </Card>
        </div>
      </div>

      <Modal open={modal === "serah"} onClose={() => setModal(null)} title="Serahkan hasil kerja?"
        description="Setelah diserahkan, Kopi Senja Malang punya 3 hari untuk review. Dana tetap ditahan sampai mereka setuju."
        footer={<><Button variant="secondary" onClick={() => setModal(null)}>Batal</Button><Button onClick={serahTerima}>Serahkan hasil</Button></>}>
        <FileDropzone label="Berkas hasil akhir" hint="PNG, JPG, PDF, atau ZIP · maksimal 25 MB" files={berkas} onFiles={(f) => setBerkas(f.map((x) => ({ name: x.name, size: "—" })))} onRemove={() => setBerkas([])} />
        <Textarea label="Catatan untuk bisnis" rows={3} placeholder="Sudah termasuk versi monokrom dan contoh penerapan di cangkir." />
      </Modal>

      <Modal open={modal === "setujui"} onClose={() => setModal(null)} tone="success" dismissible={false} title="Setujui hasil kerja?"
        description="Setelah disetujui, Rp 2.500.000 langsung dilepas ke dompet Rani dan tidak bisa ditarik kembali."
        footer={<><Button variant="secondary" onClick={() => setModal(null)}>Minta revisi</Button><Button onClick={setujui}>Setujui &amp; lepas dana</Button></>}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 14, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
          <Money value={2500000} size="sm" tone="held" label="Ditahan di escrow" />
          <Money value={2375000} size="sm" tone="in" label="Diterima Rani" />
        </div>
      </Modal>

      <Modal open={modal === "sengketa"} onClose={() => setModal(null)} tone="danger" title="Ajukan sengketa?"
        description="Dana tetap ditahan di escrow sampai admin memutuskan. Biasanya selesai dalam 3 hari kerja."
        footer={<><Button variant="secondary" onClick={() => setModal(null)}>Batal</Button><Button variant="destructive" onClick={() => { setModal(null); setTahap(3); notify({ tone: "warning", title: "Sengketa diajukan", description: "Admin akan menghubungi kedua pihak dalam 1×24 jam." }); }}>Ajukan sengketa</Button></>}>
        <Textarea label="Ceritakan yang terjadi" rows={4} maxLength={800} showCount placeholder="Hasil belum sesuai brief pada bagian palet warna, dan revisi kedua belum dikirim sejak 3 hari lalu." />
      </Modal>
    </div>
  );
}

Object.assign(window, { EscrowKontrak });
