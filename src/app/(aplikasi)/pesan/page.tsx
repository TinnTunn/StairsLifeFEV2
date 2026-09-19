"use client";

import Link from "next/link";
import { Avatar } from "@/components/data/Avatar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/feedback/Skeleton";
import { Halaman, useSesiShell } from "@/components/layout/KonteksShell";
import { Tabs } from "@/components/navigation/Tabs";
import { useBahasa } from "@/i18n/BahasaProvider";
import { chat } from "@/lib/api/chat";
import { USE_MOCK } from "@/lib/api/client";
import { formatWaktuRelatif } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { useParamUrl } from "@/lib/useParamUrl";
import app from "../mahasiswa/dashboard.module.css";
import styles from "./pesan.module.css";

type Jenis = "kontrak" | "tanya";

export default function DaftarPesan() {
  const { t } = useBahasa();
  return (
    <Halaman title={t.fitur.pesan.judul} subtitle={t.fitur.pesan.sub}>
      <Isi />
    </Halaman>
  );
}

function Isi() {
  const { t, bahasa } = useBahasa();
  const c = t.fitur.pesan;
  const session = useSesiShell();
  const mahasiswa = session.user.role === "mahasiswa";
  const [jenis, setJenis] = useParamUrl<Jenis>("jenis", "kontrak", ["kontrak", "tanya"]);
  const kontrak = useAsync(async () => (USE_MOCK ? [] : chat.rooms()), [], "ruang-kontrak");
  const tanya = useAsync(async () => (USE_MOCK ? [] : chat.inquiryRooms()), [], "ruang-tanya");

  const belumKontrak = (kontrak.data ?? []).reduce((n, r) => n + (r.unread_count ?? 0), 0);
  const aktif = jenis === "kontrak" ? kontrak : tanya;

  return (
    <>
      <Tabs
        variant="pill"
        aria-label={c.saringLabel}
        items={[
          { value: "kontrak", label: c.tab.kontrak, count: belumKontrak || undefined },
          { value: "tanya", label: c.tab.tanya },
        ]}
        value={jenis}
        onChange={(v) => setJenis(v as Jenis)}
      />

      {aktif.loading ? (
        <SkeletonCard lines={3} media label={c.memuat} />
      ) : aktif.error ? (
        <EmptyState icon="AlertTriangle" title={c.gagal} description={aktif.error} />
      ) : jenis === "kontrak" ? (
        (kontrak.data ?? []).length === 0 ? (
          <EmptyState icon="MessageSquare" title={c.kosongKontrakJudul} description={c.kosongKontrakIsi} />
        ) : (
          <ul className={app.rows}>
            {[...(kontrak.data ?? [])]
              .sort((a, b) => (b.last_message_at ?? "").localeCompare(a.last_message_at ?? ""))
              .map((r) => {
                const lawan = mahasiswa ? r.users_contracts_business_idTousers : r.users_contracts_student_idTousers;
                return (
                  <li key={r.id} className={app.row}>
                    <Avatar name={lawan?.full_name ?? "?"} size="md" />
                    <div className={app.rowMain}>
                      <span className={app.rowTitle}>
                        <Link href={`/kontrak/${r.id}#obrolan`} className={app.rowLink}>
                          {r.projects?.title ?? t.aplikasi.umum.kontrak}
                        </Link>
                      </span>
                      <span className={app.rowMeta}>{lawan?.full_name ?? t.aplikasi.umum.pihakLain}</span>
                      <span className={styles.cuplikan}>{r.last_message ?? c.belumAdaPesan}</span>
                    </div>
                    <div className={app.rowAside}>
                      {r.last_message_at ? (
                        <span className={styles.waktu}>{formatWaktuRelatif(r.last_message_at, bahasa)}</span>
                      ) : null}
                      {r.unread_count > 0 ? (
                        <span className={styles.lencana} aria-label={c.belumDibaca(r.unread_count)}>
                          {r.unread_count}
                        </span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
          </ul>
        )
      ) : (tanya.data ?? []).length === 0 ? (
        <EmptyState icon="MessageSquare" title={c.kosongTanyaJudul} description={c.kosongTanyaIsi} />
      ) : (
        <ul className={app.rows}>
          {(tanya.data ?? []).map((r) => (
            <li key={r.room_id} className={app.row}>
              <Avatar name={r.other_user?.full_name ?? "?"} src={r.other_user?.avatar_url} size="md" />
              <div className={app.rowMain}>
                <span className={app.rowTitle}>
                  <Link href={`/pesan/tanya/${r.other_user_id}`} className={app.rowLink}>
                    {r.other_user?.full_name ?? c.lawanTidakDitemukan}
                  </Link>
                </span>
                <span className={styles.cuplikan}>
                  {r.last_sender_id === session.user.id ? `${c.kamu}: ` : ""}
                  {r.last_message}
                </span>
              </div>
              <div className={app.rowAside}>
                <span className={styles.waktu}>{formatWaktuRelatif(r.last_message_at, bahasa)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
