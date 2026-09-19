"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/actions/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { MahasiswaShell } from "../MahasiswaShell";
import { BilahSaring } from "@/components/projects/BilahSaring";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useBahasa } from "@/i18n/BahasaProvider";
import { listProjects } from "@/lib/data/projects";
import { myApplications } from "@/lib/data/work";
import type { ProjectTier } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import styles from "./cari.module.css";

const TIER: ProjectTier[] = ["pemula", "menengah", "mahir"];

/**
 * Cari proyek di dalam shell aplikasi.
 *
 * Halaman publik /proyek tetap ada untuk tamu dan mesin pencari, tapi
 * mahasiswa yang sudah masuk memakai halaman ini: sidebar dan topbar tetap,
 * tanpa header pemasaran dan footer publik yang membuat orang merasa keluar
 * dari aplikasi. Susunannya mengikuti tab Cari Project di FE V2: judul, jumlah,
 * bilah cari, chip, lalu grid kartu.
 */
export default function CariProyek() {
  const { t } = useBahasa();
  const c = t.aplikasi.mahasiswa.cari;
  return (
    <MahasiswaShell title={c.judul} subtitle={c.sub}>
      {/* useSearchParams butuh batas Suspense supaya sisa halaman tetap bisa
          dirender lebih dulu. */}
      <Suspense fallback={<SkeletonCard lines={3} label={c.memuat} />}>
        <Isi />
      </Suspense>
    </MahasiswaShell>
  );
}

function Isi() {
  const { t } = useBahasa();
  const c = t.aplikasi.mahasiswa.cari;
  const d = t.proyek.daftar;
  const params = useSearchParams();

  const search = params.get("search") ?? "";
  const tierParam = params.get("tier") ?? "";
  const tier = TIER.includes(tierParam as ProjectTier) ? (tierParam as ProjectTier) : undefined;
  const disaring = Boolean(search || tier);

  const hasil = useAsync(
    () => listProjects({ search: search || undefined, tier }),
    [search, tier ?? ""],
  );
  /* Bentuknya harus persis sama dengan pemakai kunci cache "lamaran-saya" yang
     lain (beranda dan daftar lamaran): cache dibagi per kunci, jadi menyimpan
     array di sini sementara halaman lain menyimpan { data, sample } membuat
     halaman yang dibuka belakangan membaca bentuk yang salah. */
  const lamaran = useAsync(myApplications, [], "lamaran-saya");

  if (hasil.loading) return <SkeletonCard lines={4} label={c.memuat} />;

  const items = hasil.data?.items ?? [];
  const daftarLamaran = lamaran.data?.data;
  const sudahDilamar = new Set(Array.isArray(daftarLamaran) ? daftarLamaran.map((a) => a.project_id) : []);

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}

      <BilahSaring basePath="/mahasiswa/cari" />

      <div className={styles.kepala}>
        <p className={styles.jumlah}>{disaring ? d.jumlahSaring(items.length) : d.jumlah(items.length)}</p>
      </div>

      {hasil.error ? (
        <EmptyState icon="AlertTriangle" title={c.gagal} description={`${hasil.error} ${t.umum.galat.muatUlangHalaman}`} />
      ) : items.length === 0 ? (
        disaring ? (
          <EmptyState
            icon="SearchX"
            title={d.kosongSaringJudul}
            description={d.kosongSaringIsi}
            action={
              <Button href="/mahasiswa/cari" variant="secondary">
                {d.hapusSaringan}
              </Button>
            }
          />
        ) : (
          <EmptyState icon="Inbox" title={d.kosongJudul} description={d.kosongIsi} />
        )
      ) : (
        <>
          <div className={styles.grid}>
            {items.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                href={`/mahasiswa/cari/${project.id}`}
                applyHref={`/mahasiswa/lamar/${project.id}`}
                applied={sudahDilamar.has(project.id)}
              />
            ))}
          </div>
          {/* Backend GET /projects belum punya paginasi, jadi seluruh proyek
              terbuka dimuat sekaligus dan itu dikatakan apa adanya. */}
          <p className={styles.catatan}>{d.catatanSemua}</p>
        </>
      )}
    </>
  );
}
