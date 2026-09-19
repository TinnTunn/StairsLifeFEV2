const { Card, ChatBubble, Avatar, Button, IconButton, Icon, Input, SearchField, StatusBadge, Tag, Rating, Modal, Textarea, EmptyState, Money } = window.StairsLifeDesignSystem_075594;

/* ============================================================
   Chat & ulasan job board — dipakai kit mahasiswa DAN bisnis.
   Aturan produk: percakapan hanya terbuka setelah lamaran DITERIMA.
   Sebelum itu tidak ada saluran pesan — ini yang melindungi mahasiswa
   dari kontak di luar platform sebelum ada kesepakatan.
   ============================================================ */

const PERCAKAPAN = [
  { id: 1, lawan: "Rimbun Plant House", peranLawan: "bisnis", lowongan: "Konten Instagram 12 post", kode: "L-3380",
    akhir: "Baik, Senin pagi ya. Nanti saya kirim akses akunnya.", waktu: "12 menit lalu", belum: 2, verified: true,
    pesan: [
      { dari: "mereka", teks: "Halo Rani, kami senang dengan portofoliomu. Kamu bisa mulai minggu depan?", waktu: "09:12" },
      { dari: "saya", teks: "Halo! Bisa, saya kosong dari Senin. Untuk kalender kontennya mau bulanan atau mingguan?", waktu: "09:20" },
      { dari: "mereka", teks: "Mingguan saja dulu, biar bisa disesuaikan kalau ada promo mendadak.", waktu: "09:24" },
      { dari: "mereka", teks: "Baik, Senin pagi ya. Nanti saya kirim akses akunnya.", waktu: "09:25" },
    ] },
  { id: 2, lawan: "Warung Ibu Tri", peranLawan: "bisnis", lowongan: "Ilustrasi menu & papan harga", kode: "L-3210",
    akhir: "Terima kasih Rani, hasilnya kami pakai mulai minggu ini.", waktu: "3 hari lalu", belum: 0, verified: true,
    pesan: [
      { dari: "mereka", teks: "Filenya sudah kami terima semua, terima kasih.", waktu: "14:02" },
      { dari: "saya", teks: "Sama-sama, Bu. Kalau butuh versi untuk spanduk, tinggal kabari saja.", waktu: "14:30" },
      { dari: "mereka", teks: "Terima kasih Rani, hasilnya kami pakai mulai minggu ini.", waktu: "14:41" },
    ] },
];

