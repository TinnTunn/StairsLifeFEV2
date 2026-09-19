"use client";

import { usePathname } from "next/navigation";
import { useEffect, type RefObject } from "react";

/* Pengelola posisi gulir antarhalaman.
   - Navigasi maju (klik tautan, router.push): halaman baru selalu mulai dari atas.
     Perilaku bawaan Next tidak menjamin ini saat html memakai scroll-behavior
     smooth dan header lengket, jadi tautan dari footer sempat membuka halaman
     berikutnya di posisi bawah.
   - Back/Forward: posisi terakhir halaman itu dipulihkan, termasuk untuk
     kontainer gulir di dalam shell aplikasi yang tidak ditangani browser.

   Posisi dicatat dari event gulir dan dikunci tepat sebelum navigasi (klik
   tautan atau popstate). Setelah itu event gulir diabaikan: saat halaman
   berganti, browser memotong posisi ke tinggi halaman baru dan event itu akan
   menimpa posisi halaman lama.

   Pemulihan bawaan browser dimatikan (scrollRestoration manual). Browser
   memulihkan posisi sebelum Next selesai merender halaman tujuan, jadi
   hasilnya terpotong ke tinggi halaman yang masih lama. */

const KUNCI_SIMPAN = "sl-posisi-gulir";
const BATAS_TUNGGU = 3000;
const KUNCI_TRANSISI = 5000;
const BATAS_MUAT = 15000;

/* URL tujuan popstate terakhir, dipakai sekali per ruang gulir. Tidak memakai
   jendela waktu: halaman dinamis bisa butuh lebih dari satu detik sebelum
   pathname berganti. */
let popstate: { kunci: string; dipakai: Set<string> } | null = null;
const posisi = new Map<string, number>();
const penyimpan = new Set<() => void>();
/* Ruang gulir yang masih boleh dipulihkan setelah reload atau Back lintas
   dokumen. Dihapus saat posisi ditulis atau ada navigasi baru. */
const pulihMuat = new Set<string>();

function simpanSemua() {
  penyimpan.forEach((f) => f());
}

if (typeof window !== "undefined") {
  try {
    const tersimpan = JSON.parse(window.sessionStorage.getItem(KUNCI_SIMPAN) ?? "{}") as Record<string, number>;
    for (const [k, v] of Object.entries(tersimpan)) posisi.set(k, v);
  } catch {
    /* sessionStorage diblokir: posisi hanya diingat selama tab terbuka. */
  }
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === "reload" || nav?.type === "back_forward") {
    pulihMuat.add("jendela");
    pulihMuat.add("konten");
  }

  /* Listener modul terdaftar sebelum router Next, dan React belum merender
     halaman baru saat event ini berjalan, jadi posisi yang dibaca masih milik
     halaman lama. */
  window.history.scrollRestoration = "manual";
  window.addEventListener("popstate", () => {
    simpanSemua();
    pulihMuat.clear();
    popstate = { kunci: kunciSekarang(), dipakai: new Set() };
  });
  /* Reload dan pindah ke situs lain: simpan langsung, tanpa jeda. */
  window.addEventListener("pagehide", () => {
    penyimpan.forEach((f) => f());
    tulisPenyimpanan();
  });
  document.addEventListener(
    "click",
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.origin !== window.location.origin) return;
      if (a.pathname === window.location.pathname && a.search === window.location.search) return;
      simpanSemua();
      popstate = null;
      pulihMuat.clear();
    },
    true,
  );
}

function kunciSekarang(): string {
  return window.location.pathname + window.location.search;
}

function tulisPenyimpanan() {
  try {
    window.sessionStorage.setItem(KUNCI_SIMPAN, JSON.stringify(Object.fromEntries(posisi)));
  } catch {
    /* abaikan */
  }
}

let tundaSimpan: ReturnType<typeof setTimeout> | null = null;
function persisten() {
  if (tundaSimpan) return;
  tundaSimpan = setTimeout(() => {
    tundaSimpan = null;
    tulisPenyimpanan();
  }, 250);
}

type Target = "jendela" | RefObject<HTMLElement | null>;

