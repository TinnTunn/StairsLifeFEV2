import React, { useId } from "react";

/** Toggle untuk pengaturan yang berlaku langsung (bukan bagian formulir yang disimpan). */
export function Switch({ label, description, checked, defaultChecked, onChange, disabled, id, style, ...rest }) {
  const uid = useId();
  const sid = id || "sl-sw-" + uid;
  const on = checked !== undefined ? checked : undefined;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", opacity: disabled ? 0.55 : 1, ...style }}>
      <label htmlFor={sid} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2, cursor: disabled ? "not-allowed" : "pointer" }}>
        <span style={{ fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)", lineHeight: "var(--leading-snug)" }}>{label}</span>
        {description && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{description}</span>}
      </label>
      <span style={{ flex: "none", position: "relative", width: 42, height: 24, marginTop: 1 }}>
        <input
          {...rest} id={sid} type="checkbox" role="switch" checked={on} defaultChecked={defaultChecked}
          onChange={onChange} disabled={disabled}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: disabled ? "not-allowed" : "pointer", zIndex: 1 }}
        />
        <span aria-hidden="true" className="sl-switch-track" style={{
          position: "absolute", inset: 0, borderRadius: "var(--radius-full)",
          background: "var(--bg-sunken)", border: "1px solid var(--border-default)",
          transition: "var(--transition-color)",
        }} />
        <span aria-hidden="true" className="sl-switch-knob" style={{
          position: "absolute", top: 3, left: 3, width: 18, height: 18, borderRadius: "var(--radius-full)",
          background: "var(--bg-surface)", boxShadow: "var(--shadow-sm)",
          transition: "transform var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)",
        }} />
      </span>
    </div>
  );
}
