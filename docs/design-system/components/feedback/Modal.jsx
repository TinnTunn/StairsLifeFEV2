import React, { useEffect } from "react";

export function Modal({
  open = false, onClose, title, description, children, footer,
  size = "md", tone = "default", dismissible = true, style,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && dismissible && onClose) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;
  const width = size === "sm" ? 400 : size === "lg" ? 720 : 520;
  const accent = tone === "danger" ? "var(--danger)" : tone === "success" ? "var(--success)" : null;

  return (
    <div
      role="presentation"
      onClick={dismissible && onClose ? onClose : undefined}
      style={{
        position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: 0, background: "var(--bg-overlay)", backdropFilter: "blur(2px)",
        animation: "sl-fade var(--duration-base) var(--ease-out)",
      }}
    >
      <div className="sl-modal-wrap" style={{ position: "fixed", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", pointerEvents: "none" }}>
        <div
          role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}
          onClick={(e) => e.stopPropagation()}
          style={{
            pointerEvents: "auto", width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto",
            background: "var(--bg-surface-raised)", color: "var(--text-body)",
            borderTop: accent ? "3px solid " + accent : "none",
            borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
            boxShadow: "var(--shadow-lg)", animation: "sl-rise var(--duration-slow) var(--ease-entrance)",
            ...style,
          }}
        >
          <div style={{ padding: "var(--pad-card-lg)", display: "flex", flexDirection: "column", gap: "var(--gap-stack)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                {title && <h2 style={{ fontSize: "var(--text-h2)", fontFamily: "var(--font-display)", color: "var(--text-strong)" }}>{title}</h2>}
                {description && <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{description}</p>}
              </div>
              {dismissible && onClose && (
                <button type="button" onClick={onClose} aria-label="Tutup"
                  style={{ width: 40, height: 40, flex: "none", display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--text-muted)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            {children}
          </div>
          {footer && (
            <div style={{ padding: "var(--pad-card) var(--pad-card-lg)", borderTop: "var(--border-width) solid var(--border-subtle)", background: "var(--bg-subtle)", display: "flex", justifyContent: "flex-end", gap: "var(--gap-inline)", flexWrap: "wrap", position: "sticky", bottom: 0 }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
