"use client";

import { useState, type KeyboardEvent } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { formatTanggal } from "@/lib/format";
import styles from "./grafik.module.css";

export interface TitikGrafik {
  date: string;
  nilai: number;
}

/** Angka sumbu dibulatkan ke atas supaya garis atas selalu bilangan bersih. */
function batasAtas(maks: number): number {
  if (maks <= 0) return 1;
  if (maks <= 5) return maks;
  const pangkat = 10 ** Math.floor(Math.log10(maks));
  return Math.ceil(maks / pangkat) * pangkat;
}

/**
 * Grafik batang satu seri untuk hitungan harian 30 hari. Satu seri tidak
 * butuh legenda: judul kartu sudah menyebut yang digambar. Nilai tiap hari
 * tersedia lewat tooltip (arahkan kursor atau fokus lalu tombol panah) dan
 * lewat tabel, jadi tooltip tidak pernah jadi satu-satunya jalan.
 */
export function GrafikBatang({
  judul,
  data,
  format = (n) => String(n),
}: {
  judul: string;
  data: TitikGrafik[];
  format?: (n: number) => string;
}) {
  const { t, bahasa } = useBahasa();
  const [aktif, setAktif] = useState<number | null>(null);
  const atas = batasAtas(Math.max(0, ...data.map((d) => d.nilai)));

  function tombol(e: KeyboardEvent<HTMLDivElement>) {
    if (data.length === 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const langkah = e.key === "ArrowRight" ? 1 : -1;
      setAktif((i) => Math.min(data.length - 1, Math.max(0, (i ?? (langkah > 0 ? -1 : data.length)) + langkah)));
    }
    if (e.key === "Escape") setAktif(null);
  }

  const titik = aktif !== null ? data[aktif] : null;
  const tengah = Math.floor((data.length - 1) / 2);

  return (
    <figure className={styles.grafik}>
      <div className={styles.bidang}>
        <div className={styles.sumbuY} aria-hidden="true">
          <span>{format(atas)}</span>
          <span>{format(0)}</span>
        </div>
        <div
          className={styles.plot}
          role="img"
          aria-label={judul}
          tabIndex={0}
          onKeyDown={tombol}
          onBlur={() => setAktif(null)}
          onPointerLeave={() => setAktif(null)}
        >
          <span className={styles.garisAtas} aria-hidden="true" />
          <span className={styles.garisTengah} aria-hidden="true" />
          {data.map((d, i) => (
            <div
              key={d.date}
              className={styles.slot}
              data-aktif={aktif === i || undefined}
              onPointerEnter={() => setAktif(i)}
            >
              <span
                className={styles.batang}
                data-nol={d.nilai === 0 || undefined}
                style={{ height: `${(d.nilai / atas) * 100}%` }}
              />
            </div>
          ))}
          {titik && aktif !== null ? (
            <div
              className={styles.tooltip}
              data-sisi={aktif > data.length / 2 ? "kiri" : "kanan"}
              style={{ ["--posisi" as string]: `${((aktif + 0.5) / data.length) * 100}%` }}
              aria-live="polite"
            >
              <b className={styles.tooltipNilai}>{format(titik.nilai)}</b>
              <span className={styles.tooltipTanggal}>{formatTanggal(titik.date, bahasa)}</span>
            </div>
          ) : null}
        </div>
      </div>
      {data.length > 0 ? (
        <div className={styles.sumbuX} aria-hidden="true">
          <span>{formatTanggal(data[0].date, bahasa)}</span>
          <span>{formatTanggal(data[tengah].date, bahasa)}</span>
          <span>{formatTanggal(data[data.length - 1].date, bahasa)}</span>
        </div>
      ) : null}
      <details className={styles.tabel}>
        <summary>{t.admin.umum.lihatTabel}</summary>
        <div className={styles.tabelGulir}>
          <table>
            <caption className="sl-visually-hidden">{`${t.admin.umum.tabelData}: ${judul}`}</caption>
            <thead>
              <tr>
                <th scope="col">{t.admin.umum.tanggal}</th>
                <th scope="col">{t.admin.umum.jumlah}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date}>
                  <td>{formatTanggal(d.date, bahasa)}</td>
                  <td>{format(d.nilai)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
