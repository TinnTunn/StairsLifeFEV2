"use client";

import Link from "next/link";
import { Icon } from "@/components/actions/Icon";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Halaman } from "@/components/layout/KonteksShell";
import { useBahasa } from "@/i18n/BahasaProvider";
import { USE_MOCK } from "@/lib/api/client";
import { disputes } from "@/lib/api/disputes";
import { formatTanggal } from "@/lib/format";
import { DISPUTE_STATUS } from "@/lib/status";
import type { DisputeStatus } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import app from "../mahasiswa/dashboard.module.css";

export default function DaftarSengketa() {
  const { t } = useBahasa();
  return (
    <Halaman title={t.fitur.sengketa.daftarJudul} subtitle={t.fitur.sengketa.daftarSub}>
      <Isi />
    </Halaman>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const s = t.fitur.sengketa;
  const hasil = useAsync(async () => (USE_MOCK ? [] : disputes.mine()), [], "sengketa-saya");

  if (hasil.loading) return <SkeletonCard lines={3} label={s.memuat} />;
  if (hasil.error) return <EmptyState icon="AlertTriangle" title={s.gagal} description={hasil.error} />;

  const items = hasil.data ?? [];
  if (items.length === 0) {
    return <EmptyState icon="Scale" title={s.daftarKosongJudul} description={s.daftarKosongIsi} />;
  }

  return (
    <ul className={app.rows}>
      {items.map((d) => (
        <li key={d.id} className={app.row}>
          <span className={app.rowIkon} aria-hidden="true">
            <Icon name="Scale" size={18} />
          </span>
          <div className={app.rowMain}>
            <span className={app.rowTitle}>
              <Link href={`/sengketa/${d.id}`} className={app.rowLink}>
                {d.project}
              </Link>
            </span>
            <span className={app.rowMeta}>
              {s.diajukanOleh(d.opened_by_me ? s.olehKamu : (d.opener?.full_name ?? t.aplikasi.umum.pihakLain), formatTanggal(d.created_at, bahasa))}
            </span>
            <span className={app.rowMeta}>{d.reason.length > 120 ? `${d.reason.slice(0, 120)}…` : d.reason}</span>
          </div>
          <div className={app.rowAside}>
            <StatusBadge
              status={DISPUTE_STATUS[(d.status ?? "open") as DisputeStatus] ?? "sengketa"}
              label={s.status[d.status ?? "open"]}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
