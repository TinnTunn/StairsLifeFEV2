// Tombol terima dan tolak satu pelamar.

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Modal } from "@/components/feedback/Modal";
import { Input } from "@/components/forms/Input";
import { PemilihTanggal } from "@/components/forms/PemilihTanggal";
import { useBahasa } from "@/i18n/BahasaProvider";
import { applications } from "@/lib/api/applications";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { contracts } from "@/lib/api/contracts";
import { formatRupiah } from "@/lib/format";
import { RincianKomisi } from "@/components/data/RincianKomisi";
import type { Application } from "@/lib/types";
import app from "../../../../mahasiswa/dashboard.module.css";
import styles from "./pelamar.module.css";

function tanggalInput(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export function ApplicantActions({
  application,
  jumlahPelamarLain,
  onBerubah,
}: {
  application: Application;
  jumlahPelamarLain: number;
  onBerubah: () => void;
}) {
  const router = useRouter();
  const { t } = useBahasa();
  const k = t.aplikasi.bisnis.pelamar.aksi;
  const [terimaBuka, setTerimaBuka] = useState(false);
  const [tolakBuka, setTolakBuka] = useState(false);
  const [kontrakBuka, setKontrakBuka] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anggaran = application.offered_budget ?? application.projects?.budget_max ?? 0;
  const [nilai, setNilai] = useState(String(anggaran));
  const [tenggat, setTenggat] = useState(tanggalInput(application.estimated_completion));

  const sudahDiputus = application.status === "approved" || application.status === "rejected";
  const kontrakAda = (application.contracts ?? []).length > 0;

  function pesanError(e: unknown): string {
    return e instanceof ApiError ? e.messages.join(" ") : t.umum.galat.jaringan;
  }

  async function jalankan(fn: () => Promise<void>) {
    setError(null);
    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(t.aplikasi.umum.modeContoh);
        return;
      }
      await fn();
    } catch (e) {
      setError(pesanError(e));
    } finally {
      setLoading(false);
    }
  }

  const tolak = () =>
    jalankan(async () => {
      await applications.setStatus(application.id, "rejected");
      setTolakBuka(false);
      onBerubah();
    });

  const terima = () =>
    jalankan(async () => {
      await applications.setStatus(application.id, "approved");
      setTerimaBuka(false);
      setKontrakBuka(true);
      onBerubah();
    });

  const [galatKontrak, setGalatKontrak] = useState<{ nilai?: string; tenggat?: string }>({});

  function buatKontrak() {
    setError(null);
    const angka = Number(nilai);
    const g = {
      nilai: !angka || angka <= 0 ? k.nilaiNol : undefined,
      tenggat: !tenggat ? k.tenggatKosong : undefined,
    };
    setGalatKontrak(g);
    if (g.nilai || g.tenggat) return;
    void jalankan(async () => {
      const dibuat = await contracts.create({
        application_id: application.id,
        agreed_budget: angka,
        deadline: new Date(`${tenggat}T23:59:59`).toISOString(),
      });
      router.push(`/kontrak/${dibuat.id}`);
    });
  }

  const pesanGalat = error ? (
    <p role="alert" className={app.galat}>
      <Icon name="AlertTriangle" size={18} />
      {error}
    </p>
  ) : null;

  return (
    <>
      <div className={styles.actions}>
        {kontrakAda ? (
          <Button href={`/kontrak/${application.contracts?.[0].id}`} iconRight={<Icon name="ArrowUpRight" size={16} />}>
            {k.bukaKontrak}
          </Button>
        ) : application.status === "approved" ? (
          <Button onClick={() => setKontrakBuka(true)}>{k.buatKontrak}</Button>
        ) : sudahDiputus ? null : (
          <>
            <Button onClick={() => setTerimaBuka(true)} iconLeft={<Icon name="UserCheck" size={16} />}>
              {k.terima}
            </Button>
            <Button variant="secondary" onClick={() => setTolakBuka(true)} iconLeft={<Icon name="XCircle" size={16} />}>
              {k.tolak}
            </Button>
          </>
        )}

        {application.student_id ? (
          <Button
            variant="ghost"
            href={`/pesan/tanya/${application.student_id}`}
            iconLeft={<Icon name="Komentar" size={16} />}
          >
            {k.chat}
          </Button>
        ) : null}
      </div>

      {!terimaBuka && !tolakBuka && !kontrakBuka ? pesanGalat : null}

      <Modal
        open={terimaBuka}
        onClose={() => setTerimaBuka(false)}
        dismissible={false}
        size="sm"
        title={k.terimaJudul}
        description={jumlahPelamarLain > 0 ? k.terimaTolakLain(jumlahPelamarLain) : k.terimaLanjut}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTerimaBuka(false)} disabled={loading}>
              {t.umum.aksi.batal}
            </Button>
            <Button onClick={terima} loading={loading}>
              {k.yaTerima}
            </Button>
          </>
        }
      >
        {pesanGalat}
      </Modal>

      <Modal
        open={tolakBuka}
        onClose={() => setTolakBuka(false)}
        dismissible={false}
        size="sm"
        tone="danger"
        title={k.tolakJudul}
        description={k.tolakIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTolakBuka(false)} disabled={loading}>
              {t.umum.aksi.batal}
            </Button>
            <Button variant="destructive" onClick={tolak} loading={loading}>
              {k.yaTolak}
            </Button>
          </>
        }
      >
        {pesanGalat}
      </Modal>

      <Modal
        open={kontrakBuka}
        onClose={() => setKontrakBuka(false)}
        title={k.buatKontrak}
        description={k.kontrakIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setKontrakBuka(false)} disabled={loading}>
              {k.nanti}
            </Button>
            <Button onClick={buatKontrak} loading={loading}>
              {k.buatKontrak}
            </Button>
          </>
        }
      >
        <Input
          label={k.nilai}
          prefix="Rp"
          numeric
          uang
          required
          value={nilai}
          error={galatKontrak.nilai}
          onChange={(e) => {
            setNilai(e.target.value.replace(/\D/g, ""));
            setGalatKontrak((g) => ({ ...g, nilai: undefined }));
          }}
          hint={application.offered_budget ? k.nilaiPetunjuk(formatRupiah(application.offered_budget)) : undefined}
        />
        <PemilihTanggal
          label={k.tenggat}
          required
          value={tenggat}
          error={galatKontrak.tenggat}
          onChange={(v) => {
            setTenggat(v);
            setGalatKontrak((g) => ({ ...g, tenggat: undefined }));
          }}
        />
        {Number(nilai) > 0 ? (
          <p className={styles.rincian} aria-live="polite">
            <RincianKomisi nominal={Number(nilai) || 0}>
              {(komisi, diterima) => k.rincian(formatRupiah(Number(nilai)), formatRupiah(komisi), formatRupiah(diterima))}
            </RincianKomisi>
          </p>
        ) : null}
        {pesanGalat}
      </Modal>
    </>
  );
}
