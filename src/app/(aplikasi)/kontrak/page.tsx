"use client";

import Link from "next/link";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { AnyRoleShell } from "@/components/layout/AnyRoleShell";
import { useBahasa } from "@/i18n/BahasaProvider";
import { myContracts } from "@/lib/data/work";
import { formatTanggal } from "@/lib/format";
import { CONTRACT_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import styles from "../mahasiswa/dashboard.module.css";

export default function DaftarKontrak() {
  const { t } = useBahasa();
  return (
    <AnyRoleShell title={t.aplikasi.kontrak.daftar.judul} subtitle={t.aplikasi.kontrak.daftar.sub}>
      {(session) => <Isi mahasiswa={session.user.role === "mahasiswa"} />}
    </AnyRoleShell>
  );
}

function Isi({ mahasiswa }: { mahasiswa: boolean }) {
  const { t, bahasa } = useBahasa();
  const d = t.aplikasi.kontrak.daftar;
  const u = t.aplikasi.umum;
  const hasil = useAsync(myContracts, [], "kontrak-saya");

  if (hasil.loading) return <SkeletonCard lines={3} label={d.memuat} />;

  if (hasil.error || hasil.data?.error) {
    return (
      <EmptyState icon="AlertTriangle" title={d.gagal} description={`${hasil.error ?? hasil.data?.error} ${u.muatUlang}`} />
    );
  }

  const items = hasil.data?.data ?? [];

  if (items.length === 0) {
    return (
      <>
        {hasil.data?.sample ? <SampleDataNotice /> : null}
        <EmptyState
          icon="Kontrak"
          title={d.kosongJudul}
          description={mahasiswa ? d.kosongMahasiswa : d.kosongBisnis}
          action={
            mahasiswa ? (
              <Button href="/mahasiswa/cari">{u.cariProyek}</Button>
            ) : (
              <Button href="/bisnis/proyek">{d.kelolaProyek}</Button>
            )
          }
        />
      </>
    );
  }

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}
      <ul className={styles.rows}>
        {items.map((c) => {
          const lawan = mahasiswa
            ? c.users_contracts_business_idTousers?.full_name
            : c.users_contracts_student_idTousers?.full_name;
          return (
            <li key={c.id} className={styles.row}>
              <span className={styles.rowIkon} aria-hidden="true">
                <Icon name="Kontrak" size={18} />
              </span>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>
                  <Link href={`/kontrak/${c.id}`} className={styles.rowLink}>
                    {c.projects?.title ?? u.kontrak}
                  </Link>
                </span>
                <span className={styles.rowMeta}>
                  {lawan ?? u.pihakLain} · {u.tenggat(formatTanggal(c.deadline, bahasa))}
                </span>
              </div>
              <div className={styles.rowAside}>
                <Money value={c.agreed_budget} size="sm" tone={c.status === "completed" ? "in" : "held"} />
                <StatusBadge status={CONTRACT_STATUS[c.status]} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
