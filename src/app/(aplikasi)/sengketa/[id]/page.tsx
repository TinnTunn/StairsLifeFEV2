"use client";

import { use, useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Obrolan } from "@/components/chat/Obrolan";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { TombolBerkas } from "@/components/data/TombolBerkas";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { FileDropzone } from "@/components/forms/FileDropzone";
import { Halaman, useSesiShell } from "@/components/layout/KonteksShell";
import { ContractStepper } from "@/components/navigation/ContractStepper";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { Kamus } from "@/i18n/kamus";
import { ApiError, USE_MOCK, apiUpload, berkasTerlaluBesar } from "@/lib/api/client";
import { disputes, gabungBukti, sengketaAktif, type DisputeDetail } from "@/lib/api/disputes";
import { formatRupiah, formatTanggal, formatTanggalJam } from "@/lib/format";
import { DISPUTE_STATUS, PAYMENT_STATUS } from "@/lib/status";
import { parseDeliverableUrls, type DisputeStatus, type UploadResult } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import app from "../../mahasiswa/dashboard.module.css";
import styles from "../sengketa.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

export default function DetailSengketa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  return (
    <Halaman title={t.fitur.sengketa.detailJudul}>
      <Isi id={id} />
    </Halaman>
  );
}

function Isi({ id }: { id: string }) {
  const { t, bahasa } = useBahasa();
  const s = t.fitur.sengketa;
  const session = useSesiShell();
  const hasil = useAsync(() => disputes.detail(id), [id]);

  if (USE_MOCK) return <EmptyState icon="Scale" title={s.tidakDitemukan} description={t.aplikasi.umum.modeContoh} />;
  if (hasil.loading) return <SkeletonCard lines={5} label={s.memuat} />;
  if (hasil.error || !hasil.data) {
    return (
      <EmptyState
        icon="SearchX"
        title={s.tidakDitemukan}
        description={hasil.error ?? undefined}
        action={<Button href="/sengketa">{s.daftarJudul}</Button>}
      />
    );
  }

  const x = hasil.data;
  const status = x.status ?? "open";
  const aktif = sengketaAktif(status);
  const kontrak = x.contracts;
  const bayar = kontrak?.payments?.[0] ?? null;
  const pembuka = x.opened_by === session.user.id ? s.olehKamu : (x.users_disputes_opened_byTousers?.full_name ?? t.aplikasi.umum.pihakLain);
  const bukti = parseDeliverableUrls(x.evidence_url);
  const langkah = [s.langkah.diajukan, s.langkah.ditinjau, s.langkah.diputus].map((label) => ({ label }));
  const tahap = status === "open" ? 0 : aktif ? 1 : 3;

  return (
    <>
      <TautanKembali href="/sengketa" label={s.daftarJudul} />

      <header className={styles.kepala}>
        <StatusBadge status={DISPUTE_STATUS[status as DisputeStatus] ?? "sengketa"} label={s.status[status]} />
        <h2 className={styles.judul}>{kontrak?.projects?.title ?? t.aplikasi.umum.kontrak}</h2>
        <p className={styles.meta}>{s.diajukanOleh(pembuka, formatTanggalJam(x.created_at, bahasa))}</p>
      </header>

      <div className={styles.langkah}>
        <ContractStepper steps={langkah} current={tahap} />
      </div>

      <div className={styles.grid}>
        <div className={styles.kolom}>
          <section className={styles.kartu} aria-labelledby="judul-alasan">
            <h3 className={styles.kartuJudul} id="judul-alasan">
              {s.alasanJudul}
            </h3>
            <p className={styles.alasan}>{x.reason}</p>
          </section>

          <Bukti detail={x} bukti={bukti} bisaTambah={aktif && x.opened_by === session.user.id} onBerubah={hasil.muatUlang} />
        </div>

        <div className={styles.kolom}>
          <section className={styles.kartu} aria-labelledby="judul-ringkas">
            <h3 className={styles.kartuJudul} id="judul-ringkas">
              {s.putusanJudul}
            </h3>
            <Putusan detail={x} s={s} />
            {x.admin_notes ? (
              <div className={styles.catatan}>
                <b>{s.catatanAdmin}</b>
                <p>{x.admin_notes}</p>
              </div>
            ) : null}
            {x.resolved_at ? <p className={styles.meta}>{formatTanggal(x.resolved_at, bahasa)}</p> : null}
          </section>

          <section className={styles.kartu} aria-labelledby="judul-kontrak">
            <h3 className={styles.kartuJudul} id="judul-kontrak">
              {s.proyek}
            </h3>
            <dl className={styles.fakta}>
              <div>
                <dt>{s.nilaiKontrak}</dt>
                <dd>{kontrak ? <Money value={kontrak.agreed_budget} size="sm" /> : "-"}</dd>
              </div>
              <div>
                <dt>{s.statusDana}</dt>
                <dd>{bayar?.status ? <StatusBadge status={PAYMENT_STATUS[bayar.status]} size="sm" /> : "-"}</dd>
              </div>
            </dl>
            {kontrak ? (
              <Button href={`/kontrak/${kontrak.id}`} variant="secondary" size="sm" iconRight={<Icon name="ArrowUpRight" size={16} />}>
                {s.keKontrak}
              </Button>
            ) : null}
          </section>
        </div>
      </div>

      <section className={`${styles.kartu} ${styles.mediasi}`} aria-labelledby="judul-mediasi">
        <div>
          <h3 className={styles.kartuJudul} id="judul-mediasi">
            {s.mediasiJudul}
          </h3>
          <p className={styles.meta}>{s.mediasiSub}</p>
        </div>
        <Obrolan sumber={{ jenis: "mediasi", id: x.id }} />
      </section>
    </>
  );
}

