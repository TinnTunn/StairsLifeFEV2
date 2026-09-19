const { Sidebar, BottomNav, Icon, IconButton, Avatar, Button, Toast, ToastStack, StatusBadge, NotificationCenter } = window.StairsLifeDesignSystem_075594;

const MI = (n, s) => <Icon name={n} size={s || 18} />;

// Isi panel lonceng — ringkasan lintas halaman, bukan pengganti M10.
const NOTIF_PANEL_MHS = [
  { id: 1, ikon: "MessageSquare", tone: "primary", unread: true, href: "chat",
    title: "Rimbun Plant House mengirim pesan", description: "“Baik, Senin pagi ya. Nanti saya kirim akses akunnya.”", time: "12 menit lalu" },
  { id: 2, ikon: "Eye", tone: "primary", unread: true, href: "m5",
    title: "Rimbun Plant House melihat lamaranmu", time: "18 menit lalu" },
  { id: 3, ikon: "UserCheck", tone: "success", unread: true, href: "m5",
    title: "Lamaranmu masuk tahap seleksi", description: "Konten Instagram 12 post", time: "1 jam lalu" },
  { id: 4, ikon: "Sparkles", tone: "primary", unread: true, href: "m2",
    title: "3 lowongan baru cocok dengan keahlianmu", time: "5 jam lalu" },
  { id: 5, ikon: "Clock", tone: "warning", unread: true, href: "m6",
    title: "Fotografer produk katalog tutup 3 hari lagi", description: "Lowongan yang kamu simpan", time: "Kemarin" },
  { id: 6, ikon: "ShieldCheck", tone: "success", unread: false, href: "m9",
    title: "Identitasmu berhasil diverifikasi", time: "14 Feb 2026" },
];

function navMhs(tersimpan) {
  return [
    { value: "m1", label: "Dashboard", icon: MI("LayoutDashboard") },
    { section: "Lowongan" },
    { value: "m2", label: "Cari lowongan", icon: MI("Search") },
    { value: "m6", label: "Tersimpan", icon: MI("Bookmark"), badge: tersimpan || undefined },
    { section: "Lamaran" },
    { value: "m4", label: "Lamaran saya", icon: MI("Send"), badge: 4 },
    { value: "chat", label: "Pesan", icon: MI("MessageSquare"), badge: 2 },
    { section: "Escrow" },
    { value: "kontrak", label: "Kontrak berjalan", icon: MI("FileText"), badge: 1 },
    { value: "dompet", label: "Dompet", icon: MI("Wallet") },
    { value: "sengketa", label: "Sengketa", icon: MI("Scale") },
    { section: "Akun" },
    { value: "m7", label: "Profil saya", icon: MI("User") },
    { value: "m8", label: "Dokumen & CV", icon: MI("FileText") },
    { value: "m9", label: "Status verifikasi", icon: MI("BadgeCheck") },
    { value: "m10", label: "Notifikasi", icon: MI("Bell"), badge: 6 },
    { value: "m11", label: "Pengaturan", icon: MI("Settings") },
  ];
}

function bottomMhs() {
  return [
    { value: "m1", label: "Beranda", icon: MI("Home", 21) },
    { value: "m2", label: "Cari", icon: MI("Search", 21) },
    { value: "m4", label: "Lamaran", icon: MI("Send", 21), badge: 4 },
    { value: "chat", label: "Pesan", icon: MI("MessageSquare", 21), badge: 2 },
    { value: "m7", label: "Profil", icon: MI("User", 21) },
  ];
}

const JUDUL_M = {
  m1: ["Dashboard", "M1"], m2: ["Cari lowongan", "M2"], m3: ["Kirim lamaran", "M3"],
  m4: ["Lamaran saya", "M4"], m5: ["Detail lamaran", "M5"], m6: ["Lowongan tersimpan", "M6"],
  m7: ["Profil saya", "M7"], m8: ["Dokumen & CV", "M8"], m9: ["Status verifikasi", "M9"],
  m10: ["Notifikasi", "M10"], m11: ["Pengaturan akun", "M11"], det: ["Detail lowongan", "P3"],
  chat: ["Pesan", "Terbuka setelah lamaran diterima"],
  kontrak: ["Kontrak & escrow", "Dana ditahan sampai hasil disetujui"],
  dompet: ["Dompet", "Saldo, escrow, dan penarikan"],
  sengketa: ["Sengketa", "Mediasi StairsLife · SLA 3 hari kerja"],
};

