import { ALIAS_GAMBAR, IKON_GAMBAR, type IkonGambar } from "./icon-gambar";
import { ICONS, type IconName, type LucideName } from "./icon-registry";
import styles from "./Icon.module.css";

export type { IconName };

export interface IconProps {
  name: IconName;
  /** 16 inline, 20 UI (default), 24 navigasi, 28 sampai 36 empty state. */
  size?: number;
  className?: string;
}

function gambarUntuk(name: IconName): IkonGambar | null {
  if (name in IKON_GAMBAR) return IKON_GAMBAR[name as keyof typeof IKON_GAMBAR];
  const alias = ALIAS_GAMBAR[name as LucideName];
  return alias ? IKON_GAMBAR[alias] : null;
}

/**
 * Ikon selalu dekoratif: maknanya dibawa teks pendamping, bukan glyph-nya.
 * Kalau ikon berdiri sendiri di dalam kontrol, kontrol itu yang wajib punya
 * label (lihat IconButton).
 *
 * Nama yang punya padanan PNG (icon-gambar.ts) dirender sebagai gambar selama
 * ukurannya masih dalam batas tajamnya; di luar batas itu dipakai Lucide.
 */
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
      /* 1.75 dikunci di sini, bukan diserahkan ke pemanggil: default Lucide (2)
         terlalu tebal berdampingan dengan Archivo 15px. */
      strokeWidth={1.75}
      aria-hidden="true"
      focusable="false"
      data-ikon=""
      className={className}
      style={{ display: "block", flex: "none" }}
    />
  );
}
