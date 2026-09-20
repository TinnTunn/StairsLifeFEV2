// Tombol dasar dengan ragam warna dan ukuran.

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "white" | "outlineWhite";
type Size = "sm" | "md" | "lg" | "xl";

interface Common {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}

type ButtonElementProps = Common &
  Omit<ComponentPropsWithoutRef<"button">, keyof Common> & { href?: undefined };

type LinkElementProps = Common &
  Omit<ComponentPropsWithoutRef<"a">, keyof Common> & { href: string };

export type ButtonProps = ButtonElementProps | LinkElementProps;

function Spinner({ size }: { size: number }) {
  return <span aria-hidden="true" className={styles.spinner} style={{ width: size, height: size }} />;
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    iconLeft,
    iconRight,
    className,
    ...rest
  } = props;

  const cls = [styles.btn, styles[variant], styles[size], fullWidth ? styles.fullWidth : "", className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <Spinner size={size === "sm" ? 14 : 16} /> : iconLeft}
      {children}
      {!loading && iconRight}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ComponentPropsWithoutRef<"a"> & { href: string };
    if (loading) {
      return (
        <span {...anchorRest} className={cls} aria-disabled="true" aria-busy="true" role="link">
          {content}
        </span>
      );
    }
    return (
      <Link {...anchorRest} href={href} className={cls}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonRest } = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button
      {...buttonRest}
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
