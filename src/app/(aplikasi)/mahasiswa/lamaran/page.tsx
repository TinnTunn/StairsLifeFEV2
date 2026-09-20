// Halaman daftar lamaran milik mahasiswa.

"use client";

import Link from "next/link";
import { Button } from "@/components/actions/Button";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { myApplications } from "@/lib/data/work";
import { formatTanggal } from "@/lib/format";
import { APPLICATION_STATUS } from "@/lib/status";
import type { ApplicationStatus } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { useParamUrl } from "@/lib/useParamUrl";
import { MahasiswaShell } from "../MahasiswaShell";
import styles from "../dashboard.module.css";

const FILTER = [
  { value: "semua", match: ["pending", "shortlisted", "approved", "rejected"] },
  { value: "terkirim", match: ["pending"] },
  { value: "seleksi", match: ["shortlisted"] },
  { value: "diterima", match: ["approved"] },
  { value: "ditolak", match: ["rejected"] },
] as const satisfies ReadonlyArray<{ value: string; match: readonly ApplicationStatus[] }>;

type Tab = (typeof FILTER)[number]["value"];

export default function LamaranSaya() {
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.lamaran.judul} subtitle={t.aplikasi.mahasiswa.lamaran.sub}>
      <Isi />
    </MahasiswaShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const l = t.aplikasi.mahasiswa.lamaran;
  const u = t.aplikasi.umum;
  const [tab, setTab] = useParamUrl<Tab>("status", "semua", FILTER.map((f) => f.value));
  const hasil = useAsync(myApplications, [], "lamaran-saya");

  if (hasil.loading) return <SkeletonCard lines={3} label={l.memuat} />;

  if (hasil.error || hasil.data?.error) {
    return (
      <EmptyState icon="AlertTriangle" title={l.gagal} description={`${hasil.error ?? hasil.data?.error} ${u.muatUlang}`} />
    );
  }

  const semua = hasil.data?.data ?? [];
  const aktif = FILTER.find((f) => f.value === tab) ?? FILTER[0];
  const cocok = (status: ApplicationStatus, match: readonly ApplicationStatus[]) => match.includes(status);
  const items = semua.filter((a) => cocok(a.status, aktif.match));

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}

      <Tabs
        variant="pill"
        aria-label={l.saringLabel}
        items={FILTER.map((f) => ({
          value: f.value,
          label: l.tab[f.value],
          count: semua.filter((a) => cocok(a.status, f.match)).length,
        }))}
        value={tab}
        onChange={(v) => setTab(v as Tab)}
      />

      {semua.length === 0 ? (
        <EmptyState
          icon="Send"
          title={l.kosongJudul}
          description={l.kosongIsi}
          action={<Button href="/mahasiswa/cari">{u.cariProyek}</Button>}
        />
      ) : items.length === 0 ? (
        <EmptyState icon="Inbox" title={l.kosongTabJudul(l.tab[aktif.value].toLowerCase())} description={l.kosongTabIsi} />
      ) : (
        <ul className={styles.rows}>
          {items.map((a) => {
            const bisnis = a.projects?.users?.full_name ?? u.bisnis;
            return (
              <li key={a.id} className={styles.row}>
                <span className={styles.rowIkon} aria-hidden="true">
                  {bisnis.slice(0, 1).toUpperCase()}
                </span>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>
                    <Link href={`/mahasiswa/lamaran/${a.id}`} className={styles.rowLink}>
                      {a.projects?.title ?? u.proyek}
                    </Link>
                  </span>
                  <span className={styles.rowMeta}>
                    {bisnis} · {u.dikirim(formatTanggal(a.created_at, bahasa))}
                  </span>
                </div>
                <div className={styles.rowAside}>
                  <StatusBadge status={APPLICATION_STATUS[a.status]} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
