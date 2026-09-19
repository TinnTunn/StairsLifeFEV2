"use client";

import Link from "next/link";
import { Icon } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { Money } from "@/components/data/Money";
import { Rating } from "@/components/data/Rating";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { useBahasa } from "@/i18n/BahasaProvider";
import { projectApplications } from "@/lib/data/work";
import { formatTanggal } from "@/lib/format";
import { APPLICATION_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { ApplicantActions } from "./pelamar/ApplicantActions";
import styles from "./pelamar/pelamar.module.css";

/**
 * Daftar pelamar satu proyek, dipakai di halaman detail proyek milik bisnis.
 *
 * Keputusan menerima atau menolak lamaran ada di sini, bukan di halaman
 * terpisah: pemilik usaha membaca brief proyeknya lalu langsung menimbang
 * pelamarnya di layar yang sama.
 */
export function DaftarPelamar({ projectId, onBerubah }: { projectId: string; onBerubah?: () => void }) {
  const { t, bahasa } = useBahasa();
  const p = t.aplikasi.bisnis.pelamar;
  const u = t.aplikasi.umum;
  /* muatUlang, bukan mengubah dependensi useAsync.
     Dulu daftar ini dimuat ulang dengan menaikkan sebuah penanda versi yang
     ikut jadi dependensi, dan itu dianggap permintaan baru: data lama dibuang,
     loading kembali true, seluruh daftar berganti kerangka. Anak-anaknya ikut
     dilepas, termasuk ApplicantActions yang barusan menyalakan modal "buat
     kontrak", sehingga modal itu hilang sebelum sempat terlihat. muatUlang
     menahan data lama tetap tampil dan tidak membongkar pohon komponennya. */
  const hasil = useAsync(() => projectApplications(projectId), [projectId]);

  if (hasil.loading) return <SkeletonCard lines={3} media label={p.memuat} />;

  if (hasil.error || hasil.data?.error) {
    return (
      <EmptyState icon="AlertTriangle" title={p.gagal} description={`${hasil.error ?? hasil.data?.error} ${u.muatUlang}`} />
    );
  }

  const items = hasil.data?.data ?? [];

  if (items.length === 0) {
    return (
      <>
        {hasil.data?.sample ? <SampleDataNotice /> : null}
        <EmptyState
          icon="UserSearch"
          title={p.kosongJudul}
          description={p.kosongIsi}
        />
      </>
    );
  }

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}
      <ul className={styles.list}>
        {items.map((a) => {
          const pengguna = a.users;
          const nama = pengguna?.full_name ?? u.pelamar;
          return (
            <li key={a.id} className={styles.card}>
              <div className={styles.head}>
                <Avatar name={nama} src={pengguna?.avatar_url} size="lg" verified={pengguna?.is_verified} />
                <div className={styles.headText}>
                  <b className={styles.name}>{nama}</b>
                  <span className={styles.meta}>
                    <span className={styles.tier}>{t.umum.tingkat[pengguna?.tier ?? "pemula"]}</span>
                    {p.proyekSelesai(pengguna?.total_projects ?? 0)}
                  </span>
                  {/* "0.00" dari Decimal bernilai truthy; tanpa ulasan jangan tampil nol. */}
                  {Number(pengguna?.rating_avg) > 0 ? <Rating value={Number(pengguna?.rating_avg)} size="sm" /> : null}
                  {/* Keputusan menerima pelamar butuh lebih dari avatar dan
                      tingkat; portofolio kontrak selesai ada di halaman profil. */}
                  {pengguna?.id ? (
                    <Link href={`/pengguna/${pengguna.id}`} className={styles.tautanProfil}>
                      {p.lihatProfil}
                      <Icon name="ArrowUpRight" size={14} />
                    </Link>
                  ) : null}
                </div>
                <StatusBadge status={APPLICATION_STATUS[a.status]} />
              </div>

              <p className={styles.letter}>{a.cover_letter}</p>

              <div className={styles.facts}>
                <span className={styles.fact}>
                  <Icon name="Clock" size={16} />
                  {p.perkiraanSelesai(formatTanggal(a.estimated_completion, bahasa))}
                </span>
                {a.offered_budget ? <Money value={a.offered_budget} size="sm" label={p.penawaran} /> : null}
              </div>

              {pengguna?.skills && pengguna.skills.length > 0 ? (
                <div className={styles.chips}>
                  {pengguna.skills.slice(0, 6).map((s) => (
                    <span key={s} className={styles.chip}>
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}

              <ApplicantActions
                application={a}
                jumlahPelamarLain={
                  items.filter((x) => x.id !== a.id && (x.status === "pending" || x.status === "shortlisted")).length
                }
                onBerubah={() => {
                  hasil.muatUlang();
                  /* Status proyeknya ikut berubah di server begitu satu pelamar
                     diterima, jadi induknya harus memuat ulang juga. Tanpa ini
                     lencana di kepala halaman tetap tertulis AKTIF padahal
                     proyeknya sudah tertutup. */
                  onBerubah?.();
                }}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
