import React, { useState } from "react";

function Star({ fill = 1, size = 16, interactive }) {
  const id = "sl-star-" + Math.random().toString(36).slice(2, 8);
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block", flex: "none", cursor: interactive ? "pointer" : undefined }}>
      <defs>
        <linearGradient id={id}>
          <stop offset={fill} stopColor="var(--warning)" />
          <stop offset={fill} stopColor="var(--border-default)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95z"
        fill={fill >= 1 ? "var(--warning)" : fill <= 0 ? "var(--border-default)" : "url(#" + id + ")"}
      />
    </svg>
  );
}

export function Rating({
  value = 0, count, size = "md", showValue = true, editable = false, onChange,
  label = "Beri penilaian dari 1 sampai 5 bintang", style, ...rest
}) {
  const [hover, setHover] = useState(0);
  const px = size === "lg" ? 20 : size === "sm" ? 13 : 16;
  const active = hover || value;

  // Bintang yang bisa diedit adalah kontrol sungguhan: radiogroup dengan lima
  // role="radio", roving tabIndex, dan navigasi panah — bukan span ber-onClick.
  // Tanpa ini pengguna papan tombol tidak bisa memberi ulasan sama sekali.
  const pilih = (i) => { if (onChange) onChange(i); };
  const onKey = (e, i) => {
    const map = { ArrowRight: i + 1, ArrowUp: i + 1, ArrowLeft: i - 1, ArrowDown: i - 1, Home: 1, End: 5 };
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); pilih(i); return; }
    const next = map[e.key];
    if (!next) return;
    e.preventDefault();
    const n = Math.max(1, Math.min(5, next));
    pilih(n);
    const kel = e.currentTarget.parentElement;
    const target = kel && kel.children[n - 1];
    if (target && target.focus) target.focus();
  };

  return (
    <span {...rest} style={{ display: "inline-flex", alignItems: "center", gap: size === "sm" ? "5px" : "7px", ...style }}
      role={editable ? "radiogroup" : "img"}
      aria-label={editable ? label : "Rating " + String(value).replace(".", ",") + " dari 5"}
    >
      <span style={{ display: "inline-flex", gap: editable ? "0px" : "2px" }} onMouseLeave={() => editable && setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) =>
          editable ? (
            <span key={i}
              role="radio"
              aria-checked={value === i}
              aria-label={i + " dari 5 bintang"}
              tabIndex={value ? (value === i ? 0 : -1) : i === 1 ? 0 : -1}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(0)}
              onClick={() => pilih(i)}
              onKeyDown={(e) => onKey(e, i)}
              style={{
                display: "grid", placeItems: "center",
                minWidth: 44, minHeight: 44, borderRadius: "var(--radius-sm)",
                cursor: "pointer", WebkitTapHighlightColor: "transparent",
              }}
            >
              <Star size={px} interactive fill={Math.max(0, Math.min(1, active - i + 1))} />
            </span>
          ) : (
            <span key={i} style={{ display: "flex" }}>
              <Star size={px} fill={Math.max(0, Math.min(1, active - i + 1))} />
            </span>
          )
        )}
      </span>
      {showValue && (
        <span className="sl-tabular" style={{ fontSize: size === "lg" ? "var(--text-body)" : "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
          {String(value).replace(".", ",")}
        </span>
      )}
      {count !== undefined && (
        <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)" }}>({count} ulasan)</span>
      )}
    </span>
  );
}
