// Tombol pengalih tema terang dan gelap.

"use client";

import { useSyncExternalStore } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { applyTheme, readStoredTheme, TEMA_BAWAAN, type Theme } from "@/lib/theme";
import { Icon } from "./actions/Icon";
import { IconButton } from "./actions/IconButton";
import styles from "./ThemeToggle.module.css";

const NEXT: Record<Theme, Theme> = { light: "dark", dark: "light" };

const GLYPH = { light: "Terang", dark: "Gelap" } as const;

function subscribe(onChange: () => void) {
  window.addEventListener("stairslife-theme-change", onChange);
  return () => window.removeEventListener("stairslife-theme-change", onChange);
}

export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const theme = useSyncExternalStore(subscribe, readStoredTheme, () => TEMA_BAWAAN);
  const { t } = useBahasa();

  function cycle() {
    applyTheme(NEXT[theme]);
    window.dispatchEvent(new Event("stairslife-theme-change"));
  }

  const label = theme === "light" ? t.umum.tema.terang : t.umum.tema.gelap;

  return (
    <IconButton
      label={label}
      onClick={cycle}
      variant="ghost"
      className={[styles.toggle, onDark ? styles.onDark : ""].filter(Boolean).join(" ")}
    >
      <Icon name={GLYPH[theme]} />
    </IconButton>
  );
}
