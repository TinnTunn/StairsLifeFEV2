import React, { useEffect, useRef, useState } from "react";

const TONES = {
  primary: ["var(--primary-soft)", "var(--primary-text)"],
  success: ["var(--success-soft)", "var(--success-text)"],
  warning: ["var(--warning-soft)", "var(--warning-text)"],
  danger: ["var(--danger-soft)", "var(--danger-text)"],
  neutral: ["var(--bg-sunken)", "var(--text-muted)"],
};

/**
 * Lonceng + panel notifikasi. Satu-satunya tempat kejadian penting berkumpul:
 * perubahan status lamaran, keputusan moderasi, pembayaran, pesan baru.
 */
export function NotificationCenter({
  items = [], onOpenItem, onMarkAllRead, onSeeAll, live = false, label = "Notifikasi", align = "right", style, ...rest
}) {
  const [buka, setBuka] = useState(false);
  const [dibaca, setDibaca] = useState([]);
  const [masuk, setMasuk] = useState(null);
  const wrap = useRef(null);

  const belum = items.filter((n) => n.unread && !dibaca.includes(n.id));

  useEffect(() => {
    if (!buka) return;
    const luar = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setBuka(false); };
    const esc = (e) => { if (e.key === "Escape") setBuka(false); };
    document.addEventListener("mousedown", luar);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", luar); document.removeEventListener("keydown", esc); };
  }, [buka]);

  // Sorot sesaat item terbaru agar kedatangan notifikasi terasa, tanpa
  // memindahkan apa pun di layar.
  useEffect(() => {
    if (!live || !items.length) return;
    const id = items[0].id;
    setMasuk(id);
    const t = setTimeout(() => setMasuk(null), 1400);
    return () => clearTimeout(t);
  }, [live, items.length, items[0] && items[0].id]);

  const tandai = (n) => {
    setDibaca((v) => (v.includes(n.id) ? v : [...v, n.id]));
    if (onOpenItem) onOpenItem(n);
    setBuka(false);
  };

  return (
    <div ref={wrap} {...rest} style={{ position: "relative", flex: "none", ...style }}>
      <button
        type="button" aria-label={belum.length ? label + ", " + belum.length + " belum dibaca" : label}
        aria-expanded={buka} onClick={() => setBuka((v) => !v)}
        style={{
          position: "relative", width: 44, height: 44, display: "grid", placeItems: "center",
          background: buka ? "var(--bg-hover)" : "transparent", border: 0,
          borderRadius: "var(--radius-md)", color: buka ? "var(--text-strong)" : "var(--text-muted)",
          cursor: "pointer", transition: "var(--transition-color)", WebkitTapHighlightColor: "transparent",
        }}
      >
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a2 2 0 0 0 3.4 0" />
        </svg>
        {belum.length > 0 && (
          <span aria-hidden="true" style={{
            position: "absolute", top: 9, right: 9, width: 7, height: 7,
            borderRadius: "var(--radius-full)", background: "var(--primary)",
            boxShadow: "0 0 0 2px var(--bg-surface)",
          }} />
        )}
      </button>

      {buka && (
        <div role="dialog" aria-label={label} style={{
          position: "absolute", top: "calc(100% + 6px)", [align]: 0, zIndex: 40,
          width: "min(380px, calc(100vw - 32px))", maxHeight: 460, display: "flex", flexDirection: "column",
          background: "var(--bg-surface)", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", overflow: "hidden",
          animation: "sl-rise var(--duration-fast) var(--ease-out)",
        }}>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
            <b style={{ flex: 1, minWidth: 0, fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
              {label}{belum.length > 0 ? " · " + belum.length + " baru" : ""}
            </b>
            {belum.length > 0 && (
              <button type="button" onClick={() => { setDibaca(items.map((n) => n.id)); if (onMarkAllRead) onMarkAllRead(); }}
                style={{ minHeight: 32, padding: "0 8px", border: 0, background: "transparent", color: "var(--primary-text)", fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                Tandai dibaca
              </button>
            )}
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 6 }}>
            {items.length === 0 ? (
              <div style={{ padding: "28px 20px", textAlign: "center", display: "flex", flexDirection: "column", gap: 6 }}>
                <b style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", color: "var(--text-strong)" }}>Belum ada notifikasi</b>
                <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>
                  Kami beri tahu saat ada perubahan status, pesan baru, atau keputusan moderasi.
                </span>
              </div>
            ) : items.map((n) => {
              const baru = n.unread && !dibaca.includes(n.id);
              const [bg, fg] = TONES[n.tone] || TONES.neutral;
              return (
                <button key={n.id} type="button" onClick={() => tandai(n)}
                  style={{
                    width: "100%", minHeight: 56, display: "flex", gap: 11, alignItems: "flex-start",
                    padding: "11px 12px", marginBottom: 2, textAlign: "left", cursor: "pointer",
                    fontFamily: "var(--font-sans)", border: 0, borderRadius: "var(--radius-md)",
                    background: n.id === masuk ? "var(--primary-soft)" : baru ? "var(--bg-subtle)" : "transparent",
                    transition: "background var(--duration-slow) var(--ease-out)",
                  }}>
                  <span style={{ flex: "none", width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: "var(--radius-sm)", background: bg, color: fg }}>
                    {n.icon}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <b style={{ fontSize: "var(--text-body-sm)", fontWeight: baru ? "var(--weight-semibold)" : "var(--weight-medium)", color: "var(--text-strong)", lineHeight: "var(--leading-snug)" }}>{n.title}</b>
                    {n.description && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{n.description}</span>}
                    <span style={{ fontSize: "var(--text-caption)", color: "var(--text-subtle)" }}>{n.time}</span>
                  </span>
                  {baru && <span aria-hidden="true" style={{ flex: "none", width: 6, height: 6, marginTop: 6, borderRadius: "var(--radius-full)", background: "var(--primary)" }} />}
                </button>
              );
            })}
          </div>

          {onSeeAll && items.length > 0 && (
            <button type="button" onClick={() => { onSeeAll(); setBuka(false); }}
              style={{ flex: "none", minHeight: 44, border: 0, borderTop: "1px solid var(--border-subtle)", background: "transparent", color: "var(--primary-text)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", cursor: "pointer" }}>
              Lihat semua notifikasi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
