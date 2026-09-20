// Halaman beranda publik.

import type { Metadata } from "next";
import { Button } from "@/components/actions/Button";
import { Icon, type IconName } from "@/components/actions/Icon";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { ambilKamus } from "@/i18n/server";
import { listProjects } from "@/lib/data/projects";
import { ambilPengaturanServer } from "@/lib/pengaturan-server";
import { AngkaNaik } from "./_beranda/AngkaNaik";
import { AudienceSwitcher } from "./_beranda/AudienceSwitcher";
import { HeroCard } from "./_beranda/HeroCard";
import { Parallax } from "./_beranda/Parallax";
import styles from "./_beranda/beranda.module.css";
import hero from "./_beranda/beranda-hero.module.css";
import { AkhiriSesi } from "./_beranda/AkhiriSesi";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await ambilKamus();
  return { title: { absolute: t.beranda.meta.judul } };
}

const WARNA_LANGKAH = ["brandSoft", "cream", "tinta", "brand"] as const;

const FITUR: { icon: IconName; warna: string }[] = [
  { icon: "Terverifikasi", warna: "brand" },
  { icon: "Gembok", warna: "success" },
  { icon: "Kontrak", warna: "info" },
  { icon: "Komentar", warna: "rating" },
  { icon: "Bintang", warna: "rating" },
  { icon: "Dompet", warna: "warm" },
];

const NILAI_IKON = ["/assets/ikon/perisai.svg", "/assets/ikon/mata.svg", "/assets/ikon/pelukan.svg"];
const LINIMASA_WARNA = ["success", "warning", "brand"] as const;

