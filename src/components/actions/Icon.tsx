// Pembungkus ikon yang menyeragamkan ukuran dan ketebalan garis.

import { ALIAS_GAMBAR, IKON_GAMBAR, type IkonGambar } from "./icon-gambar";
import { ICONS, type IconName, type LucideName } from "./icon-registry";
import styles from "./Icon.module.css";

export type { IconName };

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

function gambarUntuk(name: IconName): IkonGambar | null {
  if (name in IKON_GAMBAR) return IKON_GAMBAR[name as keyof typeof IKON_GAMBAR];
  const alias = ALIAS_GAMBAR[name as LucideName];
  return alias ? IKON_GAMBAR[alias] : null;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const gambar = gambarUntuk(name);
  const dalamBatas = gambar && (gambar.min === undefined || size >= gambar.min) && (gambar.maks === undefined || size <= gambar.maks);

  if (gambar && dalamBatas) {
    const url = `url("${gambar.src}")`;
    return (
      <span
        aria-hidden="true"
        data-ikon=""
        className={[styles.gambar, className].filter(Boolean).join(" ")}
        style={{ width: size, height: size, WebkitMaskImage: url, maskImage: url }}
      />
    );
  }

  const Glyph = ICONS[gambar ? gambar.cadangan : (name as LucideName)];
  return (
    <Glyph
      width={size}
      height={size}
      strokeWidth={1.75}
      aria-hidden="true"
      focusable="false"
      data-ikon=""
      className={className}
      style={{ display: "block", flex: "none" }}
    />
  );
}
