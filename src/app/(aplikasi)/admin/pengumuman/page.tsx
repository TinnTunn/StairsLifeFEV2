// Halaman admin untuk mengirim pengumuman.

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin, type Announcement } from "@/lib/api/admin";
import { formatTanggalJam } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { AdminShell } from "../AdminShell";
import { KartuAdmin, useAksi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

const TARGET: Announcement["target"][] = ["all", "student", "bisnis"];

export default function PengumumanAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.pengumuman.judul} subtitle={t.admin.pengumuman.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const a = t.admin.pengumuman;
  const riwayat = useAsync(() => admin.announcements(), [], "admin-pengumuman");
  const { loading, setError, jalankan, galat } = useAksi();
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [target, setTarget] = useState<Announcement["target"]>("all");
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [terkirim, setTerkirim] = useState(false);

  function periksa(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setTerkirim(false);
    if (!judul.trim() || !isi.trim()) {
      setError(a.wajib);
      return;
    }
    setKonfirmasi(true);
  }

  async function kirim() {
    const ok = await jalankan(() => admin.sendAnnouncement({ title: judul.trim(), body: isi.trim(), target }));
    if (ok) {
      setKonfirmasi(false);
      setJudul("");
      setIsi("");
      setTerkirim(true);
      riwayat.muatUlang();
    }
  }

  return (
    <div className={styles.grid2}>
      <KartuAdmin judul={a.formJudul} icon="Bell">
        <form onSubmit={periksa} className={styles.daftar} noValidate>
          <Input label={a.judulLabel} required maxLength={255} value={judul} onChange={(e) => setJudul(e.target.value)} placeholder={a.judulContoh} />
          <Select
            label={a.target}
            value={target}
            onChange={(e) => setTarget(e.target.value as Announcement["target"])}
            options={TARGET.map((x) => ({ value: x, label: a.targetOpsi[x] }))}
            placeholder=""
          />
          <Textarea
            label={a.isi}
            required
            rows={5}
            maxLength={1000}
            showCount
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            placeholder={a.isiContoh}
          />
          {!konfirmasi ? galat : null}
          {terkirim ? (
            <p className={styles.final} role="status">
              <Icon name="CheckCircle2" size={18} />
              <span>{a.terkirim}</span>
            </p>
          ) : null}
          <div>
            <Button type="submit" iconRight={<Icon name="Send" size={16} />}>
              {a.kirim}
            </Button>
          </div>
        </form>
      </KartuAdmin>

      <KartuAdmin judul={a.riwayat} icon="Clock">
        {riwayat.loading && !riwayat.data ? (
          <SkeletonCard lines={3} label={a.memuat} />
        ) : riwayat.error ? (
          <EmptyState icon="AlertTriangle" title={a.gagal} description={`${riwayat.error} ${t.admin.umum.muatUlang}`} />
        ) : (riwayat.data ?? []).length === 0 ? (
          <p className={styles.catatan}>{a.kosong}</p>
        ) : (
          <ul className={styles.audit}>
            {(riwayat.data ?? []).map((x) => (
              <li key={x.id} className={styles.auditItem}>
                <div className={styles.auditTeks}>
                  <span className={styles.auditAksi}>{x.title}</span>
                  <span className={styles.auditMeta}>
                    {a.targetOpsi[x.target] ?? x.target} · {formatTanggalJam(x.created_at, bahasa)}
                  </span>
                  <span className={styles.catatan}>{x.body}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </KartuAdmin>

      <Modal
        open={konfirmasi}
        onClose={() => setKonfirmasi(false)}
        size="sm"
        title={a.konfirmasiJudul}
        description={a.konfirmasiIsi(a.targetOpsi[target])}
        footer={
          <>
            <Button variant="secondary" onClick={() => setKonfirmasi(false)} disabled={loading}>
              {t.admin.umum.batal}
            </Button>
            <Button onClick={kirim} loading={loading}>
              {a.kirim}
            </Button>
          </>
        }
      >
        <p className={styles.kutipan}>
          <b>{judul}</b>
          {"\n"}
          {isi}
        </p>
        {galat}
      </Modal>
    </div>
  );
}
