// Halaman formulir memasang proyek baru.

"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/actions/Button";
import { Icon, type IconName } from "@/components/actions/Icon";
import { RingkasanGalat } from "@/components/feedback/RingkasanGalat";
import { Input } from "@/components/forms/Input";
import { PemilihTanggal } from "@/components/forms/PemilihTanggal";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { projects } from "@/lib/api/projects";
import { formatRupiah } from "@/lib/format";
import { RincianKomisi } from "@/components/data/RincianKomisi";
import type { ProjectTier } from "@/lib/types";
import { idKolom, useGalatKolom } from "@/lib/useGalatKolom";
import { BisnisShell } from "../../BisnisShell";
import app from "../../../mahasiswa/dashboard.module.css";
import styles from "./baru.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

const TIER: ProjectTier[] = ["pemula", "menengah", "mahir"];

const KATEGORI_DITAHAN = "umum";

export default function ProyekBaru() {
  const { t } = useBahasa();
  return (
    <BisnisShell title={t.aplikasi.bisnis.baru.judul} subtitle={t.aplikasi.bisnis.baru.sub}>
      <TautanKembali href="/bisnis/proyek" label={t.umum.aksi.keProyekSaya} />
      <Form />
    </BisnisShell>
  );
}

function Bagian({ icon, judul, children }: { icon: IconName; judul: string; children: ReactNode }) {
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

function Form() {
  const router = useRouter();
  const { t } = useBahasa();
  const d = t.aplikasi.bisnis.baru;
  const [loading, setLoading] = useState(false);
  const galat = useGalatKolom<"title" | "description" | "budget_max" | "deadline">();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    tier: "pemula" as ProjectTier,
    skills: "",
    deliverables: "",
  });

  function set<K extends keyof typeof form>(key: K) {
    return (event: { target: { value: string } }) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      if (key === "title" || key === "description") galat.hapus(key);
    };
  }

  const min = Number(form.budget_min) || 0;
  const max = Number(form.budget_max) || 0;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const valid = galat.periksa([
      ["title", !form.title.trim(), d.salahJudul],
      ["description", !form.description.trim(), d.salahDeskripsi],
      ["deadline", !form.deadline, d.salahTenggat],
      ["budget_max", max <= 0, d.salahMaks],
      ["budget_max", min > max, d.salahRentang],
    ]);
    if (!valid) return;

    setLoading(true);
    try {
      if (USE_MOCK) {
        galat.setGalatUmum([d.modeContoh]);
        return;
      }

      const dibuat = await projects.create({
        title: form.title.trim(),
        description: form.description.trim(),
        budget_min: min,
        budget_max: max,
        deadline: new Date(`${form.deadline}T23:59:59`).toISOString(),
        category: KATEGORI_DITAHAN,
        tier: form.tier,
        ...(form.skills.trim() ? { skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) } : {}),
        ...(form.deliverables.trim() ? { deliverables: form.deliverables.trim() } : {}),
      });
      router.replace(`/bisnis/proyek/${dibuat.id}`);
    } catch (e) {
      galat.setGalatUmum(e instanceof ApiError ? e.messages : [t.umum.galat.jaringan]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <RingkasanGalat pesan={galat.ringkasan} className={app.galat} barisClassName={app.galatBaris} />

      <Bagian icon="FileText" judul={d.bagianDasar}>
        <Input
          label={d.judulProyek}
          id={idKolom("title")}
          error={galat.galat.title}
          required
          value={form.title}
          onChange={set("title")}
          placeholder={d.judulContoh}
          hint={d.judulPetunjuk}
        />

        <Textarea
          label={d.deskripsi}
          id={idKolom("description")}
          error={galat.galat.description}
          required
          rows={6}
          maxLength={2000}
          showCount
          value={form.description}
          onChange={set("description")}
          placeholder={d.deskripsiContoh}
        />

        <Input
          label={d.hasil}
          value={form.deliverables}
          onChange={set("deliverables")}
          placeholder={d.hasilContoh}
          hint={d.hasilPetunjuk}
        />
      </Bagian>

      <Bagian icon="Wallet" judul={d.bagianDana}>
        <div className={styles.row}>
          <Input
            label={d.anggaranMin}
            prefix="Rp"
            numeric
            uang
            value={form.budget_min}
            onChange={(e) => setForm((p) => ({ ...p, budget_min: e.target.value.replace(/\D/g, "") }))}
          />
          <Input
            label={d.anggaranMaks}
            id={idKolom("budget_max")}
            error={galat.galat.budget_max}
            prefix="Rp"
            numeric
            uang
            required
            value={form.budget_max}
            onChange={(e) => {
              setForm((p) => ({ ...p, budget_max: e.target.value.replace(/\D/g, "") }));
              galat.hapus("budget_max");
            }}
          />
        </div>

        {max > 0 ? (
          <p className={styles.note} aria-live="polite">
            <Icon name="ShieldCheck" size={16} className={styles.noteIkon} />
            <span>
              <RincianKomisi nominal={max}>
                {(komisi, diterima) => d.rincianKomisi(formatRupiah(max), formatRupiah(komisi), formatRupiah(diterima))}
              </RincianKomisi>
            </span>
          </p>
        ) : null}

        <div className={styles.row}>
          <PemilihTanggal
            label={d.tenggat}
            id={idKolom("deadline")}
            error={galat.galat.deadline}
            required
            value={form.deadline}
            onChange={(v) => {
              setForm((p) => ({ ...p, deadline: v }));
              galat.hapus("deadline");
            }}
          />
        </div>
      </Bagian>

      <Bagian icon="GraduationCap" judul={d.bagianMahasiswa}>
        <Select
          label={d.tingkatDicari}
          options={TIER.map((v) => ({ value: v, label: d.tingkat[v] }))}
          value={form.tier}
          onChange={(e) => setForm((p) => ({ ...p, tier: e.target.value as ProjectTier }))}
          placeholder=""
        />

        <Input
          label={d.keahlian}
          value={form.skills}
          onChange={set("skills")}
          placeholder={d.keahlianContoh}
          hint={d.keahlianPetunjuk}
        />
      </Bagian>

      <div className={styles.kirim}>
        <Button type="submit" size="lg" loading={loading} iconRight={<Icon name="ArrowUpRight" size={18} />}>
          {d.kirim}
        </Button>
      </div>
    </form>
  );
}
