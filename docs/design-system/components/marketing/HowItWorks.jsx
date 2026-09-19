import React, { useEffect, useRef, useState } from "react";

/**
 * Penjelas alur bertahap. Ditulis ulang dari pola "How It Works" 21st.dev
 * dengan token StairsLife — tanpa glow, tanpa gradasi, tanpa framer-motion.
 */
export function HowItWorks({
  steps = [], autoPlay = true, interval = 4200, orientation = "horizontal", style, ...rest
}) {
  const [aktif, setAktif] = useState(0);
  const [jeda, setJeda] = useState(false);
  const timer = useRef(null);
  const n = steps.length;
  const vertikal = orientation === "vertical";

  // prefers-reduced-motion mematikan auto-play SEKALIGUS transisi bilah.
  // Durasi bilah adalah angka milidetik dari prop, jadi token --duration-*
  // yang di-nol-kan di motion.css tidak bisa menjangkaunya — pengecekannya
  // harus di sini.
  const [redam, setRedam] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRedam(mq.matches);
    const ubah = (e) => setRedam(e.matches);
    mq.addEventListener("change", ubah);
    return () => mq.removeEventListener("change", ubah);
  }, []);
  const jalan = autoPlay && !redam;

  useEffect(() => {
    if (!jalan || jeda || n < 2) return;
    timer.current = setTimeout(() => setAktif((i) => (i + 1) % n), interval);
    return () => clearTimeout(timer.current);
  }, [jalan, jeda, aktif, interval, n]);

  if (!n) return null;
  const s = steps[aktif];

  return (
    <div {...rest} onMouseEnter={() => setJeda(true)} onMouseLeave={() => setJeda(false)}
      style={{ display: "flex", flexDirection: "column", gap: 22, ...style }}>
      <ol style={{
        listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10,
        gridTemplateColumns: vertikal ? "minmax(0,1fr)" : "repeat(auto-fit,minmax(210px,1fr))",
      }}>
        {steps.map((x, i) => {
          const on = i === aktif;
          const lewat = i < aktif;
          return (
            <li key={x.label}>
              <button type="button" onClick={() => setAktif(i)} aria-current={on}
                style={{
                  width: "100%", minHeight: 88, display: "flex", flexDirection: "column", gap: 8,
                  padding: "15px 16px", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-sans)",
                  background: on ? "var(--bg-surface)" : "transparent",
                  border: "var(--border-width) solid " + (on ? "var(--primary-border)" : "var(--border-subtle)"),
                  borderRadius: "var(--radius-lg)", transition: "var(--transition-color)",
                }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    flex: "none", width: 26, height: 26, display: "grid", placeItems: "center",
                    borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700,
                    fontVariantNumeric: "tabular-nums", transition: "var(--transition-color)",
                    background: on ? "var(--primary)" : lewat ? "var(--primary-soft)" : "var(--bg-sunken)",
                    color: on ? "var(--text-on-primary)" : lewat ? "var(--primary-text)" : "var(--text-subtle)",
                  }}>{i + 1}</span>
                  <b style={{
                    flex: 1, minWidth: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-h3)",
                    letterSpacing: "-0.015em", lineHeight: "var(--leading-snug)",
                    color: on ? "var(--text-strong)" : "var(--text-muted)",
                  }}>{x.label}</b>
                </span>
                <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{x.short}</span>
                {/* Bilah kemajuan menggantikan glow: menunjukkan sisa waktu tanpa menambah warna baru */}
                <span aria-hidden="true" style={{ display: "block", height: 3, borderRadius: "var(--radius-full)", background: "var(--bg-sunken)", overflow: "hidden" }}>
                  <span style={{
                    display: "block", height: "100%", background: "var(--primary)",
                    width: on ? "100%" : lewat ? "100%" : "0%",
                    opacity: on ? 1 : lewat ? 0.4 : 0,
                    transition: on && jalan && !jeda ? "width " + interval + "ms linear" : "width var(--duration-fast) var(--ease-out)",
                  }} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div style={{
        display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap",
        padding: "var(--pad-card)", background: "var(--bg-surface)",
        border: "var(--border-width) solid var(--border-subtle)", borderRadius: "var(--radius-lg)",
      }}>
        {s.icon && (
          <span style={{
            flex: "none", width: 46, height: 46, display: "grid", placeItems: "center",
            borderRadius: "var(--radius-md)", background: "var(--primary-soft)", color: "var(--primary-text)",
          }}>{s.icon}</span>
        )}
        <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 7 }}>
          <span className="sl-overline">Langkah {aktif + 1} dari {n}</span>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)", letterSpacing: "-0.02em", color: "var(--text-strong)" }}>{s.label}</h3>
          <p style={{ fontSize: "var(--text-body)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", maxWidth: "62ch" }}>{s.body}</p>
          {s.note && (
            <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)", paddingTop: 4 }}>{s.note}</span>
          )}
        </div>
        {s.aside}
      </div>
    </div>
  );
}
