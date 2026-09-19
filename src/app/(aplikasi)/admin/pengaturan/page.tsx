"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Checkbox } from "@/components/forms/Checkbox";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin, IZIN_ADMIN, type AdminRole, type PlatformSettings } from "@/lib/api/admin";
import { formatTanggalJam } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import app from "../../mahasiswa/dashboard.module.css";
import { AdminShell } from "../AdminShell";
import { KartuAdmin, useAksi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

export default function PengaturanAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.pengaturan.judul} subtitle={t.admin.pengaturan.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t } = useBahasa();
  const p = t.admin.pengaturan;
  const setelan = useAsync(() => admin.settings(), []);

  return (
    <>
      <div className={styles.grid2}>
        <KartuAdmin judul={p.platform} icon="Settings">
          {setelan.loading ? (
            <SkeletonCard lines={2} label={p.memuat} />
          ) : setelan.error || !setelan.data ? (
            <EmptyState icon="AlertTriangle" title={p.gagal} description={`${setelan.error ?? ""} ${t.admin.umum.muatUlang}`} />
          ) : (
            <FormPlatform awal={setelan.data} onSimpan={setelan.muatUlang} />
          )}
        </KartuAdmin>
        <Peran />
      </div>
      <Audit />
    </>
  );
}

function FormPlatform({ awal, onSimpan }: { awal: PlatformSettings; onSimpan: () => void }) {
  const { t } = useBahasa();
  const p = t.admin.pengaturan;
  const { loading, setError, jalankan, galat } = useAksi();
  const [komisi, setKomisi] = useState(String(awal.platform_fee));
  const [sla, setSla] = useState(String(awal.verification_sla_days));
  const [tersimpan, setTersimpan] = useState(false);

  async function simpan(event: FormEvent) {
    event.preventDefault();
    setTersimpan(false);
    const k = Number(komisi);
    const s = Number(sla);
    /* Backend memakai IsInt, jadi desimal ditolak di sini lebih dulu. */
    if (!Number.isInteger(k) || k < 0 || k > 100) return setError(p.salahKomisi);
    if (!Number.isInteger(s) || s < 1 || s > 30) return setError(p.salahSla);
    if (await jalankan(() => admin.updateSettings({ platform_fee: k, verification_sla_days: s }))) {
      setTersimpan(true);
      onSimpan();
    }
  }

  return (
    <form onSubmit={simpan} className={styles.daftar} noValidate>
      <Input
        label={p.komisi}
        numeric
        suffix={p.satuanPersen}
        value={komisi}
        onChange={(e) => setKomisi(e.target.value.replace(/\D/g, "").slice(0, 3))}
        hint={p.komisiPetunjuk}
      />
      <Input
        label={p.sla}
        numeric
        suffix={p.satuanHari}
        value={sla}
        onChange={(e) => setSla(e.target.value.replace(/\D/g, "").slice(0, 2))}
        hint={p.slaPetunjuk}
      />
      {galat}
      {tersimpan ? (
        <p className={styles.final} role="status">
          <Icon name="CheckCircle2" size={18} />
          <span>{t.admin.umum.diperbarui}</span>
        </p>
      ) : null}
      <div>
        <Button type="submit" loading={loading}>
          {p.simpan}
        </Button>
      </div>
    </form>
  );
}

