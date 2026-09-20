// Hook pemuat data asinkron beserta cache dan muat ulangnya.

"use client";

import { useCallback, useEffect, useState } from "react";
import { teksGalat } from "@/i18n/aktif";
import { readSession } from "./api/session";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, unknown>();
let pemilikCache: string | null = null;

if (typeof window !== "undefined") {
  pemilikCache = readSession()?.user.id ?? null;
  window.addEventListener("stairslife-session-change", () => {
    const id = readSession()?.user.id ?? null;
    if (id !== pemilikCache) {
      cache.clear();
      pemilikCache = id;
    }
  });
}

export function bersihkanCacheData(): void {
  cache.clear();
}

function tandaDeps(deps: unknown[]): string {
  try {
    return JSON.stringify(deps);
  } catch {
    return String(deps.length);
  }
}

type StateBertanda<T> = AsyncState<T> & { tanda: string };

export function useAsync<T>(
  load: () => Promise<T>,
  deps: unknown[],
  kunciCache?: string,
): AsyncState<T> & { muatUlang: () => void } {
  const tanda = tandaDeps(deps);
  const kunci = kunciCache ? `${readSession()?.user.id ?? "anon"}:${kunciCache}:${tanda}` : null;

  const [state, setState] = useState<StateBertanda<T>>(() => {
    const tersimpan = kunci && cache.has(kunci) ? (cache.get(kunci) as T) : undefined;
    return tersimpan !== undefined
      ? { tanda, data: tersimpan, loading: false, error: null }
      : { tanda, data: null, loading: true, error: null };
  });
  const [versi, setVersi] = useState(0);
  const muatUlang = useCallback(() => setVersi((v) => v + 1), []);

  useEffect(() => {
    let batal = false;
    load()
      .then((data) => {
        if (batal) return;
        if (kunci) cache.set(kunci, data);
        setState({ tanda, data, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (batal) return;
        setState((lama) =>
          lama.tanda === tanda && lama.data !== null && kunci
            ? lama
            : { tanda, data: null, loading: false, error: e instanceof Error ? e.message : teksGalat().umum },
        );
      });
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tanda, versi]);

  if (state.tanda !== tanda) {
    const tersimpan = kunci && cache.has(kunci) ? (cache.get(kunci) as T) : undefined;
    const tampil: AsyncState<T> =
      tersimpan !== undefined
        ? { data: tersimpan, loading: false, error: null }
        : { data: null, loading: true, error: null };
    return { ...tampil, muatUlang };
  }

  return { data: state.data, loading: state.loading, error: state.error, muatUlang };
}