function ChatJobBoard({ notify, peran }) {
  const [aktif, setAktif] = React.useState(PERCAKAPAN[0]);
  const [draf, setDraf] = React.useState("");
  const [kirim, setKirim] = React.useState([]);
  const lawanAdalahBisnis = peran !== "bisnis";

  const kirimPesan = () => {
    if (!draf.trim()) return;
    setKirim((v) => [...v, { dari: "saya", teks: draf.trim(), waktu: "Sekarang" }]);
    setDraf("");
  };

  const semua = [...aktif.pesan, ...kirim];

  return (
    <div className="jb-chat" style={{ display: "grid", gridTemplateColumns: "minmax(0,272px) minmax(0,1fr)", gap: "var(--gap-card)", alignItems: "start" }}>
      <style>{"@media(max-width:760px){.jb-chat{grid-template-columns:minmax(0,1fr)!important}}"}</style>

      <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
          <SearchField fullWidth placeholder="Cari percakapan" label="Cari percakapan" />
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
          {PERCAKAPAN.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => { setAktif(p); setKirim([]); }}
                style={{ width: "100%", minHeight: 64, display: "flex", gap: 11, alignItems: "flex-start", padding: "10px 11px", borderRadius: "var(--radius-md)", border: 0, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", background: p.id === aktif.id ? "var(--primary-soft)" : "transparent", transition: "var(--transition-color)" }}>
                <Avatar name={p.lawan} size="sm" shape={lawanAdalahBisnis ? "rounded" : "circle"} verified={p.verified} />
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <b className="sl-body-sm" style={{ color: p.id === aktif.id ? "var(--primary-text)" : "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.lawan}</b>
                  <span className="sl-caption" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.akhir}</span>
                  <span className="sl-caption" style={{ color: "var(--text-subtle)" }}>{p.waktu}</span>
                </span>
                {p.belum > 0 && <span className="sl-tabular" style={{ flex: "none", width: 20, textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--primary-text)" }}>{p.belum}</span>}
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="none" style={{ gap: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 15px", borderBottom: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
          <Avatar name={aktif.lawan} size="sm" shape={lawanAdalahBisnis ? "rounded" : "circle"} verified={aktif.verified} />
          <span style={{ flex: 1, minWidth: 120, display: "flex", flexDirection: "column" }}>
            <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{aktif.lawan}</b>
            <span className="sl-caption">{aktif.lowongan} · {aktif.kode}</span>
          </span>
          <StatusBadge status="diterima" size="sm" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 15px", maxHeight: 380, overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "10px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <span style={{ flex: "none", color: "var(--success-text)", display: "flex", marginTop: 1 }}><Icon name="Unlock" size={15} /></span>
            <span className="sl-caption" style={{ lineHeight: 1.55 }}>
              Percakapan terbuka karena lamaran sudah diterima pada 02 Sep 2026. Sebelum diterima, kontak kedua pihak tertutup.
            </span>
          </div>
          {semua.map((m, i) => (
            <ChatBubble key={i} side={m.dari === "saya" ? "right" : "left"}
              author={m.dari === "saya" ? "Kamu" : aktif.lawan} text={m.teks} time={m.waktu} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 9, alignItems: "flex-end", padding: "12px 15px", borderTop: "1px solid var(--border-subtle)" }}>
          <Input placeholder="Tulis pesan…" value={draf} style={{ flex: 1, minWidth: 0 }}
            onChange={(e) => setDraf(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); kirimPesan(); } }} />
          <IconButton label="Lampirkan berkas"><Icon name="Paperclip" size={17} /></IconButton>
          <Button onClick={kirimPesan} disabled={!draf.trim()}>Kirim</Button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Ulasan dua arah ---------------- */

const CEPAT_MHS = ["Brief-nya jelas", "Bayaran tepat waktu", "Komunikatif", "Jam kerja sesuai kesepakatan", "Lingkungan mendukung", "Ekspektasi realistis"];
const CEPAT_BIZ = ["Komunikasinya jelas", "Tepat waktu", "Hasil sesuai brief", "Revisi tanpa drama", "Inisiatif tinggi", "Mudah diajak diskusi"];

/**
 * Ulasan dua arah. Keduanya baru terbit setelah kedua pihak mengirim ulasan
 * atau 14 hari berlalu — supaya tidak ada yang menahan ulasan sebagai ancaman.
 */
function UlasanDuaArah({ notify, peran, nama, lowongan, sudahMengirim, onKirim }) {
  const [buka, setBuka] = React.useState(false);
  const [nilai, setNilai] = React.useState(0);
  const [pilih, setPilih] = React.useState([]);
  const [teks, setTeks] = React.useState("");
  const [err, setErr] = React.useState("");
  const [terkirim, setTerkirim] = React.useState(sudahMengirim || false);
  const forBisnis = peran === "mahasiswa";
  const cepat = forBisnis ? CEPAT_MHS : CEPAT_BIZ;

  const toggle = (t) => setPilih((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]));

  const kirim = () => {
    if (!nilai) { setErr("Pilih dulu jumlah bintangnya."); return; }
    setErr("");
    setBuka(false);
    setTerkirim(true);
    if (onKirim) onKirim({ nilai, pilih, teks });
    notify({ tone: "success", title: "Ulasan terkirim", description: "Ulasanmu terbit setelah " + nama + " juga mengirim ulasan, atau otomatis 14 hari lagi." });
  };

  return (
    <>
      <Card padding="md" style={{ gap: 11 }}>
        <span className="sl-overline">Ulasan</span>
        {terkirim ? (
          <>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "11px 13px", background: "var(--success-soft)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-md)" }}>
              <span style={{ flex: "none", color: "var(--success-text)", display: "flex", marginTop: 1 }}><Icon name="CheckCircle2" size={17} /></span>
              <span className="sl-body-sm" style={{ color: "var(--success-text)", lineHeight: 1.55 }}>
                Ulasanmu sudah terkirim. Terbit setelah {nama} juga mengirim, atau otomatis dalam 14 hari.
              </span>
            </div>
            <span className="sl-caption" style={{ lineHeight: 1.5 }}>
              Keduanya terbit bersamaan supaya tidak ada yang menahan ulasan sebagai alat tekanan.
            </span>
          </>
        ) : (
          <>
            <span className="sl-caption" style={{ lineHeight: 1.55 }}>
              Pekerjaan sudah selesai. Beri ulasan untuk {nama} — ini yang membantu {forBisnis ? "mahasiswa lain memilih bisnis yang layak" : "bisnis lain menilai calon pelamar"}.
            </span>
            <Button fullWidth onClick={() => setBuka(true)}>Beri ulasan</Button>
          </>
        )}
      </Card>

      <Modal open={buka} onClose={() => setBuka(false)} title={"Beri ulasan untuk " + nama} description={lowongan}
        footer={<><Button variant="ghost" onClick={() => setBuka(false)}>Nanti saja</Button><Button onClick={kirim}>Kirim ulasan</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-semibold)", color: "var(--text-body)" }}>
              {forBisnis ? "Bagaimana pengalaman kerjamu dengan bisnis ini?" : "Seberapa puas kamu dengan hasil kerjanya?"} <span style={{ color: "var(--danger-text)" }}>*</span>
            </span>
            <Rating value={nilai} editable size="lg" onChange={(v) => { setNilai(v); if (err) setErr(""); }} />
            {err
              ? <span style={{ fontSize: "var(--text-caption)", color: "var(--danger-text)" }}>{err}</span>
              : <span className="sl-caption">{nilai ? ["", "Jauh di bawah harapan", "Kurang memuaskan", "Cukup", "Memuaskan", "Melebihi harapan"][nilai] : "Ketuk bintangnya"}</span>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-semibold)", color: "var(--text-body)" }}>Apa yang paling menonjol?</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {cepat.map((t) => {
                const on = pilih.includes(t);
                return (
                  <button key={t} type="button" onClick={() => toggle(t)}
                    style={{ minHeight: 36, padding: "0 13px", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)",
                      background: on ? "var(--primary-soft)" : "var(--bg-surface)",
                      border: "1px solid " + (on ? "var(--primary-border)" : "var(--border-default)"),
                      color: on ? "var(--primary-text)" : "var(--text-muted)",
                      fontWeight: on ? 600 : 500, transition: "var(--transition-color)", whiteSpace: "nowrap" }}>{t}</button>
                );
              })}
            </div>
          </div>

          <Textarea label="Ceritakan pengalamanmu" rows={4} maxLength={500} showCount value={teks} onChange={(e) => setTeks(e.target.value)}
            placeholder={forBisnis ? "Apakah brief-nya jelas, bayarannya tepat waktu, dan jam kerjanya sesuai kesepakatan?" : "Bagaimana komunikasinya, apakah tenggat ditepati, dan bagaimana revisi ditangani?"}
            hint="Ulasan tampil publik. Kamu bisa mengubahnya dalam 24 jam pertama setelah terbit." />

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "11px 13px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <span style={{ flex: "none", color: "var(--text-subtle)", display: "flex", marginTop: 1 }}><Icon name="EyeOff" size={16} /></span>
            <span className="sl-caption" style={{ lineHeight: 1.55 }}>
              {nama} tidak bisa melihat ulasanmu sampai mereka juga mengirim ulasan — atau sampai 14 hari berlalu. Ini mencegah ulasan dipakai sebagai alat tekanan.
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}

Object.assign(window, { ChatJobBoard, UlasanDuaArah, PERCAKAPAN });
