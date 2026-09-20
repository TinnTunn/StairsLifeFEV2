// Layout grup publik: kepala dan kaki situs.

import type { ReactNode } from "react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import styles from "./publik.module.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <PublicHeader />
      <main className={styles.main} id="konten" tabIndex={-1}>{children}</main>
      <PublicFooter />
    </div>
  );
}
