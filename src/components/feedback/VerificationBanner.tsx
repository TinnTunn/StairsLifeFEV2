// Pita ajakan menyelesaikan verifikasi akun.

"use client";

import Link from "next/link";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon, type IconName } from "../actions/Icon";
import styles from "./VerificationBanner.module.css";

type Status = "belum_diajukan" | "menunggu_review" | "ditolak" | "disuspend" | "terverifikasi";
type Role = "mahasiswa" | "bisnis";
type Tampil = Exclude<Status, "terverifikasi">;

const TONE: Record<Tampil, string> = {
  belum_diajukan: styles.warning,
  menunggu_review: styles.neutral,
  ditolak: styles.danger,
  disuspend: styles.danger,
};

const IKON: Record<Tampil, IconName> = {
  belum_diajukan: "BadgeCheck",
  menunggu_review: "Clock",
  ditolak: "AlertTriangle",
  disuspend: "Lock",
};

export interface VerificationBannerProps {
  status: Status;
  role?: Role;
  reason?: string;
  href?: string;
  actionLabel?: string;
  className?: string;
}

export function VerificationBanner({ status, role = "mahasiswa", reason, href, actionLabel, className }: VerificationBannerProps) {
  const { t } = useBahasa();
  if (status === "terverifikasi") return null;
  if (role === "bisnis" && status !== "disuspend") return null;
  const teks = t.komponen.banner[status];
  const isi = status === "ditolak" || status === "disuspend" ? (reason ?? teks.isi) : teks.isi;

  return (
    <div role="status" className={[styles.banner, TONE[status], className].filter(Boolean).join(" ")}>
      <span className={styles.mark} aria-hidden="true">
        <Icon name={IKON[status]} size={20} />
      </span>
      <span className={styles.text}>
        <b className={styles.title}>{teks.judul}</b>
        <span className={styles.body}>{isi}</span>
      </span>
      {href ? (
        <Link href={href} className={styles.action}>
          {actionLabel ?? teks.aksi}
        </Link>
      ) : null}
    </div>
  );
}
