// Layout grup panel untuk pintu masuk admin.

import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./panel.module.css";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.bar}>
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <main className={styles.main} id="konten" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
