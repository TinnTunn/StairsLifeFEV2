const { Card, Money, StatusBadge, Button, IconButton, Icon, DataTable, Pagination, Modal, Input, Select, Tabs, Checkbox, SearchField } = window.StairsLifeDesignSystem_075594;

// Mutasi yang bisa diaudit: setiap baris punya nomor referensi, waktu jam-menit,
// dan saldo berjalan — supaya pengguna bisa mencocokkan baris per baris dengan
// mutasi rekening banknya sendiri. Tanpa saldo berjalan, selisih tidak bisa
// dilacak dan pengguna hanya bisa menebak.
const MUTASI = [
  { id: "MUT-90412", tanggal: "02 Sep 2026", jam: "14:12", ket: "Dana dibekukan — sengketa SGK-118", ref: "SGK-118", nominal: 0, tone: "held", status: "sengketa", saldo: 4150000, tahan: 2500000, catatan: "Dana tetap di escrow, tidak bergerak sampai putusan admin keluar." },
  { id: "MUT-90388", tanggal: "01 Sep 2026", jam: "09:40", ket: "Dana dilepas — Ilustrasi menu & papan harga", ref: "KT-2361", nominal: 850000, tone: "in", status: "selesai", saldo: 4150000, tahan: 2500000, catatan: "Warung Ibu Tri menyetujui hasil kerja. Dana masuk ke saldo tersedia." },
  { id: "MUT-90355", tanggal: "28 Agu 2026", jam: "16:22", ket: "Penarikan ke BCA ····7890", ref: "WD-4471", nominal: -1200000, tone: "out", status: "selesai", saldo: 3300000, tahan: 3350000, catatan: "Diproses 1×24 jam kerja. Nomor referensi bank: 8829104471." },
  { id: "MUT-90340", tanggal: "24 Agu 2026", jam: "11:05", ket: "Dana ditahan di escrow — Desain logo & brand kit", ref: "KT-2419", nominal: 0, tone: "held", status: "escrow_ditahan", saldo: 4500000, tahan: 3350000, catatan: "Kopi Senja Malang menyetor Rp 2.500.000. Dana ditahan StairsLife sampai serah terima disetujui." },
  { id: "MUT-90301", tanggal: "20 Agu 2026", jam: "13:48", ket: "Dana dilepas — Konten Instagram 12 post", ref: "KT-2288", nominal: 1200000, tone: "in", status: "selesai", saldo: 4500000, tahan: 850000, catatan: "Rimbun Plant House menyetujui hasil kerja." },
  { id: "MUT-90277", tanggal: "18 Agu 2026", jam: "10:14", ket: "Penarikan ke BCA ····7890", ref: "WD-4402", nominal: -2000000, tone: "out", status: "selesai", saldo: 3300000, tahan: 850000, catatan: "Nomor referensi bank: 8829104402." },
];

