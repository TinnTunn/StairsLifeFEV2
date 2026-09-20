// Pemilih tanggal.

"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import {
  dalamBatas,
  dariIso,
  hariIni,
  keIso,
  samaHari,
  selKalender,
  tambahBulan,
  tambahHari,
} from "@/lib/tanggal";
import { Icon } from "../actions/Icon";
import { FieldShell, fieldStyles as f, type FieldMeta } from "./FieldShell";
import styles from "./PemilihTanggal.module.css";

export interface PemilihTanggalProps extends FieldMeta {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  id?: string;
  pintasan?: boolean;
}

export function PemilihTanggal({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  min = keIso(hariIni()),
  max,
  id,
  pintasan = true,
}: PemilihTanggalProps) {
  const { t } = useBahasa();
  const k = t.fitur.tanggal;
  const idAcak = useId();
  const dasar = id ?? `tgl-${idAcak.replace(/:/g, "")}`;
  const ids = { id: dasar, errorId: `${dasar}-err`, hintId: `${dasar}-hint`, dialog: `${dasar}-kalender`, bulan: `${dasar}-bulan` };

  const terpilih = dariIso(value);
  const [buka, setBuka] = useState(false);
  const [fokus, setFokus] = useState<Date>(() => terpilih ?? dariIso(min) ?? hariIni());
  const akar = useRef<HTMLDivElement>(null);
  const pemicu = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const fokusKeGrid = useRef(true);

  const bulan = new Date(fokus.getFullYear(), fokus.getMonth(), 1);
  const sel = selKalender(bulan);
  const sekarang = hariIni();

  function tulisLengkap(d: Date) {
    return `${k.hariPanjang[d.getDay()]}, ${d.getDate()} ${k.bulanPanjang[d.getMonth()]} ${d.getFullYear()}`;
  }

  function bukaKalender() {
    fokusKeGrid.current = true;
    setFokus(terpilih ?? dariIso(min) ?? hariIni());
    setBuka(true);
  }

  function tutup(kembalikanFokus = true) {
    setBuka(false);
    if (kembalikanFokus) pemicu.current?.focus();
  }

  function pilih(d: Date) {
    if (!dalamBatas(d, min, max)) return;
    onChange(keIso(d));
    tutup();
  }

  useEffect(() => {
    if (!buka || !fokusKeGrid.current) return;
    grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${keIso(fokus)}"]`)?.focus();
  }, [buka, fokus]);

  useEffect(() => {
    if (!buka) return;
    const diLuar = (e: PointerEvent) => {
      if (akar.current && !akar.current.contains(e.target as Node)) setBuka(false);
    };
    document.addEventListener("pointerdown", diLuar);
    return () => document.removeEventListener("pointerdown", diLuar);
  }, [buka]);

  function tombolGrid(e: KeyboardEvent<HTMLDivElement>) {
    const peta: Record<string, () => Date> = {
      ArrowLeft: () => tambahHari(fokus, -1),
      ArrowRight: () => tambahHari(fokus, 1),
      ArrowUp: () => tambahHari(fokus, -7),
      ArrowDown: () => tambahHari(fokus, 7),
      Home: () => tambahHari(fokus, -((fokus.getDay() + 6) % 7)),
      End: () => tambahHari(fokus, 6 - ((fokus.getDay() + 6) % 7)),
      PageUp: () => tambahBulan(fokus, -1),
      PageDown: () => tambahBulan(fokus, 1),
    };
    if (e.key === "Escape") {
      e.preventDefault();
      tutup();
      return;
    }
    const langkah = peta[e.key];
    if (langkah) {
      e.preventDefault();
      fokusKeGrid.current = true;
      setFokus(langkah());
    }
  }

  const minggu = Array.from({ length: 6 }, (_, i) => sel.slice(i * 7, i * 7 + 7));
  const PINTASAN: Array<[string, Date]> = [
    [k.pintasan.minggu, tambahHari(sekarang, 7)],
    [k.pintasan.duaMinggu, tambahHari(sekarang, 14)],
    [k.pintasan.bulan, tambahBulan(sekarang, 1)],
  ];

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={ids.id}
      errorId={ids.errorId}
      hintId={ids.hintId}
    >
      <div className={styles.akar} ref={akar}>
        <button
          ref={pemicu}
          type="button"
          id={ids.id}
          className={[f.control, f.md, styles.pemicu, error ? f.invalid : ""].filter(Boolean).join(" ")}
          aria-haspopup="dialog"
          aria-expanded={buka}
          aria-controls={buka ? ids.dialog : undefined}
          aria-describedby={error ? ids.errorId : hint ? ids.hintId : undefined}
          onClick={() => (buka ? tutup(false) : bukaKalender())}
        >
          <Icon name="CalendarDays" size={18} />
          <span className={terpilih ? styles.nilai : styles.kosong}>{terpilih ? tulisLengkap(terpilih) : k.belumDipilih}</span>
          <span className={styles.srOnly}>{k.pilih}</span>
        </button>

        {pintasan ? (
          <div className={styles.pintasan} role="group" aria-label={k.pintasanLabel}>
            {PINTASAN.filter(([, d]) => dalamBatas(d, min, max)).map(([teks, d]) => (
              <button
                key={teks}
                type="button"
                className={styles.chip}
                aria-pressed={samaHari(terpilih, d)}
                onClick={() => onChange(keIso(d))}
              >
                {teks}
              </button>
            ))}
          </div>
        ) : null}

        {buka ? (
          <div className={styles.panel} role="dialog" id={ids.dialog} aria-modal="false" aria-labelledby={ids.bulan}>
            <div className={styles.kepala}>
              <button
                type="button"
                className={styles.navBulan}
                aria-label={k.bulanSebelum}
                onClick={() => {
                  fokusKeGrid.current = false;
                  setFokus(tambahBulan(fokus, -1));
                }}
              >
                <Icon name="ChevronLeft" size={18} />
              </button>
              <span className={styles.judulBulan} id={ids.bulan} aria-live="polite">
                {k.bulanPanjang[bulan.getMonth()]} {bulan.getFullYear()}
              </span>
              <button
                type="button"
                className={styles.navBulan}
                aria-label={k.bulanBerikut}
                onClick={() => {
                  fokusKeGrid.current = false;
                  setFokus(tambahBulan(fokus, 1));
                }}
              >
                <Icon name="ChevronRight" size={18} />
              </button>
            </div>

            <div role="grid" aria-labelledby={ids.bulan} ref={grid} onKeyDown={tombolGrid} className={styles.grid}>
              <div role="row" className={styles.baris}>
                {k.hariPendek.map((h) => (
                  <span key={h} role="columnheader" className={styles.namaHari}>
                    {h}
                  </span>
                ))}
              </div>
              {minggu.map((baris) => (
                <div role="row" className={styles.baris} key={keIso(baris[0])}>
                  {baris.map((d) => {
                    const iso = keIso(d);
                    const bisa = dalamBatas(d, min, max);
                    const luarBulan = d.getMonth() !== bulan.getMonth();
                    return (
                      <span role="gridcell" key={iso} aria-selected={samaHari(d, terpilih)}>
                        <button
                          type="button"
                          data-iso={iso}
                          className={styles.hari}
                          data-luar={String(luarBulan)}
                          data-hari-ini={String(samaHari(d, sekarang))}
                          data-terpilih={String(samaHari(d, terpilih))}
                          tabIndex={samaHari(d, fokus) ? 0 : -1}
                          aria-disabled={!bisa || undefined}
                          aria-label={`${tulisLengkap(d)}${!bisa ? `. ${k.diLuarBatas}` : ""}`}
                          onClick={() => pilih(d)}
                          onFocus={() => !samaHari(d, fokus) && setFokus(d)}
                        >
                          {d.getDate()}
                        </button>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className={styles.kaki}>
              {!required && value ? (
                <button type="button" className={styles.teksTombol} onClick={() => { onChange(""); tutup(); }}>
                  {k.hapus}
                </button>
              ) : (
                <span />
              )}
              <button type="button" className={styles.teksTombol} onClick={() => tutup()}>
                {k.tutup}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
}