interface Pengendali {
  ruang: string;
  baca: () => number;
  tulis: (y: number) => void;
  tinggi: () => number;
  sumber: EventTarget;
}

function pengendali(target: Target): Pengendali | null {
  if (target === "jendela") {
    return {
      ruang: "jendela",
      baca: () => window.scrollY,
      tulis: (y) => window.scrollTo({ top: y, behavior: "instant" }),
      tinggi: () => document.documentElement.scrollHeight - window.innerHeight,
      sumber: window,
    };
  }
  const el = target.current;
  if (!el) return null;
  return {
    ruang: "konten",
    baca: () => el.scrollTop,
    tulis: (y) => el.scrollTo({ top: y, behavior: "instant" }),
    tinggi: () => el.scrollHeight - el.clientHeight,
    sumber: el,
  };
}

export function useKelolaGulir(target: Target) {
  const pathname = usePathname();

  useEffect(() => {
    const e = pengendali(target);
    if (!e) return;

    /* Pada navigasi maju, efek ini bisa berjalan sebelum Next memperbarui URL,
       jadi path diambil dari usePathname dan query hanya dipakai bila URL
       sudah menunjuk halaman ini. */
    const search = window.location.pathname === pathname ? window.location.search : "";
    const kunci = `${e.ruang}:${pathname}${search}`;
    let transisiSampai = 0;
    const transisi = () => Date.now() < transisiSampai;

    const simpanSekarang = () => {
      if (!transisi()) posisi.set(kunci, e.baca());
      transisiSampai = Date.now() + KUNCI_TRANSISI;
      persisten();
    };
    penyimpan.add(simpanSekarang);

    const catat = () => {
      if (transisi() || `${e.ruang}:${kunciSekarang()}` !== kunci) return;
      posisi.set(kunci, e.baca());
      persisten();
    };
    e.sumber.addEventListener("scroll", catat, { passive: true });

    const penanda = popstate;
    const lewatPopstate = penanda !== null && `${e.ruang}:${penanda.kunci}` === kunci && !penanda.dipakai.has(e.ruang);
    /* Muat pertama setelah reload atau Back dari situs lain juga dipulihkan. */
    const dariRiwayat = lewatPopstate || (pulihMuat.has(e.ruang) && performance.now() < BATAS_MUAT);

    let batal = false;
    const selesai = () => {
      penanda?.dipakai.add(e.ruang);
      pulihMuat.delete(e.ruang);
    };
    /* Pengguna mulai menggulir sendiri sebelum isi siap: jangan ditarik balik. */
    const berhenti = () => {
      batal = true;
      selesai();
    };
    const interaksi = ["wheel", "touchstart", "keydown"] as const;

    if (dariRiwayat) {
      const tujuan = posisi.get(kunci) ?? 0;
      interaksi.forEach((n) => window.addEventListener(n, berhenti, { once: true, passive: true }));
      const mulai = Date.now();
      /* Isi halaman aplikasi dimuat setelah mount, jadi tunggu sampai cukup
         tinggi sebelum memulihkan posisi. setTimeout, bukan rAF, supaya tetap
         berjalan di tab yang sedang tidak terlihat. Percobaan pertama juga
         ditunda dan penanda popstate baru dipakai setelah posisi ditulis:
         StrictMode menjalankan efek dua kali saat mount, dan jalan pertama yang
         langsung dibatalkan tidak boleh menghabiskan penanda. */
      const coba = () => {
        if (batal) return;
        if (e.tinggi() >= tujuan || Date.now() - mulai > BATAS_TUNGGU) {
          e.tulis(Math.min(tujuan, Math.max(0, e.tinggi())));
          selesai();
          return;
        }
        setTimeout(coba, 50);
      };
      setTimeout(coba, 0);
    } else if (!window.location.hash) {
      e.tulis(0);
    }

    return () => {
      batal = true;
      penyimpan.delete(simpanSekarang);
      e.sumber.removeEventListener("scroll", catat);
      interaksi.forEach((n) => window.removeEventListener(n, berhenti));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}

/** Dipasang sekali di layout akar untuk gulir jendela (halaman publik). */
export function PengelolaGulirJendela() {
  useKelolaGulir("jendela");
  return null;
}
