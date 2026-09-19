import React from "react";

export function Radio({ label, description, checked, disabled = false, name, value, onChange, style, ...rest }) {
  return (
    <label style={{ display: "flex", gap: "10px", alignItems: description ? "flex-start" : "center", minHeight: "var(--tap-min)", padding: "6px 0", cursor: disabled ? "not-allowed" : "pointer", ...style }}>
      <input {...rest} type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className="sl-visually-hidden" />
      <span aria-hidden="true" style={{
        width: 20, height: 20, flex: "none", marginTop: description ? 2 : 0, display: "grid", placeItems: "center",
        borderRadius: "var(--radius-full)",
        border: "var(--border-width-strong) solid " + (checked ? "var(--primary)" : "var(--border-strong)"),
        background: checked ? "var(--primary)" : "var(--bg-surface)", transition: "var(--transition-color)", opacity: disabled ? 0.5 : 1,
      }}>
        {checked && <span style={{ width: 8, height: 8, borderRadius: "var(--radius-full)", background: "var(--text-on-primary)" }} />}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: "2px", opacity: disabled ? 0.6 : 1 }}>
        <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-strong)", fontWeight: "var(--weight-medium)" }}>{label}</span>
        {description && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{description}</span>}
      </span>
    </label>
  );
}

export function RadioCard({ label, description, price, checked, disabled = false, name, value, onChange, style }) {
  return (
    <label style={{
      display: "flex", gap: "10px", alignItems: "flex-start", padding: "var(--pad-card)", cursor: disabled ? "not-allowed" : "pointer",
      background: checked ? "var(--bg-selected)" : "var(--bg-surface)",
      border: "var(--border-width) solid " + (checked ? "var(--primary)" : "var(--border-subtle)"),
      borderRadius: "var(--radius-md)", transition: "var(--transition-color)", opacity: disabled ? 0.6 : 1, ...style,
    }}>
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className="sl-visually-hidden" />
      <span aria-hidden="true" style={{
        width: 20, height: 20, flex: "none", marginTop: 1, display: "grid", placeItems: "center", borderRadius: "var(--radius-full)",
        border: "var(--border-width-strong) solid " + (checked ? "var(--primary)" : "var(--border-strong)"),
        background: checked ? "var(--primary)" : "var(--bg-surface)",
      }}>
        {checked && <span style={{ width: 8, height: 8, borderRadius: "var(--radius-full)", background: "var(--text-on-primary)" }} />}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline" }}>
          <span style={{ fontSize: "var(--text-body)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)", minWidth: 0 }}>{label}</span>
          {price && <span className="sl-money" style={{ fontSize: "var(--text-money-sm)", color: "var(--text-strong)", flex: "none", whiteSpace: "nowrap" }}>{price}</span>}
        </span>
        {description && <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{description}</span>}
      </span>
    </label>
  );
}
