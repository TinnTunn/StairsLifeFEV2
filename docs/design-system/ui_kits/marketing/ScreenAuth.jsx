const { Card, Button, Icon, IconButton, Input, Checkbox, Avatar, StatusBadge, Tag, Money, Rating, Tabs, EmptyState, Toast, ToastStack, SearchField, Select, ContractStepper } = window.StairsLifeDesignSystem_075594;

const HALAMAN = {
  login: ["Masuk", "P5"],
  peran: ["Pilih peran", "P6"],
  email: ["Verifikasi email", "P9"],
  lupa: ["Lupa password", "P10a"],
  reset: ["Atur password baru", "P10b"],
  statik: ["Halaman statis", "P11"],
  e404: ["404", "P12a"],
  e403: ["403", "P12b"],
  e500: ["500", "P12c"],
};

function Kotak({ children, lebar }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "40px 20px", background: "var(--bg-page)" }}>
      <div style={{ width: "100%", maxWidth: lebar || 420, display: "flex", flexDirection: "column", gap: 20 }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", alignSelf: "center" }}>
          <img src="../../assets/logo-mark-wood.svg" width="26" height="26" alt="" style={{ display: "block" }} />
          <b style={{ fontFamily: "var(--font-display)", fontSize: 19, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>StairsLife</b>
        </a>
        {children}
      </div>
    </div>
  );
}

/* ---------------- P5 — Login ---------------- */
function AuthLogin({ notify, go }) {
  const [email, setEmail] = React.useState("rani@student.ub.ac.id");
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState("");
  const [ingat, setIngat] = React.useState(true);

  const masuk = () => {
    if (!pw) { setErr("Password wajib diisi."); return; }
    if (pw.length < 4) { setErr("Email atau password salah. Coba lagi atau atur ulang passwordmu."); return; }
    setErr("");
    notify({ tone: "success", title: "Berhasil masuk", description: "Mengarahkan ke dashboard mahasiswa…" });
  };

  return (
    <Kotak>
      <Card padding="lg" style={{ gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Masuk ke akunmu</h1>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 5 }}>Satu akun untuk mahasiswa maupun bisnis.</p>
        </div>
        <Input label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} iconLeft={<Icon name="Mail" size={16} />} />
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <Input label="Password" required type="password" value={pw} error={err}
            onChange={(e) => { setPw(e.target.value); if (err) setErr(""); }} iconLeft={<Icon name="Lock" size={16} />} />
          <button type="button" onClick={() => go("lupa")}
            style={{ alignSelf: "flex-end", minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--primary-text)", fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", cursor: "pointer", fontWeight: 500 }}>
            Lupa password?
          </button>
        </div>
        <Checkbox label="Ingat saya di perangkat ini" checked={ingat} onChange={(e) => setIngat(e.target.checked)} />
        <Button fullWidth onClick={masuk}>Masuk</Button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          <span className="sl-caption">atau</span>
          <span style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        </div>
        <Button variant="secondary" fullWidth onClick={() => go("peran")}>Buat akun baru</Button>
      </Card>
      <p className="sl-caption" style={{ textAlign: "center", lineHeight: 1.55 }}>
        Dengan masuk kamu menyetujui <a href="#" onClick={(e) => { e.preventDefault(); go("statik"); }}>Ketentuan Layanan</a> dan <a href="#" onClick={(e) => { e.preventDefault(); go("statik"); }}>Kebijakan Privasi</a> StairsLife.
      </p>
    </Kotak>
  );
}

/* ---------------- P6 — Pilih peran ---------------- */
function AuthPeran({ go, notify }) {
  const [peran, setPeran] = React.useState(null);
  const opsi = [
    { id: "mahasiswa", ikon: "GraduationCap", judul: "Saya mahasiswa", sub: "Mencari kerja sampingan, freelance, atau magang yang cocok dengan jadwal kuliah.", butir: ["Gratis selamanya", "Perlu KTM untuk verifikasi", "Lamar sebanyak yang kamu mau"] },
    { id: "bisnis", ikon: "Store", judul: "Saya pemilik bisnis", sub: "Mencari mahasiswa untuk mengerjakan proyek atau kerja part-time.", butir: ["Posting lowongan tanpa biaya", "Perlu dokumen legalitas", "Biaya layanan 5% hanya saat dana dilepas"] },
  ];

  return (
    <Kotak lebar={560}>
      <Card padding="lg" style={{ gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Kamu daftar sebagai apa?</h1>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 5 }}>Pilihan ini menentukan tampilan dan izin akunmu. Tidak bisa diubah setelah daftar.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {opsi.map((o) => {
            const on = peran === o.id;
            return (
              <button key={o.id} type="button" onClick={() => setPeran(o.id)}
                style={{ display: "flex", gap: 13, alignItems: "flex-start", padding: 16, textAlign: "left", cursor: "pointer", fontFamily: "var(--font-sans)",
                  background: on ? "var(--primary-soft)" : "var(--bg-surface)",
                  border: "1px solid " + (on ? "var(--primary-border)" : "var(--border-default)"),
                  borderRadius: "var(--radius-lg)", transition: "var(--transition-color)" }}>
                <span style={{ flex: "none", width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: "var(--radius-md)", background: on ? "var(--primary)" : "var(--bg-sunken)", color: on ? "var(--text-on-primary)" : "var(--text-muted)" }}>
                  <Icon name={o.ikon} size={20} />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                  <b className="sl-body" style={{ color: on ? "var(--primary-text)" : "var(--text-strong)", fontFamily: "var(--font-display)", fontSize: "var(--text-h3)" }}>{o.judul}</b>
                  <span className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>{o.sub}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 4 }}>
                    {o.butir.map((b) => (
                      <span key={b} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ flex: "none", color: on ? "var(--primary)" : "var(--text-subtle)", display: "flex", marginTop: 1 }}><Icon name="Check" size={14} /></span>
                        <span className="sl-caption" style={{ lineHeight: 1.45 }}>{b}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <Button fullWidth disabled={!peran} onClick={() => notify({ tone: "info", title: "Lanjut ke formulir", description: "Alur pendaftaran lengkap ada di UI kit Landing & onboarding." })}>Lanjutkan</Button>
      </Card>
      <p className="sl-caption" style={{ textAlign: "center" }}>Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); go("login"); }}>Masuk di sini</a></p>
    </Kotak>
  );
}

