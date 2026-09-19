"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { bankAccounts, wallet as walletApi } from "@/lib/api/wallet";
import { myWallet } from "@/lib/data/work";
import { formatRupiah } from "@/lib/format";
import { usePengaturanPublik } from "@/lib/pengaturan";
import { useAsync } from "@/lib/useAsync";
import { MahasiswaShell } from "../../MahasiswaShell";
import app from "../../dashboard.module.css";
import styles from "../dompet.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";
import { SaldoRahasia, TombolSaldo } from "@/components/data/SaldoRahasia";

/* Minimum dan biaya admin dibaca dari GET /settings/public, sumber yang sama
   dengan yang dipakai backend saat memproses penarikan (env
   WITHDRAWAL_MIN_AMOUNT dan WITHDRAWAL_ADMIN_FEE). */

export default function TarikDana() {
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.tarik.judul} subtitle={t.aplikasi.mahasiswa.tarik.sub}>
      <TautanKembali href="/mahasiswa/dompet" label={t.umum.aksi.keDompet} />
      <Isi />
    </MahasiswaShell>
  );
}

function Isi() {
  const { t } = useBahasa();
  const d = t.aplikasi.mahasiswa.tarik;
  const dompet = useAsync(myWallet, []);
  const rekening = useAsync(async () => (USE_MOCK ? [] : bankAccounts.list()), []);
  const pengaturan = usePengaturanPublik();

  const [jumlah, setJumlah] = useState("");
  const [rekeningId, setRekeningId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galatKolom, setGalatKolom] = useState<{ rekening?: string; jumlah?: string }>({});
  const [selesai, setSelesai] = useState(false);

  if (dompet.loading || rekening.loading || pengaturan.loading) return <SkeletonCard lines={3} label={d.memuat} />;

  const MIN = pengaturan.data?.withdrawal_min_amount ?? 0;
  const BIAYA_ADMIN = pengaturan.data?.withdrawal_admin_fee ?? 0;
  const batasTerbaca = Boolean(pengaturan.data);

  const saldo = dompet.data?.data.amount ?? 0;
  const nominal = Number(jumlah) || 0;
  const diterima = Math.max(0, nominal - BIAYA_ADMIN);
  const daftarRekening = rekening.data ?? [];
  /* Rekening utama, atau satu-satunya rekening, dipilih lebih dulu. Menyuruh
     orang memilih dari daftar berisi satu baris hanya menambah langkah, dan
     penarikan yang gagal di langkah itu terasa seperti aplikasi yang rewel. */
  const rekeningDipilih = rekeningId || daftarRekening.find((r) => r.is_primary)?.id || daftarRekening[0]?.id || "";

  if (selesai) {
    return (
      <EmptyState
        icon="Check"
        title={d.selesaiJudul}
        description={d.selesaiIsi}
        action={<Button href="/mahasiswa/dompet">{d.keDompet}</Button>}
      />
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!batasTerbaca) {
      setError(t.fitur.pengaturan.batasTidakTerbaca);
      return;
    }
    const g = {
      rekening: !rekeningDipilih ? d.pilihRekening : undefined,
      jumlah: nominal < MIN ? d.minimal(formatRupiah(MIN)) : nominal > saldo ? d.melebihi(formatRupiah(saldo)) : undefined,
    };
    setGalatKolom(g);
    if (g.rekening || g.jumlah) return;

    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(d.modeContoh);
        return;
      }
      await walletApi.requestWithdrawal(rekeningDipilih, nominal);
      setSelesai(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.umum.galat.jaringan);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {dompet.data?.sample ? <SampleDataNotice /> : null}

      <div className={`${styles.balance} ${styles.balanceUtama}`}>
        <span className={styles.balanceLabel}>
          <Icon name="Wallet" size={16} />
          {t.aplikasi.mahasiswa.dompet.bisaDitarik}
          <TombolSaldo className={styles.tombolSaldo} />
        </span>
        <SaldoRahasia value={saldo} size="lg" className={styles.balanceAngka} />
      </div>

      {daftarRekening.length === 0 ? (
        <EmptyState
          icon="Wallet"
          title={d.tanpaRekeningJudul}
          description={USE_MOCK ? d.tanpaRekeningContoh : d.tanpaRekeningIsi}
          action={<Button href="/mahasiswa/dompet/rekening">{d.tambahRekening}</Button>}
        />
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          {error ? (
            <p role="alert" className={app.galat}>
              <Icon name="AlertTriangle" size={18} />
              {error}
            </p>
          ) : null}

          <Select
            label={d.rekeningTujuan}
            required
            value={rekeningDipilih}
            error={galatKolom.rekening}
            onChange={(e) => {
              setRekeningId(e.target.value);
              setGalatKolom((g) => ({ ...g, rekening: undefined }));
            }}
            placeholder={d.pilih}
            options={daftarRekening.map((r) => ({
              value: r.id,
              label: d.atasNama(r.bank_name, r.account_number, r.account_holder),
            }))}
          />

          <Input
            label={d.jumlah}
            prefix="Rp"
            numeric
            uang
            required
            value={jumlah}
            error={galatKolom.jumlah}
            onChange={(e) => {
              setJumlah(e.target.value.replace(/\D/g, ""));
              setGalatKolom((g) => ({ ...g, jumlah: undefined }));
            }}
            hint={batasTerbaca ? d.jumlahPetunjuk(formatRupiah(MIN), formatRupiah(BIAYA_ADMIN)) : t.fitur.pengaturan.batasTidakTerbaca}
          />

          {nominal > 0 && batasTerbaca ? (
            <p className={styles.rincian} aria-live="polite">
              {d.rincian(formatRupiah(nominal), formatRupiah(BIAYA_ADMIN), formatRupiah(diterima))}
            </p>
          ) : null}

          <div>
            <Button type="submit" size="lg" loading={loading} iconRight={<Icon name="ArrowUpRight" size={18} />}>
              {d.ajukan}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
