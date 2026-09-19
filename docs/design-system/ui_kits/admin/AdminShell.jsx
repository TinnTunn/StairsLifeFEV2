const { Sidebar, Icon, IconButton, Avatar, Button, Toast, ToastStack, SearchField, NotificationCenter } = window.StairsLifeDesignSystem_075594;

const I = (n, s) => <Icon name={n} size={s || 18} />;

const NOTIF_PANEL_ADM = [
  { id: 1, ikon: "Flag", tone: "danger", unread: true, href: "a9",
    title: "Laporan baru: L-3384 mengarahkan ke WhatsApp", description: "Dilaporkan Sekar Ayu", time: "6 menit lalu" },
  { id: 2, ikon: "ShieldAlert", tone: "warning", unread: true, href: "a4",
    title: "4 lowongan menunggu review", description: "1 bertanda merah", time: "22 menit lalu" },
  { id: 3, ikon: "GraduationCap", tone: "warning", unread: true, href: "a2",
    title: "Verifikasi mahasiswa tertua sudah 3 hari", description: "Melewati SLA 2 hari kerja", time: "1 jam lalu" },
  { id: 4, ikon: "Receipt", tone: "neutral", unread: true, href: "a10",
    title: "Bukti transfer manual perlu dikonfirmasi", description: "TRX-8841 · Rp 49.000", time: "3 jam lalu" },
  { id: 5, ikon: "Database", tone: "neutral", unread: false, href: "a12",
    title: "Pencadangan basis data selesai", time: "Hari ini 03:00" },
];

function navAdmin() {
  return [
    { value: "a1", label: "Dashboard", icon: I("LayoutDashboard") },
    { section: "Antrean" },
    { value: "a2", label: "Verifikasi mahasiswa", icon: I("GraduationCap"), badge: 3 },
    { value: "a3", label: "Verifikasi bisnis", icon: I("Building2"), badge: 2 },
    { value: "a4", label: "Moderasi lowongan", icon: I("ShieldAlert"), badge: 4 },
    { value: "a9", label: "Laporan & aduan", icon: I("Flag"), badge: 2, badgeTone: "danger" },
    { value: "a15", label: "Sengketa escrow", icon: I("Scale"), badge: 3, badgeTone: "danger" },
    { section: "Pengguna & konten" },
    { value: "a5", label: "Mahasiswa", icon: I("Users") },
    { value: "a6", label: "Bisnis", icon: I("Store") },
    { value: "a8", label: "Semua lowongan", icon: I("Briefcase") },
    { section: "Keuangan" },
    { value: "a10", label: "Transaksi", icon: I("Receipt"), badge: 1 },
    { section: "Sistem" },
    { value: "a11", label: "Master data", icon: I("Database") },
    { value: "a12", label: "Log aktivitas", icon: I("ScrollText") },
    { value: "a14", label: "Pengumuman", icon: I("Megaphone") },
    { value: "a13", label: "Pengaturan sistem", icon: I("Settings") },
  ];
}

const JUDUL = {
  a1: ["Dashboard", "Ringkasan platform & antrean"],
  a2: ["Verifikasi mahasiswa", "A2 · antrean KTM"],
  a3: ["Verifikasi bisnis", "A3 · antrean dokumen legalitas"],
  a4: ["Moderasi lowongan", "A4 · review sebelum tayang"],
  a5: ["Manajemen mahasiswa", "A5"],
  a6: ["Manajemen bisnis", "A6"],
  a7: ["Detail pengguna", "A7"],
  a8: ["Manajemen lowongan", "A8"],
  a9: ["Laporan & aduan", "A9"],
  a10: ["Arus dana & komisi", "A10 · komisi 5% saat dana dilepas"],
  a11: ["Master data", "A11"],
  a12: ["Log aktivitas", "A12 · audit trail"],
  a13: ["Pengaturan sistem", "A13"],
  a14: ["Pengumuman", "A14 · broadcast"],
  a15: ["Sengketa escrow", "A15 · putusan dana"],
};

