import React from "react";

function Box({ checked, indeterminate, disabled, radio }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 20, height: 20, flex: "none", display: "grid", placeItems: "center",
        borderRadius: radio ? "var(--radius-full)" : "var(--radius-xs)",
        border: "var(--border-width-strong) solid " + (checked || indeterminate ? "var(--primary)" : "var(--border-strong)"),
        background: checked || indeterminate ? "var(--primary)" : "var(--bg-surface)",
        transition: "var(--transition-color)", opacity: disabled ? 0.5 : 1,
      }}
    >
      {radio ? (
        checked && <span style={{ width: 8, height: 8, borderRadius: "var(--radius-full)", background: "var(--text-on-primary)" }} />
      ) : indeterminate ? (
        <span style={{ width: 10, height: 2, borderRadius: 1, background: "var(--text-on-primary)" }} />
      ) : checked ? (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-on-primary)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      ) : null}
    </span>
  );
}

export function Checkbox({ label, description, checked, defaultChecked, indeterminate = false, disabled = false, name, value, onChange, style, ...rest }) {
  const [internal, setInternal] = React.useState(Boolean(defaultChecked));
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  return (
    <label
      style={{
        display: "flex", gap: "10px", alignItems: description ? "flex-start" : "center",
        minHeight: "var(--tap-min)", padding: "6px 0", cursor: disabled ? "not-allowed" : "pointer", ...style,
      }}
    >
      <input
        {...rest}
        type="checkbox" name={name} value={value} checked={on} disabled={disabled}
        onChange={(e) => { if (!isControlled) setInternal(e.target.checked); if (onChange) onChange(e); }}
        className="sl-visually-hidden"
      />
      <span style={{ marginTop: description ? 2 : 0, display: "flex" }}>
        <Box checked={on} indeterminate={indeterminate && !on} disabled={disabled} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: "2px", opacity: disabled ? 0.6 : 1 }}>
        <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-strong)", fontWeight: "var(--weight-medium)" }}>{label}</span>
        {description && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{description}</span>}
      </span>
    </label>
  );
}
