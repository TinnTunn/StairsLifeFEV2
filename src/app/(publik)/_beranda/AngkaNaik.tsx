// Animasi angka yang menghitung naik saat terlihat.

"use client";

import { useEffect, useRef, useState } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { LOCALE } from "@/i18n/jenis";

export function AngkaNaik({ nilai, awalan = "", akhiran = "" }: { nilai: number; awalan?: string; akhiran?: string }) {
  const { bahasa } = useBahasa();
  const ref = useRef<HTMLSpanElement>(null);
  const [tampil, setTampil] = useState(nilai);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window) || nilai === 0) return;

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const mulai = performance.now();
        const durasi = 1200;
        const langkah = (sekarang: number) => {
          const p = Math.min((sekarang - mulai) / durasi, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setTampil(Math.round(nilai * eased));
          if (p < 1) frame = requestAnimationFrame(langkah);
        };
        setTampil(0);
        frame = requestAnimationFrame(langkah);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [nilai]);

  const format = (n: number) => n.toLocaleString(LOCALE[bahasa]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {awalan}
        {format(tampil)}
        {akhiran}
      </span>
      <span className="sl-visually-hidden">
        {awalan}
        {format(nilai)}
        {akhiran}
      </span>
    </span>
  );
}
