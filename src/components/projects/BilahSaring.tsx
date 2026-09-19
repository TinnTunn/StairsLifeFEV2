"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Icon } from "@/components/actions/Icon";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { ProjectTier } from "@/lib/types";
import styles from "./BilahSaring.module.css";

const TIER: ProjectTier[] = ["pemula", "menengah", "mahir"];

export interface BilahSaringProps {
  /** Rute yang menampilkan hasilnya, misalnya /mahasiswa/cari. */
  basePath: string;
}

/**
 * Bilah saring proyek: kolom pencarian yang mengembang, lalu chip tingkat.
 *
 * Kolomnya mulai sebagai satu lingkaran ikon dan baru melebar saat ditekan.
 * Yang perlu dilihat orang di halaman ini adalah kartu proyeknya; sebuah kolom
 * panjang yang hampir selalu kosong hanya memakan baris teratas. Chip tingkat
 * duduk di baris yang sama dan bergeser mengikuti lebar kolom dengan durasi
 * yang sama, jadi baris ini bergerak sebagai satu benda.
 *
 * Kata kunci yang sedang berlaku menahan kolomnya tetap terbuka: saringan yang
 * bekerja tapi tidak terlihat membuat hasil yang sedikit tampak seperti
 * kesalahan.
 *
 * Saringan kategori sedang ditahan (lihat DECISIONS.md): satu-satunya penanda
 * proyek yang dipakai sekarang adalah tingkat, jadi hanya kata kunci dan tier
 * yang dikirim. Keduanya didukung backend; saringan lain akan terlihat bekerja
 * lalu mengembalikan hasil yang salah.
 */
export function BilahSaring({ basePath }: BilahSaringProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useBahasa();
  const s = t.proyek.saring;

  const search = params.get("search") ?? "";
  const tier = params.get("tier") ?? "";

  const [diperluas, setDiperluas] = useState(false);
  const kolom = useRef<HTMLInputElement>(null);
  const bingkai = useRef<HTMLFormElement>(null);

  /* Diturunkan dari URL, bukan disalin ke state lewat effect: begitu ada kata
     kunci aktif, kolomnya terbuka apa pun yang terjadi sebelumnya. */
  const terbuka = diperluas || search !== "";

  useEffect(() => {
    if (!terbuka) return;
    /* Menekan di luar melipat kolomnya kembali, tapi hanya kalau kosong:
       ketikan yang belum dikirim tidak boleh hilang karena klik nyasar. */
    const diLuar = (e: PointerEvent) => {
      if (bingkai.current?.contains(e.target as Node)) return;
      if (kolom.current?.value.trim()) return;
      setDiperluas(false);
    };
    document.addEventListener("pointerdown", diLuar);
    return () => document.removeEventListener("pointerdown", diLuar);
  }, [terbuka]);

  function pergi(next: URLSearchParams) {
    const query = next.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  function ubah(kunci: "search" | "tier", nilai: string) {
    const next = new URLSearchParams(params.toString());
    if (nilai) next.set(kunci, nilai);
    else next.delete(kunci);
    pergi(next);
  }

  function buka() {
    setDiperluas(true);
    /* Fokus menunggu satu frame: sebelum render berikutnya kolomnya masih
       terpotong selebar lingkaran, dan memfokuskan isi yang terpotong membuat
       sebagian peramban menggeser halaman. */
    requestAnimationFrame(() => kolom.current?.focus());
  }

  function kirim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    /* Saat masih terlipat, ikonnya bertugas membuka kolom, bukan mengirim
       pencarian kosong yang akan menghapus saringan orang. */
    if (!terbuka) {
      buka();
      return;
    }
    const isi = new FormData(event.currentTarget).get("search");
    ubah("search", typeof isi === "string" ? isi.trim() : "");
  }

  function tutup() {
    if (kolom.current) kolom.current.value = "";
    kolom.current?.blur();
    setDiperluas(false);
    if (search) ubah("search", "");
  }

  function tekan(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    tutup();
  }

  return (
    <div className={styles.bilah} data-buka={String(terbuka)}>
      <form ref={bingkai} className={styles.cari} onSubmit={kirim} role="search">
        <button
          type="submit"
          className={styles.tombolIkon}
          aria-expanded={terbuka}
          aria-controls="saring-kata-kunci"
          aria-label={terbuka ? s.terapkan : s.cari}
          title={terbuka ? s.terapkan : s.cari}
        >
          <Icon name="Search" size={18} />
        </button>

        {/* Kolom tak terkendali dengan key mengikuti URL: begitu kata kunci
            berubah dari luar (chip, tombol hapus, Back), kolomnya dipasang
            ulang dengan nilai baru tanpa state yang bisa basi. */}
        <input
          key={search}
          ref={kolom}
          id="saring-kata-kunci"
          type="search"
          name="search"
          className={styles.masukan}
          defaultValue={search}
          placeholder={s.cariContoh}
          aria-label={s.cari}
          /* Saat terlipat kolomnya dilewati Tab: yang mewakili pencarian di
             urutan keyboard adalah tombol ikonnya. */
          tabIndex={terbuka ? undefined : -1}
          onKeyDown={tekan}
        />

        <button
          type="button"
          className={styles.tombolTutup}
          onClick={tutup}
          aria-label={s.tutupCari}
          title={s.tutupCari}
          tabIndex={terbuka ? undefined : -1}
        >
          <Icon name="XCircle" size={18} />
        </button>
      </form>

      <div className={styles.chips} role="group" aria-label={s.chipTingkat}>
        <button
          type="button"
          className={styles.chip}
          style={{ ["--urutan" as string]: 0 }}
          data-aktif={String(tier === "")}
          aria-pressed={tier === ""}
          onClick={() => ubah("tier", "")}
        >
          {s.semua}
        </button>
        {TIER.map((v, i) => (
          <button
            key={v}
            type="button"
            className={styles.chip}
            style={{ ["--urutan" as string]: i + 1 }}
            data-aktif={String(tier === v)}
            aria-pressed={tier === v}
            onClick={() => ubah("tier", tier === v ? "" : v)}
          >
            {t.umum.tingkat[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
