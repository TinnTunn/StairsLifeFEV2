const { Sidebar, BottomNav, Icon, IconButton, Avatar, Button, Toast, ToastStack, SearchField, StatusBadge, NotificationCenter } = window.StairsLifeDesignSystem_075594;

const BI = (n, s) => <Icon name={n} size={s || 18} />;

const NOTIF_PANEL_BIZ = [
  { id: 1, ikon: "MessageSquare", tone: "primary", unread: true, href: "chat",
    title: "Rani Pratiwi mengirim pesan", description: "“Untuk kalender kontennya mau bulanan atau mingguan?”", time: "8 menit lalu" },
  { id: 2, ikon: "Users", tone: "primary", unread: true, href: "b5",
    title: "5 pelamar baru di Konten Instagram 12 post", time: "12 menit lalu" },
  { id: 3, ikon: "ShieldCheck", tone: "success", unread: true, href: "b4",
    title: "Lowongan Fotografer produk katalog disetujui admin", time: "2 jam lalu" },
  { id: 4, ikon: "XCircle", tone: "danger", unread: true, href: "b2",
    title: "Lowongan Fotografer — hubungi WA ditolak admin", description: "Alasan: mengarahkan pelamar ke kontak luar platform", time: "Kemarin" },
  { id: 5, ikon: "ArrowLeftRight", tone: "success", unread: false, href: "b10",
    title: "Dana Rp 1.200.000 dilepas ke Dimas Ardi", description: "Biaya layanan Rp 60.000 dipotong", time: "24 Agu 2026" },
];

function navBisnis() {
  return [
    { value: "b1", label: "Dashboard", icon: BI("LayoutDashboard") },
    { section: "Lowongan" },
    { value: "b2", label: "Kelola lowongan", icon: BI("Briefcase") },
    { value: "b3", label: "Buat lowongan", icon: BI("Plus") },
    { section: "Pelamar" },
    { value: "b7", label: "Semua pelamar", icon: BI("Users"), badge: 12 },
    { value: "chat", label: "Pesan", icon: BI("MessageSquare"), badge: 3 },
    { section: "Escrow" },
    { value: "kontrak", label: "Kontrak berjalan", icon: BI("FileText"), badge: 1 },
    { value: "dompet", label: "Dana & escrow", icon: BI("Wallet") },
    { value: "sengketa", label: "Sengketa", icon: BI("Scale") },
    { section: "Akun" },
    { value: "b8", label: "Profil bisnis", icon: BI("Store") },
    { value: "b9", label: "Biaya layanan", icon: BI("Receipt") },
    { value: "b10", label: "Riwayat pembayaran", icon: BI("ArrowLeftRight") },
    { value: "b11", label: "Notifikasi", icon: BI("Bell"), badge: 5 },
    { value: "b12", label: "Pengaturan", icon: BI("Settings") },
  ];
}

function bottomBisnis() {
  return [
    { value: "b1", label: "Beranda", icon: BI("Home", 21) },
    { value: "b2", label: "Lowongan", icon: BI("Briefcase", 21) },
    { value: "b3", label: "Buat", icon: BI("Plus", 21) },
    { value: "b7", label: "Pelamar", icon: BI("Users", 21), badge: 12 },
    { value: "chat", label: "Pesan", icon: BI("MessageSquare", 21), badge: 3 },
  ];
}

const JUDUL_B = {
  b1: ["Dashboard", "B1"], b2: ["Kelola lowongan", "B2"], b3: ["Buat lowongan", "B3"],
  b4: ["Detail lowongan", "B4"], b5: ["Daftar pelamar", "B5"], b6: ["Detail pelamar", "B6"],
  b7: ["Semua pelamar", "B7 · lintas lowongan"], b8: ["Profil bisnis", "B8"],
  b9: ["Biaya layanan", "B9 · komisi 5% saat dana dilepas"], b10: ["Riwayat pembayaran", "B10"],
  b11: ["Notifikasi", "B11"], b12: ["Pengaturan akun", "B12"],
  chat: ["Pesan", "Terbuka setelah pelamar diterima"],
  kontrak: ["Kontrak & escrow", "Dana kamu ditahan sampai hasil disetujui"],
  dompet: ["Dana & escrow", "Yang ditahan dan yang sudah dilepas"],
  sengketa: ["Sengketa", "Mediasi StairsLife · SLA 3 hari kerja"],
};