/* ---------------- P9 — Verifikasi email ---------------- */
function AuthEmail({ notify, go }) {
  const [kode, setKode] = React.useState(["", "", "", "", "", ""]);
  const [err, setErr] = React.useState("");
  const [sisa, setSisa] = React.useState(48);
  const refs = React.useRef([]);

  React.useEffect(() => {
    if (sisa <= 0) return;
    const t = setTimeout(() => setSisa((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sisa]);

  const isi = (i, v) => {
    const c = v.replace(/\D/g, "").slice(-1);
    setKode((k) => k.map((x, j) => (j === i ? c : x)));
    if (err) setErr("");
    if (c && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus();
  };

  const cek = () => {
    if (kode.some((k) => !k)) { setErr("Masukkan keenam angkanya."); return; }
    setErr("");
    notify({ tone: "success", title: "Email terverifikasi", description: "Sekarang lengkapi profilmu untuk mulai melamar." });
  };

  return (
    <Kotak>
      <Card padding="lg" style={{ gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 11, alignItems: "center", textAlign: "center" }}>
          <span style={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: "var(--radius-md)", background: "var(--primary-soft)", color: "var(--primary-text)" }}>
            <Icon name="MailCheck" size={23} />
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Cek email kampusmu</h1>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Kami mengirim enam angka ke <b style={{ color: "var(--text-body)" }}>rani@student.ub.ac.id</b>. Kodenya berlaku 10 menit.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {kode.map((k, i) => (
              <input key={i} ref={(el) => (refs.current[i] = el)} value={k} onChange={(e) => isi(i, e.target.value)}
                inputMode="numeric" maxLength={1} aria-label={"Angka " + (i + 1)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !k && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus(); }}
                style={{ width: 46, height: 56, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 600, fontVariantNumeric: "tabular-nums",
                  color: "var(--text-strong)", background: "var(--bg-surface)",
                  border: "1px solid " + (err ? "var(--danger-border)" : k ? "var(--primary-border)" : "var(--border-default)"),
                  borderRadius: "var(--radius-md)", outline: "none" }} />
            ))}
          </div>
          {err && <span style={{ fontSize: "var(--text-caption)", color: "var(--danger-text)", textAlign: "center" }}>{err}</span>}
        </div>
        <Button fullWidth onClick={cek}>Verifikasi email</Button>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
          {sisa > 0 ? (
            <span className="sl-caption sl-tabular">Kirim ulang dalam {sisa} detik</span>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => { setSisa(48); notify({ tone: "info", title: "Kode dikirim ulang", description: "Cek juga folder spam." }); }}>Kirim ulang kode</Button>
          )}
          <button type="button" onClick={() => go("login")}
            style={{ minHeight: 32, padding: 0, border: 0, background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", cursor: "pointer" }}>
            Salah email? Ganti alamat
          </button>
        </div>
      </Card>
    </Kotak>
  );
}

/* ---------------- P10a — Lupa password ---------------- */
function AuthLupa({ notify, go }) {
  const [email, setEmail] = React.useState("");
  const [err, setErr] = React.useState("");
  const [kirim, setKirim] = React.useState(false);

  const submit = () => {
    if (!email.includes("@")) { setErr("Masukkan alamat email yang valid."); return; }
    setErr(""); setKirim(true);
  };

  return (
    <Kotak>
      {kirim ? (
        <Card padding="lg" style={{ gap: 15 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 11, alignItems: "center", textAlign: "center" }}>
            <span style={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: "var(--radius-md)", background: "var(--success-soft)", color: "var(--success-text)" }}>
              <Icon name="Send" size={22} />
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Tautan sudah dikirim</h1>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              Kalau <b style={{ color: "var(--text-body)" }}>{email}</b> terdaftar di StairsLife, tautan atur ulang password ada di kotak masukmu. Berlaku 1 jam.
            </p>
          </div>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "12px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex", marginTop: 1 }}><Icon name="Info" size={16} /></span>
            <span className="sl-caption" style={{ lineHeight: 1.55 }}>Belum masuk setelah lima menit? Cek folder spam, atau pastikan alamatnya benar. Kami tidak memberi tahu apakah email terdaftar — itu melindungi akun orang lain.</span>
          </div>
          <Button variant="secondary" fullWidth onClick={() => go("reset")}>Buka contoh tautan reset</Button>
          <Button variant="ghost" fullWidth onClick={() => go("login")}>Kembali ke halaman masuk</Button>
        </Card>
      ) : (
        <Card padding="lg" style={{ gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Lupa password</h1>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 5, lineHeight: 1.6 }}>Masukkan email yang kamu pakai mendaftar. Kami kirim tautan untuk mengatur password baru.</p>
          </div>
          <Input label="Email" required type="email" value={email} error={err} placeholder="nama@student.kampus.ac.id"
            onChange={(e) => { setEmail(e.target.value); if (err) setErr(""); }} iconLeft={<Icon name="Mail" size={16} />} />
          <Button fullWidth onClick={submit}>Kirim tautan reset</Button>
          <Button variant="ghost" fullWidth onClick={() => go("login")}>Kembali ke halaman masuk</Button>
        </Card>
      )}
    </Kotak>
  );
}

