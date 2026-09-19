import React from "react";

/** Format nominal rupiah gaya StairsLife: "Rp 2.500.000" (titik ribuan, spasi setelah Rp). */
export function formatRupiah(value, { withPrefix = true, sign = false } = {}) {
  const n = Math.abs(Number(value) || 0);
  const body = n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
  const s = sign ? (Number(value) < 0 ? "−" : "+") + " " : "";
  return s + (withPrefix ? "Rp " : "") + body;
}

const TONE = {
  default: "var(--text-strong)",
  in: "var(--money-in)",
  out: "var(--money-out)",
  held: "var(--money-held)",
  muted: "var(--text-muted)",
};

const SIZE = {
  sm: "var(--text-money-sm)",
  md: "var(--text-money)",
  lg: "var(--text-money-lg)",
};

export function Money({ value, size = "md", tone = "default", sign = false, label, style, ...rest }) {
  const text = typeof value === "string" ? value : formatRupiah(value, { sign });
  return (
    <span {...rest} style={{ display: "inline-flex", flexDirection: label ? "column" : "row", gap: label ? "2px" : 0, ...style }}>
      {label && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", fontWeight: "var(--weight-regular)", letterSpacing: 0 }}>{label}</span>}
      <span className="sl-money" style={{ fontSize: SIZE[size] || SIZE.md, color: TONE[tone] || TONE.default, whiteSpace: "nowrap" }}>{text}</span>
    </span>
  );
}
