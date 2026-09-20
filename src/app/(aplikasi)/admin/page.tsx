// Halaman ringkasan admin: angka utama dan grafik tren.

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/actions/Icon";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BatasSeksi } from "@/components/feedback/BatasSeksi";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin } from "@/lib/api/admin";
import { USE_MOCK } from "@/lib/api/client";
import { formatTanggal, formatTanggalJam } from "@/lib/format";
import { PROJECT_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import app from "../mahasiswa/dashboard.module.css";
import { AdminShell } from "./AdminShell";
import { GrafikBatang } from "./_bersama/GrafikBatang";
import { KartuAdmin } from "./_bersama/bersama";
import styles from "./_bersama/admin.module.css";

export default function RingkasanAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.ringkasan.judul} subtitle={t.admin.ringkasan.sub}>
      <Isi />
    </AdminShell>
  );
}

function Stat({ label, icon, nilai }: { label: string; icon: IconName; nilai: ReactNode }) {
  return (
    <div className={app.stat}>
      <div className={app.statKepala}>
        <span className={app.statLabel}>{label}</span>
        <span className={app.statIkon} aria-hidden="true">
          <Icon name={icon} size={16} />
        </span>
      </div>
      <span className={app.statValue}>{nilai}</span>
    </div>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const r = t.admin.ringkasan;
  const stats = useAsync(() => admin.stats(), [], "admin-stats");
  const penarikan = useAsync(() => admin.withdrawals(1, "pending"), [], "admin-penarikan-pending");
  const audit = useAsync(() => admin.auditLogs(8), [], "admin-audit-8");
  const proyek = useAsync(() => admin.projects(), [], "admin-proyek");

  if (USE_MOCK) return <EmptyState icon="LayoutDashboard" title={r.sapa} description={t.admin.umum.modeContoh} />;

  if (stats.loading) {
    return (
      <>
        <SkeletonCard lines={1} label={r.memuat} />
        <SkeletonCard lines={4} />
      </>
    );
  }

  if (stats.error || !stats.data) {
    return <EmptyState icon="AlertTriangle" title={r.gagal} description={`${stats.error ?? ""} ${t.admin.umum.muatUlang}`} />;
  }

  const s = stats.data;
  const jumlahPenarikan = penarikan.data?.pagination?.total ?? 0;
  const antrean = [
    { n: s.pending_verifications, href: "/admin/verifikasi", icon: "BadgeCheck" as const, teks: r.tindakVerifikasi },
    { n: s.active_disputes, href: "/admin/sengketa", icon: "Scale" as const, teks: r.tindakSengketa },
    { n: jumlahPenarikan, href: "/admin/penarikan", icon: "Wallet" as const, teks: r.tindakPenarikan },
  ].filter((a) => a.n > 0);

  const trenProyek = (s.project_trend ?? []).map((d) => ({ date: d.date, nilai: d.count }));
  const trenDaftar = (s.registration_trend ?? []).map((d) => ({ date: d.date, nilai: d.count }));
  const total = (xs: { nilai: number }[]) => xs.reduce((n, x) => n + x.nilai, 0);

  return (
    <>
      <div className={app.stats}>
        <Stat label={r.statProyek} icon="Briefcase" nilai={s.active_projects} />
        <Stat label={r.statPengguna} icon="Users" nilai={s.total_users} />
        <Stat label={r.statSengketa} icon="Scale" nilai={s.active_disputes} />
        <Stat label={r.statVerifikasi} icon="BadgeCheck" nilai={s.pending_verifications} />
      </div>

      <div className={styles.grid2}>
        <KartuAdmin judul={r.perluTindakan} icon="AlertTriangle">
          {antrean.length === 0 ? (
            <p className={styles.catatan}>{r.semuaBeres}</p>
          ) : (
            <ul className={styles.antrean}>
              {antrean.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className={styles.antreanItem}>
                    <span className={styles.antreanIkon} aria-hidden="true">
                      <Icon name={a.icon} size={16} />
                    </span>
                    {a.teks(a.n)}
                    <Icon name="ChevronRight" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </KartuAdmin>

        <KartuAdmin judul={r.aktivitas} icon="Clock">
          {audit.loading ? (
            <SkeletonCard lines={3} />
          ) : audit.error ? (
            <p className={styles.catatan}>{r.aktivitasGagal}</p>
          ) : (audit.data ?? []).length === 0 ? (
            <p className={styles.catatan}>{r.aktivitasKosong}</p>
          ) : (
            <ul className={styles.audit}>
              {(audit.data ?? []).map((log) => (
                <li key={log.id} className={styles.auditItem}>
                  <div className={styles.auditTeks}>
                    <span className={styles.auditAksi}>{t.admin.aksiAudit[log.action] ?? log.action}</span>
                    <span className={styles.auditMeta}>
                      {log.actor_name ?? t.admin.umum.tanpaNama} · {formatTanggalJam(log.created_at, bahasa)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </KartuAdmin>

        <BatasSeksi nama="tren proyek admin">
          <KartuAdmin judul={r.trenProyek} sub={`${r.periode} · ${r.totalPeriode(total(trenProyek))}`} icon="Briefcase">
            <GrafikBatang judul={`${r.trenProyek}, ${r.periode}`} data={trenProyek} />
          </KartuAdmin>
        </BatasSeksi>

        <BatasSeksi nama="tren registrasi admin">
          <KartuAdmin judul={r.trenRegistrasi} sub={`${r.periode} · ${r.totalPeriode(total(trenDaftar))}`} icon="UserPlus">
            <GrafikBatang judul={`${r.trenRegistrasi}, ${r.periode}`} data={trenDaftar} />
          </KartuAdmin>
        </BatasSeksi>
      </div>

      <div className={app.sectionHead}>
        <h2 className={app.sectionTitle}>{r.proyekTerbaru}</h2>
        <Link href="/admin/proyek" className={app.sectionLink}>
          {r.lihatSemua}
          <Icon name="ArrowUpRight" size={16} />
        </Link>
      </div>
      {proyek.loading ? (
        <SkeletonCard lines={3} />
      ) : (
        <ul className={app.rows}>
          {(proyek.data ?? []).slice(0, 5).map((p) => (
            <li key={p.id} className={app.row}>
              <span className={app.rowIkon} aria-hidden="true">
                <Icon name="Briefcase" size={18} />
              </span>
              <div className={app.rowMain}>
                <span className={app.rowTitle}>
                  {p.title}
                </span>
                <span className={app.rowMeta}>
                  {t.admin.proyek.oleh(p.business?.full_name ?? t.admin.umum.tanpaNama)} ·{" "}
                  {formatTanggal(p.created_at, bahasa)}
                </span>
              </div>
              <div className={app.rowAside}>
                <StatusBadge status={PROJECT_STATUS[p.status]} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
