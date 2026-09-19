"use client";

import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { StatusTimeline } from "@/components/feedback/StatusTimeline";
import { VerificationBanner } from "@/components/feedback/VerificationBanner";
import { useBahasa } from "@/i18n/BahasaProvider";
import { USE_MOCK } from "@/lib/api/client";
import { users } from "@/lib/api/users";
import { formatTanggalJam } from "@/lib/format";
import type { Verification } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { MahasiswaShell } from "../MahasiswaShell";
import { FormVerifikasi } from "./FormVerifikasi";
import styles from "./verifikasi.module.css";

export default function Verifikasi() {
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.verifikasi.judul} subtitle={t.aplikasi.mahasiswa.verifikasi.sub}>
      <Isi />
    </MahasiswaShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const v = t.aplikasi.mahasiswa.verifikasi;
  const hasil = useAsync(async () => (USE_MOCK ? null : Promise.all([users.verification(), users.me()])), []);
  /* Pengajuan yang baru terkirim ditampilkan langsung dari respons POST, tanpa
     memuat ulang status dari server. */
  const [terkirim, setTerkirim] = useState<Verification | null>(null);

  if (hasil.loading) return <SkeletonCard lines={2} label={v.memuat} />;

  if (USE_MOCK) {
    return (
      <>
        <SampleDataNotice />
        <EmptyState icon="BadgeCheck" title={v.contohJudul} description={v.contohIsi} />
      </>
    );
  }

  if (hasil.error) {
    return (
      <EmptyState icon="AlertTriangle" title={v.gagal} description={`${hasil.error} ${t.aplikasi.umum.muatUlang}`} />
    );
  }

  const [status, profil] = hasil.data ?? [null, null];
  const pengajuan = terkirim ?? status;
  const universitas = profil?.university ?? "";

  if (!pengajuan) {
    return (
      <>
        <VerificationBanner status="belum_diajukan" role="mahasiswa" />
        <FormVerifikasi judul={v.unggah} universitasAwal={universitas} onTerkirim={setTerkirim} />
      </>
    );
  }

  const bannerStatus =
    pengajuan.status === "approved" ? "terverifikasi" : pengajuan.status === "rejected" ? "ditolak" : "menunggu_review";

  return (
    <>
      <VerificationBanner status={bannerStatus} role="mahasiswa" reason={pengajuan.rejection_reason ?? undefined} />
      {pengajuan.status === "approved" ? (
        <EmptyState
          icon="BadgeCheck"
          title={v.disetujuiJudul}
          description={v.disetujuiIsi}
          action={<Button href="/mahasiswa/cari">{t.aplikasi.umum.cariProyek}</Button>}
        />
      ) : null}
      {/* Backend menimpa pengajuan lama dan mengembalikan status ke pending
          untuk setiap kiriman. Form hanya muncul setelah ditolak, supaya
          mahasiswa yang sedang direview atau sudah disetujui tidak tanpa
          sengaja mengulang antrean. */}
      {pengajuan.status === "rejected" ? (
        <FormVerifikasi judul={v.unggahUlang} universitasAwal={universitas} onTerkirim={setTerkirim} />
      ) : null}
      <div className={styles.linimasa}>
        <StatusTimeline
          items={[
            { label: v.diterima, time: formatTanggalJam(pengajuan.submitted_at, bahasa), tone: "done" },
            /* Berpatokan pada status, bukan reviewed_at. Backend tidak
               mengosongkan reviewed_at saat pengajuan dikirim ulang, jadi
               pengajuan pending bisa masih membawa tanggal penolakan lama. */
            pengajuan.status !== "pending" && pengajuan.reviewed_at
              ? {
                  label: pengajuan.status === "approved" ? v.disetujuiAdmin : v.ditolakAdmin,
                  time: formatTanggalJam(pengajuan.reviewed_at, bahasa),
                  /* Tanpa description: alasan penolakan sudah tampil di banner
                     paling atas, dan mengulangnya di sini hanya menambah panjang. */
                  tone: pengajuan.status === "approved" ? "done" : "alert",
                }
              : { label: v.direview, tone: "active" },
          ]}
        />
      </div>
    </>
  );
}
