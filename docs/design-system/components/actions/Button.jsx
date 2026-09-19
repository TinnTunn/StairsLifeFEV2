import React, { useState } from "react";

const SIZES = {
  sm: { height: "var(--control-sm)", padding: "0 12px", fontSize: "var(--text-body-sm)", gap: "6px" },
  md: { height: "var(--control-md)", padding: "0 18px", fontSize: "var(--text-body)", gap: "8px" },
  lg: { height: "var(--control-lg)", padding: "0 24px", fontSize: "var(--text-body-lg)", gap: "10px" },
};

function palette(variant, state) {
  const p = {
    primary: {
      rest: { background: "var(--primary)", color: "var(--text-on-primary)", borderColor: "transparent" },
      hover: { background: "var(--primary-hover)", color: "var(--text-on-primary)", borderColor: "transparent" },
      active: { background: "var(--primary-active)", color: "var(--text-on-primary)", borderColor: "transparent" },
    },
    secondary: {
      rest: { background: "var(--bg-surface)", color: "var(--text-strong)", borderColor: "var(--border-default)" },
      hover: { background: "var(--bg-subtle)", color: "var(--text-strong)", borderColor: "var(--border-strong)" },
      active: { background: "var(--bg-sunken)", color: "var(--text-strong)", borderColor: "var(--border-strong)" },
    },
    ghost: {
      rest: { background: "transparent", color: "var(--primary-text)", borderColor: "transparent" },
      hover: { background: "var(--primary-soft)", color: "var(--primary-text)", borderColor: "transparent" },
      active: { background: "var(--primary-soft-hover)", color: "var(--primary-text)", borderColor: "transparent" },
    },
    destructive: {
      rest: { background: "var(--danger)", color: "var(--text-on-danger)", borderColor: "transparent" },
      hover: { background: "var(--danger-hover)", color: "var(--text-on-danger)", borderColor: "transparent" },
      active: { background: "var(--danger-hover)", color: "var(--text-on-danger)", borderColor: "transparent" },
    },
  };
  return (p[variant] || p.primary)[state];
}

function Spinner({ size = 16 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size, height: size, flex: "none", display: "block", borderRadius: "var(--radius-full)",
        border: "2px solid currentColor", borderTopColor: "transparent", opacity: 0.9,
        animation: "sl-spin 620ms linear infinite",
      }}
    />
  );
}

export function Button({
  children, variant = "primary", size = "md", fullWidth = false, disabled = false,
  loading = false, iconLeft, iconRight, type = "button", href, onClick, style, ...rest
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const inert = disabled || loading;
  const state = inert ? "rest" : press ? "active" : hover ? "hover" : "rest";
  const s = SIZES[size] || SIZES.md;
  const skin = palette(variant, state);
  const Tag = href ? "a" : "button";

  return (
    <Tag
      {...rest}
      href={href}
      type={href ? undefined : type}
      onClick={inert ? undefined : onClick}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: fullWidth ? "flex" : "inline-flex", width: fullWidth ? "100%" : undefined,
        alignItems: "center", justifyContent: "center", gap: s.gap,
        height: s.height, padding: s.padding, minWidth: size === "sm" ? undefined : "var(--tap-min)",
        fontFamily: "var(--font-sans)", fontSize: s.fontSize, fontWeight: "var(--weight-semibold)",
        lineHeight: 1, letterSpacing: "0.005em", textDecoration: "none", whiteSpace: "nowrap",
        borderRadius: "var(--radius-md)", borderWidth: "var(--border-width)", borderStyle: "solid",
        ...skin,
        transform: state === "active" ? "translateY(1px)" : "none",
        opacity: inert ? 0.45 : 1,
        cursor: inert ? "not-allowed" : "pointer",
        transition: "var(--transition-color), transform var(--duration-instant) var(--ease-out)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {loading ? <Spinner size={size === "sm" ? 14 : 16} /> : iconLeft}
      {children}
      {!loading && iconRight}
    </Tag>
  );
}
