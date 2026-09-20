// Halaman detail kontrak: tahapan escrow, hasil kerja, dan obrolan.

"use client";

import { use, useEffect, useRef, useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { Rating } from "@/components/data/Rating";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Obrolan } from "@/components/chat/Obrolan";
import { AnyRoleShell } from "@/components/layout/AnyRoleShell";
import { ContractStepper, type ContractStep } from "@/components/navigation/ContractStepper";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { Bahasa } from "@/i18n/jenis";
import type { Kamus } from "@/i18n/kamus";
import { USE_MOCK } from "@/lib/api/client";
import { disputes, sengketaAktif } from "@/lib/api/disputes";
import { getContract, getContractPayment, contractReviews } from "@/lib/data/work";
import { usePengaturanPublik } from "@/lib/pengaturan";
import { formatTanggal } from "@/lib/format";
import { CONTRACT_STATUS } from "@/lib/status";
import type { Contract, Payment, Review } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { AjukanSengketa } from "./AjukanSengketa";
import { ContractActions } from "./ContractActions";
import { Deliverables } from "./Deliverables";
import styles from "./kontrak.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

type KamusDetail = Kamus["aplikasi"]["kontrak"]["detail"];

export default function DetailKontrak({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  return (
    <AnyRoleShell title={t.aplikasi.kontrak.detail.judul}>
      {(session) => <Isi id={id} mahasiswa={session.user.role === "mahasiswa"} akuId={session.user.id} />}
    </AnyRoleShell>
  );
}

function tahapan(c: Contract, p: Payment | null, d: KamusDetail, bahasa: Bahasa): { steps: ContractStep[]; current: number } {
  const dibayar = p ? ["held", "released", "split_settled"].includes(p.status) : false;
  const dilepas = p ? ["released", "split_settled"].includes(p.status) : false;
  const tg = (v: string) => formatTanggal(v, bahasa);

  const steps: ContractStep[] = [
    { label: d.tahap.disepakati, meta: tg(c.created_at) },
    { label: d.tahap.escrow, meta: p?.held_at ? tg(p.held_at) : undefined },
    { label: d.tahap.dikerjakan, meta: d.tahap.tenggat(tg(c.deadline)) },
    { label: d.tahap.dikirim },
    { label: d.tahap.disetujui },
    { label: d.tahap.dompet, meta: p?.released_at ? tg(p.released_at) : undefined },
  ];

  if (c.status === "disputed") {
    steps[3] = { ...steps[3], tone: "alert", label: d.tahap.sengketa };
    return { steps, current: 3 };
  }
  if (c.status === "cancelled") {
    steps[1] = { ...steps[1], tone: "alert", label: d.tahap.dibatalkan };
    return { steps, current: 1 };
  }

  let current = 0;
  if (dibayar) current = 2;
  if (c.status === "pending_review") current = 3;
  if (c.status === "completed") current = dilepas ? steps.length : 4;
  if (!dibayar && c.status === "active") current = 1;

  return { steps, current };
}

function pemegangDana(p: Payment | null, mahasiswa: boolean, d: KamusDetail): { siapa: string; catatan: string } {
  const k = d.pemegang;
  if (!p || p.status === "pending") return mahasiswa ? k.belumMahasiswa : k.belumBisnis;
  if (p.status === "held") return { siapa: k.ditahan, catatan: mahasiswa ? k.ditahanMahasiswa : k.ditahanBisnis };
  if (p.status === "released") return mahasiswa ? k.dilepasMahasiswa : k.dilepasBisnis;
  if (p.status === "refunded") {
    return { siapa: mahasiswa ? k.dikembalikanMahasiswa : k.dikembalikanBisnis, catatan: k.dikembalikanCatatan };
  }
  if (p.status === "split_settled") return k.dibagi;
  return k.gagal;
}

function KartuUlasan({ judul, ulasan, label }: { judul: string; ulasan: Review; label: string }) {
  return (
    <div className={styles.ulasan}>
      <span className={styles.rowLabel}>{judul}</span>
      <Rating value={ulasan.rating} size="sm" label={label} />
      {ulasan.comment ? <p className={styles.kutipan}>{ulasan.comment}</p> : null}
    </div>
  );
}

function Isi({ id, mahasiswa, akuId }: { id: string; mahasiswa: boolean; akuId: string }) {
  const { t, bahasa } = useBahasa();
  const d = t.aplikasi.kontrak.detail;
  const u = t.aplikasi.umum;
  const kontrak = useAsync(() => getContract(id), [id]);
  const bayar = useAsync(() => getContractPayment(id), [id]);
  const ulasan = useAsync(() => contractReviews(id), [id]);
  const sengketa = useAsync(async () => (USE_MOCK ? [] : disputes.mine()), [id]);
  const pengaturan = usePengaturanPublik();
  const berubah = useKontrakLangsung(id, `${kontrak.data?.data?.status ?? ""}|${bayar.data?.data?.status ?? ""}`, () => {
    kontrak.muatUlang();
    bayar.muatUlang();
    sengketa.muatUlang();
  });

  if (kontrak.loading || bayar.loading || ulasan.loading) return <SkeletonCard lines={4} label={d.memuat} />;

  if (kontrak.error || kontrak.data?.error) {
    return (
      <EmptyState
        icon="AlertTriangle"
        title={d.gagal}
        description={`${kontrak.error ?? kontrak.data?.error} ${u.muatUlang}`}
      />
    );
  }

  const c = kontrak.data?.data;
  if (!c) {
    return (
      <EmptyState
        icon="SearchX"
        title={d.tidakAdaJudul}
        description={d.tidakAdaIsi}
        action={<Button href="/kontrak">{d.keDaftar}</Button>}
      />
    );
  }

  const p = bayar.data?.data ?? null;
  const ulasanku = (ulasan.data?.data ?? []).find((r) => r.reviewer_id === akuId);
  const sudahMengulas = Boolean(ulasanku);
  const ulasanUntukku = (ulasan.data?.data ?? []).find((r) => r.reviewee_id === akuId);
  const sengketaBerjalan = (sengketa.data ?? []).find((x) => x.contract_id === c.id && sengketaAktif(x.status));
  const bisaDisengketakan = c.status === "active" || c.status === "pending_review";
  const { steps, current } = tahapan(c, p, d, bahasa);
  const pemegang = pemegangDana(p, mahasiswa, d);
  const lawan =
    (mahasiswa ? c.users_contracts_business_idTousers?.full_name : c.users_contracts_student_idTousers?.full_name) ??
    u.pihakLain;

  return (
    <>
      {kontrak.data?.sample ? <SampleDataNotice /> : null}

      {berubah.tampil ? (
        <div className={`${styles.banner} ${styles.bannerInfo}`} role="status">
          <Icon name="RotateCw" size={18} className={styles.bannerIkon} />
          <span className={styles.bannerTeks}>{t.fitur.kontrakLangsung.berubah}</span>
          <Button size="sm" variant="ghost" onClick={berubah.tutup}>
            {t.komponen.modal.tutup}
          </Button>
        </div>
      ) : null}

      {sengketaBerjalan ? (
        <div className={styles.banner} role="status">
          <Icon name="Scale" size={18} className={styles.bannerIkon} />
          <span className={styles.bannerTeks}>
            <b>{t.fitur.sengketa.bannerJudul}</b>
            {t.fitur.sengketa.bannerIsi}
          </span>
          <Button size="sm" variant="secondary" href={`/sengketa/${sengketaBerjalan.id}`}>
            {t.fitur.sengketa.lihat}
          </Button>
        </div>
      ) : null}

      <TautanKembali href="/kontrak" label={d.keDaftar} />

      <div className={styles.head}>
        <StatusBadge status={CONTRACT_STATUS[c.status]} />
        <h2 className={styles.title}>{c.projects?.title ?? u.kontrak}</h2>
        <p className={styles.meta}>
          {d.dengan(lawan)} · {u.tenggat(formatTanggal(c.deadline, bahasa))}
        </p>
      </div>

      <div className={styles.holder}>
        <div className={styles.holderKepala}>
          <span className={styles.holderIkon} aria-hidden="true">
            <Icon name="ShieldCheck" size={22} />
          </span>
          <div>
            <span className={styles.holderLabel}>{d.pemegangLabel}</span>
            <span className={styles.holderValue}>{pemegang.siapa}</span>
          </div>
        </div>
        <p className={styles.holderNote}>{pemegang.catatan}</p>
        <ContractStepper steps={steps} current={current} surface="ink" />
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIkon} aria-hidden="true">
              <Icon name="Receipt" size={18} />
            </span>
            {d.rincian}
          </h3>
          <div className={styles.rows}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{d.nilai}</span>
              <Money value={c.agreed_budget} size="sm" />
            </div>
            {p ? (
              <>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>{d.komisi}</span>
                  <Money value={p.platform_fee} tone="out" size="sm" />
                </div>
                <div className={`${styles.row} ${styles.rowTotal}`}>
                  <span className={styles.rowLabel}>{mahasiswa ? d.diterimaKamu : d.diterimaMahasiswa}</span>
                  <Money value={p.net_amount} tone="in" />
                </div>
              </>
            ) : (
              <p className={styles.warn}>
                {d.komisiBelum(pengaturan.data ? t.fitur.pengaturan.persen(pengaturan.data.platform_fee) : null)}
              </p>
            )}
          </div>
        </div>

        <Deliverables contract={c} mahasiswa={mahasiswa} />
      </div>

      <ContractActions
        contract={c}
        payment={p}
        mahasiswa={mahasiswa}
        sudahMengulas={sudahMengulas}
        sengketaAktif={Boolean(sengketaBerjalan)}
        onBerubah={() => {
          berubah.abaikanSebentar();
          kontrak.muatUlang();
          bayar.muatUlang();
          ulasan.muatUlang();
        }}
      />

      {!USE_MOCK ? (
        <section className={`${styles.card} ${styles.obrolanKartu}`} id="obrolan" aria-labelledby="judul-obrolan">
          <div>
            <h3 className={styles.cardTitle} id="judul-obrolan">
              <span className={styles.cardIkon} aria-hidden="true">
                <Icon name="MessageSquare" size={18} />
              </span>
              {t.fitur.pesan.obrolanKontrak}
            </h3>
            <p className={styles.warn}>{t.fitur.pesan.obrolanKontrakSub}</p>
          </div>
          <Obrolan sumber={{ jenis: "kontrak", id: c.id }} />
        </section>
      ) : null}

      {bisaDisengketakan && !sengketaBerjalan && !sengketa.loading ? <AjukanSengketa contractId={c.id} /> : null}

      {ulasanku || ulasanUntukku ? (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <span className={styles.cardIkon} aria-hidden="true">
              <Icon name="Star" size={18} />
            </span>
            {d.ulasan}
          </h3>
          <div className={styles.ulasanGrid}>
            {ulasanku ? (
              <KartuUlasan judul={d.ulasanmu(lawan)} ulasan={ulasanku} label={d.bintang(ulasanku.rating)} />
            ) : null}
            {ulasanUntukku ? (
              <KartuUlasan
                judul={d.ulasanUntukmu(lawan)}
                ulasan={ulasanUntukku}
                label={d.bintang(ulasanUntukku.rating)}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

const JEDA_CEK = 20_000;

function useKontrakLangsung(id: string, tanda: string, muatUlang: () => void) {
  const [tampil, setTampil] = useState(false);
  const tandaSekarang = useRef(tanda);
  const abaikanSampai = useRef(0);
  const muatUlangRef = useRef(muatUlang);

  useEffect(() => {
    tandaSekarang.current = tanda;
    muatUlangRef.current = muatUlang;
  });

  useEffect(() => {
    if (USE_MOCK) return;
    let batal = false;
    async function cek() {
      if (document.visibilityState !== "visible" || Date.now() < abaikanSampai.current) return;
      const [k, b] = await Promise.all([getContract(id), getContractPayment(id)]);
      if (batal || !k.data) return;
      const baru = `${k.data.status}|${b.data?.status ?? ""}`;
      if (baru !== tandaSekarang.current && Date.now() >= abaikanSampai.current) {
        setTampil(true);
        muatUlangRef.current();
      }
    }
    const idInterval = window.setInterval(() => void cek(), JEDA_CEK);
    const saatTerlihat = () => void cek();
    document.addEventListener("visibilitychange", saatTerlihat);
    return () => {
      batal = true;
      window.clearInterval(idInterval);
      document.removeEventListener("visibilitychange", saatTerlihat);
    };
  }, [id]);

  return {
    tampil,
    tutup: () => setTampil(false),
    abaikanSebentar: () => {
      abaikanSampai.current = Date.now() + 8_000;
      setTampil(false);
    },
  };
}
