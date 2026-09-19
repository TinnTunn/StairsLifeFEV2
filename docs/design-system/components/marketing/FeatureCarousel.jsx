import React, { useEffect, useRef, useState } from "react";

/**
 * Karosel kategori: chip yang bisa diklik + satu panel isi. Ditulis ulang dari
 * pola feature carousel 21st.dev dengan token StairsLife. Bedanya dari
 * aslinya: tidak ada kartu 3D bertumpuk. Kartu yang tersembunyi di belakang
 * membuat isi tidak terjangkau — di sini semua kategori selalu terlihat
 * sebagai chip, dan hanya panelnya yang berganti.
 */
export function FeatureCarousel({
  items = [], autoPlay = true, interval = 3600, columns = "auto", style, ...rest
}) {
  const [aktif, setAktif] = useState(0);
  const [jeda, setJeda] = useState(false);
  const timer = useRef(null);
  const n = items.length;

  const [redam, setRedam] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRedam(mq.matches);
    const ubah = (e) => setRedam(e.matches);
    mq.addEventListener("change", ubah);
    return () => mq.removeEventListener("change", ubah);
  }, []);

  useEffect(() => {
    if (!autoPlay || redam || jeda || n < 2) return;
    timer.current = setTimeout(() => setAktif((i) => (i + 1) % n), interval);
    return () => clearTimeout(timer.current);
  }, [autoPlay, redam, jeda, aktif, interval, n]);

  if (!n) return null;
  const it = items[aktif];

  return (
    <div {...rest} onMouseEnter={() => setJeda(true)} onMouseLeave={() => setJeda(false)}
      style={{ display: "flex", flexDirection: "column", gap: 16, ...style }}>
      <div role="tablist" aria-label="Kategori" style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {items.map((x, i) => {
          const on = i === aktif;
          return (
            <button key={x.id} type="button" role="tab" aria-selected={on} onClick={() => setAktif(i)}
              style={{
                minHeight: 40, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 14px",
                cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)",
                fontWeight: on ? "var(--weight-semibold)" : "var(--weight-medium)",
                background: on ? "var(--primary-soft)" : "var(--bg-surface)",
                border: "var(--border-width) solid " + (on ? "var(--primary-border)" : "var(--border-default)"),
                color: on ? "var(--primary-text)" : "var(--text-muted)",
                borderRadius: "var(--radius-md)", transition: "var(--transition-color)", whiteSpace: "nowrap",
              }}>
              {x.icon && <span style={{ flex: "none", display: "flex", color: on ? "var(--primary)" : "var(--text-subtle)" }}>{x.icon}</span>}
              {x.label}
              {x.count !== undefined && (
                <span className="sl-tabular" style={{
                  fontSize: "var(--text-caption)",
                  // TANPA opacity: --primary-text di atas --primary-soft sudah
                  // 5,59:1 pada kekuatan penuh, tapi jatuh ke 3,78:1 begitu
                  // diredam alpha. Pembedaan dari label sebelahnya datang dari
                  // ukuran dan angka tabular, bukan dari transparansi.
                  color: on ? "var(--primary-text)" : "var(--text-subtle)",
                }}>{x.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div key={it.id} style={{
        display: "grid",
        // Track kedua hanya dibuat bila item BENAR-BENAR punya aside. Deklarasi
        // tanpa syarat menyisakan 220px kosong dan memeras kolom teks — pola
        // yang sudah ditangani benar oleh HowItWorks lewat flexWrap.
        gridTemplateColumns: columns === "auto" && it.aside ? "minmax(0,1fr) minmax(0,220px)" : "minmax(0,1fr)",
        gap: 18, alignItems: "center", padding: "var(--pad-card)",
        background: "var(--bg-surface)", border: "var(--border-width) solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        animation: "sl-fade var(--duration-base) var(--ease-out)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <span className="sl-overline">{it.eyebrow || "Kategori"}</span>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", letterSpacing: "-0.02em", color: "var(--text-strong)" }}>{it.title || it.label}</h3>
          <p style={{ fontSize: "var(--text-body)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", maxWidth: "58ch" }}>{it.body}</p>
          {it.meta && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 6 }}>
              {it.meta.map((m) => (
                <span key={m.label} style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                  <b className="sl-tabular" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-money)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)", lineHeight: 1.15 }}>{m.value}</b>
                  <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{m.label}</span>
                </span>
              ))}
            </div>
          )}
          {it.action}
        </div>
        {columns === "auto" && it.aside}
      </div>
    </div>
  );
}
