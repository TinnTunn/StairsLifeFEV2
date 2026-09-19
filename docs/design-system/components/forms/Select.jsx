import React, { useState } from "react";

export function Select({
  label, hint, error, options = [], value, defaultValue, placeholder = "Pilih…",
  name, id, disabled = false, required = false, size = "md", onChange, style, ...rest
}) {
  const [focus, setFocus] = useState(false);
  const fid = id || name || (label ? "sel-" + label.replace(/\s+/g, "-").toLowerCase() : undefined);
  const invalid = Boolean(error);
  const h = size === "lg" ? "var(--control-lg)" : size === "sm" ? "var(--control-sm)" : "var(--control-md)";
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-field)", width: "100%", ...style }}>
      {label && (
        <label htmlFor={fid} style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-medium)", color: "var(--text-strong)", display: "flex", gap: "4px" }}>
          {label}
          {required && <span aria-hidden="true" style={{ color: "var(--danger-text)" }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          {...rest}
          id={fid} name={name} value={value} defaultValue={defaultValue}
          disabled={disabled} required={required}
          aria-invalid={invalid || undefined}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: "100%", height: h, paddingInline: "12px 38px", appearance: "none", WebkitAppearance: "none",
            fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", color: "var(--text-body)",
            background: disabled ? "var(--bg-subtle)" : "var(--bg-surface)",
            border: "var(--border-width) solid " + (invalid ? "var(--danger)" : focus ? "var(--border-focus)" : "var(--border-default)"),
            boxShadow: focus && !invalid ? "0 0 0 var(--focus-ring-width) var(--focus-ring)" : "none",
            borderRadius: "var(--radius-md)", outline: "none", cursor: disabled ? "not-allowed" : "pointer",
            transition: "var(--transition-color), box-shadow var(--duration-fast) var(--ease-out)",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {items.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--text-muted)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 12, pointerEvents: "none" }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {(error || hint) && (
        <span role={invalid ? "alert" : undefined} style={{ fontSize: "var(--text-caption)", color: invalid ? "var(--danger-text)" : "var(--text-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