function StudentShell() {
  const [rute, setRute] = React.useState("m1");
  const [tema, setTema] = React.useState("light");
  const [verifikasi, setVerifikasi] = React.useState("terverifikasi");
  const [lowongan, setLowongan] = React.useState(null);
  const [lamaran, setLamaran] = React.useState(null);
  const [tersimpan, setTersimpan] = React.useState([2]);
  const [dilamar, setDilamar] = React.useState([]);
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
  const bukaLowongan = (l) => { setLowongan(l); setRute("det"); setMenu(false); };
  const bukaLamaran = (l) => { setLamaran(l); setRute("m5"); setMenu(false); };
  const simpan = (id) => setTersimpan((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  const ctx = { rute, setRute: pilihRute, notify, lowongan, lamaran, bukaLowongan, bukaLamaran, tersimpan, simpan, dilamar, setDilamar, verifikasi, setVerifikasi };
  const [judul, sub] = JUDUL_M[rute] || ["Mahasiswa", ""];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-page)" }}>
      <style>{`
        .mh-side{height:100%;flex:none}
        .mh-bottom{display:none}
        .mh-brand{display:none}
        .mh-menu{display:none}
        .mh-scrim{display:none}
        /* Di bawah 1024px sidebar menjadi drawer off-canvas, BUKAN display:none.
           Bottom nav 5 slot hanya memuat tujuan utama; rute seperti Tersimpan,
           Dokumen, dan Pengaturan hanya ada di sidebar — menyembunyikannya
           membuat halaman itu tak terjangkau di perangkat utama. */
        @media(max-width:1023px){
          .mh-bottom{display:block}
          .mh-brand{display:flex}
          .mh-menu{display:inline-flex}
          .mh-side{position:fixed;inset:0 auto 0 0;z-index:45;width:264px;
            box-shadow:var(--shadow-lg);transform:translateX(-100%);
            transition:transform var(--duration-base) var(--ease-out)}
          .mh-side[data-open="true"]{transform:translateX(0)}
          .mh-scrim{display:block;position:fixed;inset:0;z-index:44;
            background:var(--bg-overlay);opacity:0;pointer-events:none;
            transition:opacity var(--duration-base) var(--ease-out)}
          .mh-scrim[data-open="true"]{opacity:1;pointer-events:auto}
        }
        .mh-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--gap-card)}
        .mh-two{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:var(--gap-card);align-items:start}
        .mh-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,320px);gap:var(--gap-card);align-items:start}
        .mh-filter{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:var(--gap-card);align-items:start}
        @media(max-width:900px){.mh-two,.mh-split,.mh-filter{grid-template-columns:minmax(0,1fr)}}
      `}</style>

      <div className="mh-scrim" data-open={String(menu)} onClick={() => setMenu(false)} aria-hidden="true"></div>

      <div className="mh-side" data-open={String(menu)}>
        <Sidebar role="Mahasiswa" active={rute} onNavigate={pilihRute} items={navMhs(tersimpan.length)} style={{ height: "100%" }}
          brand={<><img src="../../assets/logo-mark-wood.svg" width="20" height="20" alt="" style={{ display: "block", flex: "none" }} /><b style={{ fontFamily: "var(--font-display)", fontSize: 15.5, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>StairsLife</b></>}
          footer={<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px" }}><Avatar name="Rani Pratiwi" size="sm" verified={verifikasi === "terverifikasi"} /><span style={{ flex: 1, minWidth: 0 }}><b className="sl-body-sm" style={{ display: "block", color: "var(--text-strong)" }}>Rani Pratiwi</b><span className="sl-caption">DKV · Univ. Brawijaya</span></span></div>} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <header style={{ flex: "none", minHeight: "var(--height-topbar)", display: "flex", alignItems: "center", gap: 12, paddingInline: "var(--pad-page-x)", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
          <IconButton className="mh-menu" label="Buka menu navigasi" onClick={() => setMenu(true)}>
            <Icon name="Menu" size={19} />
          </IconButton>
          <span className="mh-brand" style={{ alignItems: "center", gap: 8 }}><img src="../../assets/logo-mark-wood.svg" width="20" height="20" alt="" style={{ display: "block" }} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: "var(--text-h2)", color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{judul}</h1>
            {sub && <span className="sl-caption" style={{ display: "block" }}>{sub}</span>}
          </span>
          <NotificationCenter live items={NOTIF_PANEL_MHS.map((n) => ({ ...n, icon: <Icon name={n.ikon} size={16} /> }))} onSeeAll={() => setRute("m10")}
            onOpenItem={(n) => setRute(n.href || "m10")} onMarkAllRead={() => notify({ tone: "info", title: "Semua ditandai dibaca" })} />
          <IconButton label="Ganti mode terang/gelap" onClick={() => setTema(tema === "dark" ? "light" : "dark")}>
            <Icon name={tema === "dark" ? "Sun" : "Moon"} size={18} />
          </IconButton>
          <button type="button" onClick={() => setVerifikasi(verifikasi === "terverifikasi" ? "belum_diajukan" : "terverifikasi")}
            style={{ minHeight: 32, padding: "0 10px", border: "1px solid var(--border-default)", background: "var(--bg-surface)", color: "var(--text-muted)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 11.5, cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>
            {verifikasi === "terverifikasi" ? "Simulasi: belum terverifikasi" : "Simulasi: terverifikasi"}
          </button>
        </header>

        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingTop: "var(--pad-page-y)", paddingInline: "var(--pad-page-x)", paddingBottom: "var(--pad-page-bottom)" }}>
          <div style={{ maxWidth: "var(--width-container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--gap-block)" }}>
            {verifikasi !== "terverifikasi" && rute !== "m9" && (
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", background: "var(--warning-soft)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)", flexWrap: "wrap" }}>
                <span style={{ flex: "none", color: "var(--warning-text)", display: "flex", marginTop: 1 }}><Icon name="AlertTriangle" size={18} /></span>
                <span style={{ flex: 1, minWidth: 200 }}>
                  <b className="sl-body-sm" style={{ color: "var(--warning-text)", display: "block" }}>Verifikasi identitasmu dulu</b>
                  <span className="sl-caption" style={{ color: "var(--warning-text)" }}>Kamu bisa menelusuri semua lowongan, tapi belum bisa mengirim lamaran sampai KTM disetujui.</span>
                </span>
                <Button size="sm" variant="secondary" style={{ flex: "none" }} onClick={() => setRute("m9")}>Unggah KTM</Button>
              </div>
            )}
            {rute === "m1" && <MhsDashboard {...ctx} />}
            {rute === "m2" && <MhsCari {...ctx} />}
            {rute === "det" && <MhsDetailLowongan {...ctx} />}
            {rute === "m3" && <MhsFormLamaran {...ctx} />}
            {rute === "m4" && <MhsLamaran {...ctx} />}
            {rute === "m5" && <MhsDetailLamaran {...ctx} />}
            {rute === "m6" && <MhsTersimpan {...ctx} />}
            {rute === "m7" && <MhsProfil {...ctx} />}
            {rute === "m8" && <MhsDokumen {...ctx} />}
            {rute === "m9" && <MhsVerifikasi {...ctx} />}
            {rute === "chat" && <ChatJobBoard notify={notify} peran="mahasiswa" />}
            {rute === "kontrak" && <EscrowKontrak peran="mahasiswa" notify={notify} setRute={pilihRute} />}
            {rute === "dompet" && <EscrowDompet peran="mahasiswa" notify={notify} />}
            {rute === "sengketa" && <EscrowSengketa peran="mahasiswa" notify={notify} setRute={pilihRute} />}
            {rute === "m10" && <MhsNotifikasi {...ctx} />}
            {rute === "m11" && <MhsPengaturan {...ctx} />}
          </div>
        </main>

        <div className="mh-bottom"><BottomNav active={rute} onNavigate={pilihRute} items={bottomMhs()} /></div>
      </div>

      <ToastStack>{toasts.map((t) => <Toast key={t.id} tone={t.tone} title={t.title} description={t.description} onClose={() => setToasts((v) => v.filter((x) => x.id !== t.id))} />)}</ToastStack>
    </div>
  );
}

Object.assign(window, { StudentShell });
