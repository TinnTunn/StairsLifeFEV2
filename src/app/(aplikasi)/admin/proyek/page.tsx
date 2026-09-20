// Halaman admin untuk memantau dan menutup proyek.

"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin, type AdminProject } from "@/lib/api/admin";
import { formatTanggal } from "@/lib/format";
import { PROJECT_STATUS } from "@/lib/status";
import type { ProjectStatus } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { useParamUrl } from "@/lib/useParamUrl";
import app from "../../mahasiswa/dashboard.module.css";
import { AdminShell } from "../AdminShell";
import { useAksi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

const STATUS: (ProjectStatus | "semua")[] = ["semua", "open", "inProgress", "completed", "disputed", "cancelled"];

export default function ProyekAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.proyek.judul} subtitle={t.admin.proyek.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const p = t.admin.proyek;
  const [status, setStatus] = useParamUrl<(typeof STATUS)[number]>("status", "semua", STATUS);
  const [cari, setCari] = useState("");
  const [hapus, setHapus] = useState<AdminProject | null>(null);
  const hasil = useAsync(() => admin.projects(), [], "admin-proyek");

  const semua = useMemo(() => hasil.data ?? [], [hasil.data]);
  const items = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return semua.filter((x) => {
      if (status !== "semua" && x.status !== status) return false;
      if (!q) return true;
      return x.title.toLowerCase().includes(q) || x.business?.full_name.toLowerCase().includes(q);
    });
  }, [semua, status, cari]);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTabs}>
          <Tabs
            variant="pill"
            aria-label={p.saringLabel}
            items={STATUS.map((x) => ({
              value: x,
              label: x === "semua" ? t.admin.umum.semua : t.komponen.status[PROJECT_STATUS[x] as keyof typeof t.komponen.status],
              count: x === "semua" ? semua.length : semua.filter((s) => s.status === x).length,
            }))}
            value={status}
            onChange={(x) => setStatus(x as (typeof STATUS)[number])}
          />
        </div>
        <div className={styles.toolbarCari}>
          <Input
            label={t.admin.umum.cari}
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder={p.cariContoh}
            iconLeft={<Icon name="Search" size={18} />}
          />
        </div>
      </div>

      {hasil.loading ? (
        <SkeletonCard lines={4} label={p.memuat} />
      ) : hasil.error ? (
        <EmptyState icon="AlertTriangle" title={p.gagal} description={`${hasil.error} ${t.admin.umum.muatUlang}`} />
      ) : items.length === 0 ? (
        <EmptyState icon="SearchX" title={p.kosongJudul} description={p.kosongIsi} />
      ) : (
        <>
          <span className={styles.jumlah} aria-live="polite">
            {p.jumlah(items.length)}
          </span>
          <ul className={app.rows}>
            {items.map((x) => (
              <li key={x.id} className={app.row}>
                <span className={app.rowIkon} aria-hidden="true">
                  <Icon name="Briefcase" size={18} />
                </span>
                <div className={app.rowMain}>
                  <span className={app.rowTitle}>
                    {x.title}
                  </span>
                  <span className={app.rowMeta}>
                    {p.oleh(x.business?.full_name ?? t.admin.umum.tanpaNama)} ·{" "}
                    {formatTanggal(x.created_at, bahasa)} · {t.aplikasi.umum.pelamarN(x.applicant_count)}
                  </span>
                </div>
                <div className={`${app.rowAside} ${styles.asideProyek}`}>
                  <Money value={x.budget_max} size="sm" tone="muted" />
                  <StatusBadge status={PROJECT_STATUS[x.status]} />
                  <span className={styles.diAtasTautan}>
                    <Button size="sm" variant="ghost" onClick={() => setHapus(x)} iconLeft={<Icon name="Trash2" size={16} />}>
                      {p.hapus}
                    </Button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {hapus ? (
        <ModalHapus
          proyek={hapus}
          onTutup={() => setHapus(null)}
          onSelesai={() => {
            setHapus(null);
            hasil.muatUlang();
          }}
        />
      ) : null}
    </>
  );
}

function ModalHapus({ proyek, onTutup, onSelesai }: { proyek: AdminProject; onTutup: () => void; onSelesai: () => void }) {
  const { t } = useBahasa();
  const p = t.admin.proyek;
  const { loading, jalankan, galat } = useAksi();

  return (
    <Modal
      open
      onClose={onTutup}
      size="sm"
      tone="danger"
      title={p.hapusJudul(proyek.title)}
      description={p.hapusIsi}
      footer={
        <>
          <Button variant="secondary" onClick={onTutup} disabled={loading}>
            {t.admin.umum.batal}
          </Button>
          <Button
            variant="destructive"
            loading={loading}
            onClick={async () => {
              if (await jalankan(() => admin.deleteProject(proyek.id))) onSelesai();
            }}
          >
            {p.hapusYa}
          </Button>
        </>
      }
    >
      {galat}
    </Modal>
  );
}
