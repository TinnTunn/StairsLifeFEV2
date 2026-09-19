const { Button, Icon, Card, Money, Tag, Avatar, Rating, StatusBadge, ContractStepper, IconButton, Logo, HowItWorks, FeatureCarousel } = window.StairsLifeDesignSystem_075594;

/* Motif satu-satunya: tiga balok tangga dari logo, sebagai blok datar. */
function Tangga({ size = 1, color = "var(--primary)", faded }) {
  const w = 132 * size;
  return (
    <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 6 * size, alignItems: "center", opacity: faded ? 0.14 : 1 }}>
      <span style={{ width: w * 0.42, height: 16 * size, background: color, borderRadius: 3 }} />
      <span style={{ width: w * 0.72, height: 18 * size, background: color, borderRadius: 3 }} />
      <span style={{ width: w, height: 20 * size, background: color, borderRadius: 3 }} />
    </span>
  );
}


function ScreenLanding({ onDaftar }) {
  return (
    <div className="m-root">
      <style>{`
        .m-wrap{max-width:var(--width-container);margin:0 auto;padding-inline:var(--pad-page-x)}
        .m-root{overflow-x:hidden}
        .m-nav-row{display:flex;align-items:center;gap:16px;height:64px}
        @media(max-width:600px){.m-nav-row{gap:10px}}
        .m-nav{position:sticky;top:0;z-index:30;background:color-mix(in oklab,var(--bg-page) 92%,transparent);border-bottom:1px solid var(--border-subtle);backdrop-filter:blur(6px)}
        .m-hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:48px;align-items:center;padding:72px 0 64px}
        .m-cols3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
        .m-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--gap-card)}
        .m-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gap-card)}
        .m-sec{padding:var(--section-y-marketing) 0}
        .m-hide-sm{display:block}
        @media(max-width:900px){
          .m-hero{grid-template-columns:1fr;gap:32px;padding:40px 0 44px}
          .m-cols3,.m-two,.m-cards{grid-template-columns:minmax(0,1fr)}
          .m-sec{padding:48px 0}
          .m-hide-sm{display:none}
        }
      `}</style>

      <nav className="m-nav">
        <div className="m-wrap m-nav-row">
          <span style={{ display: "flex", alignItems: "center", gap: 9, flex: 1, minWidth: 0 }}>
            <img src="../../assets/logo-mark-wood.svg" width="22" height="22" alt="" style={{ display: "block", flex: "none" }} />
            <b style={{ fontFamily: "var(--font-display)", fontSize: 17, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>StairsLife</b>
          </span>
          <span className="m-hide-sm" style={{ display: "flex", gap: 22 }}>
            {[["Cara kerja", "#cara"], ["Bidang pekerjaan", "#kategori"], ["Biaya", "#biaya"]].map(([x, h]) => (
              <a key={x} href={h} className="sl-body-sm" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{x}</a>
            ))}
          </span>
          <Button variant="ghost" size="sm" className="m-hide-sm">Masuk</Button>
          <Button size="sm" onClick={onDaftar}>Daftar gratis</Button>
        </div>
      </nav>

      <header className="m-wrap m-hero">
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", padding: "6px 12px", background: "var(--primary-soft)", color: "var(--primary-text)", borderRadius: "var(--radius-pill)", fontSize: "var(--text-caption)", fontWeight: 600 }}>
            <Icon name="ShieldCheck" size={15} color="var(--primary-text)" />Setiap proyek dijamin escrow
          </span>
          <h1 className="sl-display-1" style={{ maxWidth: "18ch" }}>Kerja freelance pertamamu, tanpa takut tidak dibayar.</h1>
          <p className="sl-body-lg" style={{ color: "var(--text-muted)", maxWidth: "48ch" }}>
            StairsLife mempertemukan mahasiswa dengan bisnis dan UMKM di sekitarmu. Dana klien ditahan di escrow sejak kontrak dimulai, dan dilepas ke dompetmu setelah hasil kerja disetujui.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button size="lg" onClick={onDaftar}>Mulai sebagai mahasiswa</Button>
            <Button size="lg" variant="secondary" onClick={onDaftar}>Saya punya bisnis</Button>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 6 }}>
            {[["2.400+", "mahasiswa terverifikasi"], ["Rp 1,8 M", "dana dilepas dari escrow"], ["4,8", "rata-rata ulasan"]].map(([a, b]) => (
              <span key={b} style={{ display: "flex", flexDirection: "column" }}>
                <b className="sl-money" style={{ fontSize: "var(--text-h2)", color: "var(--text-strong)" }}>{a}</b>
                <span className="sl-caption">{b}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card padding="lg" style={{ gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div><h3 style={{ fontSize: "var(--text-h3)" }}>Desain logo &amp; brand kit untuk kedai kopi</h3>
                <span className="sl-caption">Kopi Senja Malang · Terverifikasi</span></div>
              <StatusBadge status="escrow_ditahan" size="sm" />
            </div>
            <Money value={2500000} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{["Logo", "Branding", "Illustrator"].map((t) => <Tag key={t} size="sm">{t}</Tag>)}</div>
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
              <ContractStepper orientation="vertical" current={2} steps={[
                { label: "Kontrak disepakati", meta: "10 Sep 2026" },
                { label: "Dana masuk escrow", meta: "Rp 2.500.000 ditahan" },
                { label: "Sedang dikerjakan", meta: "Tenggat 20 Sep 2026" },
                { label: "Dana dilepas ke dompet" },
              ]} />
            </div>
          </Card>
          <Card padding="md" style={{ gap: 10, flexDirection: "row", alignItems: "center" }}>
            <Avatar name="Rani Pratiwi" size="md" verified />
            <span style={{ flex: 1, minWidth: 0 }}>
              <b className="sl-body-sm" style={{ color: "var(--text-strong)", display: "block" }}>Rani Pratiwi</b>
              <span className="sl-caption">DKV · Universitas Brawijaya</span>
            </span>
            <Rating value={4.8} count={23} size="sm" />
          </Card>
        </div>
      </header>

      <section id="cara" style={{ background: "var(--bg-subtle)", borderBlock: "1px solid var(--border-subtle)" }}>
        <div className="m-wrap m-sec" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="sl-overline">Cara kerja</span>
              <h2 className="sl-display-2" style={{ maxWidth: "22ch" }}>Uangnya jelas di setiap tahap.</h2>
            </div>
            <p className="sl-body" style={{ color: "var(--text-muted)", maxWidth: "40ch" }}>
              Bisnis membayar di awal, StairsLife menahan dananya, mahasiswa bekerja dengan tenang. Tidak ada yang menunggu itikad baik pihak lain.
            </p>
          </div>
          <HowItWorks steps={[
            { label: "Lamar yang cocok", short: "Gratis, tanpa batas jumlah", icon: <Icon name="Search" size={21} />,
              body: "Cari berdasarkan keahlian, anggaran, dan tenggat. Semua bisnis terverifikasi punya rekam jejak yang bisa kamu lihat sebelum melamar.",
              note: "Melamar tidak dikenakan biaya apa pun." },
            { label: "Dana masuk escrow", short: "Bukan di tangan bisnis", icon: <Icon name="ShieldCheck" size={21} />,
              body: "Setelah kontrak disepakati, bisnis membayar ke escrow StairsLife. Dana tidak bisa ditarik siapa pun — termasuk bisnis — sampai tahap review selesai.",
              aside: <span style={{ display: "flex", flexDirection: "column", gap: 3, padding: "12px 14px", background: "var(--status-escrow-bg)", border: "1px solid var(--status-escrow-bd)", borderRadius: "var(--radius-md)", minWidth: 152 }}><span className="sl-overline" style={{ color: "var(--status-escrow-fg)" }}>Ditahan escrow</span><Money value={2500000} size="md" tone="held" /></span> },
            { label: "Serah terima", short: "Kamu kirim, bisnis review", icon: <Icon name="PackageCheck" size={21} />,
              body: "Kamu unggah hasil kerja, bisnis punya waktu untuk memeriksanya. Kalau ada yang perlu diperbaiki, revisi terjadi di sini — sebelum dana bergerak." },
            { label: "Dana dilepas", short: "Masuk dompetmu", icon: <Icon name="Wallet" size={21} />,
              body: "Bisnis menyetujui hasil kerja dan dana langsung masuk ke dompetmu. Penarikan ke rekening diproses dalam 1×24 jam kerja.",
              note: "Biaya layanan ditanggung bisnis — kamu menerima nominal penuh." },
          ]} />
        </div>
      </section>

      <section id="kategori" className="m-wrap m-sec" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="sl-overline">Bidang pekerjaan</span>
            <h2 className="sl-display-2" style={{ maxWidth: "24ch" }}>Yang paling dicari UMKM sekarang.</h2>
          </div>
          <p className="sl-body" style={{ color: "var(--text-muted)", maxWidth: "38ch" }}>
            Angka di bawah diperbarui tiap hari dari lowongan yang benar-benar tayang, bukan perkiraan.
          </p>
        </div>
        <FeatureCarousel items={[
          { id: "desain", label: "Desain grafis", icon: <Icon name="Palette" size={16} />, count: 18,
            title: "Logo, brand kit, dan kemasan",
            body: "Paling banyak dicari UMKM yang baru buka. Rata-rata proyek selesai dalam dua minggu.",
            meta: [{ label: "Lowongan aktif", value: "18" }, { label: "Rata-rata nilai", value: "Rp 1.800.000" }],
            action: <Button size="sm" onClick={onDaftar} style={{ alignSelf: "flex-start", marginTop: 4 }}>Lihat lowongan desain</Button> },
          { id: "sosmed", label: "Sosial media", icon: <Icon name="Instagram" size={16} />, count: 12,
            title: "Konten harian dan kalender posting",
            body: "Pekerjaan berulang dengan jam kerja fleksibel — paling cocok disambi kuliah.",
            meta: [{ label: "Lowongan aktif", value: "12" }, { label: "Rata-rata nilai", value: "Rp 1.200.000" }],
            action: <Button size="sm" onClick={onDaftar} style={{ alignSelf: "flex-start", marginTop: 4 }}>Lihat lowongan konten</Button> },
          { id: "foto", label: "Fotografi", icon: <Icon name="Camera" size={16} />, count: 7,
            title: "Foto produk dan katalog",
            body: "Sering onsite di Malang dan sekitarnya. Peralatan lighting biasanya disediakan bisnis.",
            meta: [{ label: "Lowongan aktif", value: "7" }, { label: "Rata-rata nilai", value: "Rp 1.800.000" }],
            action: <Button size="sm" onClick={onDaftar} style={{ alignSelf: "flex-start", marginTop: 4 }}>Lihat lowongan foto</Button> },
          { id: "tulis", label: "Penulisan", icon: <Icon name="PenLine" size={16} />, count: 9,
            title: "Artikel, caption, dan penerjemahan",
            body: "Dibayar per artikel. Paling ramah untuk yang baru mulai freelance.",
            meta: [{ label: "Lowongan aktif", value: "9" }, { label: "Per artikel", value: "Rp 50.000" }],
            action: <Button size="sm" onClick={onDaftar} style={{ alignSelf: "flex-start", marginTop: 4 }}>Lihat lowongan tulis</Button> },
        ]} />
      </section>

      <section className="m-wrap m-sec">
        <div className="m-two">
          <Card padding="lg" style={{ gap: 16 }}>
            <span className="sl-overline">Untuk mahasiswa</span>
            <h3 style={{ fontSize: "var(--text-h1)" }}>Portofolio, pengalaman, dan penghasilan pertama.</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Verifikasi KTM sekali, berlaku untuk semua proyek", "Tidak ada biaya pendaftaran; biaya layanan 5% dari nilai kontrak", "Chat dan berkas tersimpan sebagai bukti kalau terjadi sengketa"].map((t) => (
                <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Icon name="Check" size={17} color="var(--success)" />
                  <span className="sl-body" style={{ color: "var(--text-body)" }}>{t}</span>
                </li>
              ))}
            </ul>
            <Button onClick={onDaftar} style={{ alignSelf: "flex-start" }}>Daftar sebagai mahasiswa</Button>
          </Card>
          <Card padding="lg" style={{ gap: 16, background: "var(--ink-surface)", borderColor: "transparent" }}>
            <span className="sl-overline" style={{ color: "var(--ink-text-subtle)" }}>Untuk bisnis &amp; UMKM</span>
            <h3 style={{ fontSize: "var(--text-h1)", color: "var(--ink-text)" }}>Bayar setelah hasilnya sesuai.</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Dana kamu ditahan StairsLife, bukan langsung ke mahasiswa", "Pilih dari pelamar yang identitas dan kampusnya sudah dicek", "Minta revisi atau ajukan sengketa selama dana masih di escrow"].map((t) => (
                <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Icon name="Check" size={17} color="var(--ink-success)" />
                  <span className="sl-body" style={{ color: "var(--ink-text-muted)" }}>{t}</span>
                </li>
              ))}
            </ul>
            <Button onClick={onDaftar} style={{ alignSelf: "flex-start", background: "var(--sand-25)", color: "var(--sand-950)" }}>Posting proyek</Button>
          </Card>
        </div>
      </section>

      <section className="m-wrap m-sec" style={{ paddingTop: 0, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "var(--text-h1)" }}>Proyek yang baru tayang</h2>
          <Button variant="ghost" iconRight={<Icon name="ChevronRight" size={16} />}>Lihat semua proyek</Button>
        </div>
        <div className="m-cards">
          {[["Desain logo & brand kit untuk kedai kopi", "Kopi Senja Malang", 2500000, "20 Sep 2026", ["Logo", "Branding"]],
            ["Ilustrasi menu & papan harga", "Warung Ibu Tri", 850000, "28 Sep 2026", ["Ilustrasi", "Menu"]],
            ["Landing page produk kopi bubuk", "Kopi Senja Malang", 3400000, "12 Okt 2026", ["Web", "Next.js"]]].map(([j, b, n, d, tg]) => (
            <Card key={j} interactive padding="md" style={{ gap: 10 }}>
              <b className="sl-body" style={{ color: "var(--text-strong)", fontWeight: "var(--weight-semibold)" }}>{j}</b>
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Avatar name={b} size="xs" shape="rounded" verified /><span className="sl-caption">{b}</span></span>
              <Money value={n} />
              <div style={{ display: "flex", gap: 6 }}>{tg.map((t) => <Tag key={t} size="sm">{t}</Tag>)}</div>
              <span className="sl-caption">Deadline {d}</span>
            </Card>
          ))}
        </div>
      </section>

      <section id="biaya" style={{ background: "var(--bg-subtle)", borderBlock: "1px solid var(--border-subtle)" }}>
        <div className="m-wrap m-sec" style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="sl-overline">Biaya</span>
              <h2 className="sl-display-2" style={{ maxWidth: "24ch" }}>Kami baru dibayar setelah kamu dibayar.</h2>
            </div>
            <p className="sl-body" style={{ color: "var(--text-muted)", maxWidth: "38ch" }}>
              Tidak ada biaya pendaftaran, tidak ada biaya posting, tidak ada langganan. StairsLife mengambil biaya layanan 5% dari nilai kontrak, dan hanya pada saat dana dilepas dari escrow.
            </p>
          </div>

          <div className="m-two">
            <Card padding="lg" style={{ gap: 16 }}>
              <span className="sl-overline">Contoh satu kontrak</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <span className="sl-body" style={{ color: "var(--text-muted)" }}>Nilai kontrak</span>
                  <Money value={2500000} size="md" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <span className="sl-body" style={{ color: "var(--text-muted)" }}>Dibayar bisnis ke escrow</span>
                  <Money value={2500000} size="md" tone="held" />
                </div>
                <div style={{ height: 1, background: "var(--border-subtle)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <span className="sl-body" style={{ color: "var(--text-muted)" }}>Biaya layanan 5%</span>
                  <span className="sl-tabular sl-body" style={{ fontWeight: "var(--weight-semibold)", color: "var(--text-muted)" }}>− Rp 125.000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <b className="sl-body" style={{ color: "var(--text-strong)" }}>Masuk dompet mahasiswa</b>
                  <Money value={2375000} size="lg" tone="in" />
                </div>
              </div>
              <span className="sl-caption" style={{ lineHeight: 1.55 }}>
                Biaya dipotong satu kali di akhir, saat kamu menyetujui hasil kerja dan dana dilepas. Kalau kontrak dibatalkan sebelum dana dilepas, tidak ada biaya sama sekali.
              </span>
            </Card>

            <Card padding="lg" style={{ gap: 14 }}>
              <span className="sl-overline">Yang tidak pernah kami tagih</span>
              <ul style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {[["Biaya pendaftaran", "Mahasiswa maupun bisnis, keduanya gratis mendaftar."],
                  ["Biaya memposting lowongan", "Posting sebanyak yang kamu butuhkan, tanpa batas slot."],
                  ["Langganan bulanan", "Tidak ada paket, tidak ada tagihan berulang, tidak ada perpanjangan otomatis."],
                  ["Biaya melamar", "Mahasiswa melamar sebanyak yang dia mau tanpa dipungut apa pun."]].map(([j, t]) => (
                  <li key={j} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <span style={{ flex: "none", marginTop: 1, color: "var(--success)", display: "flex" }}><Icon name="XCircle" size={17} /></span>
                    <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <b className="sl-body-sm" style={{ color: "var(--text-strong)" }}>{j}</b>
                      <span className="sl-caption" style={{ lineHeight: 1.5 }}>{t}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <span className="sl-caption" style={{ lineHeight: 1.55, paddingTop: 4 }}>
                Kepentingan kami sama dengan kepentinganmu: kami hanya dapat pemasukan kalau pekerjaan benar-benar selesai dan dibayar.
              </span>
            </Card>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--clay-surface)", color: "var(--clay-surface-text)" }}>
        <div className="m-wrap" style={{ padding: "56px 0", display: "flex", gap: 40, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "34ch" }}>
            <h2 className="sl-display-2" style={{ color: "var(--clay-surface-text)" }}>Satu langkah, mulai dari sekarang.</h2>
            <p className="sl-body-lg" style={{ color: "var(--clay-surface-text)" }}>Buat akun, verifikasi identitas, dan lamar proyek pertamamu hari ini.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button size="lg" onClick={onDaftar} style={{ background: "#FFFFFF", color: "#7C3A14" }}>Daftar gratis</Button>
              <Button size="lg" variant="ghost" style={{ color: "var(--clay-surface-text)", borderColor: "var(--clay-surface-border)", border: "1px solid var(--clay-surface-border)" }}>Pelajari escrow</Button>
            </div>
          </div>
          <span className="m-hide-sm"><Tangga size={1.5} color="var(--clay-surface-text)" /></span>
        </div>
      </section>

      <footer style={{ background: "var(--ink-surface)", color: "var(--ink-text-muted)" }}>
        <div className="m-wrap" style={{ padding: "44px 0 32px", display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Logo size={22} color="var(--ink-text)" basePath="../../assets" />
            </span>
            <p className="sl-caption" style={{ color: "var(--ink-text-subtle)" }}>Marketplace freelance untuk mahasiswa Indonesia dan bisnis lokal. Dana dijamin escrow.</p>
          </div>
          {[["Produk", ["Cari proyek", "Posting proyek", "Escrow & pembayaran", "Verifikasi identitas"]],
            ["Bantuan", ["Pusat bantuan", "Cara mengajukan sengketa", "Biaya layanan", "Hubungi kami"]],
            ["Perusahaan", ["Tentang StairsLife", "Karier", "Syarat & ketentuan", "Kebijakan privasi"]]].map(([h, xs]) => (
            <div key={h} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span className="sl-overline" style={{ color: "var(--ink-text-subtle)" }}>{h}</span>
              {xs.map((x) => <a key={x} href="#cara" className="sl-body-sm" style={{ color: "var(--ink-text-muted)", textDecoration: "none" }}>{x}</a>)}
            </div>
          ))}
        </div>
        <div className="m-wrap" style={{ padding: "16px 0 28px", borderTop: "1px solid var(--ink-border)", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <span className="sl-caption" style={{ color: "var(--ink-text-subtle)" }}>© 2026 StairsLife. Malang, Indonesia.</span>
          <span className="sl-caption" style={{ color: "var(--ink-text-subtle)" }}>Bahasa Indonesia · Rp IDR</span>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { ScreenLanding, Tangga });
