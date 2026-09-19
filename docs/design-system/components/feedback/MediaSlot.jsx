import React from "react";

const SIZES = {
  sm: { icon: 20, pad: 14, gap: 6 },
  md: { icon: 28, pad: 20, gap: 8 },
  lg: { icon: 36, pad: 26, gap: 10 },
};

/**
 * Tempat gambar yang belum ada isinya — portofolio, logo bisnis, KTM,
 * kode QRIS, bukti transfer, pratinjau CV. Ikon besar + satu baris ramah,
 * bukan kotak putus-putus yang terlihat seperti kesalahan muat.
 */
export function MediaSlot({
  icon, label, hint, action, ratio = "4 / 3", size = "md", tone = "neutral", style, ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const t = tone === "primary"
    ? { bg: "var(--primary-soft)", fg: "var(--primary-text)", bd: "var(--primary-border)" }
    : { bg: "var(--bg-subtle)", fg: "var(--text-subtle)", bd: "var(--border-subtle)" };

  return (
    <div {...rest} style={{
      aspectRatio: ratio, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: s.gap, padding: s.pad, textAlign: "center",
      background: t.bg, border: "var(--border-width) solid " + t.bd,
      borderRadius: "var(--radius-md)", overflow: "hidden", ...style,
    }}>
      <span aria-hidden="true" style={{
        width: s.icon + 18, height: s.icon + 18, flex: "none", display: "grid", placeItems: "center",
        borderRadius: "var(--radius-full)", background: "var(--bg-surface)", color: t.fg,
      }}>{icon}</span>
      {label && (
        <b style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)", lineHeight: "var(--leading-snug)" }}>{label}</b>
      )}
      {hint && (
        <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)", maxWidth: "34ch" }}>{hint}</span>
      )}
      {action}
    </div>
  );
}