function BusinessShell() {
  const [rute, setRute] = React.useState("b1");
  const [tema, setTema] = React.useState("light");
  const [terverifikasi, setTerverifikasi] = React.useState(true);
  const [lowongan, setLowongan] = React.useState(null);
  const [pelamar, setPelamar] = React.useState(null);
  const [menu, setMenu] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => { document.documentElement.setAttribute("data-theme", tema); }, [tema]);

  const notify = (t) => {
    const id = Date.now();
    setToasts((v) => [...v, { ...t, id }]);
    setTimeout(() => setToasts((v) => v.filter((x) => x.id !== id)), 4200);
  };
  // Drawer selalu tertutup setelah memilih rute; di desktop tidak berpengaruh.
  const pilihRute = (r) => { setRute(r); setMenu(false); };
  const bukaLowongan = (l) => { setLowongan(l); setRute("b4"); setMenu(false); };
  const bukaPelamar = (p) => { setPelamar(p); setRute("b6"); setMenu(false); };
  const ctx = { rute, setRute: pilihRute, notify, lowongan, pelamar, bukaLowongan, bukaPelamar, terverifikasi, setTerverifikasi };
  const [judul, sub] = JUDUL_B[rute] || ["Bisnis", ""];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-page)" }}>
      <style>{`
        .bz-side{height:100%;flex:none}
        .bz-bottom{display:none}
        .bz-brand{display:none}
        .bz-menu{display:none}
        .bz-scrim{display:none}
        /* Di bawah 1024px sidebar menjadi drawer off-canvas, BUKAN display:none.
           Bottom nav 5 slot hanya memuat tujuan utama; rute seperti Tersimpan,
           Dokumen, dan Pengaturan hanya ada di sidebar — menyembunyikannya
           membuat halaman itu tak terjangkau di perangkat utama. */
        @media(max-width:1023px){
          .bz-bottom{display:block}
          .bz-brand{display:flex}
          .bz-menu{display:inline-flex}
          .bz-side{position:fixed;inset:0 auto 0 0;z-index:45;width:264px;
            box-shadow:var(--shadow-lg);transform:translateX(-100%);
            transition:transform var(--duration-base) var(--ease-out)}
          .bz-side[data-open="true"]{transform:translateX(0)}
          .bz-scrim{display:block;position:fixed;inset:0;z-index:44;
            background:var(--bg-overlay);opacity:0;pointer-events:none;
            transition:opacity var(--duration-base) var(--ease-out)}
          .bz-scrim[data-open="true"]{opacity:1;pointer-events:auto}
        }
        .bz-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--gap-card)}
        .bz-two{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:var(--gap-card);align-items:start}
        .bz-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,340px);gap:var(--gap-card);align-items:start}
        @media(max-width:900px){.bz-two,.bz-split{grid-template-columns:minmax(0,1fr)}}
      `}</style>

      <div className="bz-scrim" data-open={String(menu)} onClick={() => setMenu(false)} aria-hidden="true"></div>

      <div className="bz-side" data-open={String(menu)}>
        <Sidebar role="Bisnis" active={rute} onNavigate={pilihRute} items={navBisnis()} style={{ height: "100%" }}
          brand={<><img src="../../assets/logo-mark-wood.svg" width="20" height="20" alt="" style={{ display: "block", flex: "none" }} /><b style={{ fontFamily: "var(--font-display)", fontSize: 15.5, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>StairsLife</b></>}
          footer={<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}><Avatar name="Kopi Senja Malang" size="sm" shape="rounded" verified={terverifikasi} /><span style={{ flex: 1, minWidth: 0 }}><b className="sl-body-sm" style={{ display: "block", color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Kopi Senja Malang</b><span className="sl-caption">{terverifikasi ? "Terverifikasi" : "Belum terverifikasi"}</span></span></div>} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <header style={{ flex: "none", minHeight: "var(--height-topbar)", display: "flex", alignItems: "center", gap: 12, paddingInline: "var(--pad-page-x)", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
          <IconButton className="bz-menu" label="Buka menu navigasi" onClick={() => setMenu(true)}>
            <Icon name="Menu" size={19} />
          </IconButton>
          <span className="bz-brand" style={{ alignItems: "center", gap: 8 }}><img src="../../assets/logo-mark-wood.svg" width="20" height="20" alt="" style={{ display: "block" }} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: "var(--text-h2)", color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{judul}</h1>
            {sub && <span className="sl-caption" style={{ display: "block" }}>{sub}</span>}
          </span>
          <NotificationCenter live items={NOTIF_PANEL_BIZ.map((n) => ({ ...n, icon: <Icon name={n.ikon} size={16} /> }))} onSeeAll={() => setRute("b11")}
            onOpenItem={(n) => setRute(n.href || "b11")} onMarkAllRead={() => notify({ tone: "info", title: "Semua ditandai dibaca" })} />
          <IconButton label="Ganti mode terang/gelap" onClick={() => setTema(tema === "dark" ? "light" : "dark")}>
            <Icon name={tema === "dark" ? "Sun" : "Moon"} size={18} />
          </IconButton>
          <button type="button" onClick={() => setTerverifikasi(!terverifikasi)}
            style={{ minHeight: 32, padding: "0 10px", border: "1px solid var(--border-default)", background: "var(--bg-surface)", color: "var(--text-muted)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 11.5, cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>
            {terverifikasi ? "Simulasi: belum terverifikasi" : "Simulasi: terverifikasi"}
          </button>
        </header>

        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingTop: "var(--pad-page-y)", paddingInline: "var(--pad-page-x)", paddingBottom: "var(--pad-page-bottom)" }}>
          <div style={{ maxWidth: "var(--width-container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--gap-block)" }}>
            {!terverifikasi && rute !== "b8" && (
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--warning-soft)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
                <span style={{ flex: "none", color: "var(--warning-text)", display: "flex", marginTop: 1 }}><Icon name="AlertTriangle" size={18} /></span>
                <span style={{ flex: 1, minWidth: 200 }}>
                  <b className="sl-body-sm" style={{ color: "var(--warning-text)", display: "block" }}>Profil bisnismu belum diverifikasi</b>
                  <span className="sl-caption" style={{ color: "var(--warning-text)" }}>Kamu tetap bisa menyusun draft lowongan, tapi belum bisa menayangkannya sampai dokumen legalitas disetujui.</span>
                </span>
                <Button size="sm" variant="secondary" style={{ flex: "none" }} onClick={() => setRute("b8")}>Unggah dokumen</Button>
              </div>
            )}
            {rute === "b1" && <BizDashboard {...ctx} />}
            {rute === "b2" && <BizKelolaLowongan {...ctx} />}
            {rute === "b3" && <BizBuatLowongan {...ctx} />}
            {rute === "b4" && <BizDetailLowongan {...ctx} />}
            {rute === "b5" && <BizPelamar {...ctx} />}
            {rute === "b6" && <BizDetailPelamar {...ctx} />}
            {rute === "b7" && <BizPelamar {...ctx} semua />}
            {rute === "b8" && <BizProfil {...ctx} />}
            {rute === "b9" && <BizBiaya {...ctx} />}
            {rute === "b10" && <BizTransaksi {...ctx} />}
            {rute === "chat" && <ChatJobBoard notify={notify} peran="bisnis" />}
            {rute === "kontrak" && <EscrowKontrak peran="bisnis" notify={notify} setRute={pilihRute} />}
            {rute === "dompet" && <EscrowDompet peran="bisnis" notify={notify} />}
            {rute === "sengketa" && <EscrowSengketa peran="bisnis" notify={notify} setRute={pilihRute} />}
            {rute === "b11" && <BizNotifikasi {...ctx} />}
            {rute === "b12" && <BizPengaturan {...ctx} />}
          </div>
        </main>

        <div className="bz-bottom"><BottomNav active={rute} onNavigate={pilihRute} items={bottomBisnis()} /></div>
      </div>

      <ToastStack>{toasts.map((t) => <Toast key={t.id} tone={t.tone} title={t.title} description={t.description} onClose={() => setToasts((v) => v.filter((x) => x.id !== t.id))} />)}</ToastStack>
    </div>
  );
}

Object.assign(window, { BusinessShell });
