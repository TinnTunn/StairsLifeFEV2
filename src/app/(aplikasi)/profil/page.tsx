"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/actions/Button";
import { Avatar } from "@/components/data/Avatar";
import { Rating } from "@/components/data/Rating";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Icon, type IconName } from "@/components/actions/Icon";
import { AnyRoleShell } from "@/components/layout/AnyRoleShell";
import { useBahasa } from "@/i18n/BahasaProvider";
import { USE_MOCK } from "@/lib/api/client";
import { users } from "@/lib/api/users";
import { formatTanggal } from "@/lib/format";
import type { Session } from "@/lib/api/session";
import { useAsync } from "@/lib/useAsync";
import styles from "./profil.module.css";
import { RekamJejak } from "@/components/profil/RekamJejak";

export default function Profil() {
  const { t } = useBahasa();
  return (
    <AnyRoleShell
      title={t.aplikasi.profil.judul}
      subtitle={t.aplikasi.profil.sub}
      actions={
        <>
          <Button href="/profil/keamanan" size="sm" variant="secondary" iconLeft={<Icon name="KeyRound" size={16} />}>
            {t.fitur.akun.buka}
          </Button>
          <Button href="/profil/ubah" size="sm" iconLeft={<Icon name="PenLine" size={16} />}>
            {t.aplikasi.profil.ubah}
          </Button>
        </>
      }
    >
      {(session) => (
        <>
          {/* useSearchParams butuh Suspense supaya halaman tetap bisa dirender statis. */}
          <Suspense fallback={null}>
            <BannerTersimpan />
          </Suspense>
          <Isi session={session} />
        </>
      )}
    </AnyRoleShell>
  );
}

