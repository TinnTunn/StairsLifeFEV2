import React, { useState } from "react";

export function Tabs({ items = [], value, defaultValue, onChange, variant = "underline", fullWidth = false, style, ...rest }) {
  const [internal, setInternal] = useState(defaultValue || (items[0] && items[0].value));
  const active = value !== undefined ? value : internal;
  const pick = (v) => { if (value === undefined) setInternal(v); if (onChange) onChange(v); };
  const pill = variant === "pill";

  return (
    <div
      {...rest} role="tablist"
      style={{
        display: "flex", gap: pill ? "4px" : "2px", alignItems: "stretch",
        padding: pill ? "4px" : 0, background: pill ? "var(--bg-sunken)" : "transparent",
        borderRadius: pill ? "var(--radius-md)" : 0,
        borderBottom: pill ? "none" : "var(--border-width) solid var(--border-subtle)",
        overflowX: "auto", scrollbarWidth: "none", ...style,
      }}
    >
      {items.map((it) => {
        const on = it.value === active;
        return (
          <button
            key={it.value} type="button" role="tab" aria-selected={on}
            onClick={() => pick(it.value)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center",
              flex: fullWidth ? 1 : "none", whiteSpace: "nowrap", cursor: "pointer",
              height: pill ? 36 : 44, padding: pill ? "0 14px" : "0 4px", marginRight: pill ? 0 : "20px",
              border: 0, background: pill && on ? "var(--bg-surface)" : "transparent",
              borderRadius: pill ? "var(--radius-sm)" : 0,
              boxShadow: pill && on ? "var(--shadow-xs)" : "none",
              color: on ? (pill ? "var(--text-strong)" : "var(--primary-text)") : "var(--text-muted)",
              fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)",
              fontWeight: on ? "var(--weight-semibold)" : "var(--weight-medium)",
              position: "relative", transition: "var(--transition-color)",
            }}
          >
            {it.icon}
            {it.label}
            {it.count !== undefined && (
              <span className="sl-tabular" style={{ padding: "1px 6px", borderRadius: "var(--radius-pill)", background: on ? "var(--primary-soft)" : "var(--bg-sunken)", color: on ? "var(--primary-text)" : "var(--text-muted)", fontSize: "var(--text-overline)", fontWeight: "var(--weight-semibold)" }}>
                {it.count}
              </span>
            )}
            {!pill && on && (
              <span aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: "var(--primary)", borderRadius: "2px 2px 0 0" }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
