"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin, type AdminUser } from "@/lib/api/admin";
import { formatTanggal } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { useHalamanUrl, useParamUrl } from "@/lib/useParamUrl";
import app from "../../mahasiswa/dashboard.module.css";
import { AdminShell } from "../AdminShell";
import { Paginasi, useAksi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

type Peran = "mahasiswa" | "bisnis";
type Status = "semua" | "aktif" | "dibekukan" | "belumVerifikasi";

export default function PenggunaAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.pengguna.judul} subtitle={t.admin.pengguna.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const p = t.admin.pengguna;
  const [peran, setPeran] = useParamUrl<Peran>("peran", "mahasiswa", ["mahasiswa", "bisnis"]);
  const [status, setStatus] = useParamUrl<Status>("status", "semua", ["semua", "aktif", "dibekukan", "belumVerifikasi"]);
  const [cari, setCari] = useState("");
  /* Pencarian dikirim ke server setelah jeda mengetik, bukan tiap tombol. */
  const [kueri, setKueri] = useState("");
  const [halaman, setHalaman] = useHalamanUrl();
  const [target, setTarget] = useState<AdminUser | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setKueri(cari.trim()), 350);
    return () => window.clearTimeout(id);
  }, [cari]);
  const hasil = useAsync(
    () => admin.cariUsers({ role: peran, status, q: kueri || undefined, page: halaman, limit: 20 }),
    [peran, status, kueri, halaman],
  );

  /* Status "belum terverifikasi" hanya bermakna untuk mahasiswa; bisnis selalu
     is_verified sejak daftar (lihat DECISIONS.md). */
  const daftarStatus: Status[] = peran === "mahasiswa" ? ["semua", "aktif", "dibekukan", "belumVerifikasi"] : ["semua", "aktif", "dibekukan"];

  const items = hasil.data?.items ?? [];
  const totalHalaman = hasil.data ? Math.max(1, Math.ceil(hasil.data.total / hasil.data.limit)) : 1;

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTabs}>
          <Tabs
            variant="pill"
            aria-label={p.saringPeran}
            items={(["mahasiswa", "bisnis"] as Peran[]).map((x) => ({ value: x, label: p.peran[x] }))}
            value={peran}
            onChange={(x) => {
              setPeran(x as Peran);
              setStatus("semua");
              setHalaman(1);
            }}
          />
        </div>
        <div className={styles.toolbarCari}>
          <Input
            label={t.admin.umum.cari}
            type="search"
            value={cari}
            onChange={(e) => {
              setCari(e.target.value);
              setHalaman(1);
            }}
            placeholder={p.cariContoh}
            iconLeft={<Icon name="Search" size={18} />}
          />
        </div>
      </div>

      <Tabs
        aria-label={p.saringStatus}
        items={daftarStatus.map((x) => ({ value: x, label: p.status[x] }))}
        value={status}
        onChange={(x) => {
          setStatus(x as Status);
          setHalaman(1);
        }}
      />

      {hasil.loading ? (
        <SkeletonCard lines={4} media label={p.memuat} />
      ) : hasil.error ? (
        <EmptyState icon="AlertTriangle" title={p.gagal} description={`${hasil.error} ${t.admin.umum.muatUlang}`} />
      ) : items.length === 0 ? (
        <EmptyState icon="UserSearch" title={p.kosongJudul} description={p.kosongIsi} />
      ) : (
        <>
          <span className={styles.jumlah} aria-live="polite">
            {p.jumlah(hasil.data?.total ?? items.length)}
          </span>
          <ul className={app.rows}>
            {items.map((u) => (
              <li key={u.id} className={app.row}>
                <Avatar name={u.full_name} src={u.avatar_url} size="md" verified={u.role === "mahasiswa" && u.is_verified} />
                <div className={app.rowMain}>
                  <span className={app.rowTitle}>{u.full_name}</span>
                  <span className={app.rowMeta}>
                    {u.email}
                    {u.company_name ? ` · ${u.company_name}` : u.university ? ` · ${u.university}` : ""}
                  </span>
                  <span className={app.rowMeta}>
                    {u.is_suspended && u.suspension_reason
                      ? p.alasanBeku(u.suspension_reason)
                      : p.bergabung(formatTanggal(u.created_at, bahasa))}
                  </span>
                </div>
                <div className={app.rowAside}>
                  {u.is_suspended ? (
                    <StatusBadge status="disuspend" />
                  ) : u.role === "mahasiswa" ? (
                    <StatusBadge status={u.is_verified ? "terverifikasi" : "belum_diajukan"} label={u.is_verified ? undefined : p.status.belumVerifikasi} />
                  ) : null}
                  <Button size="sm" variant={u.is_suspended ? "secondary" : "ghost"} onClick={() => setTarget(u)}>
                    {u.is_suspended ? p.aktifkan : p.bekukan}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <Paginasi halaman={halaman} total={totalHalaman} onGanti={setHalaman} />
        </>
      )}

      {target ? (
        <ModalBeku
          pengguna={target}
          onTutup={() => setTarget(null)}
          onSelesai={() => {
            setTarget(null);
            hasil.muatUlang();
          }}
        />
      ) : null}
    </>
  );
}

function ModalBeku({ pengguna, onTutup, onSelesai }: { pengguna: AdminUser; onTutup: () => void; onSelesai: () => void }) {
  const { t } = useBahasa();
  const p = t.admin.pengguna;
  const { loading, jalankan, galat } = useAksi();
  const [alasan, setAlasan] = useState("");
  const bekukan = !pengguna.is_suspended;

  async function kirim() {
    if (await jalankan(() => admin.toggleSuspend(pengguna.id, bekukan ? alasan.trim() || undefined : undefined))) onSelesai();
  }

  return (
    <Modal
      open
      onClose={onTutup}
      size="sm"
      tone={bekukan ? "danger" : "success"}
      title={bekukan ? p.bekukanJudul(pengguna.full_name) : p.aktifkanJudul(pengguna.full_name)}
      description={bekukan ? p.bekukanIsi : p.aktifkanIsi}
      footer={
        <>
          <Button variant="secondary" onClick={onTutup} disabled={loading}>
            {t.admin.umum.batal}
          </Button>
          <Button variant={bekukan ? "destructive" : "primary"} onClick={kirim} loading={loading}>
            {bekukan ? p.bekukan : p.aktifkan}
          </Button>
        </>
      }
    >
      {bekukan ? (
        <Textarea
          label={p.alasanBekukan}
          rows={3}
          maxLength={500}
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          placeholder={p.alasanBekukanContoh}
        />
      ) : null}
      {galat}
    </Modal>
  );
}
