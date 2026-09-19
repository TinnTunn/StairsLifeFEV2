import React from "react";

function PageBtn({ children, active, disabled, onClick, label }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label} aria-current={active ? "page" : undefined}
      style={{
        minWidth: 40, height: 40, padding: "0 10px", display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
        fontVariantNumeric: "tabular-nums",
        background: active ? "var(--primary-soft)" : "transparent",
        color: active ? "var(--primary-text)" : disabled ? "var(--text-subtle)" : "var(--text-body)",
        border: "var(--border-width) solid " + (active ? "var(--primary-border)" : "transparent"),
        borderRadius: "var(--radius-md)", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, transition: "var(--transition-color)",
      }}
    >
      {children}
    </button>
  );
}

export function Pagination({ page = 1, pageCount = 1, total, perPage, onChange, style, ...rest }) {
  const go = (p) => onChange && p >= 1 && p <= pageCount && p !== page && onChange(p);
  const pages = [];
  const push = (p) => pages.push(p);
  if (pageCount <= 7) { for (let i = 1; i <= pageCount; i++) push(i); }
  else {
    push(1);
    if (page > 3) push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) push(i);
    if (page < pageCount - 2) push("…");
    push(pageCount);
  }
  const from = perPage ? (page - 1) * perPage + 1 : null;
  const to = perPage && total ? Math.min(total, page * perPage) : null;

  return (
    <nav {...rest} aria-label="Navigasi halaman" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", ...style }}>
      {total !== undefined && (
        <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {from && to ? from + "–" + to + " dari " + total.toLocaleString("id-ID") : total.toLocaleString("id-ID") + " data"}
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <PageBtn label="Halaman sebelumnya" disabled={page <= 1} onClick={() => go(page - 1)}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </PageBtn>
        {pages.map((p, i) => p === "…"
          ? <span key={"e" + i} style={{ width: 24, textAlign: "center", color: "var(--text-subtle)", fontSize: "var(--text-body-sm)" }}>…</span>
          : <PageBtn key={p} active={p === page} onClick={() => go(p)} label={"Halaman " + p}>{p}</PageBtn>
        )}
        <PageBtn label="Halaman berikutnya" disabled={page >= pageCount} onClick={() => go(page + 1)}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </PageBtn>
      </div>
    </nav>
  );
}