function EscrowDompet({ peran, notify }) {
  const mahasiswa = peran !== "bisnis";
  const [modal, setModal] = React.useState(false);
  const [tab, setTab] = React.useState("semua");
  const [halaman, setHalaman] = React.useState(1);
  const [rinci, setRinci] = React.useState(null);

  const mutasi = MUTASI.filter((t) =>
    tab === "semua" ? true
    : tab === "masuk" ? t.nominal > 0
    : tab === "keluar" ? t.nominal < 0
    : t.tone === "held");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-block)" }}>
      <style>{".sl-dompet{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:var(--gap-card)}"}</style>

      <div className="sl-dompet">
        <Card padding="lg" style={{ gap: 12, borderColor: "var(--primary-border)", background: "var(--primary-soft)" }}>
          <Money value={4150000} size="lg" label={mahasiswa ? "Saldo tersedia" : "Saldo pembayaran"} />
          <Button onClick={() => setModal(true)} iconLeft={<Icon name="ArrowUpRight" size={17} />}>{mahasiswa ? "Tarik dana" : "Isi saldo"}</Button>
        </Card>
        <Card padding="lg" style={{ gap: 6 }}>
          <Money value={2500000} size="lg" tone="held" label="Tertahan di escrow" />
          <span className="sl-caption">1 kontrak berjalan · dilepas setelah review</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--money-held)", marginTop: 4 }}><Icon name="ShieldCheck" size={16} /><span className="sl-caption" style={{ color: "var(--text-muted)" }}>Dijamin StairsLife</span></span>
        </Card>
        <Card padding="lg" style={{ gap: 6 }}>
          <Money value={600000} size="lg" tone="muted" label="Dalam sengketa" />
          <span className="sl-caption">1 kontrak · menunggu keputusan admin</span>
          <StatusBadge status="sengketa" size="sm" style={{ alignSelf: "flex-start", marginTop: 4 }} />
        </Card>
        <Card padding="lg" style={{ gap: 6 }}>
          <Money value={mahasiswa ? 11800000 : 9400000} size="lg" tone="in" label={mahasiswa ? "Total diterima 2026" : "Total dibayarkan 2026"} />
          <span className="sl-caption">{mahasiswa ? "11 proyek selesai" : "7 proyek selesai"}</span>
        </Card>
      </div>

      <Card padding="lg" style={{ gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "var(--text-h3)" }}>Mutasi dompet</h3>
            <span className="sl-caption">Setiap baris punya nomor referensi dan saldo berjalan — bisa dicocokkan dengan mutasi rekeningmu</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Select placeholder="September 2026" options={["September 2026", "Agustus 2026", "Juli 2026"]} size="sm" style={{ width: 170 }} />
            <Button size="sm" variant="secondary" iconLeft={<Icon name="Download" size={15} />} onClick={() => notify({ tone: "info", title: "Laporan disiapkan", description: "Riwayat September 2026 dikirim ke email dalam beberapa menit." })}>Unduh CSV</Button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", flex: "none" }}>
          <Tabs variant="pill" value={tab} onChange={setTab} items={[{ value: "semua", label: "Semua" }, { value: "masuk", label: mahasiswa ? "Dana masuk" : "Pembayaran" }, { value: "keluar", label: "Penarikan" }, { value: "escrow", label: "Escrow" }]} />
          <SearchField placeholder="Cari nomor referensi" label="Cari mutasi" collapsedWidth={190} expandedWidth={300} style={{ marginLeft: "auto" }} />
        </div>

        <DataTable
          columns={[
            { key: "waktu", header: "Waktu", width: 132, render: (r) => <span className="sl-body-sm">{r.tanggal}<span className="sl-caption sl-tabular" style={{ display: "block" }}>{r.jam}</span></span> },
            { key: "ket", header: "Keterangan", render: (r) => <span className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{r.ket}<span className="sl-caption sl-tabular" style={{ display: "block" }}>{r.id} · {r.ref}</span></span> },
            { key: "nominal", header: "Nominal", numeric: true, width: 142, render: (r) => r.nominal === 0
              ? <span className="sl-caption" style={{ color: "var(--money-held)" }}>tidak bergerak</span>
              : <Money value={r.nominal} size="sm" tone={r.tone} sign /> },
            { key: "saldo", header: "Saldo tersedia", numeric: true, width: 148, render: (r) => <span className="sl-tabular sl-body-sm" style={{ color: "var(--text-strong)" }}>{"Rp " + r.saldo.toLocaleString("id-ID")}</span> },
            { key: "tahan", header: "Di escrow", numeric: true, width: 140, render: (r) => <span className="sl-tabular sl-body-sm" style={{ color: "var(--money-held)" }}>{"Rp " + r.tahan.toLocaleString("id-ID")}</span> },
            { key: "status", header: "Status", width: 168, render: (r) => <StatusBadge status={r.status} size="sm" /> },
          ]}
          rows={mutasi}
          empty="Belum ada mutasi di rentang ini."
          onRowClick={(r) => setRinci(r)}
        />
        <Pagination page={halaman} pageCount={4} total={38} perPage={10} onChange={setHalaman} />
        <span className="sl-caption" style={{ lineHeight: 1.55 }}>
          Kolom <b style={{ color: "var(--text-body)" }}>Saldo tersedia</b> dan <b style={{ color: "var(--text-body)" }}>Di escrow</b> menunjukkan posisi <i>setelah</i> baris itu terjadi. Klik baris untuk melihat nomor referensi bank.
        </span>
      </Card>

      <Modal open={!!rinci} onClose={() => setRinci(null)} size="sm" title={rinci ? rinci.ket : ""} description={rinci ? rinci.id + " · " + rinci.tanggal + " " + rinci.jam : ""}
        footer={<><Button variant="ghost" onClick={() => setRinci(null)}>Tutup</Button><Button variant="secondary" iconLeft={<Icon name="Download" size={15} />}>Unduh bukti</Button></>}>
        {rinci && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14 }}>
              {[["Nomor mutasi", rinci.id], ["Referensi", rinci.ref], ["Waktu", rinci.tanggal + " · " + rinci.jam],
                ["Nominal", rinci.nominal === 0 ? "Tidak bergerak" : "Rp " + Math.abs(rinci.nominal).toLocaleString("id-ID")],
                ["Saldo setelahnya", "Rp " + rinci.saldo.toLocaleString("id-ID")],
                ["Di escrow setelahnya", "Rp " + rinci.tahan.toLocaleString("id-ID")]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  <span className="sl-overline">{k}</span>
                  <b className="sl-body-sm sl-tabular" style={{ color: "var(--text-strong)", overflowWrap: "anywhere" }}>{v}</b>
                </div>
              ))}
            </div>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6, padding: "11px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>{rinci.catatan}</p>
          </div>
        )}
      </Modal>

      <Modal open={modal} onClose={() => setModal(false)} title={mahasiswa ? "Tarik dana" : "Isi saldo"}
        description={mahasiswa ? "Penarikan diproses 1×24 jam kerja. Tidak ada biaya untuk penarikan pertama setiap bulan." : "Saldo dipakai untuk menahan dana proyek di escrow."}
        footer={<><Button variant="secondary" onClick={() => setModal(false)}>Batal</Button><Button onClick={() => { setModal(false); notify({ tone: "success", title: mahasiswa ? "Penarikan diproses" : "Menunggu pembayaran", description: mahasiswa ? "Rp 4.150.000 dikirim ke BCA ····7890, estimasi besok." : "Selesaikan transfer ke BCA Virtual Account dalam 24 jam." }); }}>{mahasiswa ? "Tarik Rp 4.150.000" : "Lanjut ke pembayaran"}</Button></>}>
        <Input label="Nominal" prefix="Rp" numeric defaultValue="4.150.000" hint="Saldo tersedia Rp 4.150.000" />
        <Select label={mahasiswa ? "Rekening tujuan" : "Metode pembayaran"} options={mahasiswa ? ["BCA · 1234567890 (Rani Pratiwi)", "BRI · 0987654321 (Rani Pratiwi)"] : ["BCA Virtual Account", "Transfer manual BNI", "QRIS"]} placeholder="" />
        {mahasiswa && <Checkbox label="Simpan sebagai rekening utama" />}
      </Modal>
    </div>
  );
}

Object.assign(window, { EscrowDompet });
