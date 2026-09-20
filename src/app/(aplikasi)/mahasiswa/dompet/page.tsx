// Halaman dompet mahasiswa: saldo dan mutasi.

"use client";

import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { BatasSeksi } from "@/components/feedback/BatasSeksi";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { useBahasa } from "@/i18n/BahasaProvider";
import { myWallet } from "@/lib/data/work";
import { formatTanggalJam } from "@/lib/format";
import type { WalletTransactionType } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { MahasiswaShell } from "../MahasiswaShell";
import app from "../dashboard.module.css";
import styles from "./dompet.module.css";
import { SaldoRahasia, TombolSaldo } from "@/components/data/SaldoRahasia";

const ARAH: Record<WalletTransactionType, { tone: "in" | "out" | "held"; gerak: boolean }> = {
  earn_release: { tone: "in", gerak: true },
  earn_split: { tone: "in", gerak: true },
  withdrawal_lock: { tone: "held", gerak: false },
  withdrawal_done: { tone: "out", gerak: true },
  withdrawal_refund: { tone: "in", gerak: true },
};

const IKON_ARAH = { in: "ArrowLeftRight", out: "ArrowUpRight", held: "Lock" } as const;

export default function Dompet() {
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.dompet.judul} subtitle={t.aplikasi.mahasiswa.dompet.sub}>
      <Isi />
    </MahasiswaShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const d = t.aplikasi.mahasiswa.dompet;
  const hasil = useAsync(myWallet, []);

  if (hasil.loading) return <SkeletonCard lines={4} label={d.memuat} />;

  if (hasil.error || hasil.data?.error) {
    return (
      <EmptyState
        icon="AlertTriangle"
        title={d.gagal}
        description={`${hasil.error ?? hasil.data?.error} ${t.aplikasi.umum.muatUlang}`}
      />
    );
  }

  const w = hasil.data?.data;
  if (!w) return null;

  return (
    <>
      {hasil.data?.sample ? <SampleDataNotice /> : null}

      <div className={styles.balances}>
        <div className={`${styles.balance} ${styles.balanceUtama}`}>
          <span className={styles.balanceLabel}>
            <Icon name="Wallet" size={16} />
            {d.bisaDitarik}
            <TombolSaldo className={styles.tombolSaldo} />
          </span>
          <SaldoRahasia value={w.amount} size="lg" className={styles.balanceAngka} />
          <p className={styles.balanceNote}>{d.bisaDitarikIsi}</p>
          <div className={styles.actions}>
            <Button href="/mahasiswa/dompet/tarik" variant="white" iconLeft={<Icon name="ArrowUpRight" size={18} />}>
              {d.tarik}
            </Button>
            <Button href="/mahasiswa/dompet/rekening" variant="outlineWhite">
              {d.kelolaRekening}
            </Button>
          </div>
        </div>
        <div className={styles.balance}>
          <span className={styles.balanceLabel}>
            <Icon name="Lock" size={16} />
            {d.diproses}
          </span>
          <SaldoRahasia value={w.pending_amount} size="lg" tone="held" />
          <p className={styles.balanceNote}>{d.diprosesIsi}</p>
        </div>
        <div className={styles.balance}>
          <span className={styles.balanceLabel}>
            <Icon name="Receipt" size={16} />
            {d.total}
          </span>
          <SaldoRahasia value={w.total_earned} size="lg" tone="muted" />
          <p className={styles.balanceNote}>{d.totalIsi}</p>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={app.sectionTitle}>{d.mutasi}</h2>
        <BatasSeksi nama="mutasi dompet">
        {w.recent_transactions.length === 0 ? (
          <EmptyState icon="Receipt" title={d.mutasiKosongJudul} description={d.mutasiKosongIsi} />
        ) : (
          <ul className={app.rows}>
            {w.recent_transactions.map((tx) => {
              const arah = ARAH[tx.type] ?? { tone: "in" as const, gerak: false };
              return (
                <li key={tx.id} className={app.row}>
                  <span className={styles.arah} data-arah={arah.tone} aria-hidden="true">
                    <Icon name={IKON_ARAH[arah.tone]} size={18} />
                  </span>
                  <div className={app.rowMain}>
                    <span className={app.rowTitle}>{d.jenis[tx.type]}</span>
                    <span className={app.rowMeta}>
                      {tx.description ? `${tx.description} · ` : ""}
                      {formatTanggalJam(tx.created_at, bahasa)}
                    </span>
                  </div>
                  <Money value={tx.amount} tone={arah.tone} sign={arah.gerak} size="sm" />
                </li>
              );
            })}
          </ul>
        )}
        {w.recent_transactions.length >= 20 ? <p className={app.catatan}>{d.mutasi20}</p> : null}
        </BatasSeksi>
      </section>
    </>
  );
}
