import React from "react";

export function ContractStepper({ steps = [], current = 0, orientation = "horizontal", surface = "default", style, ...rest }) {
  const vertical = orientation === "vertical";
  // Di atas permukaan tinta tetap (panel brand, footer) token tema tidak bisa
  // dipakai: di mode terang teks jadi gelap di atas gelap, di mode gelap latar
  // panelnya sendiri yang membalik. Permukaan tinta punya pasangan warnanya.
  const ink = surface === "ink";
  const c = ink
    ? {
        done: { dot: "var(--ink-success)", ring: "var(--ink-success)", fg: "var(--ink-text-muted)", bar: "var(--ink-success)", check: "#0B2A1D" },
        active: { dot: "var(--ink-accent)", ring: "var(--ink-accent)", fg: "var(--ink-text)", bar: "var(--ink-border-strong)", pip: "#3A1B08" },
        todo: { dot: "transparent", ring: "var(--ink-border-strong)", fg: "var(--ink-text-subtle)", bar: "var(--ink-border)", num: "var(--ink-text-subtle)" },
        alert: { dot: "#F08A80", ring: "#F08A80", fg: "#F08A80", bar: "var(--ink-border)", check: "#2C1614" },
        meta: "var(--ink-text-subtle)",
        desc: "var(--ink-text-muted)",
        glow: "rgba(240,162,114,.22)",
      }
    : {
        done: { dot: "var(--success)", ring: "var(--success)", fg: "var(--text-muted)", bar: "var(--success)", check: "var(--text-on-success)" },
        active: { dot: "var(--primary)", ring: "var(--primary)", fg: "var(--text-strong)", bar: "var(--border-default)", pip: "var(--text-on-primary)" },
        todo: { dot: "var(--bg-surface)", ring: "var(--border-strong)", fg: "var(--text-subtle)", bar: "var(--border-default)", num: "var(--text-subtle)" },
        alert: { dot: "var(--danger)", ring: "var(--danger)", fg: "var(--danger-text)", bar: "var(--border-default)", check: "var(--text-on-danger)" },
        meta: "var(--text-subtle)",
        desc: "var(--text-muted)",
        glow: "var(--primary-soft)",
      };
  return (
    <ol
      {...rest}
      style={{
        display: "flex", flexDirection: vertical ? "column" : "row",
        gap: vertical ? "0" : "0", width: "100%", ...style,
      }}
    >
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const tone = s.tone || (done ? "done" : active ? "active" : "todo");
        const colors = c[tone];
        const last = i === steps.length - 1;

        return (
          <li key={s.label + i} style={{ display: "flex", flexDirection: vertical ? "row" : "column", gap: vertical ? "12px" : "8px", flex: vertical ? "none" : 1, minWidth: 0 }}>
            {/* rel: dot + garis */}
            <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "center", gap: vertical ? 0 : 0, flex: "none", width: vertical ? 24 : "auto" }}>
              <span
                aria-hidden="true"
                style={{
                  width: 22, height: 22, flex: "none", display: "grid", placeItems: "center", borderRadius: "var(--radius-full)",
                  background: colors.dot,
                  border: "2px solid " + colors.ring,
                  transition: "var(--transition-color)",
                  boxShadow: active ? "0 0 0 4px " + c.glow : "none",
                }}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={colors.check} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                ) : tone === "alert" ? (
                  <span style={{ color: colors.check, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>!</span>
                ) : active ? (
                  <span style={{ width: 7, height: 7, borderRadius: "var(--radius-full)", background: colors.pip }} />
                ) : (
                  <span className="sl-tabular" style={{ fontSize: 11, fontWeight: 600, color: colors.num }}>{i + 1}</span>
                )}
              </span>
              {!last && (
                <span aria-hidden="true" style={{
                  background: colors.bar,
                  ...(vertical ? { width: 2, flex: 1, minHeight: 28, marginBlock: 4 } : { height: 2, flex: 1, marginInline: 8 }),
                }} />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: vertical && !last ? "20px" : 0, minWidth: 0 }}>
              <span style={{ fontSize: "var(--text-body-sm)", fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)", color: colors.fg, lineHeight: 1.35 }}>{s.label}</span>
              {s.meta && <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: c.meta }}>{s.meta}</span>}
              {s.description && <span style={{ fontSize: "var(--text-caption)", color: c.desc, lineHeight: "var(--leading-normal)", marginTop: 2 }}>{s.description}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
