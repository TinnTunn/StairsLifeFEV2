"use client";

import { use, useState } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { Obrolan } from "@/components/chat/Obrolan";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError } from "@/lib/api/client";
import { admin, type AdminDispute, type ResolveDisputePayload } from "@/lib/api/admin";
import { formatTanggal, formatTanggalJam } from "@/lib/format";
import { CONTRACT_STATUS, DISPUTE_STATUS } from "@/lib/status";
import { parseDeliverableUrls, type DisputeOutcome, type DisputeStatus } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import app from "../../../mahasiswa/dashboard.module.css";
import { AdminShell } from "../../AdminShell";
import { KartuAdmin, TombolBerkas, useAksi } from "../../_bersama/bersama";
import styles from "../../_bersama/admin.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

export default function DetailSengketaAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  return (
    <AdminShell title={t.admin.sengketa.detail.judul}>
      <Isi id={id} />
    </AdminShell>
  );
}

function Isi({ id }: { id: string }) {
  const { t, bahasa } = useBahasa();
  const d = t.admin.sengketa.detail;
  const hasil = useAsync(async () => {
    try {
      return await admin.dispute(id);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  }, [id]);

  if (hasil.loading) return <SkeletonCard lines={5} label={d.memuat} />;

  if (hasil.error) {
    return <EmptyState icon="AlertTriangle" title={t.admin.sengketa.gagal} description={`${hasil.error} ${t.admin.umum.muatUlang}`} />;
  }

  const x = hasil.data;
  if (!x) {
    return (
      <EmptyState
        icon="SearchX"
        title={d.tidakAdaJudul}
        description={d.tidakAdaIsi}
        action={<Button href="/admin/sengketa">{d.kembali}</Button>}
      />
    );
  }

  const kontrak = x.contracts;
  const status = (x.status ?? "open") as DisputeStatus;
  const final = status === "resolved" || status === "rejected";

  return (
    <>
      <TautanKembali href="/admin/sengketa" label={d.kembali} />

      <div className={styles.itemKepala}>
        <div className={styles.itemIdentitas}>
          <StatusBadge status={DISPUTE_STATUS[status] ?? "sengketa"} />
          <h2 className={app.sectionTitle}>{kontrak?.projects?.title ?? t.aplikasi.umum.kontrak}</h2>
          <span className={styles.itemMeta}>
            {t.admin.sengketa.dibukaOleh(
              x.users_disputes_opened_byTousers?.full_name ?? t.admin.umum.tanpaNama,
              formatTanggalJam(x.created_at, bahasa),
            )}
          </span>
        </div>
      </div>

      <div className={styles.detail}>
        <div className={app.list}>
          <KartuAdmin judul={d.alasan} icon="MessageSquare">
            <p className={styles.kutipan}>{x.reason}</p>
          </KartuAdmin>

          <KartuAdmin judul={d.bukti} icon="Paperclip">
            {x.evidence_url ? (
              <div className={styles.itemAksi}>
                {parseDeliverableUrls(x.evidence_url).map((path, i) => (
                  <TombolBerkas key={path} path={path} label={`${d.lihatBukti} ${i + 1}`} icon="FileText" />
                ))}
              </div>
            ) : (
              <p className={styles.catatan}>{d.tanpaBukti}</p>
            )}
          </KartuAdmin>

          <KartuAdmin judul={d.pihak} icon="Users">
            <dl className={styles.fakta}>
              <Fakta label={d.mahasiswa} nilai={kontrak?.users_contracts_student_idTousers?.full_name} />
              <Fakta label={d.bisnis} nilai={kontrak?.users_contracts_business_idTousers?.full_name} />
              <Fakta label={d.pengaju} nilai={x.users_disputes_opened_byTousers?.full_name} />
              {kontrak ? (
                <>
                  <div className={styles.faktaSel}>
                    <dt className={styles.faktaLabel}>{t.admin.sengketa.nilai}</dt>
                    <dd className={styles.faktaNilai}>
                      <Money value={kontrak.agreed_budget} size="sm" />
                    </dd>
                  </div>
                  <div className={styles.faktaSel}>
                    <dt className={styles.faktaLabel}>{d.statusKontrak}</dt>
                    <dd className={styles.faktaNilai}>
                      <StatusBadge status={CONTRACT_STATUS[kontrak.status]} size="sm" />
                    </dd>
                  </div>
                  <Fakta label={d.tenggat} nilai={formatTanggal(kontrak.deadline, bahasa)} />
                </>
              ) : null}
            </dl>
          </KartuAdmin>

          {x.admin_notes ? (
            <KartuAdmin judul={d.catatanAdmin} icon="PenLine">
              <p className={styles.kutipan}>{x.admin_notes}</p>
            </KartuAdmin>
          ) : null}

          <KartuAdmin judul={t.fitur.sengketa.mediasiJudul} sub={t.fitur.sengketa.mediasiSub} icon="MessageSquare">
            <Obrolan sumber={{ jenis: "mediasi", id: x.id }} />
          </KartuAdmin>
        </div>

        <div className={styles.detailSamping}>
          <KartuAdmin judul={t.admin.sengketa.putusan.judul} icon="Gavel">
            {final ? (
              <p className={styles.final}>
                <Icon name="CheckCircle2" size={18} />
                <span>{t.admin.sengketa.putusan.sudahFinal}</span>
              </p>
            ) : (
              <FormPutusan sengketa={x} onSelesai={hasil.muatUlang} />
            )}
          </KartuAdmin>
        </div>
      </div>
    </>
  );
}

function Fakta({ label, nilai }: { label: string; nilai: string | null | undefined }) {
  return (
    <div className={styles.faktaSel}>
      <dt className={styles.faktaLabel}>{label}</dt>
      <dd className={styles.faktaNilai}>{nilai ?? "-"}</dd>
    </div>
  );
}

type Tindakan = ResolveDisputePayload["status"];
const HASIL: DisputeOutcome[] = ["favor_student", "favor_business", "split", "no_action"];

function FormPutusan({ sengketa, onSelesai }: { sengketa: AdminDispute; onSelesai: () => void }) {
  const { t } = useBahasa();
  const p = t.admin.sengketa.putusan;
  const { loading, setError, jalankan, galat } = useAksi();
  const [tindakan, setTindakan] = useState<Tindakan>(sengketa.status === "under_review" ? "resolved" : "under_review");
  const [hasil, setHasil] = useState<DisputeOutcome | null>(null);
  const [persen, setPersen] = useState("50");
  const [catatan, setCatatan] = useState("");
  const [konfirmasi, setKonfirmasi] = useState(false);

  const opsiTindakan: { nilai: Tindakan; judul: string; isi: string }[] = [
    ...(sengketa.status === "under_review" ? [] : [{ nilai: "under_review" as const, judul: p.tinjau, isi: p.tinjauIsi }]),
    { nilai: "resolved", judul: p.putuskan, isi: p.putuskanIsi },
    { nilai: "rejected", judul: p.tolak, isi: p.tolakIsi },
  ];

  function periksa(): ResolveDisputePayload | null {
    const payload: ResolveDisputePayload = { status: tindakan };
    if (catatan.trim()) payload.admin_notes = catatan.trim();
    if (tindakan === "resolved") {
      if (!hasil) {
        setError(p.hasilWajib);
        return null;
      }
      payload.outcome = hasil;
      if (hasil === "split") {
        const angka = Number(persen);
        if (!Number.isInteger(angka) || angka < 0 || angka > 100) {
          setError(p.persenSalah);
          return null;
        }
        payload.student_share_percent = angka;
      }
    }
    return payload;
  }

  async function simpan(payload: ResolveDisputePayload) {
    if (await jalankan(() => admin.resolveDispute(sengketa.id, payload))) {
      setKonfirmasi(false);
      onSelesai();
    }
  }

  function kirim() {
    setError(null);
    const payload = periksa();
    if (!payload) return;
    /* Putusan akhir memindahkan uang dan tidak bisa diulang, jadi selalu lewat konfirmasi. */
    if (payload.status === "resolved") setKonfirmasi(true);
    else void simpan(payload);
  }

  return (
    <div className={app.list}>
      <fieldset className={styles.pilihan}>
        <legend className={styles.pilihanLegend}>{p.tindakan}</legend>
        {opsiTindakan.map((o) => (
          <label key={o.nilai} className={styles.opsi}>
            <input
              type="radio"
              name="tindakan"
              value={o.nilai}
              checked={tindakan === o.nilai}
              onChange={() => setTindakan(o.nilai)}
            />
            <span className={styles.opsiTeks}>
              <span className={styles.opsiJudul}>{o.judul}</span>
              <span className={styles.opsiIsi}>{o.isi}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {tindakan === "resolved" ? (
        <fieldset className={styles.pilihan}>
          <legend className={styles.pilihanLegend}>{p.hasil}</legend>
          {HASIL.map((h) => (
            <label key={h} className={styles.opsi}>
              <input type="radio" name="hasil" value={h} checked={hasil === h} onChange={() => setHasil(h)} />
              <span className={styles.opsiTeks}>
                <span className={styles.opsiJudul}>{p.hasilOpsi[h]}</span>
              </span>
            </label>
          ))}
          <p className={styles.catatan}>{p.belumAdaDana}</p>
        </fieldset>
      ) : null}

      {tindakan === "resolved" && hasil === "split" ? (
        <Input
          label={p.persen}
          numeric
          suffix="%"
          value={persen}
          onChange={(e) => setPersen(e.target.value.replace(/\D/g, "").slice(0, 3))}
          hint={p.persenPetunjuk}
        />
      ) : null}

      <Textarea
        label={p.catatan}
        rows={3}
        maxLength={1000}
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        placeholder={p.catatanContoh}
      />

      {!konfirmasi ? galat : null}

      <Button onClick={kirim} loading={loading && !konfirmasi} fullWidth size="lg" iconLeft={<Icon name="Gavel" size={18} />}>
        {p.simpan}
      </Button>

      <Modal
        open={konfirmasi}
        onClose={() => setKonfirmasi(false)}
        dismissible={false}
        size="sm"
        tone="danger"
        title={p.konfirmasiJudul}
        description={p.konfirmasiIsi}
        footer={
          <>
            <Button variant="secondary" onClick={() => setKonfirmasi(false)} disabled={loading}>
              {t.admin.umum.batal}
            </Button>
            <Button
              variant="destructive"
              loading={loading}
              onClick={() => {
                const payload = periksa();
                if (payload) void simpan(payload);
              }}
            >
              {p.konfirmasiYa}
            </Button>
          </>
        }
      >
        {hasil ? <p className={styles.kutipan}>{p.hasilOpsi[hasil]}{hasil === "split" ? ` (${persen}%)` : ""}</p> : null}
        {galat}
      </Modal>
    </div>
  );
}
