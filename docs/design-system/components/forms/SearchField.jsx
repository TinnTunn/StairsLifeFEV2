import React, { useRef, useState } from "react";

const GAP = 10;
let gooSeq = 0;

/** Kolom pencarian yang melebar: pill tunggal → tombol ikon bulat + kolom lebar. */
export function SearchField({
  placeholder = "Cari…", value, defaultValue = "", onChange, onSubmit, onExpandChange,
  size = "md", collapsedWidth = 216, expandedWidth = 380, fullWidth = false,
  gooey = true, label = "Cari", autoCollapse = true, style, ...rest
}) {
  const gooId = useRef(null);
  if (!gooId.current) gooId.current = "sl-goo-" + (gooSeq += 1);
  const goo = gooId.current;
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const val = isControlled ? value : internal;
  const h = size === "lg" ? 52 : 44;
  const offset = h + GAP;

  const expand = () => { setOpen(true); if (onExpandChange) onExpandChange(true); window.requestAnimationFrame(() => inputRef.current && inputRef.current.focus()); };
  const collapse = () => { setOpen(false); if (onExpandChange) onExpandChange(false); };

  const set = (v, e) => { if (!isControlled) setInternal(v); if (onChange) onChange(e); };

  const pillLeft = open ? offset : 0;
  const pillWidth = open ? "calc(100% - " + offset + "px)" : "100%";
  const move = "left var(--duration-slow) var(--ease-out), width var(--duration-slow) var(--ease-out)";

  const blob = (border) => (
    <>
      <span style={{
        position: "absolute", left: border ? -1 : 0, top: border ? -1 : 0,
        width: border ? h + 2 : h, height: border ? h + 2 : h,
        borderRadius: "var(--radius-pill)",
        background: border ? "var(--border-default)" : "var(--bg-surface)",
        opacity: open ? 1 : 0.999,
      }} />
      <span style={{
        position: "absolute", left: border ? pillLeft - 1 : pillLeft, top: border ? -1 : 0,
        width: border ? "calc(" + pillWidth + " + 2px)" : pillWidth, height: border ? h + 2 : h,
        borderRadius: "var(--radius-pill)",
        background: border ? "var(--border-default)" : "var(--bg-surface)",
        transition: move,
      }} />
    </>
  );

  return (
    <div
      {...rest}
      style={{
        position: "relative", flex: "none", height: h,
        width: fullWidth ? "100%" : open ? expandedWidth : collapsedWidth,
        transition: "width var(--duration-slow) var(--ease-out)",
        ...style,
      }}
    >
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={goo}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={h * 0.16} result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
        </defs>
      </svg>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, filter: gooey ? "url(#" + goo + ")" : "none" }}>{blob(true)}</div>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, filter: gooey ? "url(#" + goo + ")" : "none" }}>{blob(false)}</div>

      <button
        type="button" aria-label={open ? "Cari sekarang" : label} aria-expanded={open}
        onClick={() => { if (!open) expand(); else if (onSubmit) onSubmit(val); }}
        style={{
          position: "absolute", left: 0, top: 0, width: h, height: h, display: "grid", placeItems: "center",
          border: 0, background: "transparent", color: open ? "var(--primary)" : "var(--text-muted)",
          borderRadius: "var(--radius-pill)", cursor: "pointer", transition: "var(--transition-color)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <svg viewBox="0 0 24 24" width={size === "lg" ? 20 : 18} height={size === "lg" ? 20 : 18} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" />
        </svg>
      </button>

      <input
        ref={inputRef} type="search" value={val} placeholder={placeholder}
        aria-label={label}
        onFocus={() => { if (!open) expand(); }}
        onChange={(e) => set(e.target.value, e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit(val);
          if (e.key === "Escape") { set("", { target: { value: "" } }); collapse(); e.currentTarget.blur(); }
        }}
        onBlur={() => { if (autoCollapse && !val) collapse(); }}
        style={{
          position: "absolute", top: 0, height: h, border: 0, outline: "none", background: "transparent",
          left: open ? offset + 18 : h - 2,
          width: open ? "calc(100% - " + (offset + 34) + "px)" : "calc(100% - " + (h + 14) + "px)",
          transition: move,
          fontFamily: "var(--font-sans)", fontSize: size === "lg" ? "var(--text-body-lg)" : "var(--text-body)",
          color: "var(--text-body)", padding: 0, WebkitAppearance: "none",
        }}
      />

      {val ? (
        <button type="button" aria-label="Hapus pencarian"
          onClick={() => { set("", { target: { value: "" } }); if (inputRef.current) inputRef.current.focus(); }}
          style={{ position: "absolute", right: 6, top: (h - 32) / 2, width: 32, height: 32, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--text-subtle)", borderRadius: "var(--radius-pill)", cursor: "pointer" }}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      ) : null}
    </div>
  );
}
