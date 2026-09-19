"use client";

import { useEffect, useRef } from "react";
import type { ItemGalat } from "@/lib/useGalatKolom";
import { Icon } from "../actions/Icon";

/**
 * Ringkasan galat formulir yang digulir ke tengah layar dan menerima fokus
 * setiap kali isinya berubah. Tanpa ini, pesan di atas formulir panjang tetap
 * di luar layar setelah tombol kirim di bawah ditekan, dan pengguna mengira
 * tidak terjadi apa-apa.
 *
 * Pesan yang terkait kolom menjadi tautan: menekannya memindahkan fokus ke
 * kolom itu, sementara pesan yang sama juga tampil di bawah kolomnya.
 */
export function RingkasanGalat({
  pesan,
  className,
  barisClassName,
}: {
  pesan: Array<string | ItemGalat>;
  className?: string;
  barisClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const item = pesan.map((p) => (typeof p === "string" ? { teks: p } : p));
  const kunci = item.map((p) => p.teks).join("|");

  useEffect(() => {
    const el = ref.current;
    if (!el || !kunci) return;
    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: kurangiGerak ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  }, [kunci]);

  if (item.length === 0) return null;

  function keKolom(id: string) {
    const kolom = document.getElementById(id);
    if (!kolom) return;
    kolom.scrollIntoView({ block: "center" });
    kolom.focus({ preventScroll: true });
  }

  return (
    <div ref={ref} className={className} role="alert" tabIndex={-1}>
      <Icon name="AlertTriangle" size={18} />
      <span>
        {item.map((m) => (
          <span key={m.teks} className={barisClassName}>
            {m.kolom ? (
              <a
                href={`#${m.kolom}`}
                onClick={(e) => {
                  e.preventDefault();
                  keKolom(m.kolom as string);
                }}
              >
                {m.teks}
              </a>
            ) : (
              m.teks
            )}
          </span>
        ))}
      </span>
    </div>
  );
}
