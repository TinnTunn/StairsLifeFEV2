"use client";

import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Skeleton } from "@/components/feedback/Skeleton";
import { useBahasa } from "@/i18n/BahasaProvider";
import { useSesi } from "@/lib/api/useSesi";
import { myApplications } from "@/lib/data/work";
import { useAsync } from "@/lib/useAsync";
import styles from "./DetailProyek.module.css";

/**
 * Tombol lamar berbeda per keadaan pengguna, dan keadaan itu hanya ada di
 * klien karena token disimpan di localStorage. Halamannya sendiri tetap
 * dirender di server supaya bisa diindeks mesin pencari.
 */
export function ApplyAction({
  projectId,
  open,
  businessId,
}: {
  projectId: string;
  open: boolean;
  /** Untuk tombol tanya sebelum melamar; hanya tampil bagi mahasiswa. */
  businessId?: string | null;
}) {
  const { session, siap } = useSesi();
  const { t } = useBahasa();
  const l = t.proyek.lamar;
  const mahasiswa = session?.user.role === "mahasiswa";
  /* Hanya dimuat untuk mahasiswa, supaya tamu dan bisnis tidak memicu
     permintaan yang pasti ditolak. */
  const lamaranku = useAsync(
    async () => (mahasiswa ? (await myApplications()).data : []),
    [mahasiswa, session?.user.id],
  );

  if (!open) {
    return (
      <>
        <Button disabled fullWidth size="lg">
          {l.ditutup}
        </Button>
        <p className={styles.escrowNote}>{l.ditutupIsi}</p>
      </>
    );
  }

  /* Setinggi tombol lg, supaya kartu samping tidak melompat saat sesi terbaca. */
  if (!siap) return <Skeleton height={52} />;

  if (!session) {
    /* Daftar dulu, bukan masuk dulu: tamu yang sampai ke sini datang dari
       pencarian atau tautan yang dibagikan, dan belum tentu punya akun.
       Tombol masuk tetap ada di bawahnya untuk yang sudah punya. */
    return (
      <>
        <Button href="/daftar/mahasiswa" fullWidth size="lg">
          {l.daftarUntukMelamar}
        </Button>
        <Button href={`/masuk?lanjut=/mahasiswa/cari/${projectId}`} variant="secondary" fullWidth>
          {l.masukUntukMelamar}
        </Button>
        <p className={styles.factLabel}>{l.belumPunyaAkun}</p>
      </>
    );
  }

  if (session.user.role === "bisnis") {
    return (
      <>
        <Button href="/bisnis/proyek/baru" variant="secondary" fullWidth size="lg">
          {l.pasangProyek}
        </Button>
        <p className={styles.factLabel}>{l.akunBisnis}</p>
      </>
    );
  }

  if (session.user.role === "admin") {
    return (
      <Button href="/admin" variant="secondary" fullWidth size="lg">
        {l.panelAdmin}
      </Button>
    );
  }

  if (lamaranku.loading) return <Skeleton height={52} />;

  const sudahMelamar = (lamaranku.data ?? []).find((a) => a.project_id === projectId);
  if (sudahMelamar) {
    return (
      <>
        <Button href={`/mahasiswa/lamaran/${sudahMelamar.id}`} variant="secondary" fullWidth size="lg">
          {l.lihatStatus}
        </Button>
        <p className={styles.factLabel}>{l.sudahMelamar}</p>
        <TombolTanya businessId={businessId} />
      </>
    );
  }

  if (!session.user.is_verified) {
    return (
      <>
        <Button href="/mahasiswa/verifikasi" variant="secondary" fullWidth size="lg">
          {l.verifikasiDulu}
        </Button>
        <p className={styles.factLabel}>{l.verifikasiIsi}</p>
        <TombolTanya businessId={businessId} />
      </>
    );
  }

  return (
    <>
      <Button href={`/mahasiswa/lamar/${projectId}`} fullWidth size="lg">
        {l.lamarProyek}
      </Button>
      <TombolTanya businessId={businessId} />
    </>
  );
}

/* Pertanyaan sebelum melamar lewat chat tanya, supaya brief yang kurang jelas
   tidak dijawab lewat WhatsApp di luar platform. */
function TombolTanya({ businessId }: { businessId?: string | null }) {
  const { t } = useBahasa();
  if (!businessId) return null;
  return (
    <Button href={`/pesan/tanya/${businessId}`} variant="ghost" fullWidth iconLeft={<Icon name="MessageSquare" size={18} />}>
      {t.fitur.pesan.tanyaBisnis}
    </Button>
  );
}
