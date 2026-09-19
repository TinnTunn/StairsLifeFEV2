"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Menandai elemen [data-reveal] dengan data-terlihat begitu masuk layar.
 * Dipasang sekali di root layout, dipindai ulang setiap rute berganti.
 *
 * Elemen yang dirender belakangan (data dari API yang datang setelah mount)
 * ditangkap MutationObserver, supaya kartu yang muncul setelah fetch tidak
 * tertinggal tersembunyi sampai pengaman CSS 2,5 detik menyala.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const tandai = (el: Element) => el.setAttribute("data-terlihat", "");

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(tandai);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tandai(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0% 0% -8% 0%", threshold: 0.08 },
    );

    const amati = (root: ParentNode) => {
      root.querySelectorAll("[data-reveal]:not([data-terlihat])").forEach((el) => io.observe(el));
    };
    amati(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not([data-terlihat])")) io.observe(node);
          amati(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
