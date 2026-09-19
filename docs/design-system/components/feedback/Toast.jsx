import React from "react";

const TONES = {
  info: { bar: "var(--info)", bg: "var(--bg-surface-raised)", icon: "M12 16v-4M12 8h.01", ring: "var(--info-soft)" },
  success: { bar: "var(--success)", bg: "var(--bg-surface-raised)", icon: "M20 6 9 17l-5-5", ring: "var(--success-soft)" },
  warning: { bar: "var(--warning)", bg: "var(--bg-surface-raised)", icon: "M12 9v4M12 17h.01", ring: "var(--warning-soft)" },
  danger: { bar: "var(--danger)", bg: "var(--bg-surface-raised)", icon: "M18 6 6 18M6 6l12 12", ring: "var(--danger-soft)" },
};

export function Toast({ tone = "info", title, description, action, onClose, style, ...rest }) {
  const t = TONES[tone] || TONES.info;
  return (
    <div
      {...rest} role={tone === "danger" ? "alert" : "status"}
      style={{
        display: "flex", alignItems: "flex-start", gap: "12px", width: "100%", maxWidth: 420,
        padding: "12px 14px", background: t.bg, color: "var(--text-body)",
        border: "var(--border-width) solid var(--border-subtle)", borderLeft: "3px solid " + t.bar,
        borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)",
        animation: "sl-toast-in var(--duration-base) var(--ease-entrance)", ...style,
      }}
    >
      <style>{"@keyframes sl-toast-in{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}"}</style>
      <span aria-hidden="true" style={{ width: 22, height: 22, flex: "none", display: "grid", placeItems: "center", borderRadius: "var(--radius-full)", background: t.ring, marginTop: 1 }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={t.bar} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
      </span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>{title}</span>
        {description && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{description}</span>}
        {action && <span style={{ marginTop: "6px" }}>{action}</span>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Tutup notifikasi"
          style={{ width: 28, height: 28, flex: "none", display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--text-subtle)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}

export function ToastStack({ children, position = "bottom", style }) {
  const bottom = position === "bottom";
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed", zIndex: 80, left: "50%", transform: "translateX(-50%)",
        bottom: bottom ? "calc(var(--height-bottomnav) + 12px)" : undefined, top: bottom ? undefined : "16px",
        width: "min(420px, calc(100vw - 32px))", display: "flex", flexDirection: "column", gap: "8px", ...style,
      }}
    >
      {children}
    </div>
  );
}
