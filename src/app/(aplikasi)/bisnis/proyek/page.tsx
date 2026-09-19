"use client";

import Link from "next/link";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { labelAnggaran } from "@/lib/anggaran";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { useBahasa } from "@/i18n/BahasaProvider";
import { myProjects } from "@/lib/data/work";
import { formatTanggal } from "@/lib/format";
import { PROJECT_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { BisnisShell } from "../BisnisShell";
import styles from "../../mahasiswa/dashboard.module.css";

export default function ProyekSaya() {
  const { t } = useBahasa();
  const p = t.aplikasi.bisnis.proyek;
  return (
    <BisnisShell
      title={p.judul}
      subtitle={p.sub}
      actions={
        <Button href="/bisnis/proyek/baru" size="sm" iconLeft={<Icon name="Plus" size={16} />}>
          {t.aplikasi.bisnis.beranda.pasang}
        </Button>
      }
    >
      <Isi />
    </BisnisShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const p = t.aplikasi.bisnis.proyek;
  const u = t.aplikasi.umum;
  const hasil = useAsync(myProjects, [], "proyek-saya");

  if (hasil.loading) return <SkeletonCard lines={3} label={p.memuat} />;

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
          icon="Briefcase"
          title={p.kosongJudul}
          description={p.kosongIsi}
          action={<Button href="/bisnis/proyek/baru">{p.pasangPertama}</Button>}
        />
      </>
    );
  }

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}
      <ul className={styles.rows}>
        {items.map((proyek) => (
          <li key={proyek.id} className={styles.row}>
            <span className={styles.rowIkon} aria-hidden="true">
              <Icon name="Briefcase" size={18} />
            </span>
            <div className={styles.rowMain}>
              <span className={styles.rowTitle}>
                <Link href={`/bisnis/proyek/${proyek.id}`} className={styles.rowLink}>
                  {proyek.title}
                </Link>
              </span>
              <span className={styles.rowMeta}>
                {u.pelamarN(proyek.applicant_count)} · {proyek.category} ·{" "}
                {u.tenggat(formatTanggal(proyek.deadline, bahasa))}
              </span>
            </div>
            <div className={styles.rowAside}>
              {/* Rentangnya, bukan hanya batas atas: pemilik proyek menulis dua
                  angka, jadi menampilkan satu membuat daftarnya terbaca seperti
                  harga pasti. */}
              <span className={styles.anggaran}>{labelAnggaran(proyek, t.komponen.kartuProyek)}</span>
              <StatusBadge status={PROJECT_STATUS[proyek.status]} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
