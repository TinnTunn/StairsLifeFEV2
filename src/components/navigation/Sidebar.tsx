"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { Kamus } from "@/i18n/kamus";
import { Icon, type IconName } from "../actions/Icon";
import styles from "./Sidebar.module.css";

export interface NavItem {
  href: string;
  /** Kunci t.navigasi.item, diterjemahkan sesuai bahasa aktif. */
  label: keyof Kamus["navigasi"]["item"];
  icon: IconName;
  badge?: number;
  badgeTone?: "default" | "danger";
  /** Cocokkan juga rute turunannya. Beranda peran memakai false agar tidak selalu aktif. */
  matchNested?: boolean;
}

export interface NavSection {
  /** Kunci t.navigasi.seksi. */
  section: keyof Kamus["navigasi"]["seksi"];
}

export type SidebarEntry = NavItem | NavSection;

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.matchNested === false) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export interface SidebarProps {
  items: SidebarEntry[];
  brand?: ReactNode;
  footer?: ReactNode;
  role?: string;
  className?: string;
}

/**
 * Item navigasi adalah tautan sungguhan, bukan tombol dengan callback: rutenya
 * bisa dibuka di tab baru, dan status aktif dibaca dari URL sehingga tetap
 * benar setelah muat ulang halaman.
 */
export function Sidebar({ items, brand, footer, role, className }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useBahasa();

  return (
    <nav
      className={[styles.sidebar, className].filter(Boolean).join(" ")}
      aria-label={role ? t.navigasi.aplikasi.navigasiPeran(role) : t.navigasi.aplikasi.navigasi}
    >
      {brand ? <div className={styles.brand}>{brand}</div> : null}
      {role ? <div className={styles.roleLabel}>{role}</div> : null}
      <ul className={styles.list}>
        {items.map((entry) => {
          if ("section" in entry) {
            return (
              <li key={entry.section} className={styles.sectionLabel}>
                {t.navigasi.seksi[entry.section]}
              </li>
            );
          }
          const on = isActive(pathname, entry);
          return (
            <li key={entry.href}>
              <Link href={entry.href} className={styles.item} aria-current={on ? "page" : undefined}>
                <span className={styles.itemIcon}>
                  <Icon name={entry.icon} size={20} />
                </span>
                <span className={styles.itemLabel}>{t.navigasi.item[entry.label]}</span>
                {entry.badge !== undefined && entry.badge > 0 ? (
                  <span
                    className={[styles.badge, entry.badgeTone === "danger" ? styles.badgeDanger : ""]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {entry.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </nav>
  );
}
