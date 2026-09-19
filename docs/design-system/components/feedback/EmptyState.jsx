import React from "react";

export function EmptyState({ icon, title, description, action, secondaryAction, size = "md", style, ...rest }) {
  const big = size === "lg";
  return (
    <div
      {...rest}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        gap: "var(--gap-stack)", padding: big ? "56px 24px" : "40px 20px", ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: big ? 88 : 68, height: big ? 88 : 68, display: "grid", placeItems: "center",
          background: "var(--bg-sunken)", borderRadius: "var(--radius-full)", color: "var(--text-subtle)",
        }}
      >
        {icon}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: 380 }}>
        <h3 style={{ fontSize: big ? "var(--text-h2)" : "var(--text-h3)", fontFamily: "var(--font-display)", color: "var(--text-strong)" }}>{title}</h3>
        {description && <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)" }}>{description}</p>}
      </div>
      {(action || secondaryAction) && (
        <div style={{ display: "flex", gap: "var(--gap-inline)", flexWrap: "wrap", justifyContent: "center", marginTop: "4px" }}>
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
