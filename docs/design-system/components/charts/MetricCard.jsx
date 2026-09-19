import React from "react";

/** Kartu metrik: label, angka besar, dan tren dibanding periode sebelumnya. */
export function MetricCard({ label, value, delta, deltaLabel = "dari bulan lalu", icon, iconTone = "primary", invertDelta = false, deltaTone, style, ...rest }) {
  const up = typeof delta === "number" ? delta > 0 : String(delta || "").startsWith("+");
  // Naik tidak selalu berarti baik: untuk metrik seperti "sengketa terbuka",
  // turun adalah kabar bagus. invertDelta membalik pewarnaannya; deltaTone
  // memaksanya secara eksplisit.
  const baik = deltaTone ? deltaTone === "success" : invertDelta ? !up : up;
  const warnaDelta = deltaTone === "neutral" ? "var(--text-muted)" : baik ? "var(--success-text)" : "var(--danger-text)";
  const tones = {
    primary: { bg: "var(--primary-soft)", fg: "var(--primary-text)" },
    success: { bg: "var(--success-soft)", fg: "var(--success-text)" },
    warning: { bg: "var(--warning-soft)", fg: "var(--warning-text)" },
    neutral: { bg: "var(--bg-sunken)", fg: "var(--text-muted)" },
  };
  const t = tones[iconTone] || tones.primary;
  return (
    <div {...rest} style={{
      display: "flex", gap: 14, alignItems: "flex-start", justifyContent: "space-between",
      padding: "var(--pad-card)", background: "var(--bg-surface)",
      border: "var(--border-width) solid var(--border-subtle)", borderRadius: "var(--radius-lg)", ...style,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <span className="sl-overline">{label}</span>
        <b style={{ fontFamily: "var(--font-sans)", fontVariantNumeric: "tabular-nums", fontSize: "var(--text-money-lg)", fontWeight: "var(--weight-bold)", letterSpacing: "-0.01em", color: "var(--text-strong)", lineHeight: 1.1, whiteSpace: "nowrap" }}>{value}</b>
        {delta !== undefined && (
          // alignItems flex-start, BUKAN center: begitu label tren membungkus ke
          // dua baris, center menempatkan panah 13px di tengah blok 36px — ia
          // lepas dari angkanya dan menggantung di celah antar baris.
          <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: warnaDelta, display: "flex", alignItems: "flex-start", gap: 5 }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2, transform: up ? "none" : "rotate(180deg)" }}>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span style={{ minWidth: 0 }}>
              <b style={{ fontWeight: "var(--weight-semibold)", whiteSpace: "nowrap" }}>{typeof delta === "number" ? (up ? "+" : "−") + Math.abs(delta) + "%" : delta}</b> {deltaLabel}
            </span>
          </span>
        )}
      </div>
      {icon && (
        <span style={{ width: 40, height: 40, flex: "none", display: "grid", placeItems: "center", background: t.bg, color: t.fg, borderRadius: "var(--radius-md)" }}>{icon}</span>
      )}
    </div>
  );
}
