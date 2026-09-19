import React from "react";

/**
 * Panel filter — sidebar tetap di desktop, bottom sheet di mobile.
 * Filter aktif tampil sebagai chip yang bisa dihapus satu per satu.
 */
export function FilterPanel({
  groups = [], value = {}, onChange, onReset, open, onClose, resultCount, style, ...rest
}) {
  const aktif = [];
  for (const g of groups) {
    const v = value[g.key];
    if (Array.isArray(v)) v.forEach((x) => aktif.push({ group: g.key, label: x, groupLabel: g.label }));
    else if (v) aktif.push({ group: g.key, label: v, groupLabel: g.label });
  }

  const toggle = (g, opt) => {
    if (!onChange) return;
    const cur = value[g.key];
    if (g.multi) {
      const arr = Array.isArray(cur) ? cur : [];
      onChange({ ...value, [g.key]: arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt] });
    } else {
      onChange({ ...value, [g.key]: cur === opt ? undefined : opt });
    }
  };

  const hapus = (chip) => {
    if (!onChange) return;
    const cur = value[chip.group];
    onChange({ ...value, [chip.group]: Array.isArray(cur) ? cur.filter((x) => x !== chip.label) : undefined });
  };

  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <b style={{ flex: 1, fontFamily: "var(--font-display)", fontSize: "var(--text-h3)", color: "var(--text-strong)" }}>Filter</b>
        {aktif.length > 0 && onReset && (
          <button type="button" onClick={onReset} style={{ minHeight: 32, padding: "0 10px", background: "transparent", border: 0, color: "var(--primary-text)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: 600, cursor: "pointer" }}>Hapus semua</button>
        )}
      </div>

      {aktif.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {aktif.map((chip, i) => (
            <button key={i} type="button" onClick={() => hapus(chip)}
              style={{ minHeight: 28, display: "inline-flex", alignItems: "center", gap: 6, padding: "0 8px 0 10px", background: "var(--primary-soft)", border: "1px solid var(--primary-border)", borderRadius: "var(--radius-xs)", color: "var(--primary-text)", fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", fontWeight: 600, cursor: "pointer" }}>
              {chip.label}
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          ))}
        </div>
      )}

      {groups.map((g) => (
        <div key={g.key} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <span className="sl-overline">{g.label}</span>
          {/* Dua kolom, bukan satu: sembilan pilihan bertumpuk vertikal memakan
              ~500px tinggi dan memaksa pengguna scroll hanya untuk melihat
              filter apa saja yang tersedia. */}
          <div style={{ display: "grid", gridTemplateColumns: g.columns === 1 ? "minmax(0,1fr)" : "repeat(auto-fit,minmax(104px,1fr))", gap: "2px 12px" }}>
            {g.options.map((opt) => {
              const cur = value[g.key];
              const on = Array.isArray(cur) ? cur.includes(opt.value ?? opt) : cur === (opt.value ?? opt);
              const label = opt.label ?? opt;
              return (
                <label key={label} style={{ display: "flex", alignItems: "center", gap: 9, minHeight: 34, cursor: "pointer", fontSize: "var(--text-body-sm)", color: on ? "var(--text-strong)" : "var(--text-muted)", fontWeight: on ? "var(--weight-semibold)" : 400 }}>
                  <input type={g.multi ? "checkbox" : "radio"} name={g.key} checked={on} onChange={() => toggle(g, opt.value ?? opt)}
                    style={{ width: 16, height: 16, flex: "none", accentColor: "var(--primary)", cursor: "pointer" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
                  {opt.count !== undefined && <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: "var(--text-subtle)" }}>{opt.count}</span>}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (open === undefined) {
    return <div {...rest} style={{ display: "flex", flexDirection: "column", ...style }}>{body}</div>;
  }

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "var(--overlay)", zIndex: 60 }} />}
      <div {...rest} role="dialog" aria-label="Filter lowongan" style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 61,
        maxHeight: "82vh", overflowY: "auto",
        background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
        padding: "18px 18px calc(18px + env(safe-area-inset-bottom))",
        transform: open ? "translateY(0)" : "translateY(102%)",
        transition: "transform var(--duration-base) var(--ease-out)",
        boxShadow: "var(--shadow-lg)", ...style,
      }}>
        {body}
        <button type="button" onClick={onClose} style={{ marginTop: 18, width: "100%", minHeight: 44, background: "var(--primary)", color: "var(--text-on-primary)", border: 0, borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", fontWeight: 600, cursor: "pointer" }}>
          {resultCount !== undefined ? "Tampilkan " + resultCount + " lowongan" : "Terapkan filter"}
        </button>
      </div>
    </>
  );
}
