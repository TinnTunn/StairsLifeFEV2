"use client";

import { useRouter } from "next/navigation";
import { use, useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { RingkasanGalat } from "@/components/feedback/RingkasanGalat";
import { Money } from "@/components/data/Money";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SampleDataNotice } from "@/components/feedback/SampleDataNotice";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { PemilihTanggal } from "@/components/forms/PemilihTanggal";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import { labelAnggaran } from "@/lib/anggaran";
import { applications } from "@/lib/api/applications";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { getProject } from "@/lib/data/projects";
import { myApplications } from "@/lib/data/work";
import { formatTanggal } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { idKolom, useGalatKolom } from "@/lib/useGalatKolom";
import { MahasiswaShell } from "../../MahasiswaShell";
import app from "../../dashboard.module.css";
import styles from "./lamar.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

/* Backend menolak cover letter di bawah 50 karakter. Batas yang sama ditegakkan
   di sini supaya pengguna tahu sebelum mengirim, bukan setelah ditolak. */
const MIN_SURAT = 50;

export default function Lamar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  return (
    <MahasiswaShell title={t.aplikasi.mahasiswa.lamar.judul}>
      {(session) => (
        <>
          <TautanKembali href={`/mahasiswa/cari/${id}`} label={t.umum.aksi.keDetailProyek} />
          <Isi projectId={id} terverifikasi={session.user.is_verified} />
        </>
      )}
    </MahasiswaShell>
  );
}

function Isi({ projectId, terverifikasi }: { projectId: string; terverifikasi: boolean }) {
  const router = useRouter();
  const { t, bahasa } = useBahasa();
  const l = t.aplikasi.mahasiswa.lamar;
  const u = t.aplikasi.umum;
  const proyek = useAsync(() => getProject(projectId), [projectId]);
  /* Backend menolak lamaran kedua dengan 409. Diperiksa sebelum form tampil,
     supaya mahasiswa tidak menulis surat dulu baru tahu lamarannya ditolak. */
  const lamaranku = useAsync(myApplications, []);

  const [surat, setSurat] = useState("");
  const [selesai, setSelesai] = useState("");
  const [tawaran, setTawaran] = useState("");
  const [loading, setLoading] = useState(false);
  const galat = useGalatKolom<"surat" | "selesai">();

  if (proyek.loading || lamaranku.loading) return <SkeletonCard lines={3} label={l.memuat} />;

  const sudahMelamar = (lamaranku.data?.data ?? []).find((a) => a.project_id === projectId);

  const p = proyek.data?.project;
  if (!p) {
    return (
      <EmptyState
        icon="SearchX"
        title={l.tidakAdaJudul}
        description={l.tidakAdaIsi}
        action={<Button href="/mahasiswa/cari">{l.cariLain}</Button>}
      />
    );
  }

  if (sudahMelamar) {
    return (
      <EmptyState
        icon="Send"
        title={l.sudahJudul}
        description={l.sudahIsi}
        action={<Button href={`/mahasiswa/lamaran/${sudahMelamar.id}`}>{l.lihatStatus}</Button>}
      />
    );
  }

  if (!terverifikasi) {
    return (
      <EmptyState
        icon="BadgeCheck"
        title={l.verifikasiJudul}
        description={l.verifikasiIsi}
        action={<Button href="/mahasiswa/verifikasi">{l.bukaVerifikasi}</Button>}
      />
    );
  }

  if (p.status !== "open") {
    return (
      <EmptyState
        icon="Ban"
        title={l.ditutupJudul}
        description={l.ditutupIsi}
        action={<Button href="/mahasiswa/cari">{l.cariLain}</Button>}
      />
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const valid = galat.periksa([
      ["surat", surat.trim().length < MIN_SURAT, l.suratPendek(MIN_SURAT, surat.trim().length)],
      ["selesai", !selesai, l.selesaiKosong],
    ]);
    if (!valid) return;

    setLoading(true);
    try {
      if (USE_MOCK) {
        galat.setGalatUmum([l.modeContoh]);
        return;
      }
      const dibuat = await applications.create({
        project_id: projectId,
        cover_letter: surat.trim(),
        estimated_completion: new Date(`${selesai}T23:59:59`).toISOString(),
        ...(tawaran ? { offered_budget: Number(tawaran) } : {}),
      });
      /* replace: Back dari detail lamaran tidak kembali ke formulir yang sudah terkirim. */
      router.replace(`/mahasiswa/lamaran/${dibuat.id}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        galat.setGalatUmum([l.sudahPernah]);
      } else {
        galat.setGalatUmum(e instanceof ApiError ? e.messages : [t.umum.galat.jaringan]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {proyek.data?.sample ? <SampleDataNotice /> : null}

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={submit} noValidate>
          <RingkasanGalat pesan={galat.ringkasan} className={app.galat} barisClassName={app.galatBaris} />

          <Textarea
            label={l.surat}
            id={idKolom("surat")}
            error={galat.galat.surat}
            required
            rows={8}
            maxLength={2000}
            showCount
            value={surat}
            onChange={(e) => {
              setSurat(e.target.value);
              galat.hapus("surat");
            }}
            hint={l.suratPetunjuk(MIN_SURAT)}
            placeholder={l.suratContoh}
          />

          <div className={styles.row}>
            <PemilihTanggal
              label={l.perkiraan}
              id={idKolom("selesai")}
              error={galat.galat.selesai}
              required
              value={selesai}
              onChange={(v) => {
                setSelesai(v);
                galat.hapus("selesai");
              }}
              hint={l.perkiraanPetunjuk}
            />

            <Input
              label={l.tawaran}
              prefix="Rp"
              numeric
              uang
              inputMode="numeric"
              value={tawaran}
              onChange={(e) => setTawaran(e.target.value.replace(/\D/g, ""))}
              hint={l.tawaranPetunjuk}
            />
          </div>

          <p className={app.catatan}>{l.catatan}</p>

          <div>
            <Button type="submit" size="lg" loading={loading} iconRight={<Icon name="Send" size={18} />}>
              {l.kirim}
            </Button>
          </div>
        </form>

        <aside className={styles.ringkasan}>
          <span className={styles.logo} aria-hidden="true">
            {(p.users?.full_name ?? u.bisnis).slice(0, 1).toUpperCase()}
          </span>
          <h2 className={styles.judul}>{p.title}</h2>
          <p className={styles.meta}>
            {p.users?.full_name ?? u.bisnis} · {u.tenggat(formatTanggal(p.deadline, bahasa))}
          </p>
          <div className={styles.anggaran}>
            <Money value={labelAnggaran(p, t.komponen.kartuProyek)} label={l.anggaranDipasang} size="sm" />
          </div>
        </aside>
      </div>
    </>
  );
}
