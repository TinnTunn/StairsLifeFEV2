// Avatar pengguna dengan huruf awal sebagai cadangan.

"use client";

import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./Avatar.module.css";

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 } as const;
type Size = keyof typeof SIZES;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function initialSize(px: number): number {
  if (px <= 24) return 10;
  if (px <= 32) return 12;
  if (px <= 40) return 14;
  if (px <= 56) return 18;
  return 24;
}

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: Size;
  verified?: boolean;
  online?: boolean;
  shape?: "circle" | "rounded";
  className?: string;
}

export function Avatar({
  name,
  src,
  size = "md",
  verified = false,
  online = false,
  shape = "circle",
  className,
}: AvatarProps) {
  const { t } = useBahasa();
  const px = SIZES[size];
  const badge = Math.max(14, Math.round(px * 0.34));
  const dot = Math.max(9, Math.round(px * 0.24));

  return (
    <span className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <span
        className={[styles.face, shape === "rounded" ? styles.rounded : "", src ? styles.withPhoto : ""]
          .filter(Boolean)
          .join(" ")}
        style={{ width: px, height: px, fontSize: initialSize(px) }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className={styles.photo} width={px} height={px} loading="lazy" decoding="async" />
        ) : (
          initials(name)
        )}
      </span>
      {verified ? (
        <span className={styles.check} style={{ width: badge, height: badge }} title={t.komponen.avatar.terverifikasi}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width={Math.max(8, Math.round(px * 0.2))} height={Math.max(8, Math.round(px * 0.2))} fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      ) : online ? (
        <span className={styles.online} style={{ width: dot, height: dot }} title={t.komponen.avatar.aktif} />
      ) : null}
    </span>
  );
}
