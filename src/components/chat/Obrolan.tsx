"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent , type ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { BATAS_PESAN, chat, type PesanObrolan, type SumberObrolan } from "@/lib/api/chat";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { formatJam, formatTanggal } from "@/lib/format";
import { Icon } from "../actions/Icon";
import { useSesiShell } from "../layout/KonteksShell";
import styles from "./Obrolan.module.css";

const JEDA_POLLING = 5_000;

type PesanLokal = PesanObrolan & { status?: "mengirim" | "gagal" };

/**
 * Percakapan berbasis polling REST, bukan WebSocket. Endpoint REST backend
 * sudah menandai pesan dibaca dan memancarkan event realtime ke pihak lain;
 * menarik setiap 5 detik selama tab terlihat cukup untuk percakapan kerja,
 * dan tidak menambah koneksi terbuka atau aturan CSP untuk socket.
 */
export function Obrolan({
  sumber,
  pembuka,
  kepala,
  onLawan,
}: {
  sumber: SumberObrolan;
  /** Catatan di atas percakapan, mis. peringatan bertransaksi di luar platform. */
  pembuka?: string;
  /** Kepala percakapan (lawan bicara dan tombol kembali) yang menempel di kotak. */
  kepala?: ReactNode;
  onLawan?: (lawan: { id: string; full_name: string } | null) => void;
}) {
  const { t, bahasa } = useBahasa();
  const c = t.fitur.pesan;
  const session = useSesiShell();
  const akuId = session.user.id;

  const [pesan, setPesan] = useState<PesanLokal[] | null>(null);
  const [galatMuat, setGalatMuat] = useState<string | null>(null);
  /* Nama lawan bicara dipakai sebagai cadangan label gelembung: pesan yang
     datang lewat realtime tidak selalu membawa objek pengirimnya, dan tanpa ini
     pesan yang sama tertulis "pihak lain" sekarang lalu bernama sungguhan
     setelah halaman dimuat ulang. */
  const [namaLawan, setNamaLawan] = useState<string | null>(null);
  const [draf, setDraf] = useState("");
  const daftar = useRef<HTMLDivElement>(null);
  const diBawah = useRef(true);
  const urutLokal = useRef(0);
  const kunci = sumber.jenis === "bantuan" ? "bantuan" : `${sumber.jenis}:${sumber.id}`;

  const onLawanRef = useRef(onLawan);
  useEffect(() => {
    onLawanRef.current = onLawan;
  });

  useEffect(() => {
    let batal = false;
    /* setState hanya di dalam callback promise, tidak langsung di badan efek. */
    const tarik = () => {
      const permintaan = USE_MOCK ? Promise.resolve({ pesan: [] as PesanObrolan[], lawan: null }) : chat.ambil(sumber);
      permintaan
        .then((r) => {
          if (batal) return;
          setNamaLawan(r.lawan?.full_name ?? null);
          onLawanRef.current?.(r.lawan ?? null);
          setGalatMuat(null);
          setPesan((lama) => {
            // Pesan yang masih dikirim atau gagal tetap tampil di bawah.
            const tertunda = (lama ?? []).filter((p) => p.status);
            return [...r.pesan, ...tertunda];
          });
        })
        .catch((e: unknown) => {
          if (!batal) setGalatMuat(e instanceof ApiError ? e.message : t.umum.galat.jaringan);
        });
    };
    tarik();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) tarik();
    }, JEDA_POLLING);
    const saatTerlihat = () => {
      if (document.visibilityState === "visible" && navigator.onLine) tarik();
    };
    document.addEventListener("visibilitychange", saatTerlihat);
    /* Saat jaringan putus, polling hanya menumpuk galat. Berhenti selama offline
       lalu tarik sekali begitu koneksi kembali. */
    window.addEventListener("online", saatTerlihat);
    return () => {
      batal = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", saatTerlihat);
      window.removeEventListener("online", saatTerlihat);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci]);

  /* Gulir ke bawah hanya bila pengguna memang sedang di bawah, supaya pesan
     baru tidak menarik orang yang sedang membaca riwayat. */
  useLayoutEffect(() => {
    const el = daftar.current;
    if (el && diBawah.current) el.scrollTop = el.scrollHeight;
  }, [pesan]);

  function catatPosisi() {
    const el = daftar.current;
    if (el) diBawah.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  async function kirim(isi: string, ulangId?: string) {
    const teks = isi.trim();
    if (!teks || teks.length > BATAS_PESAN) return;
    urutLokal.current += 1;
    const idLokal = ulangId ?? `lokal-${urutLokal.current}`;
    const sementara: PesanLokal = {
      id: idLokal,
      sender_id: akuId,
      content: teks,
      created_at: new Date().toISOString(),
      status: "mengirim",
    };
    diBawah.current = true;
    setPesan((lama) => [...(lama ?? []).filter((p) => p.id !== idLokal), sementara]);
    if (!ulangId) setDraf("");

    if (USE_MOCK) {
      setPesan((lama) => (lama ?? []).map((p) => (p.id === idLokal ? { ...p, status: "gagal" } : p)));
      return;
    }
    try {
      const terkirim = await chat.kirim(sumber, teks);
      setPesan((lama) => [...(lama ?? []).filter((p) => p.id !== idLokal && p.id !== terkirim.id), terkirim]);
    } catch {
      setPesan((lama) => (lama ?? []).map((p) => (p.id === idLokal ? { ...p, status: "gagal" } : p)));
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void kirim(draf);
  }

  function tombol(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void kirim(draf);
    }
  }

  function namaPengirim(p: PesanObrolan): string {
    if (p.sender_id === akuId) return c.kamu;
    if (p.sender?.role === "admin" || p.sender_role === "admin") return c.tim;
    return p.sender?.full_name ?? namaLawan ?? t.aplikasi.umum.pihakLain;
  }

  const panjang = draf.length;
  let hariSebelum = "";

  return (
    <div className={styles.obrolan}>
      {kepala ? <div className={styles.kepala}>{kepala}</div> : null}
      {pembuka ? (
        <p className={styles.pembuka}>
          <Icon name="ShieldCheck" size={16} />
          <span>{pembuka}</span>
        </p>
      ) : null}

      <div
        ref={daftar}
        className={styles.daftar}
        onScroll={catatPosisi}
        role="log"
        aria-live="polite"
        aria-label={c.obrolanKontrak}
        tabIndex={0}
      >
        {pesan === null ? (
          galatMuat ? (
            <p className={styles.status} role="alert">
              {c.gagal} {galatMuat}
            </p>
          ) : (
            <p className={styles.status}>{c.memuat}</p>
          )
        ) : pesan.length === 0 ? (
          <p className={styles.status}>{c.kosong}</p>
        ) : (
          pesan.map((p) => {
            const hari = formatTanggal(p.created_at, bahasa);
            const pemisah = hari !== hariSebelum;
            hariSebelum = hari;
            const milikku = p.sender_id === akuId;
            const admin = !milikku && (p.sender?.role === "admin" || p.sender_role === "admin");
            return (
              <div key={p.id} className={styles.kelompok}>
                {pemisah ? (
                  <div className={styles.hari}>
                    <span>{hari}</span>
                  </div>
                ) : null}
                <div className={styles.baris} data-milikku={String(milikku)}>
                  <div className={styles.gelembung} data-admin={String(admin)} data-status={p.status ?? "terkirim"}>
                    {!milikku ? <span className={styles.pengirim}>{namaPengirim(p)}</span> : null}
                    <p className={styles.isi}>{p.content}</p>
                    <span className={styles.waktu}>
                      {p.status === "mengirim" ? (
                        c.mengirim
                      ) : p.status === "gagal" ? (
                        <button type="button" className={styles.ulang} onClick={() => void kirim(p.content, p.id)}>
                          <Icon name="RotateCw" size={12} />
                          {c.gagalKirim}
                        </button>
                      ) : (
                        <>
                          <time dateTime={p.created_at}>{formatJam(p.created_at)}</time>
                          {/* Dua centang selalu, seperti aplikasi pesan yang sudah
                              dikenal: abu-abu berarti terkirim, biru berarti sudah
                              dibuka lawan bicara (backend menandainya saat ruang
                              dibuka). Warnanya yang berubah, bukan jumlahnya. */}
                          {milikku ? (
                            <span
                              className={styles.centang}
                              data-dibaca={String(p.is_read === true)}
                              title={p.is_read ? c.dibaca : c.terkirim}
                            >
                              <Icon name="CheckCheck" size={14} />
                              <span className="sl-visually-hidden">{p.is_read ? c.dibaca : c.terkirim}</span>
                            </span>
                          ) : null}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form className={styles.komposer} onSubmit={submit}>
        <label className={styles.srOnly} htmlFor={`tulis-${kunci}`}>
          {c.tulis}
        </label>
        <textarea
          id={`tulis-${kunci}`}
          className={styles.masukan}
          rows={2}
          value={draf}
          maxLength={BATAS_PESAN}
          placeholder={c.tulis}
          onChange={(e) => setDraf(e.target.value)}
          onKeyDown={tombol}
          aria-describedby={`petunjuk-${kunci}`}
        />
        <div className={styles.komposerKaki}>
          <span id={`petunjuk-${kunci}`} className={styles.petunjuk}>
            {panjang > BATAS_PESAN * 0.8 ? c.panjang(panjang, BATAS_PESAN) : c.kirimDenganEnter}
          </span>
          <button type="submit" className={styles.kirim} disabled={!draf.trim()}>
            <Icon name="Send" size={16} />
            {c.kirim}
          </button>
        </div>
      </form>
    </div>
  );
}
