// Kerangka kolom formulir: label, petunjuk, dan pesan galat.

import type { ReactNode } from "react";
import styles from "./field.module.css";

export interface FieldMeta {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function fieldIds(prefix: string, id?: string, name?: string, label?: string) {
  const base = id ?? name ?? (label ? `${prefix}-${label.replace(/\s+/g, "-").toLowerCase()}` : prefix);
  return { id: base, errorId: `${base}-err`, hintId: `${base}-hint` };
}

export function FieldShell({
  label,
  hint,
  error,
  required,
  htmlFor,
  errorId,
  hintId,
  className,
  children,
}: FieldMeta & {
  htmlFor: string;
  errorId: string;
  hintId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label ? (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span id={errorId} role="alert" className={styles.error}>
          <span className={styles.errorMark} aria-hidden="true">
            !
          </span>
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export { styles as fieldStyles };
