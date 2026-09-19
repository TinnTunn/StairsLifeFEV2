"use client";

import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./Skeleton.module.css";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  className?: string;
}

export function Skeleton({ width = "100%", height = 14, circle = false, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.bar, circle ? styles.circle : "", className].filter(Boolean).join(" ")}
      style={{ width: circle ? height : width, height }}
    />
  );
}

/**
 * Pembungkus kerangka selalu membawa label teks untuk pembaca layar: balok
 * abu-abu sendirian tidak mengumumkan apa pun, jadi pengguna pembaca layar
 * tidak tahu ada yang sedang dimuat.
 */
export function SkeletonCard({ lines = 2, media = false, label }: { lines?: number; media?: boolean; label?: string }) {
  const { t } = useBahasa();
  return (
    <div className={styles.card} role="status" aria-live="polite">
      <span className="sl-visually-hidden">{label ?? t.umum.memuat}</span>
      <div className={styles.cardHead}>
        {media ? <Skeleton height={40} circle /> : null}
        <div className={styles.cardHeadText}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "55%" : "100%"} height={12} />
      ))}
    </div>
  );
}
