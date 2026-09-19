import React, { useState } from "react";

export function Textarea({
  label, hint, error, value, defaultValue, placeholder, name, id, rows = 4,
  maxLength, showCount = false, disabled = false, required = false, onChange, style, ...rest
}) {
  const [focus, setFocus] = useState(false);
  const [len, setLen] = useState((defaultValue || value || "").length);
  const fid = id || name || (label ? "ta-" + label.replace(/\s+/g, "-").toLowerCase() : undefined);
  const invalid = Boolean(error);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-field)", width: "100%", ...style }}>
      {label && (
        <label htmlFor={fid} style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-medium)", color: "var(--text-strong)", display: "flex", gap: "4px" }}>
          {label}
          {required && <span aria-hidden="true" style={{ color: "var(--danger-text)" }}>*</span>}
        </label>
      )}
      <textarea
        {...rest}
        id={fid} name={name} rows={rows} value={value} defaultValue={defaultValue}
        placeholder={placeholder} disabled={disabled} required={required} maxLength={maxLength}
        aria-invalid={invalid || undefined}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => { setLen(e.target.value.length); if (onChange) onChange(e); }}
        style={{
          width: "100%", padding: "12px", resize: "vertical", minHeight: 44 * 2,
          fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", lineHeight: "var(--leading-normal)",
          color: "var(--text-body)", background: disabled ? "var(--bg-subtle)" : "var(--bg-surface)",
          border: "var(--border-width) solid " + (invalid ? "var(--danger)" : focus ? "var(--border-focus)" : "var(--border-default)"),
          boxShadow: focus && !invalid ? "0 0 0 var(--focus-ring-width) var(--focus-ring)" : "none",
          borderRadius: "var(--radius-md)", outline: "none",
          transition: "var(--transition-color), box-shadow var(--duration-fast) var(--ease-out)",
          opacity: disabled ? 0.6 : 1,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <span style={{ fontSize: "var(--text-caption)", color: invalid ? "var(--danger-text)" : "var(--text-muted)" }} role={invalid ? "alert" : undefined}>
          {error || hint}
        </span>
        {showCount && maxLength ? (
          <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: len > maxLength * 0.9 ? "var(--warning-text)" : "var(--text-subtle)", flex: "none" }}>
            {len}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}
