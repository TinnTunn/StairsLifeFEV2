import React, { useState } from "react";

// Sejajar dengan Button: sm 36 · md 44 · lg 52. md = default DAN ambang
// sentuh WCAG AA, supaya target di bawah 44px tidak bisa terjadi karena lupa.
const SIZES = { sm: 36, md: 44, lg: 52 };

export function IconButton({
  children, label, variant = "ghost", size = "md", disabled = false, onClick, style, ...rest
}) {
  const [hover, setHover] = useState(false);
  const px = SIZES[size] || SIZES.md;
  const skins = {
    ghost: { background: hover ? "var(--bg-hover)" : "transparent", color: "var(--text-muted)", borderColor: "transparent" },
    outline: { background: hover ? "var(--bg-subtle)" : "var(--bg-surface)", color: "var(--text-strong)", borderColor: hover ? "var(--border-strong)" : "var(--border-default)" },
    solid: { background: hover ? "var(--primary-hover)" : "var(--primary)", color: "var(--text-on-primary)", borderColor: "transparent" },
    danger: { background: hover ? "var(--danger-soft)" : "transparent", color: "var(--danger-text)", borderColor: "transparent" },
  };
  return (
    <button
      {...rest}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: px, height: px, display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--radius-md)", borderWidth: "var(--border-width)", borderStyle: "solid",
        ...(skins[variant] || skins.ghost),
        opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer",
        transition: "var(--transition-color)", flex: "none", padding: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
