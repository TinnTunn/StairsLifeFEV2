// Penampil nominal rupiah dengan pemisah ribuan.

import type { ComponentPropsWithoutRef } from "react";
import { formatRupiah } from "@/lib/format";
import styles from "./Money.module.css";

type Tone = "default" | "in" | "out" | "held" | "muted";

const TONE: Record<Tone, string> = {
  default: styles.toneDefault,
  in: styles.toneIn,
  out: styles.toneOut,
  held: styles.toneHeld,
  muted: styles.toneMuted,
};

export interface MoneyProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  value: number | string;
  size?: "sm" | "md" | "lg";
  tone?: Tone;
  sign?: boolean;
  label?: string;
}

export function Money({
  value,
  size = "md",
  tone = "default",
  sign = false,
  label,
  className,
  ...rest
}: MoneyProps) {
  const text = typeof value === "string" ? value : formatRupiah(value, { sign });
  return (
    <span
      {...rest}
      className={[styles.wrap, label ? styles.withLabel : "", className].filter(Boolean).join(" ")}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={`sl-money ${styles.value} ${styles[size]} ${TONE[tone]}`}>{text}</span>
    </span>
  );
}
