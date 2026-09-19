import React from "react";

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 };

function initials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, src, size = "md", verified = false, online = false, shape = "circle", style, ...rest }) {
  const px = SIZES[size] || SIZES.md;
  const fontSize = px <= 24 ? 10 : px <= 32 ? 12 : px <= 40 ? 14 : px <= 56 ? 18 : 24;
  return (
    <span {...rest} style={{ position: "relative", display: "inline-flex", flex: "none", ...style }}>
      <span
        title={name}
        style={{
          width: px, height: px, display: "grid", placeItems: "center", overflow: "hidden",
          borderRadius: shape === "circle" ? "var(--radius-full)" : "var(--radius-md)",
          background: src ? "var(--bg-sunken)" : "var(--primary-soft)",
          color: "var(--primary-text)", fontSize, fontWeight: "var(--weight-semibold)",
          letterSpacing: "0.01em", border: "var(--border-width) solid var(--border-subtle)",
        }}
      >
        {src ? <img src={src} alt={name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(name)}
      </span>
      {verified && (
        <span title="Terverifikasi" style={{ position: "absolute", right: -2, bottom: -2, width: Math.max(14, px * 0.34), height: Math.max(14, px * 0.34), display: "grid", placeItems: "center", background: "var(--success)", borderRadius: "var(--radius-full)", border: "2px solid var(--bg-surface)" }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width={Math.max(8, px * 0.2)} height={Math.max(8, px * 0.2)} fill="none" stroke="var(--text-on-success)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
      )}
      {online && !verified && (
        <span title="Sedang aktif" style={{ position: "absolute", right: 0, bottom: 0, width: Math.max(9, px * 0.24), height: Math.max(9, px * 0.24), background: "var(--success)", borderRadius: "var(--radius-full)", border: "2px solid var(--bg-surface)" }} />
      )}
    </span>
  );
}

export function AvatarGroup({ people = [], size = "sm", max = 4, style }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const px = SIZES[size] || SIZES.sm;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", ...style }}>
      {shown.map((p, i) => (
        <span key={(p.name || "") + i} style={{ marginLeft: i === 0 ? 0 : -px * 0.3, borderRadius: "var(--radius-full)", boxShadow: "0 0 0 2px var(--bg-surface)" }}>
          <Avatar name={p.name} src={p.src} size={size} />
        </span>
      ))}
      {rest > 0 && (
        <span className="sl-tabular" style={{ marginLeft: -px * 0.3, width: px, height: px, display: "grid", placeItems: "center", borderRadius: "var(--radius-full)", background: "var(--bg-sunken)", color: "var(--text-muted)", fontSize: px <= 32 ? 11 : 13, fontWeight: "var(--weight-semibold)", boxShadow: "0 0 0 2px var(--bg-surface)" }}>
          +{rest}
        </span>
      )}
    </span>
  );
}
