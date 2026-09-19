"use client";

import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK, apiFetch } from "@/lib/api/client";
import { contractDeliverables } from "@/lib/data/work";
import { formatTanggalJam } from "@/lib/format";
import { parseDeliverableUrls, type Contract } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import app from "../../mahasiswa/dashboard.module.css";
import styles from "./kontrak.module.css";

/**
 * Berkas hasil kerja disimpan di bucket privat, jadi URL-nya bukan tautan yang
 * bisa dibuka langsung: kolomnya hanya menyimpan path storage. Tautan yang bisa
 * dipakai diminta saat diklik lewat endpoint signed-url, yang berlaku satu jam.
 */
function NamaBerkas({ path, urutan }: { path: string; urutan: number }) {
  const { t } = useBahasa();
  const h = t.aplikasi.kontrak.hasil;
  const [membuka, setMembuka] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Backend menyimpan berkas dengan nama acak dan tidak mencatat nama aslinya,
     jadi yang bisa ditampilkan dengan jujur hanya urutan dan jenisnya. */
  const ekstensi = path.includes(".") ? path.split(".").pop()?.toUpperCase() : undefined;

  async function buka() {
    setError(null);
    if (USE_MOCK) {
      setError(h.modeContoh);
      return;
    }
    /* Path publik (avatar, gambar chat) sudah berupa URL penuh; sisanya perlu
       ditandatangani dulu. */
    if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener");
      return;
    }
    /* Tab dibuka saat klik, sebelum menunggu signed URL. window.open setelah
       await tidak lagi dianggap bagian dari klik pengguna dan diblokir sebagai
       popup di Chrome dan Safari. */
    const tab = window.open("", "_blank");
    if (tab) tab.opener = null;
    setMembuka(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/upload/signed-url", { query: { path } });
      if (tab) tab.location.href = url;
      else window.location.assign(url);
    } catch (e) {
      tab?.close();
      setError(e instanceof ApiError ? e.message : h.gagalAmbil);
    } finally {
      setMembuka(false);
    }
  }

  return (
    <li className={styles.berkas}>
      <span className={styles.berkasIkon} aria-hidden="true">
        <Icon name="FileText" size={18} />
      </span>
      <span className={styles.berkasNama}>{h.berkas(urutan, ekstensi)}</span>
      <Button size="sm" variant="secondary" onClick={buka} loading={membuka} iconRight={<Icon name="ExternalLink" size={14} />}>
        {h.buka}
      </Button>
      {error ? (
        <span role="alert" className={app.galat}>
          {error}
        </span>
      ) : null}
    </li>
  );
}

export function Deliverables({ contract, mahasiswa }: { contract: Contract; mahasiswa: boolean }) {
  const { t, bahasa } = useBahasa();
  const h = t.aplikasi.kontrak.hasil;
  /* Dimuat ulang setiap status kontrak berubah, supaya riwayat ikut bertambah
     setelah kirim, setujui, atau minta perbaikan tanpa memuat ulang halaman. */
  const riwayat = useAsync(() => contractDeliverables(contract.id), [contract.id, contract.status]);
  const terkini = parseDeliverableUrls(contract.deliverable_url);
  const daftar = [...(riwayat.data?.data ?? [])].sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));

  /* contracts.deliverable_notes tidak bisa dipercaya sebagai catatan mahasiswa.
     Saat bisnis meminta perbaikan, backend menimpanya dengan alasan penolakan,
     dan kiriman ulang tanpa catatan tidak menghapusnya. Riwayat menyimpan
     catatan dan alasan di kolom terpisah per kiriman, jadi keduanya dibaca dari
     sana. Kolom kontrak hanya dipakai kalau riwayatnya kosong. */
  const revisi = terkini.length === 0 ? daftar.find((d) => d.status === "rejected") : undefined;
  const catatanKini =
    terkini.length > 0 ? (daftar.length > 0 ? daftar[0].deliverable_notes : contract.deliverable_notes) : null;

  if (terkini.length === 0 && daftar.length === 0) return null;

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>
        <span className={styles.cardIkon} aria-hidden="true">
          <Icon name="PackageCheck" size={18} />
        </span>
        {h.judul}
      </h3>

      {revisi ? (
        <div className={styles.revisi} role="status">
          <b className={styles.revisiTitle}>
            {mahasiswa ? h.perbaikanDariBisnis : h.perbaikanDariKamu}
            {revisi.reviewed_at ? `, ${formatTanggalJam(revisi.reviewed_at, bahasa)}` : ""}
          </b>
          <span>{revisi.rejection_reason ?? h.tanpaCatatan}</span>
        </div>
      ) : null}

      {terkini.length > 0 ? (
        <>
          {catatanKini ? <p className={styles.warn}>{h.catatanMahasiswa(catatanKini)}</p> : null}
          <ul className={styles.rows}>
            {terkini.map((path, i) => (
              <NamaBerkas key={path} path={path} urutan={i + 1} />
            ))}
          </ul>
        </>
      ) : null}

      {daftar.length > 0 ? (
        <>
          <h4 className={styles.subTitle}>{h.riwayat}</h4>
          <ul className={styles.rows}>
            {daftar.map((d) => (
              <li key={d.id} className={styles.row}>
                <span className={`${styles.rowLabel} ${styles.riwayat}`}>
                  <Icon name="Clock" size={14} /> {formatTanggalJam(d.submitted_at, bahasa)}, {h.status[d.status]}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
