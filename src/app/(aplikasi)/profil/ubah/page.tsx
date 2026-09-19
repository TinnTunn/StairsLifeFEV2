"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/actions/Button";
import { Icon, type IconName } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { AnyRoleShell } from "@/components/layout/AnyRoleShell";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK, apiUpload } from "@/lib/api/client";
import { readSession, writeSession, type Session } from "@/lib/api/session";
import { users, type UpdateProfilePayload } from "@/lib/api/users";
import type { UploadResult, User } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import app from "../../mahasiswa/dashboard.module.css";
import styles from "./ubah.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

const BATAS_FOTO = 10 * 1024 * 1024;
const TIPE_FOTO = ["image/jpeg", "image/png", "image/webp"];

export default function UbahProfil() {
  const { t } = useBahasa();
  return (
    <AnyRoleShell title={t.aplikasi.profil.edit.judul} subtitle={t.aplikasi.profil.edit.sub}>
      {(session) => (
        <>
          <TautanKembali href="/profil" label={t.umum.aksi.keProfil} />
          <Isi session={session} />
        </>
      )}
    </AnyRoleShell>
  );
}

function Isi({ session }: { session: Session }) {
  const { t } = useBahasa();
  const e = t.aplikasi.profil.edit;
  const hasil = useAsync(async () => (USE_MOCK ? null : users.me()), []);

  if (USE_MOCK) return <EmptyState icon="UserCheck" title={e.judul} description={t.admin.umum.modeContoh} />;
  if (hasil.loading) return <SkeletonCard lines={5} media label={e.memuat} />;
  if (hasil.error || !hasil.data) {
    return (
      <EmptyState
        icon="AlertTriangle"
        title={t.aplikasi.profil.gagal}
        description={`${hasil.error ?? ""} ${t.aplikasi.umum.muatUlang}`}
      />
    );
  }
  return <Formulir awal={hasil.data} session={session} />;
}

function Bagian({ judul, icon, children }: { judul: string; icon: IconName; children: ReactNode }) {
  return (
    <fieldset className={styles.bagian}>
      <legend className={styles.bagianJudul}>
        <span className={styles.bagianIkon} aria-hidden="true">
          <Icon name={icon} size={18} />
        </span>
        {judul}
      </legend>
      {children}
    </fieldset>
  );
}

