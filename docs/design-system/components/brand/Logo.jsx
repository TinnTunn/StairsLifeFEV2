import React from "react";

const MARK = {
  teak: "logo-mark-wood.svg",
  walnut: "logo-mark-wood-walnut.svg",
};

// Varian datar dirender INLINE, bukan lewat <img>: seluruh gunanya adalah
// fill="currentColor", dan <img> tidak mewarisi color dari induknya — lewat
// <img> warnanya selalu jatuh ke hitam, yang tidak ada di palet.
function MarkDatar({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ display: "block", flex: "none" }}>
      <rect x="4" y="40" width="56" height="16" rx="2" fill="currentColor"></rect>
      <rect x="12" y="22" width="40" height="14" rx="2" fill="currentColor"></rect>
      <rect x="20" y="6" width="24" height="12" rx="2" fill="currentColor"></rect>
    </svg>
  );
}

/**
 * Lockup StairsLife: mark kayu + wordmark sebagai teks hidup.
 * Teks bukan gambar, jadi tajam di semua ukuran dan ikut warna induknya.
 */
export function Logo({ size = 22, wordmark = true, wood = "teak", color, basePath = "assets", style, ...rest }) {
  return (
    <span {...rest} style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.42), minWidth: 0, color: color || "var(--text-strong)", ...style }}>
      {wood === "flat"
        ? <MarkDatar size={size} />
        : <img src={basePath + "/" + MARK[wood]} width={size} height={size} alt={wordmark ? "" : "StairsLife"} style={{ display: "block", flex: "none" }} />}
      {wordmark && (
        <b style={{
          fontFamily: "var(--font-display)", fontSize: Math.round(size * 0.78),
          fontWeight: "var(--weight-semibold)", letterSpacing: "-0.02em", lineHeight: 1.1,
          color: color || "var(--text-strong)", whiteSpace: "nowrap",
        }}>StairsLife</b>
      )}
    </span>
  );
}
