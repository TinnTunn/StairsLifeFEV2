// Tampilan daftar kosong beserta ajakan lanjutannya.

import type { ReactNode } from "react";
import { Icon, type IconName } from "../actions/Icon";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  size?: "md" | "lg";
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  return (
    <div className={[styles.wrap, size === "lg" ? styles.lg : "", className].filter(Boolean).join(" ")}>
      <span className={styles.icon}>
        <Icon name={icon} size={size === "lg" ? 36 : 28} />
      </span>
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action || secondaryAction ? (
        <div className={styles.actions}>
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
