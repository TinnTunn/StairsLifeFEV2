import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  children: ReactNode;
  /** Wajib: ikon di dalamnya aria-hidden, jadi ini satu-satunya nama kontrol. */
  label: string;
  variant?: "ghost" | "outline" | "solid" | "danger";
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  children,
  label,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={[styles.btn, styles[variant], styles[size], className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
