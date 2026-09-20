// Halaman admin untuk membalas pesan dukungan pengguna.

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin, type SupportRoom } from "@/lib/api/admin";
import { formatTanggalJam } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { AdminShell } from "../AdminShell";
import { KartuAdmin, useAksi } from "../_bersama/bersama";
import styles from "../_bersama/admin.module.css";

export default function DukunganAdmin() {
  const { t } = useBahasa();
  const d = t.admin.dukungan;
  return (
    <AdminShell title={d.judul} subtitle={d.sub}>
      <Isi />
    </AdminShell>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const d = t.admin.dukungan;
  const ruang = useAsync(() => admin.supportInbox(), []);
  const [pilih, setPilih] = useState<SupportRoom | null>(null);

  if (ruang.loading && !ruang.data) return <SkeletonCard lines={4} label={d.memuat} />;
  if (ruang.error) {
    return <EmptyState icon="AlertTriangle" title={d.gagal} description={`${ruang.error} ${t.admin.umum.muatUlang}`} />;
  }

  const items = ruang.data ?? [];
  if (items.length === 0) return <EmptyState icon="Inbox" title={d.kosongJudul} description={d.kosongIsi} />;

  return (
    <>
      <div className={styles.toolbar}>
        <p className={styles.catatan}>{d.catatanRealtime}</p>
        <Button size="sm" variant="secondary" onClick={ruang.muatUlang} iconLeft={<Icon name="RotateCw" size={16} />}>
          {d.muatUlang}
        </Button>
      </div>
      <div className={styles.dukungan}>
        <ul className={styles.ruang}>
          {items.map((r) => (
            <li key={r.room_id}>
              <button
                type="button"
                className={styles.ruangTombol}
                aria-current={pilih?.room_id === r.room_id || undefined}
                onClick={() => setPilih(r)}
              >
                <span className={styles.ruangNama}>
                  {r.user_name ?? t.admin.umum.tanpaNama}
                  {r.is_suspended ? <Icon name="Ban" size={14} /> : null}
                </span>
                <span className={styles.ruangPesan}>{r.last_message}</span>
                <span className={styles.pesanMeta}>
                  {r.user_role ? `${t.umum.peran[r.user_role]} · ` : ""}
                  {formatTanggalJam(r.updated_at, bahasa)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {pilih ? (
          <Percakapan key={pilih.room_id} ruang={pilih} />
        ) : (
          <KartuAdmin judul={d.judul} icon="MessageSquare">
            <p className={styles.catatan}>{d.pilih}</p>
          </KartuAdmin>
        )}
      </div>
    </>
  );
}

function Percakapan({ ruang }: { ruang: SupportRoom }) {
  const { t, bahasa } = useBahasa();
  const d = t.admin.dukungan;
  const riwayat = useAsync(() => admin.supportHistory(ruang.room_id), [ruang.room_id]);
  const { loading, jalankan, galat } = useAksi();
  const [balasan, setBalasan] = useState("");

  async function kirim(event: FormEvent) {
    event.preventDefault();
    const isi = balasan.trim();
    if (!isi) return;
    if (await jalankan(() => admin.supportReply(ruang.room_id, isi))) {
      setBalasan("");
      riwayat.muatUlang();
    }
  }

  return (
    <KartuAdmin
      judul={ruang.user_name ?? t.admin.umum.tanpaNama}
      sub={ruang.is_suspended ? `${d.dibekukan}${ruang.suspension_reason ? `: ${ruang.suspension_reason}` : ""}` : undefined}
      icon="MessageSquare"
    >
      {riwayat.loading && !riwayat.data ? (
        <SkeletonCard lines={3} />
      ) : riwayat.error ? (
        <p className={styles.catatan}>{d.riwayatGagal}</p>
      ) : (
        <div className={styles.thread} aria-live="polite">
          {(riwayat.data ?? []).map((m) => {
            const dariAdmin = m.sender_role === "admin" || m.sender?.role === "admin";
            return (
              <div key={m.id} className={styles.pesan} data-admin={dariAdmin || undefined}>
                <span>{m.content}</span>
                <span className={styles.pesanMeta}>
                  {dariAdmin ? d.admin : (m.sender?.full_name ?? ruang.user_name)} · {formatTanggalJam(m.created_at, bahasa)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={kirim} className={styles.daftar}>
        <Textarea
          label={d.balas}
          rows={3}
          maxLength={2000}
          value={balasan}
          onChange={(e) => setBalasan(e.target.value)}
          placeholder={d.balasContoh}
        />
        {galat}
        <div>
          <Button type="submit" loading={loading} disabled={!balasan.trim()} iconRight={<Icon name="Send" size={16} />}>
            {d.kirim}
          </Button>
        </div>
      </form>
    </KartuAdmin>
  );
}
