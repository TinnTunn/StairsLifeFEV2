const { Button, Icon, Card, Input, Select, Checkbox, RadioCard, FileDropzone, ContractStepper, Toast, ToastStack, Logo } = window.StairsLifeDesignSystem_075594;

const LANGKAH = [
  { label: "Peran" },
  { label: "Data akun" },
  { label: "Verifikasi identitas" },
];

function ScreenRegister({ onSelesai }) {
  const [langkah, setLangkah] = React.useState(0);
  const [peran, setPeran] = React.useState("mahasiswa");
  const [berkas, setBerkas] = React.useState([]);
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [toast, setToast] = React.useState(null);
  const mhs = peran === "mahasiswa";

  const lanjut = () => {
    if (langkah === 1 && !/@/.test(email)) { setError("Masukkan email yang bisa kami hubungi, misalnya nama@student.ub.ac.id"); return; }
    setError("");
    if (langkah < 2) setLangkah(langkah + 1);
    else { setToast({ tone: "success", title: "Akun StairsLife kamu aktif", description: mhs ? "KTM sedang diperiksa, biasanya selesai dalam 1×24 jam. Kamu sudah bisa melamar proyek." : "Kamu sudah bisa memposting proyek pertama." }); window.setTimeout(onSelesai, 2600); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <style>{`
        .r-side{width:min(400px,38vw);flex:none;background:var(--ink-surface);color:var(--ink-text);padding:40px 36px;display:flex;flex-direction:column;justify-content:space-between}
        .r-main{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;padding:32px var(--pad-page-x) 64px}
        .r-form{width:100%;max-width:520px;display:flex;flex-direction:column;gap:var(--gap-block)}
        .r-fields{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:900px){.r-side{display:none}.r-fields{grid-template-columns:1fr}}
      `}</style>

      <aside className="r-side">
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Logo size={26} color="var(--ink-text)" basePath="../../assets" style={{ alignSelf: "flex-start" }} />
          <h2 className="sl-display-2" style={{ color: "var(--ink-text)", maxWidth: "16ch" }}>Tiga langkah, lalu kamu siap kerja.</h2>
          <ContractStepper orientation="vertical" surface="ink" current={langkah} steps={LANGKAH.map((l, i) => ({
            label: l.label,
            description: i === 2 ? "KTM atau kartu identitas mahasiswa" : i === 1 ? "Email, nomor HP, dan kata sandi" : "Mahasiswa atau pemilik bisnis",
          }))} />
        </div>
        <Card padding="md" style={{ gap: 8, background: "var(--ink-fill)", borderColor: "var(--ink-border)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-accent)" }}><Icon name="ShieldCheck" size={17} color="var(--ink-accent)" /><b className="sl-body-sm">Kenapa perlu verifikasi?</b></span>
          <p className="sl-caption" style={{ color: "var(--ink-text-muted)" }}>Karena StairsLife menahan uang orang lain di escrow, kami perlu memastikan setiap akun benar-benar dimiliki mahasiswa atau bisnis yang nyata.</p>
        </Card>
      </aside>

      <main className="r-main">
        <div className="r-form">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {langkah > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setLangkah(langkah - 1)} iconLeft={<Icon name="ChevronLeft" size={16} />}>Kembali</Button>
            )}
            <span className="sl-caption sl-tabular" style={{ marginLeft: "auto" }}>Langkah {langkah + 1} dari 3</span>
          </div>

          {langkah === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h1 style={{ fontSize: "var(--text-h1)" }}>Kamu di sini sebagai apa?</h1>
                <p className="sl-body" style={{ color: "var(--text-muted)" }}>Pilihan ini menentukan tampilan dashboard kamu. Bisa diubah nanti di pengaturan.</p>
              </div>
              <RadioCard name="peran" value="mahasiswa" checked={mhs} onChange={() => setPeran("mahasiswa")}
                label="Saya mahasiswa" description="Mencari proyek, membangun portofolio, dan menerima pembayaran lewat dompet StairsLife." />
              <RadioCard name="peran" value="bisnis" checked={!mhs} onChange={() => setPeran("bisnis")}
                label="Saya punya bisnis atau UMKM" description="Memposting proyek, memilih pelamar, dan membayar lewat escrow." />
              <Button size="lg" fullWidth onClick={lanjut}>Lanjut</Button>
            </div>
          )}

          {langkah === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h1 style={{ fontSize: "var(--text-h1)" }}>Buat akunmu</h1>
                <p className="sl-body" style={{ color: "var(--text-muted)" }}>Pakai email yang aktif — semua pemberitahuan soal kontrak dan dana dikirim ke sini.</p>
              </div>
              <div className="r-fields">
                <Input label="Nama lengkap" defaultValue={mhs ? "Rani Pratiwi" : ""} placeholder={mhs ? "" : "Nama pemilik atau PIC"} required />
                <Input label="Nomor HP" numeric prefix="+62" placeholder="812 3456 7890" required />
              </div>
              <Input label={mhs ? "Email kampus" : "Email bisnis"} value={email} onChange={(e) => setEmail(e.target.value)}
                iconLeft={<Icon name="Mail" size={16} />} error={error}
                hint={mhs ? "Email kampus mempercepat verifikasi identitas." : "Boleh email pribadi kalau bisnis belum punya domain."} required />
              {mhs ? (
                <div className="r-fields">
                  <Input label="Kampus" defaultValue="Universitas Brawijaya" required />
                  <Select label="Program studi" options={["Desain Komunikasi Visual", "Ilmu Komunikasi", "Teknik Informatika", "Manajemen"]} defaultValue="Desain Komunikasi Visual" placeholder="" required />
                </div>
              ) : (
                <div className="r-fields">
                  <Input label="Nama bisnis" defaultValue="Kopi Senja Malang" required />
                  <Select label="Bidang" options={["Kuliner & F&B", "Retail", "Jasa", "Pendidikan"]} defaultValue="Kuliner & F&B" placeholder="" required />
                </div>
              )}
              <Input label="Kata sandi" type="password" defaultValue="rahasia123" hint="Minimal 8 karakter, campur huruf dan angka." required />
              <Checkbox label="Saya setuju dengan syarat & ketentuan dan kebijakan privasi" description="Termasuk aturan escrow dan penyelesaian sengketa." defaultChecked />
              <Button size="lg" fullWidth onClick={lanjut}>Lanjut ke verifikasi</Button>
            </div>
          )}

          {langkah === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h1 style={{ fontSize: "var(--text-h1)" }}>{mhs ? "Verifikasi identitas mahasiswa" : "Verifikasi bisnis"}</h1>
                <p className="sl-body" style={{ color: "var(--text-muted)" }}>
                  {mhs ? "Unggah KTM atau kartu identitas mahasiswa. Kami hanya memakainya untuk memastikan kamu benar mahasiswa aktif; data tidak ditampilkan ke bisnis."
                       : "Unggah KTP pemilik atau dokumen usaha. Bisnis terverifikasi mendapat label dan lebih banyak pelamar."}
                </p>
              </div>
              <FileDropzone label={mhs ? "Foto KTM" : "Dokumen usaha"} hint="JPG, PNG, atau PDF · maksimal 10 MB"
                files={berkas} onFiles={(f) => setBerkas(f.map((x) => ({ name: x.name, size: "—" })))} onRemove={() => setBerkas([])} />
              <Card padding="md" style={{ gap: 10, background: "var(--bg-subtle)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="Wallet" size={17} color="var(--primary)" /><b className="sl-body-sm">Rekening penerimaan dana</b></span>
                <div className="r-fields">
                  <Select label="Bank" options={["BCA", "BRI", "BNI", "Mandiri"]} defaultValue="BCA" placeholder="" />
                  <Input label="Nomor rekening" numeric defaultValue="1234567890" />
                </div>
                <span className="sl-caption">Nama pemilik rekening harus sama dengan nama di identitas.</span>
              </Card>
              <Button size="lg" fullWidth onClick={lanjut}>{berkas.length ? "Kirim verifikasi" : "Lewati dulu, kirim nanti"}</Button>
              <p className="sl-caption" style={{ textAlign: "center" }}>Tanpa verifikasi, kamu bisa melamar proyek tapi belum bisa menarik dana.</p>
            </div>
          )}
        </div>
      </main>

      {toast && <ToastStack position="top"><Toast tone={toast.tone} title={toast.title} description={toast.description} onClose={() => setToast(null)} /></ToastStack>}
    </div>
  );
}

Object.assign(window, { ScreenRegister });
