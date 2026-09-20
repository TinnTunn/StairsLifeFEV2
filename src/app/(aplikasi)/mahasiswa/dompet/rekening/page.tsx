// Halaman kelola rekening bank tujuan penarikan.

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { bankAccounts } from "@/lib/api/wallet";
import { useAsync } from "@/lib/useAsync";
import { MahasiswaShell } from "../../MahasiswaShell";
import app from "../../dashboard.module.css";
import styles from "../dompet.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

export default function Rekening() {
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.rekening.judul} subtitle={t.aplikasi.mahasiswa.rekening.sub}>
      <TautanKembali href="/mahasiswa/dompet" label={t.umum.aksi.keDompet} />
      <Isi />
    </MahasiswaShell>
  );
}

function Isi() {
  const { t } = useBahasa();
  const r = t.aplikasi.mahasiswa.rekening;
  const [versi, setVersi] = useState(0);
  const daftar = useAsync(async () => (USE_MOCK ? [] : bankAccounts.list()), [versi]);

  const [tambahBuka, setTambahBuka] = useState(false);
  const [hapusId, setHapusId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ bank_name: "", bank_code: "", account_number: "", account_holder: "" });
  const [galatKolom, setGalatKolom] = useState<Partial<Record<keyof typeof form, string>>>({});

  function set<K extends keyof typeof form>(key: K) {
    return (e: { target: { value: string } }) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
      setGalatKolom((g) => ({ ...g, [key]: undefined }));
    };
  }

  async function jalankan(fn: () => Promise<unknown>, tutup?: () => void) {
    setError(null);
    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(t.aplikasi.umum.modeContoh);
        return;
      }
      await fn();
      tutup?.();
      setVersi((v) => v + 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.messages.join(" ") : t.umum.galat.jaringan);
    } finally {
      setLoading(false);
    }
  }

  function tambah(event: FormEvent) {
    event.preventDefault();
    const isi = {
      bank_name: form.bank_name.trim(),
      bank_code: form.bank_code.trim().toUpperCase(),
      account_number: form.account_number.trim(),
      account_holder: form.account_holder.trim(),
    };

    const g = {
      bank_name: isi.bank_name.length < 2 ? r.salahNamaBank : undefined,
      bank_code: !/^[A-Z0-9_]{2,20}$/.test(isi.bank_code) ? r.salahKode : undefined,
      account_number: !/^[0-9-]{6,30}$/.test(isi.account_number) ? r.salahNomor : undefined,
      account_holder: isi.account_holder.length < 2 ? r.salahPemilik : undefined,
    };
    setGalatKolom(g);
    if (Object.values(g).some(Boolean)) return;

    void jalankan(
      () => bankAccounts.create(isi),
      () => {
        setTambahBuka(false);
        setForm({ bank_name: "", bank_code: "", account_number: "", account_holder: "" });
      },
    );
  }

  if (daftar.loading) return <SkeletonCard lines={2} label={r.memuat} />;

  const items = daftar.data ?? [];
  const pesanGalat = error ? (
    <p role="alert" className={app.galat}>
      <Icon name="AlertTriangle" size={18} />
      {error}
    </p>
  ) : null;

  return (
    <>
      <div className={styles.actions}>
        <Button
          onClick={() => {
            setError(null);
            setTambahBuka(true);
          }}
          iconLeft={<Icon name="Plus" size={18} />}
        >
          {r.tambah}
        </Button>
      </div>

      {!tambahBuka && !hapusId ? pesanGalat : null}

      {items.length === 0 ? (
        <EmptyState icon="Wallet" title={r.kosongJudul} description={USE_MOCK ? r.kosongContoh : r.kosongIsi} />
      ) : (
        <ul className={app.rows}>
          {items.map((rek) => (
            <li key={rek.id} className={app.row}>
              <span className={app.rowIkon} aria-hidden="true">
                <Icon name="Wallet" size={18} />
              </span>
              <div className={app.rowMain}>
                <span className={app.rowTitle}>
                  {rek.bank_name} {rek.account_number}
                </span>
                <span className={app.rowMeta}>{r.atasNama(rek.account_holder)}</span>
              </div>
              <div className={app.rowAside}>
                {rek.is_primary ? (
                  <StatusBadge status="terverifikasi" label={r.utama} size="sm" />
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => jalankan(() => bankAccounts.setPrimary(rek.id))}
                    loading={loading}
                  >
                    {r.jadikanUtama}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setError(null);
                    setHapusId(rek.id);
                  }}
                >
                  {r.hapus}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={tambahBuka}
        onClose={() => setTambahBuka(false)}
        title={r.tambah}
        description={r.tambahIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTambahBuka(false)} disabled={loading}>
              {t.umum.aksi.batal}
            </Button>
            <Button type="submit" form="form-rekening" loading={loading}>
              {r.simpan}
            </Button>
          </>
        }
      >
        <form id="form-rekening" className={styles.section} onSubmit={tambah} noValidate>
          <Input
            label={r.namaBank}
            error={galatKolom.bank_name}
            required
            value={form.bank_name}
            onChange={set("bank_name")}
            placeholder={r.namaBankContoh}
          />
          <Input
            label={r.kodeBank}
            error={galatKolom.bank_code}
            required
            value={form.bank_code}
            onChange={set("bank_code")}
            placeholder="BCA"
            hint={r.kodeBankPetunjuk}
          />
          <Input
            label={r.nomor}
            error={galatKolom.account_number}
            required
            numeric
            value={form.account_number}
            onChange={set("account_number")}
            placeholder="1234567890"
          />
          <Input
            label={r.pemilik}
            error={galatKolom.account_holder}
            required
            value={form.account_holder}
            onChange={set("account_holder")}
            placeholder={r.pemilikContoh}
          />
          {pesanGalat}
        </form>
      </Modal>

      <Modal
        open={hapusId !== null}
        onClose={() => setHapusId(null)}
        size="sm"
        tone="danger"
        title={r.hapusJudul}
        description={r.hapusIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setHapusId(null)} disabled={loading}>
              {t.umum.aksi.batal}
            </Button>
            <Button
              variant="destructive"
              loading={loading}
              onClick={() => hapusId && jalankan(() => bankAccounts.remove(hapusId), () => setHapusId(null))}
            >
              {r.hapusRekening}
            </Button>
          </>
        }
      >
        {pesanGalat}
      </Modal>
    </>
  );
}
