import React, { useState } from "react";

export function Input({
  label, hint, error, value, defaultValue, placeholder, type = "text", name, id,
  disabled = false, readOnly = false, required = false, size = "md",
  prefix, suffix, iconLeft, numeric = false, onChange, style, ...rest
}) {
  const [focus, setFocus] = useState(false);
  const fid = id || name || (label ? "in-" + label.replace(/\s+/g, "-").toLowerCase() : undefined);
  const invalid = Boolean(error);
  const h = size === "lg" ? "var(--control-lg)" : size === "sm" ? "var(--control-sm)" : "var(--control-md)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-field)", width: "100%", ...style }}>
      {label && (
        <label htmlFor={fid} style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-medium)", color: "var(--text-strong)", display: "flex", gap: "4px" }}>
          {label}
          {required && <span aria-hidden="true" style={{ color: "var(--danger-text)" }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: "flex", alignItems: "center", gap: "8px", height: h, paddingInline: "12px",
          background: disabled ? "var(--bg-subtle)" : "var(--bg-surface)",
          border: "var(--border-width) solid " + (invalid ? "var(--danger)" : focus ? "var(--border-focus)" : "var(--border-default)"),
          boxShadow: focus && !invalid ? "0 0 0 var(--focus-ring-width) var(--focus-ring)" : invalid && focus ? "0 0 0 var(--focus-ring-width) rgba(180,35,24,.22)" : "none",
          borderRadius: "var(--radius-md)", transition: "var(--transition-color), box-shadow var(--duration-fast) var(--ease-out)",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {iconLeft}
        {prefix && <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", flex: "none" }}>{prefix}</span>}
        <input
          {...rest}
          id={fid} name={name} type={type} value={value} defaultValue={defaultValue}
          placeholder={placeholder} disabled={disabled} readOnly={readOnly} required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? fid + "-err" : hint ? fid + "-hint" : undefined}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          inputMode={numeric ? "numeric" : undefined}
          style={{
            flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent",
            fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", color: "var(--text-body)",
            fontVariantNumeric: numeric ? "tabular-nums" : undefined,
            textAlign: numeric ? "right" : "left", padding: 0,
          }}
        />
        {suffix && <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", flex: "none" }}>{suffix}</span>}
      </div>
      {error ? (
        <span id={fid + "-err"} role="alert" style={{ fontSize: "var(--text-caption)", color: "var(--danger-text)", display: "flex", gap: "5px", alignItems: "flex-start" }}>
          <span aria-hidden="true" style={{ width: 14, height: 14, flex: "none", marginTop: 1, borderRadius: "var(--radius-full)", background: "var(--danger)", color: "var(--text-on-danger)", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", lineHeight: 1 }}>!</span>
          {error}
        </span>
      ) : hint ? (
        <span id={fid + "-hint"} style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
