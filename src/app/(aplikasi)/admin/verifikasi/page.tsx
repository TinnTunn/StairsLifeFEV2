// Halaman admin untuk meninjau pengajuan verifikasi mahasiswa.

"use client";

import { useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Textarea } from "@/components/forms/Textarea";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin, type AdminVerification } from "@/lib/api/admin";
import { formatTanggalJam } from "@/lib/format";
import { VERIFICATION_STATUS } from "@/lib/status";
import { useAsync } from "@/lib/useAsync";
import { useParamUrl } from "@/lib/useParamUrl";
import { AdminShell } from "../AdminShell";
import { TombolBerkas, useAksi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

type Tab = "pending" | "approved" | "rejected";
const TAB: Tab[] = ["pending", "approved", "rejected"];

export default function VerifikasiAdmin() {
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.verifikasi.judul} subtitle={t.admin.verifikasi.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t } = useBahasa();
  const v = t.admin.verifikasi;
  const [tab, setTab] = useParamUrl<Tab>("status", "pending", TAB);
  const hasil = useAsync(() => admin.verifications(tab), [tab], "admin-verifikasi");
  const [tindakan, setTindakan] = useState<{ item: AdminVerification; jenis: "approved" | "rejected" } | null>(null);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTabs}>
          <Tabs
            variant="pill"
            aria-label={v.saringLabel}
            items={TAB.map((x) => ({ value: x, label: v.tab[x] }))}
            value={tab}
            onChange={(x) => setTab(x as Tab)}
          />
        </div>
      </div>

      {hasil.loading ? (
        <SkeletonCard lines={3} media label={v.memuat} />
      ) : hasil.error ? (
        <EmptyState icon="AlertTriangle" title={v.gagal} description={`${hasil.error} ${t.admin.umum.muatUlang}`} />
      ) : (hasil.data ?? []).length === 0 ? (
        <EmptyState icon="BadgeCheck" title={v.kosongJudul} description={v.kosong[tab]} />
      ) : (
        <>
          <p className={styles.catatan}>{v.buktiPrivat}</p>
          <ul className={styles.daftarGrid}>
            {(hasil.data ?? []).map((item) => (
              <KartuVerifikasi key={item.id} item={item} onTindak={(jenis) => setTindakan({ item, jenis })} />
            ))}
          </ul>
        </>
      )}

      {tindakan ? (
        <ModalTindakan
          item={tindakan.item}
          jenis={tindakan.jenis}
          onTutup={() => setTindakan(null)}
          onSelesai={() => {
            setTindakan(null);
            hasil.muatUlang();
          }}
        />
      ) : null}
    </>
  );
}

function KartuVerifikasi({
  item,
  onTindak,
}: {
  item: AdminVerification;
  onTindak: (jenis: "approved" | "rejected") => void;
}) {
  const { t, bahasa } = useBahasa();
  const v = t.admin.verifikasi;
  const nama = item.user?.full_name ?? t.admin.umum.tanpaNama;

  return (
    <li className={styles.item}>
      <div className={styles.itemKepala}>
        <Avatar name={nama} size="md" />
        <div className={styles.itemIdentitas}>
          <span className={styles.itemNama}>{nama}</span>
          <span className={styles.itemMeta}>{item.user?.email}</span>
        </div>
        <StatusBadge status={VERIFICATION_STATUS[item.status]} />
      </div>

      <dl className={styles.fakta}>
        <div className={styles.faktaSel}>
          <dt className={styles.faktaLabel}>{v.kampus}</dt>
          <dd className={styles.faktaNilai}>{item.university ?? item.user?.university ?? "-"}</dd>
        </div>
        <div className={styles.faktaSel}>
          <dt className={styles.faktaLabel}>{v.nim}</dt>
          <dd className={styles.faktaNilai}>{item.student_id_number || v.nimKosong}</dd>
        </div>
      </dl>

      <span className={styles.itemMeta}>
        {v.diajukan(formatTanggalJam(item.submitted_at, bahasa))}
        {item.reviewed_at && item.status !== "pending" ? ` · ${v.direview(formatTanggalJam(item.reviewed_at, bahasa))}` : ""}
      </span>

      {item.status === "rejected" && item.rejection_reason ? (
        <p className={styles.alasan}>{v.alasanDitolak(item.rejection_reason)}</p>
      ) : null}

      <div className={styles.itemAksi}>
        {item.ktm_image_url ? <TombolBerkas path={item.ktm_image_url} label={v.fotoKtm} /> : null}
        {item.selfie_url ? (
          <TombolBerkas path={item.selfie_url} label={v.fotoSelfie} />
        ) : (
          <span className={styles.itemMeta}>{v.tidakAdaSelfie}</span>
        )}
        {item.status === "pending" ? (
          <div className={styles.itemAksiKanan}>
            <Button size="sm" variant="secondary" onClick={() => onTindak("rejected")}>
              {v.tolak}
            </Button>
            <Button size="sm" onClick={() => onTindak("approved")} iconLeft={<Icon name="Check" size={16} />}>
              {v.setujui}
            </Button>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function ModalTindakan({
  item,
  jenis,
  onTutup,
  onSelesai,
}: {
  item: AdminVerification;
  jenis: "approved" | "rejected";
  onTutup: () => void;
  onSelesai: () => void;
}) {
  const { t } = useBahasa();
  const v = t.admin.verifikasi;
  const { loading, setError, jalankan, galat } = useAksi();
  const [alasan, setAlasan] = useState("");
  const nama = item.user?.full_name ?? t.admin.umum.tanpaNama;
  const tolak = jenis === "rejected";

  async function kirim() {
    if (tolak && alasan.trim().length < 5) {
      setError(v.alasanWajib);
      return;
    }
    if (await jalankan(() => admin.reviewVerification(item.id, jenis, tolak ? alasan.trim() : undefined))) onSelesai();
  }

  return (
    <Modal
      open
      onClose={onTutup}
      size="sm"
      tone={tolak ? "danger" : "success"}
      title={tolak ? v.tolakJudul(nama) : v.setujuiJudul(nama)}
      description={tolak ? v.tolakIsi : v.setujuiIsi}
      footer={
        <>
          <Button variant="secondary" onClick={onTutup} disabled={loading}>
            {t.admin.umum.batal}
          </Button>
          <Button variant={tolak ? "destructive" : "primary"} onClick={kirim} loading={loading}>
            {tolak ? v.tolak : v.setujui}
          </Button>
        </>
      }
    >
      {tolak ? (
        <Textarea
          label={v.alasanTolak}
          required
          rows={3}
          maxLength={500}
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          placeholder={v.alasanContoh}
        />
      ) : null}
      {galat}
    </Modal>
  );
}