/* ---------------- P10b — Reset password ---------------- */
function AuthReset({ notify, go }) {
  const [pw, setPw] = React.useState("");
  const [ulang, setUlang] = React.useState("");
  const [err, setErr] = React.useState("");
  const [selesai, setSelesai] = React.useState(false);

  const kuat = pw.length >= 8 && /[0-9]/.test(pw) && /[a-zA-Z]/.test(pw);
  const nilai = !pw ? 0 : pw.length < 6 ? 1 : !kuat ? 2 : pw.length >= 12 ? 4 : 3;
  const label = ["", "Lemah", "Sedang", "Kuat", "Sangat kuat"][nilai];
  const warna = ["transparent", "var(--danger)", "var(--warning)", "var(--success)", "var(--success)"][nilai];

  const submit = () => {
    if (!kuat) { setErr("Minimal 8 karakter dan mengandung huruf serta angka."); return; }
    if (pw !== ulang) { setErr("Kedua password belum sama."); return; }
    setErr(""); setSelesai(true);
    notify({ tone: "success", title: "Password diperbarui", description: "Semua sesi lain sudah dikeluarkan." });
  };

  if (selesai) {
    return (
      <Kotak>
        <Card padding="lg" style={{ gap: 15 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 11, alignItems: "center", textAlign: "center" }}>
            <span style={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: "var(--radius-md)", background: "var(--success-soft)", color: "var(--success-text)" }}>
              <Icon name="ShieldCheck" size={23} />
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Password berhasil diubah</h1>
            <p className="sl-body-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>Semua perangkat lain sudah dikeluarkan. Masuk kembali dengan password barumu.</p>
          </div>
          <Button fullWidth onClick={() => go("login")}>Masuk sekarang</Button>
        </Card>
      </Kotak>
    );
  }

  return (
    <Kotak>
      <Card padding="lg" style={{ gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", color: "var(--text-strong)", letterSpacing: "-0.02em" }}>Atur password baru</h1>
          <p className="sl-body-sm" style={{ color: "var(--text-muted)", marginTop: 5 }}>Untuk akun rani@student.ub.ac.id</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Input label="Password baru" required type="password" value={pw} error={err}
            onChange={(e) => { setPw(e.target.value); if (err) setErr(""); }} iconLeft={<Icon name="Lock" size={16} />}
            hint="Minimal 8 karakter, mengandung huruf dan angka." />
          {pw && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ flex: 1, display: "flex", gap: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} style={{ flex: 1, height: 4, borderRadius: "var(--radius-full)", background: i <= nilai ? warna : "var(--bg-sunken)" }} />
                ))}
              </span>
              <span className="sl-caption" style={{ flex: "none", color: nilai >= 3 ? "var(--success-text)" : nilai === 2 ? "var(--warning-text)" : "var(--danger-text)" }}>{label}</span>
            </div>
          )}
        </div>
        <Input label="Ulangi password baru" required type="password" value={ulang} onChange={(e) => setUlang(e.target.value)} iconLeft={<Icon name="Lock" size={16} />} />
        <Button fullWidth onClick={submit}>Simpan password baru</Button>
      </Card>
    </Kotak>
  );
}

Object.assign(window, { AuthLogin, AuthPeran, AuthEmail, AuthLupa, AuthReset, Kotak, HALAMAN });
