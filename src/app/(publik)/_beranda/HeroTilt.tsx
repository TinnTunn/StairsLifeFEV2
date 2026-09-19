"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./beranda-hero.module.css";

/**
 * Kartu hero miring 3D mengikuti kursor di seluruh area hero, seperti
 * landing.js V2. Hanya untuk pointer presisi; di layar sentuh dan saat
 * gerak diredam, kartunya tetap diam.
 */
export function HeroTilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const area = el?.closest("section");
    if (!el || !area) return;
    const boleh = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!boleh.matches) return;

    let frame = 0;
    const gerak = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--miring-x", `${(-y * 7).toFixed(2)}deg`);
        el.style.setProperty("--miring-y", `${(x * 7).toFixed(2)}deg`);
      });
    };
    const lepas = () => {
      cancelAnimationFrame(frame);
      el.style.removeProperty("--miring-x");
      el.style.removeProperty("--miring-y");
    };

    area.addEventListener("pointermove", gerak);
    area.addEventListener("pointerleave", lepas);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener("pointermove", gerak);
      area.removeEventListener("pointerleave", lepas);
    };
  }, []);

  return (
    <div ref={ref} className={styles.stage}>
      {children}
    </div>
  );
}
