import React from "react";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

function gaji(j) {
  if (j.gajiNego) return "Nego";
  if (j.gajiMin && j.gajiMaks) return rupiah(j.gajiMin) + " – " + rupiah(j.gajiMaks);
  if (j.gajiMin) return "Dari " + rupiah(j.gajiMin);
  return "Tidak dicantumkan";
}

/**
 * Kartu lowongan — komponen paling sering dipakai di produk (daftar publik,
 * hasil pencarian, tersimpan, rekomendasi, profil bisnis, dashboard).
 */
export function JobCard({
  job, variant = "grid", saved, applied, onOpen, onSave, actions, style, ...rest
}) {
  const j = job || {};
  const list = variant === "list";
  const compact = variant === "compact";
  const pad = compact ? "12px 13px" : "var(--pad-card)";

  const logo = (
    <span style={{
      width: compact ? 32 : 44, height: compact ? 32 : 44, flex: "none",
      display: "grid", placeItems: "center", background: "var(--bg-sunken)",
      border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-display)", fontSize: compact ? 13 : 16, fontWeight: 600,
      color: "var(--text-muted)", letterSpacing: "-0.01em",
    }}>{(j.bisnis || "?").slice(0, 1)}</span>
  );

  const meta = [j.lokasi, j.tipe, j.jadwal].filter(Boolean);

  return (
    <div
      {...rest}
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={onOpen ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(e); } } : undefined}
      style={{
        display: "flex", flexDirection: list || compact ? "row" : "column",
        gap: compact ? 11 : 13, alignItems: list || compact ? "flex-start" : "stretch",
        padding: pad, background: "var(--bg-surface)",
        border: "var(--border-width) solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)", cursor: onOpen ? "pointer" : "default",
        transition: "var(--transition-color)", minWidth: 0, ...style,
      }}
      onMouseEnter={(e) => { if (onOpen) e.currentTarget.style.borderColor = "var(--border-strong)"; }}
      onMouseLeave={(e) => { if (onOpen) e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
    >
      {(list || compact) && logo}

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: compact ? 5 : 9 }}>
        {!list && !compact && (
          <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            {logo}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-body-lg)", color: "var(--text-strong)", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{j.judul}</h3>
              <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                {j.bisnis}
                {j.verified && (
                  <svg aria-label="Terverifikasi" viewBox="0 0 24 24" width="12" height="12" fill="var(--success)" style={{ flex: "none" }}>
                    <path d="M12 2l2.4 1.8 3-.2 1 2.8 2.6 1.6-1 2.9 1 2.9-2.6 1.6-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3 16l1-2.9L3 10.2l2.6-1.6 1-2.8 3 .2z" />
                    <path d="M8.6 12.2l2.2 2.2 4.4-4.4" stroke="var(--bg-surface)" strokeWidth="1.9" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </div>
            {applied && <span style={{ flex: "none", fontSize: "var(--text-overline)", letterSpacing: "var(--tracking-overline)", textTransform: "uppercase", fontWeight: 600, color: "var(--success-text)" }}>Dilamar</span>}
          </div>
        )}

        {(list || compact) && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: compact ? "var(--text-body-sm)" : "var(--text-body-lg)", color: "var(--text-strong)", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{j.judul}</h3>
              <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{j.bisnis}</span>
            </div>
            {applied && <span style={{ flex: "none", fontSize: "var(--text-overline)", letterSpacing: "var(--tracking-overline)", textTransform: "uppercase", fontWeight: 600, color: "var(--success-text)" }}>Dilamar</span>}
          </div>
        )}

        {meta.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? "3px 10px" : "5px 14px" }}>
            {meta.map((m) => (
              <span key={m} style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                <span aria-hidden="true" style={{ width: 3, height: 3, borderRadius: "var(--radius-full)", background: "var(--text-subtle)", flex: "none" }} />{m}
              </span>
            ))}
          </div>
        )}

        <span className="sl-tabular" style={{ fontSize: compact ? "var(--text-body-sm)" : "var(--text-body)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>{gaji(j)}</span>

        {!compact && j.tags && j.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {j.tags.slice(0, 4).map((t) => (
              <span key={t} style={{ padding: "2px 8px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-xs)", fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{t}</span>
            ))}
          </div>
        )}

        {!compact && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto", paddingTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: "var(--text-caption)", color: "var(--text-subtle)", flex: 1, minWidth: 0 }}>
              {j.diposting}{j.pelamar !== undefined ? " · " + j.pelamar + " pelamar" : ""}
            </span>
            {actions}
            {onSave && (
              <button type="button" aria-label={saved ? "Hapus dari simpanan" : "Simpan lowongan"} aria-pressed={!!saved}
                onClick={(e) => { e.stopPropagation(); onSave(e); }}
                style={{ width: 32, height: 32, flex: "none", display: "grid", placeItems: "center", border: 0, background: "transparent", color: saved ? "var(--primary)" : "var(--text-subtle)", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "var(--transition-color)" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