function Isi({ session }: { session: Session }) {
  const { t, bahasa } = useBahasa();
  const p = t.aplikasi.profil;
  const mahasiswa = session.user.role === "mahasiswa";
  const hasil = useAsync(async () => (USE_MOCK ? null : users.me()), []);
  /* is_verified hanya benar atau salah, jadi tidak bisa membedakan "belum
     mengajukan" dari "sedang direview". Status lengkapnya dibaca terpisah. */
  const verifikasi = useAsync(async () => (USE_MOCK || !mahasiswa ? null : users.verification()), [mahasiswa]);
  /* Rekam jejak dibaca dari endpoint publik yang sama dengan yang dipakai orang
     lain, jadi yang dilihat pemiliknya persis yang dilihat calon pemberi kerja.
     Dimuat terpisah supaya kepala profil tidak ikut menunggu. */
  const jejak = useAsync(
    async () =>
      USE_MOCK ? null : Promise.all([users.profile(session.user.id), users.portfolio(session.user.id)]),
    [session.user.id],
  );

  if (hasil.loading || verifikasi.loading) return <SkeletonCard lines={3} media label={p.memuat} />;

  if (hasil.error) {
    return <EmptyState icon="AlertTriangle" title={p.gagal} description={`${hasil.error} ${t.aplikasi.umum.muatUlang}`} />;
  }

  /* Mode contoh hanya punya data dari sesi, bukan profil lengkap dari backend.
     Yang ditampilkan dibatasi ke apa yang benar-benar diketahui, sisanya
     dinyatakan belum tersedia. */
  const u = hasil.data;
  const nama = u?.full_name ?? session.user.full_name;
  const email = u?.email ?? session.user.email;
  const terverifikasi = u?.is_verified ?? session.user.is_verified;
  const v = verifikasi.data;
  const statusVerifikasi = terverifikasi
    ? "terverifikasi"
    : v?.status === "pending"
      ? "menunggu_review"
      : v?.status === "rejected"
        ? "ditolak"
        : "belum_diajukan";

  return (
    <>
      {USE_MOCK ? <SampleDataNotice /> : null}

      <div className={styles.card}>
        <div className={styles.sampul} aria-hidden="true" />
        <div className={styles.head}>
          <span className={styles.avatar}>
            <Avatar name={nama} src={u?.avatar_url} size="xl" verified={mahasiswa && terverifikasi} />
          </span>
          <div className={styles.headText}>
            <h2 className={styles.name}>{nama}</h2>
            <span className={styles.meta}>{email}</span>
            <div className={styles.badges}>
              <span className={styles.peran}>{t.umum.peran[session.user.role]}</span>
              {/* Bisnis tidak diverifikasi (DECISIONS.md), jadi tidak ada badge status untuknya. */}
              {mahasiswa ? <StatusBadge status={statusVerifikasi} /> : null}
              {/* Tingkat adalah jenjang mahasiswa; akun bisnis ikut membawa nilai bawaan "pemula". */}
              {u && mahasiswa ? <span className={styles.chip}>{t.umum.tingkat[u.tier]}</span> : null}
            </div>
          </div>
          {/* rating_avg datang sebagai string Decimal. "0.00" bernilai truthy,
              dan akun tanpa ulasan akan tampil dengan rating nol. */}
          {Number(u?.rating_avg) > 0 && u ? (
            <div className={styles.rating}>
              {/* Tanpa count: total_projects adalah jumlah proyek selesai, bukan
                  jumlah ulasan, dan backend tidak mengirim jumlah ulasan di sini. */}
              <Rating value={Number(u.rating_avg)} />
            </div>
          ) : null}
        </div>

        {u?.bio ? <p className={styles.bio}>{u.bio}</p> : null}

        {u ? (
          <dl className={styles.facts}>
            {u.role === "mahasiswa" ? (
              <>
                <Fakta icon="GraduationCap" label={p.kampus} nilai={u.university} />
                <Fakta icon="BookOpen" label={p.jurusan} nilai={u.major} />
                <Fakta icon="Clock" label={p.semester} nilai={u.semester ? String(u.semester) : null} />
              </>
            ) : (
              <>
                <Fakta icon="Store" label={p.namaUsaha} nilai={u.company_name} />
                <Fakta icon="Briefcase" label={p.jenisUsaha} nilai={u.business_type} />
              </>
            )}
            <Fakta icon="Home" label={p.lokasi} nilai={u.location} />
            <Fakta icon="MessageSquare" label={p.telepon} nilai={u.phone} />
            <Fakta icon="UserCheck" label={p.bergabung} nilai={formatTanggal(u.created_at, bahasa)} />
          </dl>
        ) : null}

        {u?.skills && u.skills.length > 0 ? (
          <div className={styles.skills}>
            <span className={styles.factLabel}>{p.keahlian}</span>
            <div className={styles.badges}>
              {u.skills.map((s) => (
                <span key={s} className={styles.skill}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Portofolio dan ulasan: hanya dibaca, tidak bisa disunting. Keduanya
          tumbuh sendiri dari kontrak yang selesai, dan menyuntingnya akan
          membuat rekam jejak kehilangan gunanya sebagai bukti. */}
      <div className={styles.jejakKepala}>
        <div>
          <h3 className={styles.jejakJudul}>{p.rekamJejak}</h3>
          <p className={styles.jejakIsi}>{p.rekamJejakIsi}</p>
        </div>
        <Button href={`/pengguna/${session.user.id}`} variant="secondary" size="sm" iconRight={<Icon name="ArrowUpRight" size={16} />}>
          {p.lihatPublik}
        </Button>
      </div>

      {jejak.loading ? (
        <SkeletonCard lines={3} label={p.memuat} />
      ) : jejak.data ? (
        <RekamJejak profil={jejak.data[0]} portofolio={jejak.data[1]} />
      ) : null}
    </>
  );
}

function BannerTersimpan() {
  const { t } = useBahasa();
  if (useSearchParams().get("tersimpan") !== "1") return null;
  return (
    <p className={styles.tersimpan} role="status">
      <Icon name="CheckCircle2" size={18} />
      {t.aplikasi.profil.tersimpan}
    </p>
  );
}

function Fakta({ icon, label, nilai }: { icon: IconName; label: string; nilai: string | null | undefined }) {
  if (!nilai) return null;
  return (
    <div className={styles.fact}>
      <dt className={styles.factLabel}>
        <Icon name={icon} size={14} />
        {label}
      </dt>
      <dd className={styles.factValue}>{nilai}</dd>
    </div>
  );
}
