import React from "react";

/** Donut proporsi — komposisi antrean/status. Total di tengah. */
export function DonutChart({ data = [], size = 190, thickness = 26, centerLabel, centerValue, style, ...rest }) {
  const total = data.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div {...rest} style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap", ...style }}>
      <svg width={size} height={size} viewBox={"0 0 " + size + " " + size} role="img"
        aria-label={data.map((x) => x.label + " " + Math.round((x.value / total) * 100) + " persen").join(", ")}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={thickness} />
        {data.map((x) => {
          const len = (x.value / total) * c;
          const el = (
            <circle key={x.label} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={x.color} strokeWidth={thickness} strokeDasharray={len + " " + (c - len)}
              strokeDashoffset={-acc} transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"} strokeLinecap="butt" />
          );
          acc += len;
          return el;
        })}
        {centerValue && (
          <>
            <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fill="var(--text-strong)"
              style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-sans)", fontVariantNumeric: "tabular-nums" }}>{centerValue}</text>
            <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fill="var(--text-muted)"
              style={{ fontSize: 10, fontFamily: "var(--font-sans)" }}>{centerLabel}</text>
          </>
        )}
      </svg>
      <ul style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 168, flex: 1 }}>
        {data.map((x) => (
          <li key={x.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 9, height: 9, flex: "none", borderRadius: 2, background: x.color }} />
            <span style={{ flex: 1, minWidth: 0, fontSize: "var(--text-body-sm)", color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.label}</span>
            <span className="sl-tabular" style={{ fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
              {Math.round((x.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

