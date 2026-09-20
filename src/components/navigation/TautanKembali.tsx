// Tautan kembali ke halaman sebelumnya.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/actions/Icon";
import styles from "./TautanKembali.module.css";

export interface TautanKembaliProps {
  href: string;
  label: string;
  pakaiRiwayat?: boolean;
  className?: string;
}

export function TautanKembali({ href, label, pakaiRiwayat = false, className }: TautanKembaliProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={[styles.kembali, className].filter(Boolean).join(" ")}
      onClick={
        pakaiRiwayat
          ? (event) => {
              if (window.history.length <= 1) return;
              event.preventDefault();
              router.back();
            }
          : undefined
      }
    >
      <Icon name="ArrowLeft" size={16} />
      {label}
    </Link>
  );
}
