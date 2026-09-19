"use client";

import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { Rating } from "@/components/data/Rating";
import { Modal } from "@/components/feedback/Modal";
import { FileDropzone } from "@/components/forms/FileDropzone";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { Kamus } from "@/i18n/kamus";
import { ApiError, USE_MOCK, apiUpload, berkasTerlaluBesar } from "@/lib/api/client";
import { contracts } from "@/lib/api/contracts";
import { payments } from "@/lib/api/payments";
import { reviews } from "@/lib/api/reviews";
import { formatRupiah } from "@/lib/format";
import { RincianKomisi } from "@/components/data/RincianKomisi";
import { contractDeliverables } from "@/lib/data/work";
import type { Contract, Payment, UploadResult } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import app from "../../mahasiswa/dashboard.module.css";
import styles from "./kontrak.module.css";

/** Aksi berisiko dengan pesan galat yang sama: mode contoh, galat API, atau jaringan. */
function useAksi(t: Kamus) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function jalankan(fn: () => Promise<unknown>): Promise<boolean> {
    setError(null);
    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(t.aplikasi.umum.modeContoh);
        return false;
      }
      await fn();
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.messages.join(" ") : t.umum.galat.jaringan);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const galat = error ? (
    <p role="alert" className={app.galat}>
      <Icon name="AlertTriangle" size={18} />
      {error}
    </p>
  ) : null;

  return { loading, error, setError, jalankan, galat };
}

export function ContractActions({
  contract,
  payment,
  mahasiswa,
  sudahMengulas,
  sengketaAktif = false,
  onBerubah,
}: {
  contract: Contract;
  payment: Payment | null;
  mahasiswa: boolean;
  sudahMengulas: boolean;
  /** Selama sengketa berjalan, dana hanya bergerak lewat putusan admin. */
  sengketaAktif?: boolean;
  /** Dipanggil setelah aksi berhasil, supaya halaman memuat ulang kontrak, pembayaran, dan ulasan. */
  onBerubah: () => void;
}) {
  if (!mahasiswa && (!payment || payment.status === "pending" || payment.status === "expired" || payment.status === "failed")) {
    return <BayarEscrow contract={contract} payment={payment} />;
  }
  if (mahasiswa && contract.status === "active" && payment?.status === "held") {
    return <KirimHasil contract={contract} onBerubah={onBerubah} />;
  }
  if (!mahasiswa && contract.status === "pending_review" && !sengketaAktif) {
    return <PutusHasil contract={contract} payment={payment} onBerubah={onBerubah} />;
  }
  if (contract.status === "completed" && !sudahMengulas) {
    return <BeriUlasan contract={contract} mahasiswa={mahasiswa} onBerubah={onBerubah} />;
  }
  return null;
}

/* Bisnis: buat tagihan lalu diarahkan ke Xendit.
   Backend mengembalikan invoice_url untuk dituju, bukan QR untuk dirender. */
function BayarEscrow({ contract, payment }: { contract: Contract; payment: Payment | null }) {
  const { t } = useBahasa();
  const b = t.aplikasi.kontrak.aksi.bayar;
  const { loading, jalankan, galat } = useAksi(t);
  const kedaluwarsa = payment?.status === "expired" || payment?.status === "failed";

  function bayar() {
    void jalankan(async () => {
      const invoice = await payments.createInvoice(contract.id, contract.agreed_budget);
      /* Halaman pembayaran ada di domain Xendit, jadi ini benar-benar
         meninggalkan aplikasi. Router Next tidak dipakai di sini. */
      window.location.href = invoice.invoice_url;
    });
  }

  return (
    <div className={`${styles.card} ${styles.cardAksi}`}>
      <h3 className={styles.cardTitle}>
        <span className={styles.cardIkon} aria-hidden="true">
          <Icon name="Lock" size={18} />
        </span>
        {kedaluwarsa ? b.judulUlang : b.judul}
      </h3>
      <p className={styles.warn}>{kedaluwarsa ? b.isiUlang : b.isi}</p>
      <p className={styles.rincian}>
        {/* Tagihan yang sudah dibuat membawa komisi pastinya; tagihan baru
            memakai persen dari pengaturan backend. */}
        {payment && !kedaluwarsa && payment.platform_fee > 0 ? (
          b.rincian(
            formatRupiah(contract.agreed_budget),
            formatRupiah(payment.platform_fee),
            formatRupiah(payment.net_amount),
          )
        ) : (
          <RincianKomisi nominal={contract.agreed_budget}>
            {(komisi, diterima) =>
              b.rincian(formatRupiah(contract.agreed_budget), formatRupiah(komisi), formatRupiah(diterima))
            }
          </RincianKomisi>
        )}
      </p>
      {galat}
      <div className={styles.actions}>
        <Button onClick={bayar} loading={loading} size="lg" iconRight={<Icon name="ArrowUpRight" size={18} />}>
          {kedaluwarsa ? b.tagihanBaru : b.bayar}
        </Button>
      </div>
    </div>
  );
}