function AdminShell() {
  const [rute, setRute] = React.useState("a1");
  const [tema, setTema] = React.useState("light");
  const [pengguna, setPengguna] = React.useState(null);
  const [menu, setMenu] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => { document.documentElement.setAttribute("data-theme", tema); }, [tema]);

  const notify = (t) => {
    const id = Date.now();
    setToasts((v) => [...v, { ...t, id }]);
    setTimeout(() => setToasts((v) => v.filter((x) => x.id !== id)), 4200);
  };
  const bukaPengguna = (p) => { setPengguna(p); setRute("a7"); setMenu(false); };
  // Drawer selalu tertutup setelah memilih rute; di desktop tidak berpengaruh.
  const pilihRute = (r) => { setRute(r); setMenu(false); };
  const ctx = { rute, setRute: pilihRute, notify, pengguna, bukaPengguna };
  const [judul, sub] = JUDUL[rute] || ["Admin", ""];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-page)" }}>
      <style>{`
        .ad-side{height:100%;flex:none}
        .ad-menu{display:none}
        .ad-scrim{display:none}
        /* Di bawah 1024px sidebar menjadi drawer off-canvas, BUKAN display:none —
           14 rute admin dalam 5 grup tidak bisa diwakili bottom nav 5 slot,
           dan menyembunyikan satu-satunya nav membuat 9 layar tak terjangkau. */
        @media(max-width:1023px){
          .ad-menu{display:inline-flex}
          .ad-side{position:fixed;inset:0 auto 0 0;z-index:45;width:264px;
            box-shadow:var(--shadow-lg);transform:translateX(-100%);
            transition:transform var(--duration-base) var(--ease-out)}
          .ad-side[data-open="true"]{transform:translateX(0)}
          .ad-scrim{display:block;position:fixed;inset:0;z-index:44;
            background:var(--bg-overlay);opacity:0;pointer-events:none;
            transition:opacity var(--duration-base) var(--ease-out)}
          .ad-scrim[data-open="true"]{opacity:1;pointer-events:auto}
        }
        .ad-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--gap-card)}
        .ad-two{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:var(--gap-card);align-items:start}
        .ad-split{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);gap:var(--gap-card);align-items:start}
        @media(max-width:900px){.ad-two,.ad-split{grid-template-columns:minmax(0,1fr)}}
      `}</style>

      <div className="ad-scrim" data-open={String(menu)} onClick={() => setMenu(false)} aria-hidden="true"></div>

      <div className="ad-side" data-open={String(menu)}>
        <Sidebar role="Admin" active={rute} onNavigate={pilihRute} items={navAdmin()} style={{ height: "100%" }}
          brand={<><img src="../../assets/logo-mark-wood.svg" width="20" height="20" alt="" style={{ display: "block", flex: "none" }} /><b style={{ fontFamily: "var(--font-display)", fontSize: 15.5, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>StairsLife</b></>}
          footer={<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}><Avatar name="Admin Nadia" size="sm" /><span style={{ flex: 1, minWidth: 0 }}><b className="sl-body-sm" style={{ display: "block", color: "var(--text-strong)" }}>Nadia Rahma</b><span className="sl-caption">Admin moderasi</span></span></div>} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <header style={{ flex: "none", minHeight: "var(--height-topbar)", display: "flex", alignItems: "center", gap: 12, paddingInline: "var(--pad-page-x)", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
          <IconButton className="ad-menu" label="Buka menu navigasi" onClick={() => setMenu(true)}>
            <Icon name="Menu" size={19} />
          </IconButton>
          <span style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: "var(--text-h2)", color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{judul}</h1>
            {sub && <span className="sl-caption" style={{ display: "block" }}>{sub}</span>}
          </span>
          <SearchField placeholder="Cari pengguna, lowongan, atau ID" label="Cari" collapsedWidth={200} expandedWidth={340} />
          <NotificationCenter live items={NOTIF_PANEL_ADM.map((n) => ({ ...n, icon: <Icon name={n.ikon} size={16} /> }))} label="Antrean & sistem"
            onOpenItem={(n) => pilihRute(n.href || "a1")} onMarkAllRead={() => notify({ tone: "info", title: "Semua ditandai dibaca" })} />
          <IconButton label="Ganti mode terang/gelap" onClick={() => setTema(tema === "dark" ? "light" : "dark")}>
            <Icon name={tema === "dark" ? "Sun" : "Moon"} size={18} />
          </IconButton>
        </header>

        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingTop: "var(--pad-page-y)", paddingInline: "var(--pad-page-x)", paddingBottom: "var(--pad-page-bottom-lg)" }}>
          <div style={{ maxWidth: "var(--width-container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--gap-block)" }}>
            {rute === "a1" && <AdminDashboard {...ctx} />}
            {(rute === "a2" || rute === "a3") && <AdminVerifikasi key={rute} {...ctx} bisnis={rute === "a3"} />}
            {rute === "a4" && <AdminModerasi {...ctx} />}
            {rute === "a5" && <AdminMahasiswa {...ctx} />}
            {rute === "a6" && <AdminBisnis {...ctx} />}
            {rute === "a7" && <AdminDetailPengguna {...ctx} />}
            {rute === "a8" && <AdminLowongan {...ctx} />}
            {rute === "a9" && <AdminLaporan {...ctx} />}
            {rute === "a10" && <AdminTransaksi {...ctx} />}
            {rute === "a11" && <AdminMaster {...ctx} />}
            {rute === "a12" && <AdminLog {...ctx} />}
            {rute === "a13" && <AdminPengaturan {...ctx} />}
            {rute === "a14" && <AdminPengumuman {...ctx} />}
            {rute === "a15" && <AdminSengketa {...ctx} />}
          </div>
        </main>
      </div>

      <ToastStack>{toasts.map((t) => <Toast key={t.id} tone={t.tone} title={t.title} description={t.description} onClose={() => setToasts((v) => v.filter((x) => x.id !== t.id))} />)}</ToastStack>
    </div>
  );
}

Object.assign(window, { AdminShell });
