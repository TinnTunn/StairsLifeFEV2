"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { formatDesimal } from "@/lib/format";
import styles from "./Rating.module.css";

function Star({ fill, size, gradientId }: { fill: number; size: number; gradientId: string }) {
  const solid = fill >= 1 ? "var(--rating)" : fill <= 0 ? "var(--rating-empty)" : `url(#${gradientId})`;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={styles.star}>
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={fill} stopColor="var(--rating)" />
          <stop offset={fill} stopColor="var(--rating-empty)" />
        </linearGradient>
      </defs>
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95z" fill={solid} />
    </svg>
  );
}

export interface RatingProps {
  value?: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  editable?: boolean;
  onChange?: (value: number) => void;
  label?: string;
  className?: string;
}

/**
 * Mode editable adalah radiogroup sungguhan dengan roving tabIndex dan navigasi
 * panah. Bintang adalah kolom wajib di alur ulasan, jadi versi yang hanya bisa
 * diklik mouse membuat langkah terakhir alur kontrak mustahil diselesaikan.
 */
export function Rating({
  value = 0,
  count,
  size = "md",
  showValue = true,
  editable = false,
  onChange,
  label,
  className,
}: RatingProps) {
  const { t, bahasa } = useBahasa();
  const [hover, setHover] = useState(0);
  const uid = useId();
  const px = size === "lg" ? 20 : size === "sm" ? 13 : 16;
  const active = hover || value;

  function handleKey(event: KeyboardEvent<HTMLSpanElement>, index: number) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onChange?.(index);
      return;
    }
    const map: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowUp: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index - 1,
      Home: 1,
      End: 5,
    };
    const next = map[event.key];
    if (!next) return;
    event.preventDefault();
    const clamped = Math.max(1, Math.min(5, next));
    onChange?.(clamped);
    const sibling = event.currentTarget.parentElement?.children[clamped - 1];
    if (sibling instanceof HTMLElement) sibling.focus();
  }

  return (
    <span
      className={[styles.wrap, size === "sm" ? styles.wrapSm : "", className].filter(Boolean).join(" ")}
      role={editable ? "radiogroup" : "img"}
      aria-label={editable ? (label ?? t.komponen.rating.beri) : t.komponen.rating.nilai(formatDesimal(value, 1, bahasa))}
    >
      <span
        className={[styles.stars, editable ? styles.starsEditable : ""].filter(Boolean).join(" ")}
        onMouseLeave={() => editable && setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, active - i + 1));
          const star = <Star fill={fill} size={px} gradientId={`${uid}-${i}`} />;
          if (!editable) return <span key={i}>{star}</span>;
          return (
            <span
              key={i}
              role="radio"
              aria-checked={value === i}
              aria-label={t.komponen.rating.bintang(i)}
              tabIndex={value ? (value === i ? 0 : -1) : i === 1 ? 0 : -1}
              className={styles.starBox}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(0)}
              onClick={() => onChange?.(i)}
              onKeyDown={(e) => handleKey(e, i)}
            >
              {star}
            </span>
          );
        })}
      </span>
      {showValue ? (
        <span className={[styles.value, size === "lg" ? styles.valueLg : ""].filter(Boolean).join(" ")}>
          {formatDesimal(value, 1, bahasa)}
        </span>
      ) : null}
      {count !== undefined ? <span className={styles.count}>({t.komponen.rating.ulasan(count)})</span> : null}
    </span>
  );
}
