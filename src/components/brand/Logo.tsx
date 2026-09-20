// Logo StairsLife dalam beberapa ragam warna.

import styles from "./Logo.module.css";

const WOOD_FILE = {
  teak: "/assets/logo-mark-wood.svg",
  walnut: "/assets/logo-mark-wood-walnut.svg",
} as const;

function FlatMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className={styles.mark}>
      <rect x="4" y="40" width="56" height="16" rx="2" fill="currentColor" />
      <rect x="12" y="22" width="40" height="14" rx="2" fill="currentColor" />
      <rect x="20" y="6" width="24" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

export interface LogoProps {
  size?: number;
  wordmark?: boolean;
  wood?: "teak" | "walnut" | "flat";
  surface?: "default" | "ink";
  className?: string;
}

export function Logo({ size = 22, wordmark = true, wood = "teak", surface = "default", className }: LogoProps) {
  return (
    <span
      className={[styles.logo, surface === "ink" ? styles.ink : "", className].filter(Boolean).join(" ")}
      style={{ gap: Math.round(size * 0.42) }}
    >
      {wood === "flat" ? (
        <FlatMark size={size} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={WOOD_FILE[wood]}
          width={size}
          height={size}
          alt={wordmark ? "" : "StairsLife"}
          className={styles.mark}
        />
      )}
      {wordmark ? (
        <b className={styles.wordmark} style={{ fontSize: Math.round(size * 0.78) }}>
          StairsLife
        </b>
      ) : null}
    </span>
  );
}
