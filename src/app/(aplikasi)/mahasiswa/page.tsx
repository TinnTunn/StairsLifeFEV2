"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/actions/Button";
import { Icon, type IconName } from "@/components/actions/Icon";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { VerificationBanner } from "@/components/feedback/VerificationBanner";
import { useBahasa } from "@/i18n/BahasaProvider";
import { USE_MOCK } from "@/lib/api/client";
import type { Session } from "@/lib/api/session";
import { users } from "@/lib/api/users";
import { myApplications, myWallet } from "@/lib/data/work";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { APPLICATION_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { MahasiswaShell } from "./MahasiswaShell";
import styles from "./dashboard.module.css";
import { useSaldoTersembunyi } from "@/lib/saldo";
import { TombolSaldo } from "@/components/data/SaldoRahasia";

export default function BerandaMahasiswa() {
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.beranda.judul} subtitle={t.aplikasi.mahasiswa.beranda.sub}>
      {(session) => <Isi session={session} />}
    </MahasiswaShell>
  );
}

function Stat({
  label,
  icon,
  aksi,
  children,
}: {
  label: string;
  icon: IconName;
  /** Kontrol kecil di kepala kartu, misalnya tombol menyembunyikan saldo. */
  aksi?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.stat}>
      <div className={styles.statKepala}>
        <span className={styles.statLabel}>{label}</span>
        {/* Kontrolnya menempati petak ikon, bukan ditambahkan di sebelahnya:
            kartu ini selebar tiga kartu lain, dan satu elemen tambahan membuat
            labelnya patah jadi dua baris sementara tetangganya satu baris. */}
        {aksi ?? (
          <span className={styles.statIkon} aria-hidden="true">
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Isi({ session }: { session: Session }) {
  const { t, bahasa } = useBahasa();
  const { tersembunyi: saldoTersembunyi } = useSaldoTersembunyi();
  const b = t.aplikasi.mahasiswa.beranda;
  const u = t.aplikasi.umum;
  const verified = session.user.is_verified;
  const lamaran = useAsync(myApplications, [], "lamaran-saya");
  const dompet = useAsync(myWallet, []);
  /* Tanpa status pengajuan, mahasiswa yang kartunya sedang direview tetap
     disuruh mengunggah kartu. */
  const pengajuan = useAsync(async () => (verified || USE_MOCK ? null : users.verification()), [verified]);

  if (lamaran.loading || dompet.loading || pengajuan.loading) {
    return (
      <>
        <SkeletonCard lines={1} label={b.memuat} />
        <SkeletonCard lines={3} />
      </>
    );
  }

  if (lamaran.error || lamaran.data?.error) {
    return (
      <EmptyState
        icon="AlertTriangle"
        title={b.gagal}
        description={`${lamaran.error ?? lamaran.data?.error} ${u.muatUlang}`}
      />
    );
  }

  const items = lamaran.data?.data ?? [];
  const wallet = dompet.data?.data;
  const sample = lamaran.data?.sample || dompet.data?.sample;

  const dalamSeleksi = items.filter((a) => a.status === "pending" || a.status === "shortlisted").length;
  const diterima = items.filter((a) => a.status === "approved").length;
  const namaDepan = session.user.full_name.split(" ")[0];

  return (
    <>
      {sample ? <SampleDataNotice /> : null}
      {!verified ? (
        <VerificationBanner
          status={
            pengajuan.data?.status === "pending"
              ? "menunggu_review"
              : pengajuan.data?.status === "rejected"
                ? "ditolak"
                : "belum_diajukan"
          }
          reason={pengajuan.data?.rejection_reason ?? undefined}
          role="mahasiswa"
          href="/mahasiswa/verifikasi"
        />
      ) : null}

      <section className={styles.sapa}>
        <div className={styles.sapaTeks}>
          <h2 className={styles.sapaJudul}>{u.sapa(namaDepan)}</h2>
          <p className={styles.sapaIsi}>{b.sapaIsi}</p>
        </div>
        <div className={styles.sapaAksi}>
          <Button href="/mahasiswa/cari" variant="white" iconLeft={<Icon name="Search" size={18} />}>
            {u.cariProyek}
          </Button>
        </div>
      </section>

      <div className={styles.stats}>
        <Stat label={b.statTerkirim} icon="Send">
          <span className={styles.statValue}>{items.length}</span>
        </Stat>
        <Stat label={b.statDiproses} icon="Clock">
          <span className={styles.statValue}>{dalamSeleksi}</span>
        </Stat>
        <Stat label={b.statDiterima} icon="CheckCircle2">
          <span className={styles.statValue}>{diterima}</span>
        </Stat>
        {/* Tombolnya ada di sini juga, bukan hanya di dompet: angka ini yang
            pertama terlihat saat halaman dibuka, jadi di sinilah orang ingin
            menutupnya saat layarnya sedang dilihat orang lain. */}
        <Stat label={b.statSaldo} icon="Wallet" aksi={<TombolSaldo className={styles.statTombol} />}>
          {/* Ikut pilihan yang dibuat di dompet: menyembunyikan saldo di satu
              tempat lalu memperlihatkannya di tempat lain tidak menyembunyikan
              apa pun. */}
          <span className={`${styles.statValue} ${styles.statUang}`}>
            {saldoTersembunyi ? "Rp ••••••" : formatRupiah(wallet?.amount ?? 0)}
          </span>
        </Stat>
      </div>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{b.terbaru}</h2>
        <Link href="/mahasiswa/lamaran" className={styles.sectionLink}>
          {b.lihatSemua}
          <Icon name="ArrowUpRight" size={16} />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="Send"
          title={b.kosongJudul}
          description={b.kosongIsi}
          action={<Button href="/mahasiswa/cari">{u.cariProyek}</Button>}
        />
      ) : (
        <ul className={styles.rows}>
          {items.slice(0, 5).map((a) => {
            const bisnis = a.projects?.users?.full_name ?? u.bisnis;
            return (
              <li key={a.id} className={styles.row}>
                <span className={styles.rowIkon} aria-hidden="true">
                  {bisnis.slice(0, 1).toUpperCase()}
                </span>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>
                    <Link href={`/mahasiswa/lamaran/${a.id}`} className={styles.rowLink}>
                      {a.projects?.title ?? u.proyek}
                    </Link>
                  </span>
                  <span className={styles.rowMeta}>
                    {bisnis} · {u.dikirim(formatTanggal(a.created_at, bahasa))}
                  </span>
                </div>
                <div className={styles.rowAside}>
                  <StatusBadge status={APPLICATION_STATUS[a.status]} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
