// Halaman daftar notifikasi pengguna.

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { IconButton } from "@/components/actions/IconButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Halaman } from "@/components/layout/KonteksShell";
import { BERANDA_PERAN } from "@/components/layout/nav-items";
import { TautanKembali } from "@/components/navigation/TautanKembali";
import { useSesi } from "@/lib/api/useSesi";
import { IKON_NOTIFIKASI, kabariNotifikasiBerubah } from "@/components/layout/LoncengNotifikasi";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { USE_MOCK } from "@/lib/api/client";
import { notifications } from "@/lib/api/notifications";
import { formatTanggalJam, formatWaktuRelatif } from "@/lib/format";
import { ruteNotifikasi, teksNotifikasi } from "@/lib/notifikasi";
import type { Notification } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { useParamUrl } from "@/lib/useParamUrl";
import styles from "./notifikasi.module.css";

type Tab = "semua" | "belum";

export default function HalamanNotifikasi() {
  const { t } = useBahasa();
  const { session } = useSesi();
  return (
    <Halaman title={t.fitur.notifikasi.judul} subtitle={t.fitur.notifikasi.sub}>
      <TautanKembali href={session ? BERANDA_PERAN[session.user.role] : "/mahasiswa"} label={t.umum.aksi.keBeranda} />
      <Isi />
    </Halaman>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const n = t.fitur.notifikasi;
  const [tab, setTab] = useParamUrl<Tab>("status", "semua", ["semua", "belum"]);
  const hasil = useAsync(async () => (USE_MOCK ? [] : notifications.list()), [], "notifikasi");
  const [dibaca, setDibaca] = useState<Set<string>>(new Set());
  const [dihapus, setDihapus] = useState<Set<string>>(new Set());

  if (hasil.loading) return <SkeletonCard lines={4} label={n.memuat} />;
  if (hasil.error) {
    return <EmptyState icon="AlertTriangle" title={n.gagal} description={hasil.error} />;
  }

  const semua = (hasil.data ?? [])
    .filter((x) => !dihapus.has(x.id))
    .map((x) => (dibaca.has(x.id) ? { ...x, is_read: true } : x));
  const belum = semua.filter((x) => !x.is_read);
  const tampil = tab === "belum" ? belum : semua;

  function tandai(item: Notification) {
    if (item.is_read) return;
    setDibaca((s) => new Set(s).add(item.id));
    void notifications
      .markRead(item.id)
      .then(kabariNotifikasiBerubah)
      .catch(() => hasil.muatUlang());
  }

  function tandaiSemua() {
    setDibaca(new Set(semua.map((x) => x.id)));
    void notifications
      .markAllRead()
      .then(kabariNotifikasiBerubah)
      .catch(() => hasil.muatUlang());
  }

  function hapus(item: Notification) {
    setDihapus((s) => new Set(s).add(item.id));
    void notifications
      .remove(item.id)
      .then(kabariNotifikasiBerubah)
      .catch(() => hasil.muatUlang());
  }

  return (
    <>
      <div className={styles.toolbar}>
        <Tabs
          variant="pill"
          aria-label={n.saringLabel}
          items={[
            { value: "semua", label: n.tab.semua, count: semua.length },
            { value: "belum", label: n.tab.belum, count: belum.length },
          ]}
          value={tab}
          onChange={(v) => setTab(v as Tab)}
        />
        {belum.length > 0 ? (
          <Button variant="secondary" size="sm" onClick={tandaiSemua} iconLeft={<Icon name="CheckCheck" size={16} />}>
            {n.tandaiSemua}
          </Button>
        ) : null}
      </div>

      {tampil.length === 0 ? (
        <EmptyState
          icon="BellOff"
          title={tab === "belum" && semua.length > 0 ? n.kosongBelumDibaca : n.kosongJudul}
          description={tab === "belum" && semua.length > 0 ? undefined : n.kosongIsi}
        />
      ) : (
        <ul className={styles.daftar}>
          {tampil.map((item) => {
            const teks = teksNotifikasi(item, n, bahasa);
            const ke = ruteNotifikasi(item.action_url);
            return (
              <li key={item.id} className={styles.item} data-baru={String(!item.is_read)}>
                <span className={styles.ikon} aria-hidden="true">
                  <Icon name={IKON_NOTIFIKASI[item.type] ?? "Bell"} size={18} />
                </span>
                <div className={styles.teks}>
                  <span className={styles.judul}>
                    {!item.is_read ? <span className={styles.srOnly}>{n.baru}: </span> : null}
                    {ke ? (
                      <Link href={ke} className={styles.tautan} onClick={() => tandai(item)}>
                        {teks.judul}
                      </Link>
                    ) : (
                      teks.judul
                    )}
                  </span>
                  {teks.isi ? <p className={styles.isi}>{teks.isi}</p> : null}
                  <span className={styles.meta}>
                    {n.jenis[item.type]} ·{" "}
                    <time dateTime={item.created_at} title={formatTanggalJam(item.created_at, bahasa)}>
                      {formatWaktuRelatif(item.created_at, bahasa)}
                    </time>
                  </span>
                </div>
                <div className={styles.aksi}>
                  {!item.is_read ? (
                    <IconButton label={n.tandaiDibaca} size="sm" onClick={() => tandai(item)}>
                      <Icon name="Check" size={16} />
                    </IconButton>
                  ) : null}
                  <IconButton label={n.hapusLabel(teks.judul)} size="sm" onClick={() => hapus(item)}>
                    <Icon name="Trash2" size={16} />
                  </IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
