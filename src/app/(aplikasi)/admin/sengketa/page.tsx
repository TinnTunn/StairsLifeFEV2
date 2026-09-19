"use client";

import Link from "next/link";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin } from "@/lib/api/admin";
import { formatTanggal } from "@/lib/format";
import { DISPUTE_STATUS } from "@/lib/status";
import type { DisputeStatus } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { useParamUrl } from "@/lib/useParamUrl";
import app from "../../mahasiswa/dashboard.module.css";
import { AdminShell } from "../AdminShell";
import styles from "../_bersama/admin.module.css";

const TAB = ["open", "under_review", "resolved", "rejected", "semua"] as const;
type Tab = (typeof TAB)[number];

export default function SengketaAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.sengketa.judul} subtitle={t.admin.sengketa.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const s = t.admin.sengketa;
  const [tab, setTab] = useParamUrl<Tab>("status", "open", TAB);
  const hasil = useAsync(() => admin.disputes(tab === "semua" ? undefined : tab), [tab], "admin-sengketa");
  const items = hasil.data ?? [];

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTabs}>
          <Tabs
            variant="pill"
            aria-label={s.saringLabel}
            items={TAB.map((x) => ({ value: x, label: s.tab[x] }))}
            value={tab}
            onChange={(x) => setTab(x as Tab)}
          />
        </div>
      </div>

      {hasil.loading ? (
        <SkeletonCard lines={4} label={s.memuat} />
      ) : hasil.error ? (
        <EmptyState icon="AlertTriangle" title={s.gagal} description={`${hasil.error} ${t.admin.umum.muatUlang}`} />
      ) : items.length === 0 ? (
        <EmptyState icon="Scale" title={s.kosongJudul} description={s.kosongIsi} />
      ) : (
        <ul className={app.rows}>
          {items.map((d) => (
            <li key={d.id} className={app.row}>
              <span className={app.rowIkon} aria-hidden="true">
                <Icon name="Scale" size={18} />
              </span>
              <div className={app.rowMain}>
                <span className={app.rowTitle}>
                  <Link href={`/admin/sengketa/${d.id}`} className={app.rowLink}>
                    {d.contracts?.projects?.title ?? t.aplikasi.umum.kontrak}
                  </Link>
                </span>
                <span className={app.rowMeta}>
                  {s.dibukaOleh(
                    d.users_disputes_opened_byTousers?.full_name ?? t.admin.umum.tanpaNama,
                    formatTanggal(d.created_at, bahasa),
                  )}
                </span>
                <span className={app.rowMeta}>{d.reason.length > 110 ? `${d.reason.slice(0, 110)}…` : d.reason}</span>
              </div>
              <div className={app.rowAside}>
                {d.contracts ? <Money value={d.contracts.agreed_budget} size="sm" tone="held" /> : null}
                <StatusBadge status={DISPUTE_STATUS[(d.status ?? "open") as DisputeStatus] ?? "sengketa"} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
