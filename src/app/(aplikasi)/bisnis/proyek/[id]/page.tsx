"use client";

import Link from "next/link";
import { use } from "react";
import { Icon } from "@/components/actions/Icon";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { IsiDetailProyek } from "@/components/projects/IsiDetailProyek";
import { useBahasa } from "@/i18n/BahasaProvider";
import { getProject } from "@/lib/data/projects";
import { PROJECT_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { BisnisShell } from "../../BisnisShell";
import { DaftarPelamar } from "./DaftarPelamar";
import styles from "./detail.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

/**
 * Detail proyek milik pemilik usaha.
 *
 * Isinya sama persis dengan yang dibaca mahasiswa (brief, hasil yang diminta,
 * keahlian, anggaran, tenggat), karena itulah yang menentukan apakah lamaran
 * masuk. Bedanya satu: panel sampingnya bukan tombol lamar, melainkan jumlah
 * pelamar, dan di bawahnya daftar pelamar beserta keputusannya.
 *
 * Halaman inilah tujuan setelah proyek dipasang. Sebelumnya proyek baru
 * langsung membuka daftar pelamar yang pasti masih kosong, sehingga pemilik
 * usaha tidak pernah melihat hasil proyek yang baru saja dia tulis.
 */
export default function DetailProyekBisnis({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  return (
    <BisnisShell title={t.aplikasi.bisnis.detail.judul} subtitle={t.aplikasi.bisnis.detail.sub}>
      <Isi id={id} />
    </BisnisShell>
  );
}

function Isi({ id }: { id: string }) {
  const { t } = useBahasa();
  const b = t.aplikasi.bisnis.detail;
  const d = t.proyek.detail;
  const hasil = useAsync(() => getProject(id), [id]);

  if (hasil.loading) return <SkeletonCard lines={4} label={b.memuat} />;

  if (hasil.error || hasil.data?.error) {
    return (
      <EmptyState
        icon="AlertTriangle"
        title={d.gagalJudul}
        description={`${hasil.error ?? hasil.data?.error} ${t.umum.galat.muatUlangHalaman}`}
      />
    );
  }

  const project = hasil.data?.project;
  if (!project) {
    return <EmptyState icon="SearchX" title={d.tidakDitemukan} description={d.tidakDitemukanIsi} />;
  }

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}

      <TautanKembali href="/bisnis/proyek" label={b.semuaProyek} />

      <div className={styles.kepala}>
        <StatusBadge status={PROJECT_STATUS[project.status]} />
        <h2 className={styles.judul}>{project.title}</h2>
        <p className={styles.meta}>{b.pelamarMasuk(project.applicant_count)}</p>
      </div>

      <IsiDetailProyek
        project={project}
        aksi={
          <>
            <Link href="#pelamar" className={styles.kePelamar}>
              <Icon name="Users" size={18} />
              {b.lihatPelamar}
            </Link>
          </>
        }
        catatan={b.catatanEscrow}
      />

      <h3 id="pelamar" className={styles.judulSeksi}>
        {t.aplikasi.bisnis.pelamar.judul}
      </h3>
      <DaftarPelamar projectId={project.id} onBerubah={hasil.muatUlang} />
    </>
  );
}