/* Mahasiswa: unggah hasil lalu tandai kontrak menunggu review. */
function KirimHasil({ contract, onBerubah }: { contract: Contract; onBerubah: () => void }) {
  const { t } = useBahasa();
  const k = t.aplikasi.kontrak.aksi.kirim;
  const { loading, error, setError, jalankan, galat } = useAksi(t);
  const [files, setFiles] = useState<File[]>([]);
  const [catatan, setCatatan] = useState("");
  /* Berkas hasil kerja boleh sampai 50 MB dan diunggah satu per satu, jadi
     jedanya bisa menit-menit di koneksi seluler. Tanpa penanda berkas ke
     berapa, layar diam itu terbaca sebagai aplikasi yang macet. */
  const [progres, setProgres] = useState<string | null>(null);

  async function kirim() {
    if (files.length === 0) {
      setError(k.kosong);
      return;
    }
    const besar = berkasTerlaluBesar(files, "deliverable");
    if (besar) {
      setError(t.umum.galat.berkasBesar(besar.nama, besar.batasMb));
      return;
    }
    const berhasil = await jalankan(async () => {
      try {
        /* Unggah satu per satu: endpoint upload menerima satu berkas per
           permintaan. Kolom deliverable_url menyimpan satu URL apa adanya,
           atau array ter-JSON kalau lebih dari satu. */
        const hasil: UploadResult[] = [];
        for (const [i, f] of files.entries()) {
          setProgres(k.mengunggah(i + 1, files.length));
          hasil.push(await apiUpload<UploadResult>(f, "deliverable"));
        }
        const url = hasil.map((h) => h.url);

        await contracts.submitDeliverable(contract.id, {
          ...(url.length === 1 ? { deliverable_url: url[0] } : { deliverable_urls: url }),
          ...(catatan.trim() ? { deliverable_notes: catatan.trim() } : {}),
        });
      } finally {
        setProgres(null);
      }
    });
    if (berhasil) onBerubah();
  }

  return (
    <div className={`${styles.card} ${styles.cardAksi}`}>
      <h3 className={styles.cardTitle}>
        <span className={styles.cardIkon} aria-hidden="true">
          <Icon name="Upload" size={18} />
        </span>
        {k.judul}
      </h3>
      <p className={styles.warn}>{k.isi}</p>
      <FileDropzone
        label={k.berkas}
        multiple
        files={files}
        onFiles={(f) => setFiles((prev) => [...prev, ...f])}
        onRemove={(i) => setFiles((prev) => prev.filter((_, n) => n !== i))}
        hint={k.berkasPetunjuk}
        error={error && files.length === 0 ? error : undefined}
      />
      <Textarea
        label={k.catatan}
        rows={3}
        maxLength={1000}
        showCount
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        placeholder={k.catatanContoh}
      />
      {files.length > 0 ? galat : null}
      {progres ? (
        <p className={styles.progres} role="status">
          {progres}
        </p>
      ) : null}
      <div className={styles.actions}>
        <Button onClick={kirim} loading={loading} size="lg" iconRight={<Icon name="Send" size={18} />}>
          {k.kirim}
        </Button>
      </div>
    </div>
  );
}

