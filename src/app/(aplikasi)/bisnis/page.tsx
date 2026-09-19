"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/actions/Button";
import { Icon, type IconName } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { Session } from "@/lib/api/session";
import { myContracts, myProjects } from "@/lib/data/work";
import { formatTanggal } from "@/lib/format";
import { CONTRACT_STATUS, PROJECT_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { BisnisShell } from "./BisnisShell";
import styles from "../mahasiswa/dashboard.module.css";

export default function BerandaBisnis() {
  const { t } = useBahasa();
  const b = t.aplikasi.bisnis.beranda;
  return (
    /* Tanpa tombol di topbar: kartu sapaan sudah membawa ajakan pasang proyek. */
    <BisnisShell title={b.judul} subtitle={b.sub}>
      {(session) => <Isi session={session} />}
    </BisnisShell>
  );
}

function Stat({ label, icon, nilai }: { label: string; icon: IconName; nilai: ReactNode }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statKepala}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statIkon} aria-hidden="true">
          <Icon name={icon} size={16} />
        </span>
      </div>
      <span className={styles.statValue}>{nilai}</span>
    </div>
  );
}

function Isi({ session }: { session: Session }) {
  const { t, bahasa } = useBahasa();
  const b = t.aplikasi.bisnis.beranda;
  const u = t.aplikasi.umum;
  const proyek = useAsync(myProjects, [], "proyek-saya");
  const kontrak = useAsync(myContracts, [], "kontrak-saya");

  if (proyek.loading || kontrak.loading) return <SkeletonCard lines={3} label={b.memuat} />;

  if (proyek.error || proyek.data?.error) {
    return (
      <EmptyState icon="AlertTriangle" title={b.gagal} description={`${proyek.error ?? proyek.data?.error} ${u.muatUlang}`} />
    );
  }

  const items = proyek.data?.data ?? [];
  const kontrakAktif = (kontrak.data?.data ?? []).filter((c) => c.status === "active" || c.status === "pending_review");
  const terbuka = items.filter((p) => p.status === "open");
  const totalPelamar = items.reduce((n, p) => n + p.applicant_count, 0);
  const perluDiputus = kontrakAktif.filter((c) => c.status === "pending_review");
  const namaDepan = session.user.full_name.split(" ")[0];

  return (
    <>
      {proyek.data?.sample || kontrak.data?.sample ? <SampleDataNotice /> : null}

      <section className={styles.sapa}>
        <div className={styles.sapaTeks}>
          <h2 className={styles.sapaJudul}>{u.sapa(namaDepan)}</h2>
          <p className={styles.sapaIsi}>{b.sapaIsi}</p>
        </div>
        <div className={styles.sapaAksi}>
          <Button href="/bisnis/proyek/baru" variant="white" iconLeft={<Icon name="Plus" size={18} />}>
            {b.pasang}
          </Button>
        </div>
      </section>

      <div className={styles.stats}>
        <Stat label={b.statTerbuka} icon="Briefcase" nilai={terbuka.length} />
        <Stat label={b.statPelamar} icon="Users" nilai={totalPelamar} />
        <Stat label={b.statKontrak} icon="Kontrak" nilai={kontrakAktif.length} />
        <Stat label={b.statKeputusan} icon="PackageCheck" nilai={perluDiputus.length} />
      </div>

      {perluDiputus.length > 0 ? (
        <>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{b.hasilMenunggu}</h2>
          </div>
          <ul className={styles.rows}>
            {perluDiputus.map((c) => (
              <li key={c.id} className={styles.row}>
                <span className={styles.rowIkon} aria-hidden="true">
                  <Icon name="PackageCheck" size={18} />
                </span>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>
                    <Link href={`/kontrak/${c.id}`} className={styles.rowLink}>
                      {c.projects?.title ?? u.kontrak}
                    </Link>
                  </span>
                  <span className={styles.rowMeta}>
                    {b.sudahKirim(c.users_contracts_student_idTousers?.full_name ?? u.mahasiswa)}
                  </span>
                </div>
                <div className={styles.rowAside}>
                  <Money value={c.agreed_budget} size="sm" tone="held" />
                  <StatusBadge status={CONTRACT_STATUS[c.status]} />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{b.proyekKamu}</h2>
        <Link href="/bisnis/proyek" className={styles.sectionLink}>
          {b.kelolaSemua}
          <Icon name="ArrowUpRight" size={16} />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="Briefcase"
          title={b.kosongJudul}
          description={b.kosongIsi}
          action={<Button href="/bisnis/proyek/baru">{b.pasang}</Button>}
        />
      ) : (
        <ul className={styles.rows}>
          {items.slice(0, 5).map((p) => (
            <li key={p.id} className={styles.row}>
              <span className={styles.rowIkon} aria-hidden="true">
                <Icon name="Briefcase" size={18} />
              </span>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>
                  <Link href={`/bisnis/proyek/${p.id}/pelamar`} className={styles.rowLink}>
                    {p.title}
                  </Link>
                </span>
                <span className={styles.rowMeta}>
                  {u.pelamarN(p.applicant_count)} · {u.tenggat(formatTanggal(p.deadline, bahasa))}
                </span>
              </div>
              <div className={styles.rowAside}>
                <StatusBadge status={PROJECT_STATUS[p.status]} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
