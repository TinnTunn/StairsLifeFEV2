// Halaman detail satu lamaran beserta statusnya.

"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { StatusTimeline, type TimelineItem } from "@/components/feedback/StatusTimeline";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { Bahasa } from "@/i18n/jenis";
import type { Kamus } from "@/i18n/kamus";
import { getApplication } from "@/lib/data/work";
import { formatTanggal, formatTanggalJam } from "@/lib/format";
import { APPLICATION_STATUS } from "@/lib/status";
import type { Application } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { MahasiswaShell } from "../../MahasiswaShell";
import styles from "../../dashboard.module.css";
import { BatalkanLamaran } from "./BatalkanLamaran";
import detail from "./detail.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

export default function DetailLamaran({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.detailLamaran.judul}>
      <TautanKembali href="/mahasiswa/lamaran" label={t.aplikasi.mahasiswa.detailLamaran.keDaftar} />
      <Isi id={id} />
    </MahasiswaShell>
  );
}

function timeline(a: Application, d: Kamus["aplikasi"]["mahasiswa"]["detailLamaran"], bahasa: Bahasa): TimelineItem[] {
  const dikirim: TimelineItem = { label: d.dikirim, time: formatTanggalJam(a.created_at, bahasa), tone: "done" };

  if (a.status === "pending") return [dikirim, { label: d.menungguDilihat, tone: "active" }];
  if (a.status === "shortlisted") {
    return [dikirim, { label: d.masukSeleksi, tone: "done" }, { label: d.menungguKeputusan, tone: "active" }];
  }
  if (a.status === "approved") {
    return [dikirim, { label: d.diterima, description: d.diterimaIsi, tone: "done" }];
  }
  return [dikirim, { label: d.ditolak, tone: "alert" }];
}

function Isi({ id }: { id: string }) {
  const { t, bahasa } = useBahasa();
  const d = t.aplikasi.mahasiswa.detailLamaran;
  const u = t.aplikasi.umum;
  const hasil = useAsync(() => getApplication(id), [id]);

  if (hasil.loading) return <SkeletonCard lines={4} label={d.memuat} />;

  if (hasil.error || hasil.data?.error) {
    return (
      <EmptyState icon="AlertTriangle" title={d.gagal} description={`${hasil.error ?? hasil.data?.error} ${u.muatUlang}`} />
    );
  }

  const a = hasil.data?.data;
  if (!a) {
    return (
      <EmptyState
        icon="SearchX"
        title={d.tidakAdaJudul}
        description={d.tidakAdaIsi}
        action={<Button href="/mahasiswa/lamaran">{d.keDaftar}</Button>}
      />
    );
  }

  const kontrak = a.contracts?.[0];

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}

      <div className={detail.head}>
        <StatusBadge status={APPLICATION_STATUS[a.status]} />
        <h2 className={detail.title}>{a.projects?.title ?? u.proyek}</h2>
        <p className={styles.rowMeta}>
          {a.projects?.users?.full_name ?? u.bisnis} · {u.dikirim(formatTanggal(a.created_at, bahasa))}
        </p>
      </div>

      {a.status === "approved" ? (
        <div className={detail.callout}>
          <span className={detail.calloutIcon}>
            <Icon name="ShieldCheck" size={20} />
          </span>
          <div className={detail.calloutText}>
            <b className={detail.calloutTitle}>{d.diterimaJudul}</b>
            <p className={detail.calloutBody}>{kontrak ? d.kontrakAda : d.kontrakBelum}</p>
          </div>
          {kontrak ? (
            <Button href={`/kontrak/${kontrak.id}`} variant="secondary">
              {d.bukaKontrak}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className={detail.grid}>
        <section className={detail.block}>
          <h3 className={detail.blockTitle}>
            <span className={detail.blockIcon} aria-hidden="true">
              <Icon name="Clock" size={18} />
            </span>
            {d.perjalanan}
          </h3>
          <StatusTimeline items={timeline(a, d, bahasa)} />
        </section>

        <section className={detail.block}>
          <h3 className={detail.blockTitle}>
            <span className={detail.blockIcon} aria-hidden="true">
              <Icon name="Send" size={18} />
            </span>
            {d.yangDikirim}
          </h3>
          <div className={detail.facts}>
            <div className={detail.fact}>
              <span className={styles.rowMeta}>{d.perkiraanSelesai}</span>
              <span className={detail.factValue}>{formatTanggal(a.estimated_completion, bahasa)}</span>
            </div>
            {a.offered_budget ? (
              <div className={detail.fact}>
                <span className={styles.rowMeta}>{d.penawaran}</span>
                <Money value={a.offered_budget} size="sm" />
              </div>
            ) : null}
          </div>
          <p className={detail.letter}>{a.cover_letter}</p>
        </section>
      </div>

      <div className={detail.footer}>
        {a.status === "pending" || a.status === "shortlisted" ? (
          <BatalkanLamaran id={a.id} projectId={a.project_id} />
        ) : null}
        <Link href={`/mahasiswa/cari/${a.project_id}`} className={styles.sectionLink}>
          {d.lihatProyek}
          <Icon name="ArrowUpRight" size={16} />
        </Link>
      </div>
    </>
  );
}
