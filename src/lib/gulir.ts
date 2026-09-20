// Pengelola penguncian gulir halaman saat lapisan atas terbuka.

"use client";

import { usePathname } from "next/navigation";
import { useEffect, type RefObject } from "react";

const KUNCI_SIMPAN = "sl-posisi-gulir";
const BATAS_TUNGGU = 3000;
const KUNCI_TRANSISI = 5000;
const BATAS_MUAT = 15000;

let popstate: { kunci: string; dipakai: Set<string> } | null = null;
const posisi = new Map<string, number>();
const penyimpan = new Set<() => void>();
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

  window.history.scrollRestoration = "manual";
  window.addEventListener("popstate", () => {
    simpanSemua();
    pulihMuat.clear();
    popstate = { kunci: kunciSekarang(), dipakai: new Set() };
  });
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
    const dariRiwayat = lewatPopstate || (pulihMuat.has(e.ruang) && performance.now() < BATAS_MUAT);

    let batal = false;
    const selesai = () => {
      penanda?.dipakai.add(e.ruang);
      pulihMuat.delete(e.ruang);
    };
    const berhenti = () => {
      batal = true;
      selesai();
    };
    const interaksi = ["wheel", "touchstart", "keydown"] as const;

    if (dariRiwayat) {
      const tujuan = posisi.get(kunci) ?? 0;
      interaksi.forEach((n) => window.addEventListener(n, berhenti, { once: true, passive: true }));
      const mulai = Date.now();
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

export function PengelolaGulirJendela() {
  useKelolaGulir("jendela");
  return null;
}
