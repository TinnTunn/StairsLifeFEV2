"use client";

import Link from "next/link";
import { use } from "react";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { IsiDetailProyek } from "@/components/projects/IsiDetailProyek";
import { useBahasa } from "@/i18n/BahasaProvider";
import { getProject } from "@/lib/data/projects";
import { PROJECT_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { MahasiswaShell } from "../../MahasiswaShell";
import styles from "./detail.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

/**
 * Detail proyek versi di dalam shell aplikasi.
 *
 * Isinya komponen yang sama dengan halaman publik /proyek/[id], jadi brief yang
 * dibaca pelamar tidak pernah berbeda. Yang berbeda hanya kepalanya: di sini
 * sidebar dan topbar aplikasi tetap tampil, dan tautan kembali mengarah ke
 * daftar cari di dalam aplikasi, bukan ke halaman publik.
 */
export default function DetailProyekAplikasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.cari.judul}>
      <Isi id={id} />
    </MahasiswaShell>
  );
}

function Isi({ id }: { id: string }) {
  const { t } = useBahasa();
  const d = t.proyek.detail;
  const c = t.aplikasi.mahasiswa.cari;
  const hasil = useAsync(() => getProject(id), [id]);

  if (hasil.loading) return <SkeletonCard lines={4} label={c.memuat} />;

  const project = hasil.data?.project;

  if (hasil.error || hasil.data?.error) {
    return (
      <EmptyState
        icon="AlertTriangle"
        title={d.gagalJudul}
        description={`${hasil.error ?? hasil.data?.error} ${t.umum.galat.muatUlangHalaman}`}
      />
    );
  }

  if (!project) {
    return (
      <EmptyState
        icon="SearchX"
        title={d.tidakDitemukan}
        description={d.tidakDitemukanIsi}
        action={
          <Link href="/mahasiswa/cari" className={styles.kembaliTombol}>
            {d.semuaProyek}
          </Link>
        }
      />
    );
  }

  const business = project.users?.full_name ?? t.komponen.kartuProyek.bisnis;

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}

      <TautanKembali href="/mahasiswa/cari" label={d.semuaProyek} />

      <div className={styles.kepala}>
        <StatusBadge status={PROJECT_STATUS[project.status]} />
        <h2 className={styles.judul}>{project.title}</h2>
        <Link href={`/pengguna/${project.business_id}`} className={styles.bisnis}>
          {business}
        </Link>
      </div>

      <IsiDetailProyek project={project} />
    </>
  );
}
