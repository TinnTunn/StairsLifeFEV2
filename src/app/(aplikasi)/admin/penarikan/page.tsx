"use client";

import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Textarea } from "@/components/forms/Textarea";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin, type AdminWithdrawal } from "@/lib/api/admin";
import { formatRupiah, formatTanggalJam } from "@/lib/format";
import { WITHDRAWAL_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { useHalamanUrl, useParamUrl } from "@/lib/useParamUrl";
import { AdminShell } from "../AdminShell";
import { Paginasi, useAksi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

const TAB = ["pending", "processing", "completed", "rejected", "failed", "semua"] as const;
type Tab = (typeof TAB)[number];
type Aksi = "manual" | "xendit" | "tolak";

export default function PenarikanAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.penarikan.judul} subtitle={t.admin.penarikan.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t } = useBahasa();
  const w = t.admin.penarikan;
  const [tab, setTab] = useParamUrl<Tab>("status", "pending", TAB);
  const [halaman, setHalaman] = useHalamanUrl();
  const [aksi, setAksi] = useState<{ item: AdminWithdrawal; jenis: Aksi } | null>(null);
  const hasil = useAsync(() => admin.withdrawals(halaman, tab === "semua" ? undefined : tab), [halaman, tab], "admin-penarikan");
  const items = hasil.data?.items ?? [];

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTabs}>
          <Tabs
            variant="pill"
            aria-label={w.saringLabel}
            items={TAB.map((x) => ({ value: x, label: w.tab[x] }))}
            value={tab}
            onChange={(x) => {
              setTab(x as Tab);
              setHalaman(1);
            }}
          />
        </div>
      </div>

      {hasil.loading && !hasil.data ? (
        <SkeletonCard lines={3} media label={w.memuat} />
      ) : hasil.error ? (
        <EmptyState icon="AlertTriangle" title={w.gagal} description={`${hasil.error} ${t.admin.umum.muatUlang}`} />
      ) : items.length === 0 ? (
        <EmptyState icon="Wallet" title={w.kosongJudul} description={w.kosongIsi} />
      ) : (
        <>
          <ul className={styles.daftarGrid}>
            {items.map((item) => (
              <KartuPenarikan key={item.id} item={item} onAksi={(jenis) => setAksi({ item, jenis })} />
            ))}
          </ul>
          <Paginasi halaman={halaman} total={hasil.data?.pagination.total_pages ?? 1} onGanti={setHalaman} />
        </>
      )}

      {aksi ? (
        <ModalAksi
          item={aksi.item}
          jenis={aksi.jenis}
          onTutup={() => setAksi(null)}
          onSelesai={() => {
            setAksi(null);
            hasil.muatUlang();
          }}
        />
      ) : null}
    </>
  );
}

function rekeningTeks(item: AdminWithdrawal, t: ReturnType<typeof useBahasa>["t"]) {
  const r = item.bank_account;
  return r ? t.admin.penarikan.rekening(r.bank_name, r.account_number, r.account_holder) : "-";
}

function KartuPenarikan({ item, onAksi }: { item: AdminWithdrawal; onAksi: (jenis: Aksi) => void }) {
  const { t, bahasa } = useBahasa();
  const w = t.admin.penarikan;
  const nama = item.users?.full_name ?? t.admin.umum.tanpaNama;

  return (
    <li className={styles.item}>
      <div className={styles.itemKepala}>
        <Avatar name={nama} size="md" />
        <div className={styles.itemIdentitas}>
          <span className={styles.itemNama}>{nama}</span>
          <span className={styles.itemMeta}>{item.users?.email}</span>
          <span className={styles.itemMeta}>{w.diminta(formatTanggalJam(item.requested_at, bahasa))}</span>
        </div>
        <StatusBadge status={WITHDRAWAL_STATUS[item.status]} />
      </div>

      <dl className={styles.fakta}>
        <div className={styles.faktaSel}>
          <dt className={styles.faktaLabel}>{w.kotor}</dt>
          <dd className={styles.faktaNilai}>{formatRupiah(item.amount_gross)}</dd>
        </div>
        <div className={styles.faktaSel}>
          <dt className={styles.faktaLabel}>{w.biaya}</dt>
          <dd className={styles.faktaNilai}>{formatRupiah(item.admin_fee)}</dd>
        </div>
        <div className={styles.faktaSel}>
          <dt className={styles.faktaLabel}>{w.bersih}</dt>
          <dd className={styles.faktaNilai}>{formatRupiah(item.amount_net)}</dd>
        </div>
      </dl>

      <span className={styles.rekening}>
        <Icon name="Wallet" size={14} />
        {rekeningTeks(item, t)}
      </span>

      {item.rejection_reason ? <p className={styles.alasan}>{w.alasanDitolak(item.rejection_reason)}</p> : null}

      {item.status === "pending" ? (
        <div className={styles.itemAksi}>
          <Button size="sm" variant="ghost" onClick={() => onAksi("tolak")}>
            {w.tolak}
          </Button>
          <div className={styles.itemAksiKanan}>
            <Button size="sm" variant="secondary" onClick={() => onAksi("xendit")} iconLeft={<Icon name="Send" size={16} />}>
              {w.kirimXendit}
            </Button>
            <Button size="sm" onClick={() => onAksi("manual")} iconLeft={<Icon name="Check" size={16} />}>
              {w.tandaiSelesai}
            </Button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

function ModalAksi({
  item,
  jenis,
  onTutup,
  onSelesai,
}: {
  item: AdminWithdrawal;
  jenis: Aksi;
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const { t } = useBahasa();
  const w = t.admin.penarikan;
  const { loading, jalankan, galat } = useAksi();
  const [alasan, setAlasan] = useState("");
  const nominal = formatRupiah(item.amount_net);
  const rekening = rekeningTeks(item, t);

  const isi = {
    manual: { judul: w.selesaiJudul, isi: w.selesaiIsi(nominal, rekening), tombol: w.tandaiSelesai },
    xendit: { judul: w.xenditJudul, isi: w.xenditIsi(nominal, rekening), tombol: w.kirimXendit },
    tolak: { judul: w.tolakJudul, isi: w.tolakIsi, tombol: w.tolak },
  }[jenis];

  async function kirim() {
    const payload =
      jenis === "tolak"
        ? { action: "reject" as const, ...(alasan.trim() ? { reason: alasan.trim() } : {}) }
        : { action: "approve" as const, use_xendit: jenis === "xendit" };
    if (await jalankan(() => admin.processWithdrawal(item.id, payload))) onSelesai();
  }

  return (
    <Modal
      open
      onClose={onTutup}
      dismissible={false}
      size="sm"
      tone={jenis === "tolak" ? "danger" : "success"}
      title={isi.judul}
      description={isi.isi}
      footer={
        <>
          <Button variant="secondary" onClick={onTutup} disabled={loading}>
            {t.admin.umum.batal}
          </Button>
          <Button variant={jenis === "tolak" ? "destructive" : "primary"} onClick={kirim} loading={loading}>
            {isi.tombol}
          </Button>
        </>
      }
    >
      {jenis === "tolak" ? (
        <Textarea
          label={t.admin.umum.alasan}
          rows={3}
          maxLength={500}
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          placeholder={w.alasanContoh}
        />
      ) : null}
      {galat}
    </Modal>
  );
}