function Putusan({ detail, s }: { detail: DisputeDetail; s: Kamus["fitur"]["sengketa"] }) {
  const status = detail.status ?? "open";
  const bayar = detail.contracts?.payments?.[0] ?? null;

  if (sengketaAktif(status)) return <p className={styles.menunggu}>{s.menunggu}</p>;
  if (status === "rejected") return <p className={styles.hasil}>{s.putusan.ditolak}</p>;

  const net = bayar?.net_amount ?? 0;
  let teks = s.putusan.tanpaDana;
  if (bayar?.status === "released") teks = s.putusan.released(formatRupiah(net));
  if (bayar?.status === "refunded") teks = s.putusan.refunded(formatRupiah(net));
  if (bayar?.status === "split_settled") {
    const mhs = detail.student_share ?? 0;
    teks = s.putusan.split_settled(formatRupiah(mhs), formatRupiah(Math.max(0, net - mhs)));
  }
  return <p className={styles.hasil}>{teks}</p>;
}

function Bukti({
  detail,
  bukti,
  bisaTambah,
  onBerubah,
}: {
  detail: DisputeDetail;
  bukti: string[];
  bisaTambah: boolean;
  onBerubah: () => void;
}) {
  const { t } = useBahasa();
  const s = t.fitur.sengketa;
  const [berkas, setBerkas] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState<{ jenis: "ok" | "galat"; teks: string } | null>(null);

  async function tambah() {
    if (berkas.length === 0) return;
    const besar = berkasTerlaluBesar(berkas, "evidence");
    if (besar) {
      setPesan({ jenis: "galat", teks: t.umum.galat.berkasBesar(besar.nama, besar.batasMb) });
      return;
    }
    setLoading(true);
    setPesan(null);
    try {
      const baru: string[] = [];
      for (const [i, f] of berkas.entries()) {
        setPesan({ jenis: "ok", teks: s.mengunggah(i + 1, berkas.length) });
        baru.push((await apiUpload<UploadResult>(f, "evidence")).url);
      }
      await disputes.setEvidence(detail.id, gabungBukti([...bukti, ...baru]) ?? "");
      setBerkas([]);
      setPesan({ jenis: "ok", teks: s.buktiTerkirim });
      onBerubah();
    } catch (e) {
      setPesan({ jenis: "galat", teks: e instanceof ApiError ? e.messages.join(" ") : t.umum.galat.jaringan });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.kartu} aria-labelledby="judul-bukti">
      <h3 className={styles.kartuJudul} id="judul-bukti">
        {s.buktiJudul}
      </h3>
      {bukti.length === 0 ? (
        <p className={styles.meta}>{s.buktiKosong}</p>
      ) : (
        <ul className={styles.bukti}>
          {bukti.map((path, i) => (
            <li key={path}>
              <TombolBerkas path={path} label={s.buktiBerkas(i + 1)} icon="Paperclip" />
            </li>
          ))}
        </ul>
      )}

      {bisaTambah ? (
        <div className={styles.tambah}>
          <FileDropzone
            label={s.tambahBukti}
            hint={`${s.buktiPetunjuk} ${s.tambahBuktiPetunjuk}`}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            multiple
            files={berkas}
            onFiles={(f) => setBerkas((lama) => [...lama, ...f].slice(0, 5))}
            onRemove={(i) => setBerkas((lama) => lama.filter((_, n) => n !== i))}
          />
          {pesan ? (
            <p role={pesan.jenis === "galat" ? "alert" : "status"} className={pesan.jenis === "galat" ? app.galat : styles.ok}>
              {pesan.teks}
            </p>
          ) : null}
          {berkas.length > 0 ? (
            <div>
              <Button onClick={tambah} loading={loading} iconLeft={<Icon name="Upload" size={16} />}>
                {s.tambahBukti}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
