"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { admin as adminApi, type AksesAdmin } from "@/lib/api/admin";
import { USE_MOCK } from "@/lib/api/client";
import { readSession, sedangKeluar } from "@/lib/api/session";
import { segarkanSesi, useSesi } from "@/lib/api/useSesi";
import type { UserRole } from "@/lib/types";
import { Button } from "../actions/Button";
import { EmptyState } from "../feedback/EmptyState";
import { SkeletonCard } from "../feedback/Skeleton";
import { VerificationBanner } from "../feedback/VerificationBanner";
import { AppShell } from "./AppShell";
import { LoncengNotifikasi } from "./LoncengNotifikasi";
import {
  BERANDA_PERAN,
  BOTTOM_ADMIN,
  BOTTOM_BISNIS,
  BOTTOM_MAHASISWA,
  NAV_ADMIN,
  NAV_BISNIS,
  NAV_MAHASISWA,
  izinUntukRute,
} from "./nav-items";
import type { SidebarEntry } from "../navigation/Sidebar";

/** Rute yang dipakai semua peran, termasuk admin. */
const UNTUK_SEMUA = ["/notifikasi"];

/** Peran yang dibutuhkan rute ini. null: halaman bersama mahasiswa dan bisnis. */
function peranUntuk(pathname: string): UserRole | null {
  for (const peran of ["admin", "mahasiswa", "bisnis"] as const) {
    if (pathname === `/${peran}` || pathname.startsWith(`/${peran}/`)) return peran;
  }
  return null;
}

const NAV = {
  mahasiswa: { sidebar: NAV_MAHASISWA, bottom: BOTTOM_MAHASISWA },
  bisnis: { sidebar: NAV_BISNIS, bottom: BOTTOM_BISNIS },
  admin: { sidebar: NAV_ADMIN, bottom: BOTTOM_ADMIN },
};

/**
 * Penjaga dan shell untuk seluruh area yang butuh akun, dipasang sekali di
 * layout (aplikasi).
 *
 * Penjaga ini sisi klien, bukan middleware, karena token hidup di
 * localStorage. Ini bukan lapisan keamanan: yang benar-benar menolak akses
 * adalah guard di backend. Fungsinya mengarahkan orang ke tempat yang benar.
 *
 * Navigasi mengikuti peran yang sedang masuk, bukan rute, jadi mahasiswa yang
 * membuka /kontrak tetap melihat sidebar mahasiswa dan shell tidak dibongkar.
 */
export function ShellAplikasi({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, siap } = useSesi();
  const { t } = useBahasa();
  const p = t.komponen.penjaga;

  /* Sesi dibaca ulang di dalam efek, bukan dari snapshot render: snapshot
     server selalu null, dan pada render hidrasi pertama nilai itulah yang
     dipakai. Kalau efek memercayainya, setiap pengguna yang sudah masuk akan
     dilempar ke halaman login begitu halaman dimuat ulang. */
  /* adaSesi ikut jadi dependensi supaya sesi yang dicabut di tengah jalan
     (refresh token ditolak server) langsung mengarahkan ke halaman masuk,
     bukan menunggu pengguna berpindah halaman sendiri dari layar "butuh akun". */
  const adaSesi = session !== null;
  useEffect(() => {
    if (readSession() === null && !sedangKeluar()) {
      /* Rute panel punya pintu masuknya sendiri: halaman masuk biasa membingkai
         produk untuk mahasiswa dan usaha, bukan untuk pengurus platform. */
      const pintu = pathname.startsWith("/admin") ? "/masuk/admin" : "/masuk";
      router.replace(`${pintu}?lanjut=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, adaSesi]);

  /* Status akun (terverifikasi, dibekukan) disegarkan saat berpindah halaman,
     paling sering sekali per menit. */
  useEffect(() => {
    void segarkanSesi();
  }, [pathname]);

  /* Izin admin menentukan menu yang tampil. Backend tetap menolak endpoint
     yang tidak diizinkan; menu hanya berhenti menawarkan pintu yang terkunci. */
  const perannya = session?.user.role;
  const [akses, setAkses] = useState<{ untuk: string; nilai: AksesAdmin } | null>(null);
  useEffect(() => {
    if (perannya !== "admin" || USE_MOCK || !session) return;
    let batal = false;
    adminApi
      .me()
      .then((nilai) => !batal && setAkses({ untuk: session.user.id, nilai }))
      .catch(() => {
        /* Tidak terbaca: menu lengkap, backend yang menjaga. */
      });
    return () => {
      batal = true;
    };
  }, [perannya, session]);

  if (!siap) return <SkeletonCard lines={3} label={t.komponen.memuatAkun} />;

  if (!session) {
    return (
      <EmptyState
        icon="Lock"
        title={p.butuhAkun}
        description={p.mengarahkan}
        action={<Button href="/masuk">{p.masukSekarang}</Button>}
      />
    );
  }

  const role = session.user.role;
  const perlu = peranUntuk(pathname);
  let isi: ReactNode = children;
  const aksesAdmin = role === "admin" && akses?.untuk === session.user.id ? akses.nilai : null;
  const boleh = (href: string) => {
    if (!aksesAdmin || aksesAdmin.penuh) return true;
    const izin = izinUntukRute(href);
    return !izin || (aksesAdmin.izin as string[]).includes(izin);
  };
  const saring = <T extends SidebarEntry>(daftar: T[]): T[] => {
    const hasil = daftar.filter((x) => !("href" in x) || boleh(x.href));
    // Judul seksi yang tidak lagi punya isi ikut dibuang.
    return hasil.filter((x, i) => !("section" in x) || (hasil[i + 1] !== undefined && !("section" in hasil[i + 1])));
  };

  if (perlu && perlu !== role) {
    isi = (
      <EmptyState
        icon="Ban"
        title={p.untukPeran(t.umum.peran[perlu].toLowerCase())}
        description={p.salahPeran(t.umum.peran[role].toLowerCase())}
        action={<Button href={BERANDA_PERAN[role]}>{p.keBeranda}</Button>}
      />
    );
  } else if (role === "admin" && perlu === "admin" && !boleh(pathname)) {
    isi = (
      <EmptyState
        icon="Lock"
        title={t.fitur.peranAdmin.tanpaAksesJudul}
        description={t.fitur.peranAdmin.tanpaAksesIsi}
        action={<Button href="/admin">{p.keBeranda}</Button>}
      />
    );
  } else if (!perlu && role === "admin" && !UNTUK_SEMUA.includes(pathname)) {
    isi = (
      <EmptyState
        icon="Ban"
        title={p.bukanAdmin}
        description={p.bukanAdminIsi}
        action={<Button href="/admin">{p.bukaAdmin}</Button>}
      />
    );
  }

  return (
    <AppShell
      session={session}
      sidebar={saring(NAV[role].sidebar)}
      bottom={saring(NAV[role].bottom)}
      topbarExtra={<LoncengNotifikasi />}
    >
      {/* Akun yang dibekukan saat sedang masuk: sesi refresh sudah dicabut
          backend, tetapi access token berlaku sampai satu jam. Selama itu
          pengguna diberi tahu dan diarahkan ke banding. */}
      {session.user.is_suspended && role !== "admin" ? (
        <VerificationBanner
          status="disuspend"
          role={role}
          reason={session.user.suspension_reason ?? undefined}
          href="/banding"
        />
      ) : null}
      {isi}
    </AppShell>
  );
}
