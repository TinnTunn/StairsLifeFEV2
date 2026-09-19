"use client";

import { useEffect } from "react";

/**
 * Menggeser elemen [data-parallax] mengikuti posisi scroll, seperti orb hero
 * di landing.js V2. Nilai atributnya adalah kecepatan: negatif naik, positif
 * turun. Dimatikan saat prefers-reduced-motion.
 */
export function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elemen = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (elemen.length === 0) return;

    let frame = 0;
    const perbarui = () => {
      const vh = window.innerHeight;
      for (const el of elemen) {
        const kecepatan = Number(el.dataset.parallax) || 0;
        const r = el.getBoundingClientRect();
        const geser = (r.top + r.height / 2 - vh / 2) * kecepatan;
        el.style.transform = `translate3d(0, ${geser.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(perbarui);
    };

    perbarui();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
