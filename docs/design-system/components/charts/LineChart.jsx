import React from "react";

/** Membangun path SVG dari deret angka (kurva halus, monoton). */
function linePath(values, w, h, pad) {
  const max = Math.max(...values) * 1.08;
  const min = 0;
  const step = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => [pad + i * step, h - pad - ((v - min) / (max - min)) * (h - pad * 2)]);
  let d = "M" + pts[0][0] + " " + pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += " C" + cx + " " + y0 + " " + cx + " " + y1 + " " + x1 + " " + y1;
  }
  return { d, pts, max };
}

/**
 * Grafik garis + area untuk panel admin. Sumbu, kisi, dan label memakai token
 * sistem; tanpa gradasi warna-warni — area hanya terakota transparan.
 */
export function LineChart({
  data = [], height = 220, valueFormat, yTicks = 4, tone = "primary", showArea = true, style, ...rest
}) {
  const w = 560, pad = 34;
  const values = data.map((d) => d.value);
  if (!values.length) return null;
  const { d, pts, max } = linePath(values, w, height, pad);
  const stroke = tone === "success" ? "var(--success)" : tone === "muted" ? "var(--text-muted)" : "var(--primary)";
  const fmt = valueFormat || ((v) => v.toLocaleString("id-ID"));
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((max / yTicks) * i));

  return (
    <div {...rest} style={{ width: "100%", ...style }}>
      <svg viewBox={"0 0 " + w + " " + height} width="100%" height={height} role="img" preserveAspectRatio="none"
        aria-label={"Grafik: " + data.map((x) => x.label + " " + fmt(x.value)).join(", ")}>
        {ticks.map((t, i) => {
          const y = height - pad - (t / max) * (height - pad * 2);
          return (
            <g key={i}>
              <line x1={pad} x2={w - pad / 2} y1={y} y2={y} stroke="var(--border-subtle)" strokeWidth="1" />
              <text x={pad - 8} y={y + 3.5} textAnchor="end" fill="var(--text-subtle)" style={{ fontSize: 9.5, fontFamily: "var(--font-sans)", fontVariantNumeric: "tabular-nums" }}>{fmt(t)}</text>
            </g>
          );
        })}
        {showArea && (
          <path d={d + " L" + pts[pts.length - 1][0] + " " + (height - pad) + " L" + pts[0][0] + " " + (height - pad) + " Z"}
            fill={stroke} opacity="0.10" />
        )}
        <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.2" fill="var(--bg-surface)" stroke={stroke} strokeWidth="2" />
        ))}
        {data.map((x, i) => (
          <text key={x.label} x={pts[i][0]} y={height - pad + 15} textAnchor="middle" fill="var(--text-subtle)" style={{ fontSize: 9.5, fontFamily: "var(--font-sans)" }}>{x.label}</text>
        ))}
      </svg>
    </div>
  );
}

