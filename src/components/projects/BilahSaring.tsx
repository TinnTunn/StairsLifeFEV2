// Bilah pencarian dan saringan tingkat pada daftar proyek.

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Icon } from "@/components/actions/Icon";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { ProjectTier } from "@/lib/types";
import styles from "./BilahSaring.module.css";

const TIER: ProjectTier[] = ["pemula", "menengah", "mahir"];

export interface BilahSaringProps {
  basePath: string;
}

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

  const terbuka = diperluas || search !== "";

  useEffect(() => {
    if (!terbuka) return;
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
    requestAnimationFrame(() => kolom.current?.focus());
  }

  function kirim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
