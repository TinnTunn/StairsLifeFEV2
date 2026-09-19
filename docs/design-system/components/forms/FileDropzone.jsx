import React, { useState } from "react";

export function FileDropzone({
  label, hint = "PNG, JPG, atau PDF · maksimal 10 MB", accept, multiple = true,
  files = [], onFiles, onRemove, error, disabled = false, style,
}) {
  const [over, setOver] = useState(false);
  const inputRef = React.useRef(null);
  const invalid = Boolean(error);

  function pick(list) {
    if (onFiles && list && list.length) onFiles(Array.from(list));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-field)", width: "100%", ...style }}>
      {label && <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-medium)", color: "var(--text-strong)" }}>{label}</span>}
      <div
        role="button" tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current && inputRef.current.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current && inputRef.current.click(); } }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) pick(e.dataTransfer.files); }}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center",
          padding: "24px 16px", cursor: disabled ? "not-allowed" : "pointer",
          background: over ? "var(--bg-selected)" : "var(--bg-subtle)",
          border: "1.5px dashed " + (invalid ? "var(--danger)" : over ? "var(--primary)" : "var(--border-default)"),
          borderRadius: "var(--radius-lg)", transition: "var(--transition-color)", opacity: disabled ? 0.6 : 1,
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={over ? "var(--primary)" : "var(--text-subtle)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
        </svg>
        <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-strong)", fontWeight: "var(--weight-medium)" }}>
          Tarik berkas ke sini atau <span style={{ color: "var(--primary-text)", textDecoration: "underline", textUnderlineOffset: 2 }}>pilih dari perangkat</span>
        </span>
        <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{hint}</span>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => pick(e.target.files)} className="sl-visually-hidden" />
      </div>
      {invalid && <span role="alert" style={{ fontSize: "var(--text-caption)", color: "var(--danger-text)" }}>{error}</span>}
      {files.length > 0 && (
        <ul style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
          {files.map((f, i) => (
            <li key={f.name + i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "var(--bg-surface)", border: "var(--border-width) solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
              <span style={{ flex: 1, minWidth: 0, fontSize: "var(--text-body-sm)", color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
              <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: "var(--text-subtle)", flex: "none" }}>{f.size}</span>
              {onRemove && (
                <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(f, i); }} aria-label={"Hapus " + f.name}
                  style={{ width: 28, height: 28, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--text-muted)", cursor: "pointer", borderRadius: "var(--radius-sm)" }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
