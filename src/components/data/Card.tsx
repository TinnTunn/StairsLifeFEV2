// Kartu dasar bergaris sebagai wadah isi.

import type { ElementType, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps {
  children: ReactNode;
  as?: ElementType;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  selected?: boolean;
  raised?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const PAD = { none: styles.padNone, sm: styles.padSm, md: "", lg: styles.padLg };

export function Card({
  children,
  as: Tag = "div",
  padding = "md",
  interactive = false,
  selected = false,
  raised = false,
  header,
  footer,
  className,
  ...rest
}: CardProps & Record<string, unknown>) {
  return (
    <Tag
      {...rest}
      className={[
        styles.card,
        PAD[padding],
        interactive ? styles.interactive : "",
        selected ? styles.selected : "",
        raised ? styles.raised : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {header ? <div className={styles.header}>{header}</div> : null}
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </Tag>
  );
}