export default async function Beranda() {
  const { t, bahasa } = await ambilKamus();
  const b = t.beranda;
  const [{ items, sample }, pengaturan] = await Promise.all([listProjects({}, bahasa), ambilPengaturanServer()]);

  return (
    <>
      <AkhiriSesi />
      {sample ? <SampleDataNotice /> : null}
      <Parallax />

      <section className={hero.hero}>
        <span className={`${hero.orb} ${hero.orbKiri}`} data-parallax="-0.14" aria-hidden="true" />
        <span className={`${hero.orb} ${hero.orbKanan}`} data-parallax="0.18" aria-hidden="true" />
        <div className={hero.inner}>
          <div className={hero.teks}>
            <span className={`${hero.badge} ${hero.masuk}`}>
              {b.hero.badge}
            </span>
            <h1 className={`${hero.judul} ${hero.masuk} ${hero.masuk1}`}>
              {b.hero.judul1}
              <br />
              <span className={hero.aksen}>{b.hero.judul2}</span>
            </h1>
            <p className={`${hero.deskripsi} ${hero.masuk} ${hero.masuk2}`}>{b.hero.deskripsi}</p>
            <div className={`${hero.aksi} ${hero.masuk} ${hero.masuk3}`}>
              <Button href="/daftar/mahasiswa" size="xl" iconRight={<Icon name="ChevronRight" size={20} />}>
                {b.hero.ctaUtama}
              </Button>
              <Button href="/daftar/bisnis" size="xl" variant="outlineWhite">
                {b.hero.ctaKedua}
              </Button>
            </div>
          </div>
          <div className={hero.kartuKolom}>
            <HeroCard project={items[0] ?? null} t={t} />
          </div>
        </div>
      </section>

      <section className={styles.stats} aria-label={b.statistik.label}>
        <div className={styles.statsGrid}>
          {[
            { nilai: <AngkaNaik nilai={items.length} />, label: b.statistik.proyekDibuka },
            ...(pengaturan
              ? [{ nilai: <AngkaNaik nilai={pengaturan.platform_fee} akhiran="%" />, label: b.statistik.komisi }]
              : []),
            { nilai: <AngkaNaik nilai={0} awalan="Rp " />, label: b.statistik.biayaPasang },
            { nilai: <AngkaNaik nilai={3} />, label: b.statistik.tingkat },
          ].map((s, i) => (
            <div key={s.label} className={styles.stat} data-reveal="zoom" style={{ ["--urutan" as string]: i }}>
              <div className={styles.statVal}>{s.nilai}</div>
              <div className={styles.statLbl}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="judul-sisi">
        <div className={`${styles.eyebrowBlock} ${styles.centered}`} data-reveal>
          <span className={styles.eyebrow}>{b.sisi.eyebrow}</span>
          <h2 id="judul-sisi" className={styles.h2}>
            {b.sisi.judul}
          </h2>
        </div>
        <div data-reveal style={{ ["--urutan" as string]: 1 }}>
          <AudienceSwitcher />
        </div>
      </section>

      <section className={styles.sectionCream} id="cara-kerja" aria-labelledby="judul-cara-kerja">
        <div className={styles.section}>
          <div className={styles.eyebrowBlock} data-reveal>
            <span className={styles.eyebrow}>{b.caraKerja.eyebrow}</span>
            <h2 id="judul-cara-kerja" className={styles.h2}>
              {b.caraKerja.judul}
            </h2>
            <p className={styles.lead}>{b.caraKerja.isi}</p>
          </div>
          <ol className={styles.bento}>
            {b.caraKerja.langkah.map((l, i) => (
              <li
                key={l.judul}
                className={`${styles.b} ${styles.span6} ${styles[WARNA_LANGKAH[i]]}`}
                data-reveal
                style={{ ["--urutan" as string]: i }}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.bTitle}>{l.judul}</h3>
                <p className={styles.bText}>{l.isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} id="fitur" aria-labelledby="judul-fitur">
        <div className={styles.eyebrowBlock} data-reveal>
          <span className={styles.eyebrow}>{b.fitur.eyebrow}</span>
          <h2 id="judul-fitur" className={styles.h2}>
            {b.fitur.judul}
          </h2>
          <p className={styles.lead}>{b.fitur.isi}</p>
        </div>
        <ul className={styles.bento}>
          {b.fitur.daftar.map((f, i) => (
            <li
              key={f.judul}
              className={`${styles.b} ${styles.span4} ${styles.cream} ${styles.featureTile}`}
              data-reveal
              style={{ ["--urutan" as string]: i % 3 }}
            >
              <span className={styles.featIco} data-warna={FITUR[i].warna}>
                <Icon name={FITUR[i].icon} size={24} />
              </span>
              <h3 className={styles.bTitle}>{f.judul}</h3>
              <p className={styles.bText}>{f.isi}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.sectionCream} id="tentang" aria-labelledby="judul-tentang">
        <div className={styles.section}>
          <div className={`${styles.eyebrowBlock} ${styles.centered}`} data-reveal>
            <span className={styles.eyebrow}>{b.tentang.eyebrow}</span>
            <h2 id="judul-tentang" className={styles.h2}>
              {b.tentang.judul}
            </h2>
            <p className={styles.lead}>{b.tentang.isi}</p>
          </div>

          <div className={styles.tentangGrid}>
            <div className={styles.kartuBesar} data-reveal="kiri">
              <h3 className={styles.kartuJudul}>{b.tentang.sejarahJudul}</h3>
              <p className={styles.kartuTeks}>{b.tentang.sejarahIsi}</p>
              <ul className={styles.linimasa}>
                {b.tentang.linimasa.map((l, i) => (
                  <li key={l.judul} className={styles.linimasaItem}>
                    <span className={styles.pill} data-warna={LINIMASA_WARNA[i]}>
                      {l.badge}
                    </span>
                    <div>
                      <div className={styles.linimasaJudul}>{l.judul}</div>
                      <p className={styles.linimasaTeks}>{l.isi}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.kartuBesar} data-reveal="kanan">
              <h3 className={styles.kartuJudul}>{b.tentang.nilaiJudul}</h3>
              <ul className={styles.nilai}>
                {b.tentang.nilai.map((n, i) => (
                  <li key={n.judul} className={styles.nilaiItem}>
                    <span className={styles.nilaiIkon} aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={NILAI_IKON[i]} alt="" width={26} height={26} className={styles.nilaiGambar} />
                    </span>
                    <div>
                      <div className={styles.linimasaJudul}>{n.judul}</div>
                      <p className={styles.linimasaTeks}>{n.isi}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.garis} />
              <div className={styles.tentangAksi}>
                <Button href="/daftar" size="lg" fullWidth>
                  {b.tentang.ctaMulai}
                </Button>
                <Button href="/#cara-kerja" size="lg" variant="ghost" fullWidth>
                  {b.tentang.ctaCaraKerja}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.cta} sl-noise`}>
        <div className={styles.ctaInner} data-reveal="zoom">
          <h2 className={styles.ctaTitle}>{b.cta.judul}</h2>
          <p className={styles.ctaDesc}>{b.cta.isi}</p>
          <div className={styles.ctaActions}>
            <Button href="/daftar/mahasiswa" size="xl" variant="white">
              {b.cta.mahasiswa}
            </Button>
            <Button href="/daftar/bisnis" size="xl" variant="outlineWhite">
              {b.cta.bisnis}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
