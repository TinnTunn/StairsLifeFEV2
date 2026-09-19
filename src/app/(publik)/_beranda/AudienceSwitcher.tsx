"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon, type IconName } from "@/components/actions/Icon";
import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./beranda.module.css";

type Sisi = "mahasiswa" | "bisnis";
const URUTAN: Sisi[] = ["mahasiswa", "bisnis"];

/* Ikon dan warna chip per kartu, mengikuti feat-ico V2. */
const GAYA: Record<Sisi, { icon: IconName; warna: string }[]> = {
  mahasiswa: [
    { icon: "BadgeCheck", warna: "brand" },
    { icon: "Clock", warna: "rating" },
    { icon: "Wallet", warna: "success" },
  ],
  bisnis: [
    { icon: "UserSearch", warna: "info" },
    { icon: "Lock", warna: "success" },
    { icon: "Kontrak", warna: "brand" },
  ],
};

/**
 * Pengalih "Untuk Mahasiswa / Untuk UMKM" dari landing V2: segmented control
 * dengan penanda yang bergeser, kartu yang masuk ulang setiap sisi berganti.
 */
export function AudienceSwitcher() {
  const { t } = useBahasa();
  const s = t.beranda.sisi;
  const [sisi, setSisi] = useState<Sisi>("mahasiswa");
  const tombol = useRef<Record<Sisi, HTMLButtonElement | null>>({ mahasiswa: null, bisnis: null });

  function panah(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const i = URUTAN.indexOf(sisi);
    const tujuan =
      e.key === "Home" ? URUTAN[0] : e.key === "End" ? URUTAN[1] : URUTAN[(i + (e.key === "ArrowRight" ? 1 : -1) + 2) % 2];
    setSisi(tujuan);
    tombol.current[tujuan]?.focus();
  }

  const kartu = sisi === "mahasiswa" ? s.mahasiswa : s.bisnis;

  return (
    <div className={styles.audWrap}>
      <div className={styles.audToggle} role="tablist" aria-label={s.label} data-aktif={sisi}>
        <span className={styles.audThumb} aria-hidden="true" />
        {URUTAN.map((x) => (
          <button
            key={x}
            ref={(el) => {
              tombol.current[x] = el;
            }}
            type="button"
            role="tab"
            id={`tab-sisi-${x}`}
            aria-selected={sisi === x}
            aria-controls="panel-sisi"
            tabIndex={sisi === x ? 0 : -1}
            className={styles.audTab}
            onClick={() => setSisi(x)}
            onKeyDown={panah}
          >
            {x === "mahasiswa" ? s.tabMahasiswa : s.tabBisnis}
          </button>
        ))}
      </div>

      <div key={sisi} id="panel-sisi" role="tabpanel" aria-labelledby={`tab-sisi-${sisi}`} className={styles.audPanel}>
        <ul className={styles.audCards}>
          {kartu.map((k, i) => (
            <li key={k.judul} className={styles.audCard} style={{ ["--urutan" as string]: i }}>
              <span className={styles.featIco} data-warna={GAYA[sisi][i].warna}>
                <Icon name={GAYA[sisi][i].icon} size={22} />
              </span>
              <h3 className={styles.audCardTitle}>{k.judul}</h3>
              <p className={styles.audCardDesc}>{k.isi}</p>
            </li>
          ))}
        </ul>
        <Button href={sisi === "mahasiswa" ? "/daftar/mahasiswa" : "/daftar/bisnis"} size="lg">
          {sisi === "mahasiswa" ? s.ctaMahasiswa : s.ctaBisnis}
        </Button>
      </div>
    </div>
  );
}
