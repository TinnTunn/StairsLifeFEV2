import React from "react";

/**
 * Timeline riwayat status vertikal — dipakai di detail lamaran (sisi mahasiswa)
 * dan detail pelamar (sisi bisnis). Berbeda dari ContractStepper: ini riwayat
 * yang sudah terjadi dengan cap waktu, bukan tahap yang akan datang.
 */
export function StatusTimeline({ items = [], style, ...rest }) {
  const tones = {
    done: "var(--success)",
    active: "var(--primary)",
    todo: "var(--border-strong)",
    alert: "var(--danger)",
  };

  return (
    <ol {...rest} style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", ...style }}>
      {items.map((it, i) => {
        const tone = it.tone || "done";
        const last = i === items.length - 1;
        const dim = tone === "todo";
        return (
          <li key={i} style={{ display: "flex", gap: 13, minHeight: last ? 0 : 46 }}>
            <span style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
              <span style={{
                width: 11, height: 11, borderRadius: "var(--radius-full)", flex: "none",
                background: dim ? "var(--bg-surface)" : tones[tone],
                border: "2px solid " + tones[tone], marginTop: 3,
              }} />
              {!last && <span style={{ flex: 1, width: 2, background: "var(--border-subtle)", marginTop: 3, minHeight: 20 }} />}
            </span>
            <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2, paddingBottom: last ? 0 : 14 }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap" }}>
                <b style={{ fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: dim ? "var(--text-subtle)" : "var(--text-strong)" }}>{it.label}</b>
                {it.time && <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: "var(--text-subtle)" }}>{it.time}</span>}
              </span>
              {it.description && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: 1.55 }}>{it.description}</span>}
              {it.by && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-subtle)" }}>oleh {it.by}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