function Formulir({ awal, session }: { awal: User; session: Session }) {
  const router = useRouter();
  const { t } = useBahasa();
  const e = t.aplikasi.profil.edit;
  const mahasiswa = awal.role === "mahasiswa";
  const inputFoto = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: awal.full_name ?? "",
    bio: awal.bio ?? "",
    phone: awal.phone ?? "",
    location: awal.location ?? "",
    university: awal.university ?? "",
    major: awal.major ?? "",
    semester: awal.semester ? String(awal.semester) : "",
    skills: (awal.skills ?? []).join(", "),
    portfolio_url: awal.portfolio_url ?? "",
    company_name: awal.company_name ?? "",
    business_type: awal.business_type ?? "",
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [pratinjau, setPratinjau] = useState<string | null>(null);
  const [status, setStatus] = useState<"diam" | "unggah" | "simpan">("diam");
  const [error, setError] = useState<string | null>(null);
  const [galatKolom, setGalatKolom] = useState<{ full_name?: string; semester?: string; portfolio_url?: string }>({});

  /* URL objek pratinjau dilepas saat foto diganti, dibatalkan, atau halaman ditinggal. */
  const urlTerakhir = useRef<string | null>(null);
  useEffect(() => () => {
    if (urlTerakhir.current) URL.revokeObjectURL(urlTerakhir.current);
  }, []);

  function gantiPratinjau(file: File | null) {
    if (urlTerakhir.current) URL.revokeObjectURL(urlTerakhir.current);
    urlTerakhir.current = file ? URL.createObjectURL(file) : null;
    setFoto(file);
    setPratinjau(urlTerakhir.current);
  }

  function set(key: keyof typeof form) {
    return (ev: { target: { value: string } }) => setForm((p) => ({ ...p, [key]: ev.target.value }));
  }

  function pilihFoto(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!TIPE_FOTO.includes(file.type)) return setError(e.fotoFormat);
    if (file.size > BATAS_FOTO) return setError(e.fotoBesar);
    gantiPratinjau(file);
  }

  /** Hanya kolom yang benar-benar berubah yang dikirim; backend mengabaikan string kosong kecuali bio. */
  function perubahan(): UpdateProfilePayload {
    const p: UpdateProfilePayload = {};
    const beda = (a: string, b: string | null | undefined) => a.trim() !== (b ?? "").trim();
    if (beda(form.full_name, awal.full_name) && form.full_name.trim()) p.full_name = form.full_name.trim();
    if (beda(form.bio, awal.bio)) p.bio = form.bio.trim();
    if (beda(form.phone, awal.phone) && form.phone.trim()) p.phone = form.phone.trim();
    if (beda(form.location, awal.location) && form.location.trim()) p.location = form.location.trim();
    if (mahasiswa) {
      if (beda(form.university, awal.university) && form.university.trim()) p.university = form.university.trim();
      if (beda(form.major, awal.major) && form.major.trim()) p.major = form.major.trim();
      if (form.semester && Number(form.semester) !== awal.semester) p.semester = Number(form.semester);
      const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (skills.join("|") !== (awal.skills ?? []).join("|")) p.skills = skills;
      if (beda(form.portfolio_url, awal.portfolio_url) && form.portfolio_url.trim()) p.portfolio_url = form.portfolio_url.trim();
    } else {
      if (beda(form.company_name, awal.company_name) && form.company_name.trim()) p.company_name = form.company_name.trim();
      if (beda(form.business_type, awal.business_type) && form.business_type.trim()) p.business_type = form.business_type.trim();
    }
    return p;
  }

  async function simpan(ev: FormEvent) {
    ev.preventDefault();
    setError(null);

    const sem = Number(form.semester);
    const g = {
      full_name: !form.full_name.trim() ? e.namaWajib : undefined,
      semester: mahasiswa && form.semester && (!Number.isInteger(sem) || sem < 1 || sem > 14) ? e.semesterSalah : undefined,
      portfolio_url:
        mahasiswa && form.portfolio_url.trim() && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(form.portfolio_url.trim())
          ? e.portofolioSalah
          : undefined,
    };
    setGalatKolom(g);
    if (g.full_name || g.semester || g.portfolio_url) return;

    const payload = perubahan();
    if (Object.keys(payload).length === 0 && !foto) return setError(e.tidakBerubah);

    try {
      if (foto) {
        setStatus("unggah");
        const unggah = await apiUpload<UploadResult>(foto, "avatar");
        payload.avatar_url = unggah.url;
      }
      setStatus("simpan");
      const baru = await users.updateMe(payload);
      /* Nama dan foto di sidebar dibaca dari sesi, jadi sesi ikut diperbarui. */
      const kini = readSession() ?? session;
      writeSession({
        ...kini,
        user: { ...kini.user, full_name: baru.full_name ?? kini.user.full_name, avatar_url: baru.avatar_url ?? kini.user.avatar_url },
      });
      router.replace("/profil?tersimpan=1");
    } catch (err) {
      setError(err instanceof ApiError ? err.messages.join(" ") : t.umum.galat.jaringan);
      setStatus("diam");
    }
  }

  const sibuk = status !== "diam";

  return (
    <form className={styles.form} onSubmit={simpan} noValidate>
      <Bagian judul={e.foto} icon="Camera">
        <div className={styles.foto}>
          <span className={styles.fotoBingkai}>
            {pratinjau ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pratinjau} alt="" className={styles.fotoPratinjau} />
            ) : (
              <Avatar name={form.full_name || awal.full_name} src={awal.avatar_url} size="xl" />
            )}
          </span>
          <div className={styles.fotoTeks}>
            <span className={app.rowMeta}>{e.fotoPetunjuk}</span>
            <div className={styles.fotoAksi}>
              <input
                ref={inputFoto}
                type="file"
                accept={TIPE_FOTO.join(",")}
                className="sl-visually-hidden"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(ev) => {
                  pilihFoto(ev.target.files?.[0]);
                  ev.target.value = "";
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={sibuk}
                onClick={() => inputFoto.current?.click()}
                iconLeft={<Icon name="ImagePlus" size={16} />}
              >
                {awal.avatar_url || foto ? e.gantiFoto : e.pilihFoto}
              </Button>
              {foto ? (
                <Button type="button" size="sm" variant="ghost" disabled={sibuk} onClick={() => gantiPratinjau(null)}>
                  {e.batalFoto}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Bagian>

      <Bagian judul={mahasiswa ? e.bagianDiri : e.bagianUsaha} icon={mahasiswa ? "UserCheck" : "Store"}>
        <Input
          label={mahasiswa ? e.namaLengkap : e.namaPenanggungJawab}
          required
          autoComplete="name"
          value={form.full_name}
          error={galatKolom.full_name}
          onChange={(ev) => {
            set("full_name")(ev);
            setGalatKolom((g) => ({ ...g, full_name: undefined }));
          }}
        />
        {!mahasiswa ? (
          <div className={styles.row}>
            <Input label={e.namaUsaha} autoComplete="organization" value={form.company_name} onChange={set("company_name")} />
            <Input label={e.jenisUsaha} value={form.business_type} onChange={set("business_type")} placeholder={e.jenisUsahaContoh} />
          </div>
        ) : null}
        <Textarea
          label={e.bio}
          rows={4}
          maxLength={500}
          showCount
          value={form.bio}
          onChange={set("bio")}
          hint={e.bioPetunjuk}
          placeholder={mahasiswa ? e.bioContohMahasiswa : e.bioContohBisnis}
        />
      </Bagian>

      {mahasiswa ? (
        <Bagian judul={e.bagianKampus} icon="GraduationCap">
          <Input label={e.universitas} value={form.university} onChange={set("university")} />
          <div className={styles.row}>
            <Input label={e.jurusan} value={form.major} onChange={set("major")} />
            <Input
              label={e.semester}
              numeric
              value={form.semester}
              error={galatKolom.semester}
              onChange={(ev) => {
                setForm((p) => ({ ...p, semester: ev.target.value.replace(/\D/g, "").slice(0, 2) }));
                setGalatKolom((g) => ({ ...g, semester: undefined }));
              }}
            />
          </div>
          <Input label={e.keahlian} value={form.skills} onChange={set("skills")} hint={e.keahlianPetunjuk} />
          <Input
            label={e.portofolio}
            type="url"
            inputMode="url"
            value={form.portfolio_url}
            error={galatKolom.portfolio_url}
            onChange={(ev) => {
              set("portfolio_url")(ev);
              setGalatKolom((g) => ({ ...g, portfolio_url: undefined }));
            }}
            placeholder={e.portofolioContoh}
          />
        </Bagian>
      ) : null}

      <Bagian judul={e.bagianKontak} icon="MessageSquare">
        <div className={styles.row}>
          <Input label={e.telepon} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" />
          <Input label={e.lokasi} value={form.location} onChange={set("location")} placeholder={e.lokasiContoh} />
        </div>
        <p className={app.catatan}>
          <Icon name="Info" size={14} />
          {e.catatanKosong}
        </p>
      </Bagian>

      {error ? (
        <p role="alert" className={app.galat}>
          <Icon name="AlertTriangle" size={18} />
          <span>{error}</span>
        </p>
      ) : null}

      <div className={styles.kaki}>
        <Button variant="ghost" href="/profil">
          {e.batal}
        </Button>
        <Button type="submit" size="lg" loading={sibuk}>
          {status === "unggah" ? e.mengunggah : e.simpan}
        </Button>
      </div>
    </form>
  );
}
