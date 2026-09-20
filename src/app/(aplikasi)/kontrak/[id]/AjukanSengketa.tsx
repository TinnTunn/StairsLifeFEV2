// Formulir mengajukan sengketa atas sebuah kontrak.

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Modal } from "@/components/feedback/Modal";
import { FileDropzone } from "@/components/forms/FileDropzone";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, USE_MOCK, apiUpload, berkasTerlaluBesar } from "@/lib/api/client";
import { disputes, gabungBukti } from "@/lib/api/disputes";
import type { UploadResult } from "@/lib/types";
import app from "../../mahasiswa/dashboard.module.css";
import styles from "./kontrak.module.css";

const MIN_ALASAN = 20;

export function AjukanSengketa({ contractId }: { contractId: string }) {
  const { t } = useBahasa();
  const s = t.fitur.sengketa;
  const router = useRouter();
  const [buka, setBuka] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [berkas, setBerkas] = useState<File[]>([]);
  const [dicoba, setDicoba] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progres, setProgres] = useState<string | null>(null);
  const [galat, setGalat] = useState<string | null>(null);

  const kurang = Math.max(0, MIN_ALASAN - alasan.trim().length);
  const galatAlasan = dicoba && kurang > 0 ? s.alasanPendek(kurang) : undefined;

  async function kirim() {
    setDicoba(true);
    setGalat(null);
    if (kurang > 0) return;
    const besar = berkasTerlaluBesar(berkas, "evidence");
    if (besar) {
      setGalat(t.umum.galat.berkasBesar(besar.nama, besar.batasMb));
      return;
    }
    if (USE_MOCK) {
      setGalat(t.aplikasi.umum.modeContoh);
      return;
    }
    setLoading(true);
    try {
      const paths: string[] = [];
      for (const [i, f] of berkas.entries()) {
        setProgres(s.mengunggah(i + 1, berkas.length));
        paths.push((await apiUpload<UploadResult>(f, "evidence")).url);
      }
      setProgres(null);
      const dibuat = await disputes.create({
        contract_id: contractId,
        reason: alasan.trim(),
        evidence_url: gabungBukti(paths),
      });
      router.push(`/sengketa/${dibuat.id}`);
    } catch (e) {
      setGalat(e instanceof ApiError ? e.messages.join(" ") : t.umum.galat.jaringan);
    } finally {
      setLoading(false);
      setProgres(null);
    }
  }

  return (
    <div className={`${styles.card} ${styles.masalah}`}>
      <div className={styles.masalahTeks}>
        <h3 className={styles.cardTitle}>
          <span className={styles.cardIkon} aria-hidden="true">
            <Icon name="Scale" size={18} />
          </span>
          {s.ajukanJudul}
        </h3>
        <p className={styles.warn}>{s.ajukanIsi}</p>
      </div>
      <div>
        <Button variant="secondary" onClick={() => setBuka(true)}>
          {s.ajukan}
        </Button>
      </div>

      <Modal
        open={buka}
        onClose={() => !loading && setBuka(false)}
        size="md"
        tone="danger"
        title={s.ajukanJudul}
        description={s.ajukanIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBuka(false)} disabled={loading}>
              {t.umum.aksi.batal}
            </Button>
            <Button variant="destructive" onClick={kirim} loading={loading}>
              {s.kirim}
            </Button>
          </>
        }
      >
        <Textarea
          label={s.alasan}
          required
          rows={5}
          maxLength={2000}
          showCount
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          hint={s.alasanPetunjuk}
          error={galatAlasan}
        />
        <FileDropzone
          label={s.bukti}
          hint={s.buktiPetunjuk}
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          files={berkas}
          onFiles={(f) => setBerkas((lama) => [...lama, ...f].slice(0, 5))}
          onRemove={(i) => setBerkas((lama) => lama.filter((_, n) => n !== i))}
        />
        {progres ? (
          <p className={styles.warn} aria-live="polite">
            {progres}
          </p>
        ) : null}
        {galat ? (
          <p role="alert" className={app.galat}>
            <Icon name="AlertTriangle" size={18} />
            {galat}
          </p>
        ) : null}
      </Modal>
    </div>
  );
}
