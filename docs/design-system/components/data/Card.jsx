import React, { useState } from "react";

export function Card({
  children, as = "div", padding = "md", interactive = false, selected = false,
  raised = false, header, footer, style, onClick, ...rest
}) {
  const [hover, setHover] = useState(false);
  const Tag = as;
  const pad = padding === "none" ? 0 : padding === "lg" ? "var(--pad-card-lg)" : padding === "sm" ? "12px" : "var(--pad-card)";
  return (
    <Tag
      {...rest}
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        display: "flex", flexDirection: "column",
        background: "var(--bg-surface)",
        border: "var(--border-width) solid " + (selected ? "var(--primary)" : hover ? "var(--border-default)" : "var(--border-subtle)"),
        borderRadius: "var(--radius-lg)",
        boxShadow: raised ? "var(--shadow-md)" : hover ? "var(--shadow-sm)" : "var(--shadow-none)",
        transition: "var(--transition-color), box-shadow var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
        transform: hover ? "translateY(-1px)" : "none",
        cursor: interactive ? "pointer" : undefined,
        textDecoration: "none", color: "inherit", overflow: "hidden",
        ...style,
      }}
    >
      {header && (
        <div style={{ padding: pad, paddingBottom: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>{header}</div>
      )}
      <div style={{ padding: pad, display: "flex", flexDirection: "column", gap: "var(--gap-stack)", flex: 1 }}>{children}</div>
      {footer && (
        <div style={{ padding: pad, paddingTop: "12px", borderTop: "var(--border-width) solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "var(--gap-inline)", background: "var(--bg-subtle)" }}>{footer}</div>
      )}
    </Tag>
  );
}
