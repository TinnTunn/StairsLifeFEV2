// Tombol membatalkan lamaran yang belum diproses.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Modal } from "@/components/feedback/Modal";
import { useBahasa } from "@/i18n/BahasaProvider";
import { applications } from "@/lib/api/applications";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import styles from "../../dashboard.module.css";

export function BatalkanLamaran({ id, projectId }: { id: string; projectId: string }) {
  const router = useRouter();
  const { t } = useBahasa();
  const d = t.aplikasi.mahasiswa.detailLamaran;
  const [buka, setBuka] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function batalkan() {
    setError(null);
    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(t.umum.galat.modeContoh);
        return;
      }
      await applications.cancel(id);
      router.replace("/mahasiswa/lamaran");
    } catch (e) {
      setError(e instanceof ApiError ? e.messages.join(" ") : t.umum.galat.jaringan);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setBuka(true)}>
        {d.batalkan}
      </Button>

      <Modal
        open={buka}
        onClose={() => setBuka(false)}
        tone="danger"
        size="sm"
        title={d.batalkanJudul}
        description={d.batalkanIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBuka(false)} disabled={loading}>
              {d.tidakJadi}
            </Button>
            <Button variant="destructive" onClick={batalkan} loading={loading}>
              {d.yaBatalkan}
            </Button>
          </>
        }
      >
        {error ? (
          <p role="alert" className={styles.galat}>
            <span>
              {error}{" "}
              <Link href={`/mahasiswa/cari/${projectId}`}>{d.lihatProyekSingkat}</Link>
            </span>
          </p>
        ) : null}
      </Modal>
    </>
  );
}
