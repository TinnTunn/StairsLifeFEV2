// Formulir pendaftaran akun untuk kedua peran.

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { RingkasanGalat } from "@/components/feedback/RingkasanGalat";
import { IconButton } from "@/components/actions/IconButton";
import { Input } from "@/components/forms/Input";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth, type RegisterPayload } from "@/lib/api/auth";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { tandaiMasuk, writeSession } from "@/lib/api/session";
import { LayarProses } from "@/components/feedback/LayarProses";
import { idKolom, useGalatKolom } from "@/lib/useGalatKolom";
import styles from "../masuk/auth.module.css";

export function RegisterForm({ role }: { role: "mahasiswa" | "bisnis" }) {
  const router = useRouter();
  const { t } = useBahasa();
  const d = t.auth.daftar;
  const f = t.auth.bidang;
  const [loading, setLoading] = useState(false);
  const [lihatSandi, setLihatSandi] = useState(false);
  const galat = useGalatKolom<"full_name" | "email" | "password" | "semester">();
  const [namaBaru, setNamaBaru] = useState<string | null>(null);

  useEffect(() => () => tandaiMasuk(false), []);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    university: "",
    major: "",
    semester: "",
    company_name: "",
  });

  function set(key: keyof typeof form) {
    return (event: { target: { value: string } }) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      if (key === "full_name" || key === "email" || key === "password" || key === "semester") galat.hapus(key);
    };
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    const semester = Number(form.semester);
    const valid = galat.periksa([
      ["full_name", !form.full_name.trim(), t.auth.galat.namaKosong],
      ["email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()), t.auth.galat.emailSalah],
      ["password", form.password.length < 8, t.auth.galat.sandiPendek],
      ["semester", role === "mahasiswa" && form.semester !== "" && (!Number.isInteger(semester) || semester < 1 || semester > 14), t.auth.galat.semesterSalah],
    ]);
    if (!valid) return;

    setLoading(true);
    try {
      if (USE_MOCK) {
        galat.setGalatUmum([d.modeContoh]);
        return;
      }

      const payload: RegisterPayload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      };
      if (form.phone) payload.phone = form.phone;
      if (role === "mahasiswa") {
        if (form.university) payload.university = form.university;
        if (form.major) payload.major = form.major;
        if (form.semester) payload.semester = Number(form.semester);
      } else if (form.company_name) {
        payload.company_name = form.company_name;
      }

      const hasil = await auth.register(payload);
      tandaiMasuk(true);
      setNamaBaru(hasil.user.full_name.split(" ")[0] || hasil.user.full_name);
      writeSession(hasil);
      router.replace(role === "mahasiswa" ? "/mahasiswa" : "/bisnis");
    } catch (e) {
      galat.setGalatUmum(e instanceof ApiError ? e.messages : [t.umum.galat.jaringan]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {namaBaru ? <LayarProses judul={t.umum.masuk.daftarJudul(namaBaru)} isi={t.umum.masuk.isi} /> : null}
      <RingkasanGalat pesan={galat.ringkasan} className={styles.error} barisClassName={styles.errorBaris} />

      <Input
        label={role === "mahasiswa" ? d.namaLengkap : d.namaPenanggungJawab}
        name="full_name"
        id={idKolom("full_name")}
        error={galat.galat.full_name}
        autoComplete="name"
        required
        value={form.full_name}
        onChange={set("full_name")}
        placeholder={d.namaLengkap}
      />

      {role === "bisnis" ? (
        <Input
          label={d.namaUsaha}
          name="company_name"
          autoComplete="organization"
          value={form.company_name}
          onChange={set("company_name")}
          placeholder={d.namaUsaha}
          iconLeft={<Icon name="Store" size={18} />}
        />
      ) : null}

      <Input
        label={f.email}
        type="email"
        name="email"
        id={idKolom("email")}
        error={galat.galat.email}
        autoComplete="email"
        required
        value={form.email}
        onChange={set("email")}
        placeholder={f.emailContoh}
        hint={d.emailPetunjuk}
        iconLeft={<Icon name="Mail" size={18} />}
      />

      <Input
        label={f.sandi}
        type={lihatSandi ? "text" : "password"}
        name="password"
        id={idKolom("password")}
        error={galat.galat.password}
        autoComplete="new-password"
        required
        value={form.password}
        onChange={set("password")}
        hint={f.minimal8}
        iconLeft={<Icon name="Lock" size={18} />}
        trailing={
          <IconButton
            label={lihatSandi ? f.sembunyikanSandi : f.tampilkanSandi}
            aria-pressed={lihatSandi}
            onClick={() => setLihatSandi((v) => !v)}
          >
            <Icon name={lihatSandi ? "EyeOff" : "Eye"} size={18} />
          </IconButton>
        }
      />

      {role === "mahasiswa" ? (
        <>
          <Input
            label={d.kampus}
            name="university"
            value={form.university}
            onChange={set("university")}
            placeholder={d.kampusContoh}
            iconLeft={<Icon name="GraduationCap" size={18} />}
          />
          <div className={styles.row}>
            <Input label={d.jurusan} name="major" value={form.major} onChange={set("major")} placeholder={d.jurusanContoh} />
            <Input
              label={d.semester}
              name="semester"
              id={idKolom("semester")}
              error={galat.galat.semester}
              numeric
              value={form.semester}
              onChange={set("semester")}
              placeholder="5"
              hint={d.semesterPetunjuk}
            />
          </div>
        </>
      ) : null}

      <Input
        label={d.telepon}
        name="phone"
        type="tel"
        autoComplete="tel"
        value={form.phone}
        onChange={set("phone")}
        placeholder="08xxxxxxxxxx"
      />

      <Button type="submit" size="lg" fullWidth loading={loading}>
        {d[role].kirim}
      </Button>
    </form>
  );
}