/* Bisnis: setujui (melepas dana, tidak bisa dibatalkan) atau minta perbaikan. */
function PutusHasil({
  contract,
  payment,
  onBerubah,
}: {
  contract: Contract;
  payment: Payment | null;
  onBerubah: () => void;
}) {
  const { t } = useBahasa();
  const p = t.aplikasi.kontrak.aksi.putus;
  const { loading, jalankan, galat } = useAksi(t);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [tolakBuka, setTolakBuka] = useState(false);
  const [alasan, setAlasan] = useState("");

  const diterima = payment?.net_amount ?? contract.agreed_budget;
  /* Kiriman yang sedang dilihat klien. Backend menolak keputusan bila yang
     menunggu review sudah kiriman lain (DELIVERABLE_CHANGED). */
  const riwayat = useAsync(() => contractDeliverables(contract.id), [contract.id, contract.status]);
  const kirimanDilihat = (riwayat.data?.data ?? []).find((x) => x.status === "pending")?.id;

  async function putuskan(fn: () => Promise<unknown>) {
    if (await jalankan(fn)) {
      setKonfirmasi(false);
      setTolakBuka(false);
      onBerubah();
    }
  }

  return (
    <div className={`${styles.card} ${styles.cardAksi}`}>
      <h3 className={styles.cardTitle}>
        <span className={styles.cardIkon} aria-hidden="true">
          <Icon name="PackageCheck" size={18} />
        </span>
        {p.judul}
      </h3>
      <p className={styles.warn}>{p.isi(formatRupiah(diterima))}</p>
      {!konfirmasi && !tolakBuka ? galat : null}
      <div className={styles.actions}>
        <Button onClick={() => setKonfirmasi(true)} iconLeft={<Icon name="CheckCircle2" size={18} />}>
          {p.setujui}
        </Button>
        <Button variant="secondary" onClick={() => setTolakBuka(true)}>
          {p.mintaPerbaikan}
        </Button>
      </div>

      {/* dismissible false: ini keputusan dana, jadi pengguna harus memilih
          salah satu, bukan menutupnya dengan Escape tanpa sadar. */}
      <Modal
        open={konfirmasi}
        onClose={() => setKonfirmasi(false)}
        dismissible={false}
        tone="success"
        size="sm"
        title={p.lepasJudul}
        description={p.lepasIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setKonfirmasi(false)} disabled={loading}>
              {t.umum.aksi.batal}
            </Button>
            <Button onClick={() => putuskan(() => contracts.approve(contract.id, kirimanDilihat))} loading={loading}>
              {p.yaLepas}
            </Button>
          </>
        }
      >
        <Money value={diterima} label={p.diterimaMahasiswa} size="lg" tone="in" />
        {galat}
      </Modal>

      <Modal
        open={tolakBuka}
        onClose={() => setTolakBuka(false)}
        size="sm"
        title={p.mintaPerbaikan}
        description={p.perbaikanIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTolakBuka(false)} disabled={loading}>
              {t.umum.aksi.batal}
            </Button>
            <Button
              variant="destructive"
              loading={loading}
              onClick={() => putuskan(() => contracts.reject(contract.id, alasan.trim() || undefined, kirimanDilihat))}
            >
              {p.kirimPerbaikan}
            </Button>
          </>
        }
      >
        <Textarea
          label={p.apaDiperbaiki}
          rows={4}
          maxLength={1000}
          showCount
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          hint={p.apaDiperbaikiPetunjuk}
        />
        {galat}
      </Modal>
    </div>
  );
}

/* Ulasan dua arah setelah kontrak selesai. */
function BeriUlasan({
  contract,
  mahasiswa,
  onBerubah,
}: {
  contract: Contract;
  mahasiswa: boolean;
  onBerubah: () => void;
}) {
  const { t } = useBahasa();
  const r = t.aplikasi.kontrak.aksi.ulasan;
  const { loading, setError, jalankan, galat } = useAksi(t);
  const [nilai, setNilai] = useState(0);
  const [komentar, setKomentar] = useState("");

  const lawan =
    (mahasiswa
      ? contract.users_contracts_business_idTousers?.full_name
      : contract.users_contracts_student_idTousers?.full_name) ?? t.aplikasi.umum.pihakLain;

  async function kirim() {
    if (nilai < 1) {
      setError(r.pilihBintang);
      return;
    }
    const berhasil = await jalankan(() =>
      reviews.create({
        contract_id: contract.id,
        rating: nilai,
        ...(komentar.trim() ? { comment: komentar.trim() } : {}),
      }),
    );
    if (berhasil) onBerubah();
  }

  return (
    <div className={`${styles.card} ${styles.cardAksi}`}>
      <h3 className={styles.cardTitle}>
        <span className={styles.cardIkon} aria-hidden="true">
          <Icon name="Star" size={18} />
        </span>
        {r.judul(lawan)}
      </h3>
      <p className={styles.warn}>{r.isi(lawan)}</p>
      <Rating value={nilai} editable onChange={setNilai} size="lg" showValue={false} />
      <Textarea
        label={r.cerita}
        rows={4}
        maxLength={2000}
        showCount
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
        placeholder={mahasiswa ? r.contohMahasiswa : r.contohBisnis}
      />
      {galat}
      <div className={styles.actions}>
        <Button onClick={kirim} loading={loading}>
          {r.kirim}
        </Button>
      </div>
    </div>
  );
}