function Peran() {
  const { t } = useBahasa();
  const p = t.admin.pengaturan;
  const daftar = useAsync(() => admin.roles(), []);
  const [tambah, setTambah] = useState(false);
  const [ubah, setUbah] = useState<AdminRole | null>(null);
  const [hapus, setHapus] = useState<AdminRole | null>(null);
  const a = t.fitur.peranAdmin;

  return (
    <KartuAdmin
      judul={p.peran}
      sub={p.peranPetunjuk}
      icon="ShieldCheck"
      aksi={
        <Button size="sm" variant="secondary" onClick={() => setTambah(true)} iconLeft={<Icon name="Plus" size={16} />}>
          {p.tambahPeran}
        </Button>
      }
    >
      <p className={styles.catatan}>{a.aturan}</p>
      {daftar.loading && !daftar.data ? (
        <SkeletonCard lines={2} />
      ) : daftar.error ? (
        <p className={styles.catatan}>{p.peranGagal}</p>
      ) : (daftar.data ?? []).length === 0 ? (
        <p className={styles.catatan}>{p.peranKosong}</p>
      ) : (
        <ul className={app.rows}>
          {(daftar.data ?? []).map((r) => (
            <li key={r.id} className={app.row}>
              <span className={app.rowIkon} aria-hidden="true">
                <Icon name="ShieldCheck" size={18} />
              </span>
              <div className={app.rowMain}>
                <span className={app.rowTitle}>{r.name}</span>
                <span className={app.rowMeta}>
                  {r.description ? `${r.description} · ` : ""}
                  {r.is_system ? a.sistem : (r.permissions ?? []).map((x) => a.izin[x] ?? x).join(", ") || p.izin(0)}
                </span>
                <span className={app.rowMeta}>
                  {(r.members ?? []).length === 0 ? a.anggotaKosong : `${a.anggotaJumlah(r.members.length)}: ${r.members.join(", ")}`}
                </span>
              </div>
              <div className={app.rowAside}>
                {r.is_system ? <span className={styles.jumlah}>{p.bawaan}</span> : null}
                <Button size="sm" variant="secondary" onClick={() => setUbah(r)}>
                  {a.ubah}
                </Button>
                {r.is_system ? null : (
                  <Button size="sm" variant="ghost" onClick={() => setHapus(r)}>
                    {p.hapusPeran}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {tambah || ubah ? (
        <ModalPeran
          peran={ubah}
          onTutup={() => {
            setTambah(false);
            setUbah(null);
          }}
          onSelesai={() => {
            setTambah(false);
            setUbah(null);
            daftar.muatUlang();
          }}
        />
      ) : null}
      {hapus ? (
        <ModalHapusPeran
          peran={hapus}
          onTutup={() => setHapus(null)}
          onSelesai={() => {
            setHapus(null);
            daftar.muatUlang();
          }}
        />
      ) : null}
    </KartuAdmin>
  );
}

function ModalPeran({ peran, onTutup, onSelesai }: { peran: AdminRole | null; onTutup: () => void; onSelesai: () => void }) {
  const { t } = useBahasa();
  const p = t.admin.pengaturan;
  const a = t.fitur.peranAdmin;
  const { loading, setError, jalankan, galat } = useAksi();
  const [nama, setNama] = useState(peran?.name ?? "");
  const [deskripsi, setDeskripsi] = useState(peran?.description ?? "");
  const [izin, setIzin] = useState<Set<string>>(new Set(peran?.permissions ?? []));
  const [anggota, setAnggota] = useState((peran?.members ?? []).join(", "));

  function alihkanIzin(kunci: string, aktif: boolean) {
    setIzin((lama) => {
      const baru = new Set(lama);
      if (aktif) baru.add(kunci);
      else baru.delete(kunci);
      return baru;
    });
  }

  async function simpan() {
    if (!nama.trim()) return setError(p.namaWajib);
    const payload = {
      name: nama.trim(),
      description: deskripsi.trim(),
      permissions: IZIN_ADMIN.filter((x) => izin.has(x)),
      members: anggota
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };
    const kirim = peran ? () => admin.updateRole(peran.id, payload) : () => admin.createRole(payload);
    if (await jalankan(kirim)) onSelesai();
  }

  return (
    <Modal
      open
      onClose={onTutup}
      title={peran ? a.ubahJudul(peran.name) : p.tambahPeran}
      description={a.aturan}
      footer={
        <>
          <Button variant="secondary" onClick={onTutup} disabled={loading}>
            {t.admin.umum.batal}
          </Button>
          <Button onClick={simpan} loading={loading}>
            {a.simpan}
          </Button>
        </>
      }
    >
      <Input label={p.namaPeran} required maxLength={100} value={nama} onChange={(e) => setNama(e.target.value)} placeholder={p.namaContoh} />
      <Input label={p.deskripsi} maxLength={255} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
      <fieldset className={styles.izinGrup} disabled={peran?.is_system}>
        <legend className={styles.izinJudul}>{peran?.is_system ? a.sistem : a.izinJudul}</legend>
        <div className={styles.izinDaftar}>
          {IZIN_ADMIN.map((kunci) => (
            <Checkbox
              key={kunci}
              label={a.izin[kunci] ?? kunci}
              checked={peran?.is_system ? true : izin.has(kunci)}
              onChange={(e) => alihkanIzin(kunci, e.target.checked)}
            />
          ))}
        </div>
      </fieldset>
      <Textarea
        label={a.anggota}
        rows={2}
        value={anggota}
        onChange={(e) => setAnggota(e.target.value)}
        hint={a.anggotaPetunjuk}
      />
      {galat}
    </Modal>
  );
}

function ModalHapusPeran({ peran, onTutup, onSelesai }: { peran: AdminRole; onTutup: () => void; onSelesai: () => void }) {
  const { t } = useBahasa();
  const p = t.admin.pengaturan;
  const { loading, jalankan, galat } = useAksi();
  return (
    <Modal
      open
      onClose={onTutup}
      size="sm"
      tone="danger"
      title={p.hapusJudul(peran.name)}
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
              if (await jalankan(() => admin.deleteRole(peran.id))) onSelesai();
            }}
          >
            {p.hapusPeran}
          </Button>
        </>
      }
    >
      {galat}
    </Modal>
  );
}

function Audit() {
  const { t, bahasa } = useBahasa();
  const p = t.admin.pengaturan;
  const log = useAsync(() => admin.auditLogs(50), []);

  return (
    <KartuAdmin judul={p.audit} icon="Clock">
      {log.loading ? (
        <SkeletonCard lines={4} />
      ) : log.error ? (
        <p className={styles.catatan}>{p.auditGagal}</p>
      ) : (log.data ?? []).length === 0 ? (
        <p className={styles.catatan}>{p.auditKosong}</p>
      ) : (
        <ul className={styles.audit}>
          {(log.data ?? []).map((x) => (
            <li key={x.id} className={styles.auditItem}>
              <div className={styles.auditTeks}>
                <span className={styles.auditAksi}>{t.admin.aksiAudit[x.action] ?? x.action}</span>
                <span className={styles.auditMeta}>
                  {p.oleh(x.actor_name ?? t.admin.umum.tanpaNama)} · {formatTanggalJam(x.created_at, bahasa)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </KartuAdmin>
  );
}
