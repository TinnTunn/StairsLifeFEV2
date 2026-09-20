// Lonceng notifikasi di bilah atas beserta jumlah yang belum dibaca.

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { notifications } from "@/lib/api/notifications";
import { USE_MOCK } from "@/lib/api/client";
import { formatWaktuRelatif } from "@/lib/format";
import { ruteNotifikasi, teksNotifikasi } from "@/lib/notifikasi";
import type { Notification, NotificationType } from "@/lib/types";
import { Icon, type IconName } from "../actions/Icon";
import styles from "./LoncengNotifikasi.module.css";

const JEDA_POLLING = 30_000;
export const EVENT_NOTIFIKASI = "sl-notifikasi-berubah";

export const IKON_NOTIFIKASI: Record<NotificationType, IconName> = {
  application: "Send",
  contract: "Kontrak",
  payment: "Wallet",
  review: "Star",
  dispute: "Scale",
  verification: "BadgeCheck",
  system: "Bell",
  withdrawal: "ArrowUpRight",
};

export function kabariNotifikasiBerubah() {
  window.dispatchEvent(new Event(EVENT_NOTIFIKASI));
}

export function LoncengNotifikasi() {
  const { t, bahasa } = useBahasa();
  const n = t.fitur.notifikasi;
  const router = useRouter();
  const pathname = usePathname();
  const [jumlah, setJumlah] = useState(0);
  const [bukaDi, setBukaDi] = useState<string | null>(null);
  const buka = bukaDi === pathname;
  const [daftar, setDaftar] = useState<Notification[] | null>(null);
  const [galat, setGalat] = useState(false);
  const akar = useRef<HTMLDivElement>(null);

  const muatJumlah = useCallback(() => {
    if (USE_MOCK || document.visibilityState !== "visible" || !navigator.onLine) return;
    notifications
      .unreadCount()
      .then((r) => setJumlah(r?.count ?? 0))
      .catch(() => {
        /* Lencana tidak kritis: gagal diam-diam, dicoba lagi di putaran berikut. */
      });
  }, []);

  useEffect(() => {
    muatJumlah();
  }, [pathname, muatJumlah]);

  useEffect(() => {
    const id = window.setInterval(muatJumlah, JEDA_POLLING);
    document.addEventListener("visibilitychange", muatJumlah);
    window.addEventListener(EVENT_NOTIFIKASI, muatJumlah);
    window.addEventListener("online", muatJumlah);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", muatJumlah);
      window.removeEventListener(EVENT_NOTIFIKASI, muatJumlah);
      window.removeEventListener("online", muatJumlah);
    };
  }, [muatJumlah]);

  useEffect(() => {
    if (!buka) return;
    const diLuar = (e: PointerEvent) => {
      if (akar.current && !akar.current.contains(e.target as Node)) setBukaDi(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBukaDi(null);
        akar.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", diLuar);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", diLuar);
      document.removeEventListener("keydown", esc);
    };
  }, [buka]);

  function alihkan() {
    if (buka) {
      setBukaDi(null);
      return;
    }
    setBukaDi(pathname);
    setGalat(false);
    if (USE_MOCK) {
      setDaftar([]);
      return;
    }
    notifications
      .list()
      .then((d) => setDaftar(d ?? []))
      .catch(() => setGalat(true));
  }

  function tandaiSemua() {
    setDaftar((d) => d?.map((x) => ({ ...x, is_read: true })) ?? d);
    setJumlah(0);
    void notifications.markAllRead().catch(() => muatJumlah());
  }

  function pilih(item: Notification) {
    const ke = ruteNotifikasi(item.action_url);
    if (!item.is_read) {
      setJumlah((j) => Math.max(0, j - 1));
      void notifications.markRead(item.id).catch(() => muatJumlah());
    }
    setBukaDi(null);
    if (ke) router.push(ke);
  }

  const labelTombol = jumlah > 0 ? n.labelBelumDibaca(jumlah) : n.label;
  const terbaru = (daftar ?? []).slice(0, 8);

  return (
    <div className={styles.akar} ref={akar}>
      <button
        type="button"
        className={styles.tombol}
        aria-label={labelTombol}
        title={labelTombol}
        aria-expanded={buka}
        aria-haspopup="true"
        onClick={alihkan}
      >
        <Icon name="Bell" size={20} />
        {jumlah > 0 ? (
          <span className={styles.lencana} aria-hidden="true">
            {jumlah > 9 ? "9+" : jumlah}
          </span>
        ) : null}
      </button>

      {buka ? (
        <div className={styles.panel} role="region" aria-label={n.judul}>
          <div className={styles.kepala}>
            <h2 className={styles.judul}>{n.judul}</h2>
            {(daftar ?? []).some((x) => !x.is_read) ? (
              <button type="button" className={styles.tautanKecil} onClick={tandaiSemua}>
                {n.tandaiSemua}
              </button>
            ) : null}
          </div>

          {galat ? (
            <p className={styles.status}>{n.gagal}</p>
          ) : daftar === null ? (
            <p className={styles.status} aria-live="polite">
              {n.memuat}
            </p>
          ) : terbaru.length === 0 ? (
            <div className={styles.kosong}>
              <b>{n.kosongJudul}</b>
              <span>{n.kosongIsi}</span>
            </div>
          ) : (
            <ul className={styles.daftar}>
              {terbaru.map((item) => {
                const teks = teksNotifikasi(item, n, bahasa);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={styles.item}
                      data-baru={String(!item.is_read)}
                      onClick={() => pilih(item)}
                    >
                      <span className={styles.ikon} aria-hidden="true">
                        <Icon name={IKON_NOTIFIKASI[item.type] ?? "Bell"} size={16} />
                      </span>
                      <span className={styles.teks}>
                        <span className={styles.itemJudul}>
                          {!item.is_read ? <span className={styles.srOnly}>{n.baru}: </span> : null}
                          {teks.judul}
                        </span>
                        {teks.isi ? <span className={styles.itemIsi}>{teks.isi}</span> : null}
                        <span className={styles.waktu}>
                          {n.jenis[item.type]} · {formatWaktuRelatif(item.created_at, bahasa)}
                        </span>
                      </span>
                      {!item.is_read ? <span className={styles.titik} aria-hidden="true" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <Link href="/notifikasi" className={styles.kaki} onClick={() => setBukaDi(null)}>
            {n.lihatSemua}
            <Icon name="ChevronRight" size={16} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
