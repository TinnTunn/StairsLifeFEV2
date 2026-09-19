import React from "react";

/** Peta status siklus proyek & escrow → token warna + label bahasa Indonesia. */
export const STATUS = {
  draft: { label: "Draft", bg: "var(--status-draft-bg)", fg: "var(--status-draft-fg)", bd: "var(--status-draft-bd)" },
  aktif: { label: "Aktif", bg: "var(--status-aktif-bg)", fg: "var(--status-aktif-fg)", bd: "var(--status-aktif-bd)" },
  menunggu_pembayaran: { label: "Menunggu pembayaran", bg: "var(--status-menunggu-bg)", fg: "var(--status-menunggu-fg)", bd: "var(--status-menunggu-bd)" },
  escrow_ditahan: { label: "Escrow ditahan", bg: "var(--status-escrow-bg)", fg: "var(--status-escrow-fg)", bd: "var(--status-escrow-bd)" },
  dikerjakan: { label: "Sedang dikerjakan", bg: "var(--status-dikerjakan-bg)", fg: "var(--status-dikerjakan-fg)", bd: "var(--status-dikerjakan-bd)" },
  menunggu_review: { label: "Menunggu review", bg: "var(--status-review-bg)", fg: "var(--status-review-fg)", bd: "var(--status-review-bd)" },
  selesai: { label: "Selesai", bg: "var(--status-selesai-bg)", fg: "var(--status-selesai-fg)", bd: "var(--status-selesai-bd)" },
  sengketa: { label: "Dalam sengketa", bg: "var(--status-sengketa-bg)", fg: "var(--status-sengketa-fg)", bd: "var(--status-sengketa-bd)" },
  ditolak: { label: "Ditolak", bg: "var(--status-ditolak-bg)", fg: "var(--status-ditolak-fg)", bd: "var(--status-ditolak-bd)" },

  /* --- Status lowongan --- */
  menunggu_review_lowongan: { label: "Menunggu review", bg: "var(--status-menunggu-bg)", fg: "var(--status-menunggu-fg)", bd: "var(--status-menunggu-bd)" },
  ditolak_admin: { label: "Ditolak admin", bg: "var(--status-sengketa-bg)", fg: "var(--status-sengketa-fg)", bd: "var(--status-sengketa-bd)" },
  ditutup: { label: "Ditutup", bg: "var(--status-draft-bg)", fg: "var(--status-draft-fg)", bd: "var(--status-draft-bd)" },
  kedaluwarsa: { label: "Kedaluwarsa", bg: "var(--status-dilihat-bg)", fg: "var(--status-dilihat-fg)", bd: "var(--status-dilihat-bd)" },

  /* --- Status lamaran --- */
  terkirim: { label: "Terkirim", bg: "var(--status-dikerjakan-bg)", fg: "var(--status-dikerjakan-fg)", bd: "var(--status-dikerjakan-bd)" },
  dilihat: { label: "Dilihat", bg: "var(--status-dilihat-bg)", fg: "var(--status-dilihat-fg)", bd: "var(--status-dilihat-bd)" },
  seleksi: { label: "Seleksi", bg: "var(--status-seleksi-bg)", fg: "var(--status-seleksi-fg)", bd: "var(--status-seleksi-bd)" },
  diterima: { label: "Diterima", bg: "var(--status-selesai-bg)", fg: "var(--status-selesai-fg)", bd: "var(--status-selesai-bd)" },
  dibatalkan: { label: "Dibatalkan", bg: "var(--status-draft-bg)", fg: "var(--status-draft-fg)", bd: "var(--status-draft-bd)" },

  /* --- Status verifikasi akun --- */
  belum_diajukan: { label: "Belum diajukan", bg: "var(--status-draft-bg)", fg: "var(--status-draft-fg)", bd: "var(--status-draft-bd)" },
  terverifikasi: { label: "Terverifikasi", bg: "var(--status-aktif-bg)", fg: "var(--status-aktif-fg)", bd: "var(--status-aktif-bd)" },
  disuspend: { label: "Disuspend", bg: "var(--status-suspend-bg)", fg: "var(--status-suspend-fg)", bd: "var(--status-suspend-bd)" },

  /* --- Status pembayaran --- */
  menunggu_konfirmasi: { label: "Menunggu konfirmasi", bg: "var(--status-seleksi-bg)", fg: "var(--status-seleksi-fg)", bd: "var(--status-seleksi-bd)" },
  lunas: { label: "Lunas", bg: "var(--status-selesai-bg)", fg: "var(--status-selesai-fg)", bd: "var(--status-selesai-bd)" },
  gagal: { label: "Gagal", bg: "var(--status-sengketa-bg)", fg: "var(--status-sengketa-fg)", bd: "var(--status-sengketa-bd)" },
};

export function StatusBadge({ status = "draft", label, size = "md", style, ...rest }) {
  const s = STATUS[status] || STATUS.draft;
  const sm = size === "sm";
  return (
    <span
      {...rest}
      style={{
        display: "inline-flex", alignItems: "center", gap: sm ? "5px" : "6px",
        padding: sm ? "1px 6px" : "2px 8px", background: s.bg, color: s.fg,
        border: "1px solid " + (s.bd || "transparent"),
        borderRadius: "var(--radius-xs)", fontSize: sm ? "var(--text-overline)" : "var(--text-caption)",
        fontWeight: "var(--weight-semibold)", letterSpacing: "0.01em", lineHeight: 1.55, whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label || s.label}
    </span>
  );
}

export function Tag({ children, tone = "neutral", size = "md", onRemove, style, ...rest }) {
  const tones = {
    neutral: { background: "var(--bg-sunken)", color: "var(--text-muted)" },
    primary: { background: "var(--primary-soft)", color: "var(--primary-text)" },
    outline: { background: "transparent", color: "var(--text-muted)", boxShadow: "inset 0 0 0 1px var(--border-default)" },
  };
  const sm = size === "sm";
  return (
    <span
      {...rest}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px", padding: sm ? "2px 8px" : "4px 10px",
        borderRadius: "var(--radius-sm)", fontSize: sm ? "var(--text-caption)" : "var(--text-body-sm)",
        fontWeight: "var(--weight-medium)", whiteSpace: "nowrap", ...(tones[tone] || tones.neutral), ...style,
      }}
    >
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={"Hapus " + String(children)}
          style={{ border: 0, background: "transparent", padding: 0, width: 16, height: 16, display: "grid", placeItems: "center", color: "inherit", cursor: "pointer", opacity: 0.85 }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </span>
  );
}
