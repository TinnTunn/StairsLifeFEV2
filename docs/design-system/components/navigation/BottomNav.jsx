import React from "react";

export function BottomNav({ items = [], active, onNavigate, style, ...rest }) {
  return (
    <nav
      {...rest}
      style={{
        position: "sticky", bottom: 0, zIndex: 40, flex: "none",
        height: "calc(var(--height-bottomnav) + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        display: "flex", alignItems: "stretch", background: "var(--bg-surface)",
        borderTop: "var(--border-width) solid var(--border-subtle)",
        boxShadow: "var(--shadow-sticky-bottom)", ...style,
      }}
    >
      {items.map((it) => {
        const on = it.value === active;
        return (
          <button
            key={it.value} type="button" onClick={() => onNavigate && onNavigate(it.value)}
            aria-current={on ? "page" : undefined}
            style={{
              flex: 1, minWidth: 0, minHeight: "var(--tap-min)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "3px", padding: "6px 1px",
              border: 0, background: "transparent", cursor: "pointer",
              color: on ? "var(--primary-text)" : "var(--text-muted)",
              transition: "var(--transition-color)", position: "relative",
            }}
          >
            <span style={{ position: "relative", display: "flex", color: on ? "var(--primary)" : "var(--text-subtle)" }}>
              {it.icon}
              {it.badge ? (
                <span aria-label={typeof it.badge === "number" ? it.badge + " belum dibaca" : "ada yang baru"} style={{
                  position: "absolute", top: -2, right: -5, width: 6, height: 6, borderRadius: "var(--radius-full)",
                  background: it.badgeTone === "danger" ? "var(--danger)" : "var(--primary)",
                  boxShadow: "0 0 0 1.5px var(--bg-surface)",
                }} />
              ) : null}
            </span>
            <span style={{ fontSize: 10.5, fontWeight: on ? "var(--weight-semibold)" : "var(--weight-medium)", letterSpacing: on ? "-0.01em" : "0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
