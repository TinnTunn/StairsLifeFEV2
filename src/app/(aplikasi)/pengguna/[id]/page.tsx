// Halaman profil publik seorang pengguna.

"use client";

import { use } from "react";
import { Avatar } from "@/components/data/Avatar";
import { Rating } from "@/components/data/Rating";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Halaman } from "@/components/layout/KonteksShell";
import { RekamJejak } from "@/components/profil/RekamJejak";
import { BERANDA_PERAN } from "@/components/layout/nav-items";
import { TautanKembali } from "@/components/navigation/TautanKembali";
import { useSesi } from "@/lib/api/useSesi";
import { useBahasa } from "@/i18n/BahasaProvider";
import { USE_MOCK } from "@/lib/api/client";
import { users } from "@/lib/api/users";
import { useAsync } from "@/lib/useAsync";
import styles from "./pengguna.module.css";

export default function ProfilPengguna({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  const { session } = useSesi();
  const cadangan = session ? BERANDA_PERAN[session.user.role] : "/mahasiswa";
  return (
    <Halaman title={t.fitur.profilPublik.judul} subtitle={t.fitur.profilPublik.sub}>
      <TautanKembali href={cadangan} label={t.umum.aksi.kembali} pakaiRiwayat />
      <Isi id={id} />
    </Halaman>
  );
}

function Isi({ id }: { id: string }) {
  const { t } = useBahasa();
  const g = t.fitur.profilPublik;
  const hasil = useAsync(
    async () => (USE_MOCK ? null : Promise.all([users.profile(id), users.portfolio(id)])),
    [id],
  );

  if (hasil.loading) return <SkeletonCard lines={4} label={g.memuat} />;

  if (USE_MOCK || !hasil.data) {
    return (
      <EmptyState
        icon="UserSearch"
        title={hasil.error ? g.gagalJudul : g.contohJudul}
        description={hasil.error ? `${hasil.error} ${t.umum.galat.muatUlangHalaman}` : g.contohIsi}
      />
    );
  }

  const [profil, portofolio] = hasil.data;

  if (!profil?.user) {
    return <EmptyState icon="UserSearch" title={g.gagalJudul} description={t.umum.galat.muatUlangHalaman} />;
  }

  const u = profil.user;

  return (
    <>
      <section className={styles.kepala}>
        <Avatar name={u.full_name} src={u.avatar_url} size="xl" verified={u.is_verified} />
        <div className={styles.kepalaTeks}>
          <h2 className={styles.nama}>{u.full_name}</h2>
          <p className={styles.meta}>
            <span className={styles.tingkat}>{t.umum.tingkat[u.tier]}</span>
            {u.role === "mahasiswa" && u.university ? ` · ${u.university}` : ""}
            {u.role === "mahasiswa" && u.major ? ` · ${u.major}` : ""}
            {u.role === "bisnis" && u.company_name ? ` · ${u.company_name}` : ""}
          </p>
          {Number(u.rating_avg) > 0 ? (
            <Rating value={Number(u.rating_avg)} size="sm" count={profil.review_count} />
          ) : (
            <span className={styles.metaKecil}>{g.belumDinilai}</span>
          )}
        </div>
      </section>

      {u.bio ? <p className={styles.bio}>{u.bio}</p> : null}

      {u.skills && u.skills.length > 0 ? (
        <div className={styles.chips}>
          {u.skills.map((s) => (
            <span key={s} className={styles.chip}>
              {s}
            </span>
          ))}
        </div>
      ) : null}

      <RekamJejak profil={profil} portofolio={portofolio} />
    </>
  );
}
