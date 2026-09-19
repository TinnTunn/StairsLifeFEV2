import React from "react";

export function DataTable({ columns = [], rows = [], onRowClick, empty, dense = false, stickyHeader = true, style, ...rest }) {
  const cellY = dense ? "8px" : "var(--pad-cell-y)";
  // minWidth diturunkan DARI lebar kolom yang dideklarasikan, bukan angka tetap.
  // Sebelumnya 640px — di bawah total kolom, sehingga overflowX tidak pernah
  // aktif dan kolom diperas: tanggal terpecah "10 Sep / 2026" dan tinggi baris
  // membengkak dari 52px ke 83px. Kolom tanpa `width` dihitung 140px.
  const minTabel = Math.max(560, columns.reduce((s, c) => s + (c.width || 140), 0));
  return (
    <div {...rest} style={{ width: "100%", flex: "none", overflowX: "auto", background: "var(--bg-surface)", border: "var(--border-width) solid var(--border-subtle)", borderRadius: "var(--radius-lg)", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: minTabel }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}
                style={{
                  position: stickyHeader ? "sticky" : undefined, top: stickyHeader ? 0 : undefined, zIndex: 1,
                  textAlign: c.align || "left", padding: cellY + " var(--pad-cell-x)",
                  background: "var(--bg-subtle)", color: "var(--text-muted)",
                  fontSize: "var(--text-overline)", fontWeight: "var(--weight-semibold)",
                  letterSpacing: "var(--tracking-overline)", textTransform: "uppercase",
                  borderBottom: "var(--border-width) solid var(--border-subtle)", whiteSpace: "nowrap",
                  width: c.width,
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--text-body-sm)" }}>{empty || "Belum ada data."}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={r.id || i}
              onClick={onRowClick ? () => onRowClick(r, i) : undefined}
              style={{
                cursor: onRowClick ? "pointer" : undefined,
                borderBottom: i === rows.length - 1 ? "none" : "var(--border-width) solid var(--border-subtle)",
                transition: "background-color var(--duration-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {columns.map((c) => (
                <td key={c.key}
                  className={c.numeric ? "sl-tabular" : undefined}
                  style={{
                    padding: cellY + " var(--pad-cell-x)", minHeight: "var(--row-height)", height: dense ? 44 : "var(--row-height)",
                    textAlign: c.align || (c.numeric ? "right" : "left"),
                    fontSize: "var(--text-body-sm)", color: "var(--text-body)", verticalAlign: "middle",
                    fontVariantNumeric: c.numeric ? "tabular-nums" : undefined,
                    // nowrap secara default: nilai sel — tanggal, nominal, status —
                    // tidak boleh terpecah di tengah. Kolom prosa ikut membungkus
                    // hanya bila menyatakannya lewat `wrap: true`.
                    whiteSpace: c.wrap ? "normal" : "nowrap",
                  }}
                >
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
