import React, { useEffect, useRef } from "react";

/** Menunggu window.lucide siap — di beberapa host (template DC) Lucide dimuat
 *  asinkron setelah komponen ini mount, jadi sekali gambar saja tidak cukup. */
let siap = null;
function tungguLucide() {
  const ada = () => typeof window !== "undefined" && window.lucide && window.lucide.icons;
  if (ada()) return Promise.resolve();
  if (!siap) {
    siap = new Promise((res) => {
      const t = window.setInterval(() => { if (ada()) { window.clearInterval(t); res(); } }, 40);
      window.setTimeout(() => { window.clearInterval(t); res(); }, 6000);
    });
  }
  return siap;
}

/**
 * Wrapper ikon Lucide. Ikon dimuat dari CDN Lucide (window.lucide) — lihat
 * ICONOGRAPHY di readme.md. Ukuran & stroke mengikuti konvensi sistem:
 * 20px / stroke 1.75 untuk UI, 16px untuk teks inline, 24px untuk nav.
 */
export function Icon({ name, size = 20, strokeWidth = 1.75, color = "currentColor", style, ...rest }) {
  const host = useRef(null);

  useEffect(() => {
    let batal = false;
    const gambar = () => {
      const el = host.current;
      if (!el || batal) return;
      el.textContent = "";
      const lucide = typeof window !== "undefined" ? window.lucide : null;
      const node = lucide && lucide.icons ? lucide.icons[name] : null;
      if (!node || !lucide.createElement) return;
      try {
        const svg = lucide.createElement(node);
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("stroke-width", strokeWidth);
        svg.setAttribute("stroke", color);
        svg.style.display = "block";
        el.appendChild(svg);
      } catch (e) { /* ikon tidak tersedia: biarkan kosong, jangan merusak layout */ }
    };
    tungguLucide().then(gambar);
    return () => { batal = true; };
  }, [name, size, strokeWidth, color]);

  return (
    <span
      {...rest}
      ref={host}
      aria-hidden="true"
      style={{ width: size, height: size, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", color, ...style }}
    />
  );
}
