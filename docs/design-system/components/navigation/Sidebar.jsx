import React from "react";

export function Sidebar({
  items = [], active, onNavigate, brand, footer, collapsed = false, role, style, ...rest
}) {
  return (
    <nav
      {...rest}
      style={{
        width: collapsed ? "var(--width-sidebar-collapsed)" : "var(--width-sidebar)",
        flex: "none", height: "100%", display: "flex", flexDirection: "column",
        background: "var(--bg-surface)", borderRight: "var(--border-width) solid var(--border-subtle)",
        transition: "width var(--duration-base) var(--ease-out)", ...style,
      }}
    >
      {brand && (
        <div style={{ height: "var(--height-topbar)", flex: "none", display: "flex", alignItems: "center", gap: "10px", padding: "0 16px", borderBottom: "var(--border-width) solid var(--border-subtle)" }}>
          {brand}
        </div>
      )}
      {role && !collapsed && (
        <div style={{ padding: "12px 16px 4px" }}>
          <span className="sl-overline">{role}</span>
        </div>
      )}
      <ul style={{ flex: 1, overflowY: "auto", padding: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {items.map((it) => {
          if (it.section) {
            return collapsed ? <li key={it.section} style={{ height: 8 }} /> : (
              <li key={it.section} style={{ padding: "14px 8px 4px" }}><span className="sl-overline">{it.section}</span></li>
            );
          }
          const on = it.value === active;
          return (
            <li key={it.value}>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(it.value)}
                title={collapsed ? it.label : undefined}
                aria-current={on ? "page" : undefined}
                style={{
                  width: "100%", minHeight: 44, display: "flex", alignItems: "center", gap: "10px",
                  padding: collapsed ? "0" : "0 10px", justifyContent: collapsed ? "center" : "flex-start",
                  background: on ? "var(--primary-soft)" : "transparent",
                  color: on ? "var(--primary-text)" : "var(--text-muted)",
                  border: 0, borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left",
                  position: "relative",
                  fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)",
                  fontWeight: on ? "var(--weight-semibold)" : "var(--weight-medium)",
                  transition: "var(--transition-color)",
                }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ display: "flex", flex: "none", color: on ? "var(--primary)" : "var(--text-subtle)" }}>{it.icon}</span>
                {!collapsed && <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>}
                {!collapsed && it.badge !== undefined && (
                  <span className="sl-tabular" style={{
                    flex: "none", width: 22, textAlign: "right", fontVariantNumeric: "tabular-nums",
                    color: it.badgeTone === "danger" ? "var(--danger-text)" : on ? "var(--primary-text)" : "var(--text-subtle)",
                    fontSize: 12, fontWeight: "var(--weight-semibold)", letterSpacing: "0.01em",
                    lineHeight: 1, whiteSpace: "nowrap", fontFeatureSettings: '"tnum"',
                  }}>
                    {it.badge}
                  </span>
                )}
                {collapsed && it.badge !== undefined && (
                  <span aria-hidden="true" style={{
                    position: "absolute", top: 8, right: 12, width: 5, height: 5,
                    borderRadius: "var(--radius-full)",
                    background: it.badgeTone === "danger" ? "var(--danger)" : "var(--primary)",
                  }} />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {footer && (
        <div style={{ flex: "none", padding: "10px", borderTop: "var(--border-width) solid var(--border-subtle)" }}>{footer}</div>
      )}
    </nav>
  );
}
