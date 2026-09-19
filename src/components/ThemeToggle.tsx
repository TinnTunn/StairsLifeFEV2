"use client";

import { useSyncExternalStore } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { applyTheme, readStoredTheme, type Theme } from "@/lib/theme";
import { Icon } from "./actions/Icon";
import { IconButton } from "./actions/IconButton";
import styles from "./ThemeToggle.module.css";

const NEXT: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };

const GLYPH = { system: "Palette", light: "Eye", dark: "EyeOff" } as const;

function subscribe(onChange: () => void) {
  window.addEventListener("stairslife-theme-change", onChange);
  return () => window.removeEventListener("stairslife-theme-change", onChange);
}

/* Tema dibaca lewat useSyncExternalStore: localStorage adalah state di luar
   React, dan snapshot server dikunci "system" supaya markup server dan klien
   cocok. Warnanya sudah benar sejak paint pertama berkat skrip inline. */
export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const theme = useSyncExternalStore(subscribe, readStoredTheme, () => "system" as Theme);
  const { t } = useBahasa();

  function cycle() {
    applyTheme(NEXT[theme]);
    window.dispatchEvent(new Event("stairslife-theme-change"));
  }

  const label = theme === "system" ? t.umum.tema.sistem : theme === "light" ? t.umum.tema.terang : t.umum.tema.gelap;

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
