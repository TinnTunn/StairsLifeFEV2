import React from "react";

export function Skeleton({ width = "100%", height = 14, radius = "var(--radius-sm)", circle = false, style, ...rest }) {
  return (
    <span
      {...rest} aria-hidden="true"
      style={{
        display: "block", width: circle ? height : width, height,
        borderRadius: circle ? "var(--radius-full)" : radius,
        background: "linear-gradient(90deg, var(--bg-sunken) 0%, var(--bg-subtle) 40%, var(--bg-sunken) 80%)",
        backgroundSize: "200% 100%", animation: "sl-shimmer 1.4s linear infinite", ...style,
      }}
    />
  );
}

export function SkeletonCard({ lines = 2, media = false, style }) {
  return (
    <div style={{ padding: "var(--pad-card)", background: "var(--bg-surface)", border: "var(--border-width) solid var(--border-subtle)", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", gap: "12px", ...style }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {media && <Skeleton height={40} circle />}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "55%" : "100%"} height={12} />
      ))}
      <Skeleton width={120} height={20} radius="var(--radius-md)" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, style }) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "var(--border-width) solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden", ...style }}>
      <div style={{ display: "flex", gap: "16px", padding: "12px var(--pad-cell-x)", background: "var(--bg-subtle)", borderBottom: "var(--border-width) solid var(--border-subtle)" }}>
        {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} width={i === 1 ? "40%" : "16%"} height={10} />)}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap: "16px", alignItems: "center", padding: "0 var(--pad-cell-x)", height: "var(--row-height)", borderBottom: r === rows - 1 ? "none" : "var(--border-width) solid var(--border-subtle)" }}>
          {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} width={i === 1 ? "40%" : "16%"} height={12} />)}
        </div>
      ))}
    </div>
  );
}
