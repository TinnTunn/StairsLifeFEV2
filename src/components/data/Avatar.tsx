"use client";

import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./Avatar.module.css";

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 } as const;
type Size = keyof typeof SIZES;

/* Inisial, bukan foto orang yang dikarang. Placeholder yang terlihat seperti
   wajah asli menyamarkan bahwa datanya belum ada. */
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
          /* next/image butuh domain terkonfigurasi; avatar datang dari Supabase
             Storage dengan host yang berbeda antar lingkungan. */
          /* width dan height ditulis supaya kotaknya sudah punya ukuran sebelum
             gambar tiba: tanpa itu isi di sekitarnya bergeser saat foto selesai
             diunduh. */
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

export interface AvatarGroupProps {
  people: Array<{ name: string; src?: string | null }>;
  size?: Size;
  max?: number;
  className?: string;
}

export function AvatarGroup({ people, size = "sm", max = 4, className }: AvatarGroupProps) {
  const px = SIZES[size];
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const overlap = -Math.round(px * 0.3);

  return (
    <span className={[styles.group, className].filter(Boolean).join(" ")}>
      {shown.map((p, i) => (
        <span key={`${p.name}-${i}`} className={styles.stacked} style={{ marginLeft: i === 0 ? 0 : overlap }}>
          <Avatar name={p.name} src={p.src} size={size} />
        </span>
      ))}
      {rest > 0 ? (
        <span
          className={styles.more}
          style={{ marginLeft: overlap, width: px, height: px, fontSize: px <= 32 ? 11 : 13 }}
        >
          +{rest}
        </span>
      ) : null}
    </span>
  );
}
