// Navigasi bawah untuk layar sempit.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon } from "../actions/Icon";
import { isActive, type NavItem } from "./Sidebar";
import styles from "./BottomNav.module.css";

export interface BottomNavProps {
  items: NavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useBahasa();

  return (
    <nav className={[styles.nav, className].filter(Boolean).join(" ")} aria-label={t.navigasi.aplikasi.navigasiBawah}>
      {items.slice(0, 5).map((item) => {
        const on = isActive(pathname, item);
        return (
          <Link key={item.href} href={item.href} className={styles.item} aria-current={on ? "page" : undefined}>
            <span className={styles.iconWrap}>
              <Icon name={item.icon} size={22} />
              {item.badge ? (
                <span
                  className={[styles.dot, item.badgeTone === "danger" ? styles.dotDanger : ""]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                />
              ) : null}
            </span>
            <span className={styles.label}>{t.navigasi.item[item.label]}</span>
            {item.badge ? <span className="sl-visually-hidden">{t.navigasi.aplikasi.belumDibaca(item.badge)}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
