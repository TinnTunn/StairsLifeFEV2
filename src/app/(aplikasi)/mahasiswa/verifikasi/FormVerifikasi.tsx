// Formulir unggah kartu mahasiswa untuk verifikasi.

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { RingkasanGalat } from "@/components/feedback/RingkasanGalat";
import { FileDropzone } from "@/components/forms/FileDropzone";
import { Input } from "@/components/forms/Input";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK, apiUpload } from "@/lib/api/client";
import { users } from "@/lib/api/users";
import { idKolom, useGalatKolom } from "@/lib/useGalatKolom";
import type { UploadResult, Verification } from "@/lib/types";
import app from "../dashboard.module.css";
import styles from "./verifikasi.module.css";

const BATAS_BYTE = 10 * 1024 * 1024;

interface Props {
  universitasAwal: string;
  judul: string;
  onTerkirim: (v: Verification) => void;
}

export function FormVerifikasi({ universitasAwal, judul, onTerkirim }: Props) {
  const { t } = useBahasa();
  const f = t.aplikasi.mahasiswa.verifikasi.form;
  const [universitas, setUniversitas] = useState(universitasAwal);
  const [nim, setNim] = useState("");
  const [ktm, setKtm] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const galat = useGalatKolom<"kampus" | "ktm" | "selfie">();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const valid = galat.periksa([
      ["kampus", !universitas.trim(), f.kampusKosong],
      ["ktm", !ktm, f.ktmKosong],
      ["ktm", Boolean(ktm && ktm.size > BATAS_BYTE), f.terlaluBesar(ktm?.name ?? "")],
      ["selfie", !selfie, f.selfieKosong],
      ["selfie", Boolean(selfie && selfie.size > BATAS_BYTE), f.terlaluBesar(selfie?.name ?? "")],
    ]);
    if (!valid) return;
    setLoading(true);
    try {
      if (USE_MOCK) {
        galat.setGalatUmum([f.modeContoh]);
        return;
      }
      const kartu = await apiUpload<UploadResult>(ktm as File, "ktm");
      const wajah = await apiUpload<UploadResult>(selfie as File, "selfie");
      const hasil = await users.submitVerification({
        ktm_image_url: kartu.url,
        selfie_url: wajah.url,
        university: universitas.trim(),
        ...(nim.trim() ? { student_id_number: nim.trim() } : {}),
      });
      onTerkirim(hasil);
    } catch (e) {
      galat.setGalatUmum(e instanceof ApiError ? e.messages : [t.umum.galat.jaringan]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.kepala}>
        <span className={styles.ikon} aria-hidden="true">
          <Icon name="BadgeCheck" size={22} />
        </span>
        <div>
          <h2 className={styles.title}>{judul}</h2>
          <p className={styles.lead}>{f.lead}</p>
        </div>
      </div>

      <RingkasanGalat pesan={galat.ringkasan} className={app.galat} barisClassName={app.galatBaris} />

      <div className={styles.row}>
        <Input
          label={f.kampus}
          id={idKolom("kampus")}
          error={galat.galat.kampus}
          required
          value={universitas}
          onChange={(e) => {
            setUniversitas(e.target.value);
            galat.hapus("kampus");
          }}
          placeholder={f.kampusContoh}
          iconLeft={<Icon name="GraduationCap" size={18} />}
        />
        <Input label={f.nim} value={nim} onChange={(e) => setNim(e.target.value)} hint={f.nimPetunjuk} />
      </div>

      <div className={styles.row}>
        <FileDropzone
          label={f.fotoKtm}
          accept="image/jpeg,image/png,image/webp,application/pdf"
          files={ktm ? [ktm] : []}
          error={galat.galat.ktm}
          onFiles={(daftar) => {
            setKtm(daftar[0] ?? null);
            galat.hapus("ktm");
          }}
          onRemove={() => setKtm(null)}
          disabled={loading}
        />

        <FileDropzone
          label={f.selfie}
          accept="image/jpeg,image/png,image/webp"
          hint={f.selfiePetunjuk}
          files={selfie ? [selfie] : []}
          error={galat.galat.selfie}
          onFiles={(daftar) => {
            setSelfie(daftar[0] ?? null);
            galat.hapus("selfie");
          }}
          onRemove={() => setSelfie(null)}
          disabled={loading}
        />
      </div>

      <p className={app.catatan}>
        <Icon name="Lock" size={14} className={styles.catatanIkon} />
        {f.privat}
      </p>

      <div>
        <Button type="submit" size="lg" loading={loading}>
          {f.kirim}
        </Button>
      </div>
    </form>
  );
}
