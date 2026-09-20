// Halaman admin untuk ringkasan keuangan dan daftar pembayaran.

"use client";

import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/actions/Icon";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin } from "@/lib/api/admin";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { PAYMENT_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { useHalamanUrl, useParamUrl } from "@/lib/useParamUrl";
import app from "../../mahasiswa/dashboard.module.css";
import { AdminShell } from "../AdminShell";
import { GrafikBatang } from "../_bersama/GrafikBatang";
import { KartuAdmin, Paginasi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

const STATUS = ["semua", "pending", "held", "released", "refunded", "split_settled"] as const;
type Status = (typeof STATUS)[number];

export default function KeuanganAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.keuangan.judul} subtitle={t.admin.keuangan.sub}>
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
      <span className={`${app.statValue} ${app.statUang}`}>{nilai}</span>
    </div>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const k = t.admin.keuangan;
  const ringkas = useAsync(() => admin.finances(), []);
  const [status, setStatus] = useParamUrl<Status>("status", "semua", STATUS);
  const [halaman, setHalaman] = useHalamanUrl();
  const detail = useAsync(() => admin.financeDetail(halaman, status === "semua" ? undefined : status), [halaman, status]);

  if (ringkas.loading) return <SkeletonCard lines={4} label={k.memuat} />;
  if (ringkas.error || !ringkas.data) {
    return <EmptyState icon="AlertTriangle" title={k.gagal} description={`${ringkas.error ?? ""} ${t.admin.umum.muatUlang}`} />;
  }

  const s = ringkas.data.summary;
  const tren = (ringkas.data.daily_trend ?? []).map((d) => ({ date: d.date, nilai: d.komisi }));
  const pembayaran = Array.isArray(detail.data?.payments) ? detail.data.payments : [];

  return (
    <>
      <div className={app.stats}>
        <Stat label={k.totalKomisi} icon="Wallet" nilai={formatRupiah(s.total_komisi)} />
        <Stat label={k.bulanIni} icon="Receipt" nilai={formatRupiah(s.komisi_bulan_ini)} />
        <Stat label={k.mingguIni} icon="Clock" nilai={formatRupiah(s.komisi_minggu_ini)} />
        <Stat label={k.hariIni} icon="AlarmClock" nilai={formatRupiah(s.komisi_hari_ini)} />
      </div>

      <div className={styles.grid2}>
        <KartuAdmin judul={k.tren} sub={t.admin.ringkasan.periode} icon="Receipt">
          <GrafikBatang judul={`${k.tren}, ${t.admin.ringkasan.periode}`} data={tren} format={(n) => formatRupiah(n)} />
        </KartuAdmin>
        <KartuAdmin judul={k.volume} icon="ShieldCheck">
          <dl className={styles.fakta}>
            <div className={styles.faktaSel}>
              <dt className={styles.faktaLabel}>{k.gmv}</dt>
              <dd className={styles.faktaNilai}>{formatRupiah(s.total_gmv)}</dd>
            </div>
            <div className={styles.faktaSel}>
              <dt className={styles.faktaLabel}>{k.transaksi}</dt>
              <dd className={styles.faktaNilai}>{s.total_transaksi}</dd>
            </div>
          </dl>
        </KartuAdmin>
      </div>

      <div className={app.sectionHead}>
        <h2 className={app.sectionTitle}>{k.daftar}</h2>
      </div>
      <Tabs
        variant="pill"
        aria-label={k.saringLabel}
        items={STATUS.map((x) => ({
          value: x,
          label: x === "semua" ? t.admin.umum.semua : t.komponen.status[PAYMENT_STATUS[x] as keyof typeof t.komponen.status],
        }))}
        value={status}
        onChange={(x) => {
          setStatus(x as Status);
          setHalaman(1);
        }}
      />

      {detail.loading && !detail.data ? (
        <SkeletonCard lines={5} />
      ) : detail.error ? (
        <EmptyState icon="AlertTriangle" title={k.gagal} description={`${detail.error} ${t.admin.umum.muatUlang}`} />
      ) : pembayaran.length === 0 ? (
        <EmptyState icon="Receipt" title={k.daftar} description={k.kosong} />
      ) : (
        <>
          <div className={styles.tabelBungkus}>
            <table className={styles.tabel}>
              <thead>
                <tr>
                  <th scope="col">{k.kolom.proyek}</th>
                  <th scope="col">{k.kolom.pihak}</th>
                  <th scope="col" className={styles.angka}>
                    {k.kolom.nilai}
                  </th>
                  <th scope="col" className={styles.angka}>
                    {k.kolom.komisi}
                  </th>
                  <th scope="col">{k.kolom.status}</th>
                  <th scope="col">{k.kolom.tanggal}</th>
                </tr>
              </thead>
              <tbody>
                {pembayaran.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className={styles.tabelJudul}>{p.contracts?.projects?.title ?? t.aplikasi.umum.kontrak}</span>
                    </td>
                    <td>
                      <span>{p.contracts?.users_contracts_student_idTousers?.full_name ?? "-"}</span>
                      <span className={styles.tabelSub}>{p.contracts?.users_contracts_business_idTousers?.full_name ?? "-"}</span>
                    </td>
                    <td className={styles.angka}>{formatRupiah(p.amount)}</td>
                    <td className={styles.angka}>{formatRupiah(p.platform_fee)}</td>
                    <td>
                      <StatusBadge status={PAYMENT_STATUS[p.status]} size="sm" />
                    </td>
                    <td>{formatTanggal(p.created_at, bahasa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginasi halaman={halaman} total={detail.data?.pagination.total_pages ?? 1} onGanti={setHalaman} />
        </>
      )}
    </>
  );
}
