"use client";

import type { ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon, type IconName } from "../actions/Icon";
import { IconButton } from "../actions/IconButton";
import styles from "./Toast.module.css";

type Tone = "info" | "success" | "warning" | "danger";

const GLYPH: Record<Tone, IconName> = {
  info: "Info",
  success: "Check",
  warning: "AlertTriangle",
  danger: "XCircle",
};

export interface ToastProps {
  tone?: Tone;
  title: string;
  description?: string;
  action?: ReactNode;
  onClose?: () => void;
}

export function Toast({ tone = "info", title, description, action, onClose }: ToastProps) {
  const { t } = useBahasa();
  return (
    /* danger memakai role="alert" agar diumumkan langsung; sisanya "status"
       supaya tidak memotong apa yang sedang dibaca pengguna. */
    <div role={tone === "danger" ? "alert" : "status"} className={`${styles.toast} ${styles[tone]}`}>
      <span className={styles.mark} aria-hidden="true">
        <Icon name={GLYPH[tone]} size={14} />
      </span>
      <div className={styles.body}>
        <span className={styles.title}>{title}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
        {action ? <span className={styles.action}>{action}</span> : null}
      </div>
      {onClose ? (
        <IconButton label={t.komponen.toast.tutup} onClick={onClose} size="sm">
          <Icon name="XCircle" size={14} />
        </IconButton>
      ) : null}
    </div>
  );
}

export function ToastStack({ children }: { children: ReactNode }) {
  return (
    <div aria-live="polite" className={styles.stack}>
      {children}
    </div>
  );
}
