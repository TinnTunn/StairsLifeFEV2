import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShellAplikasi } from "@/components/layout/ShellAplikasi";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/* Satu shell untuk semua halaman yang butuh akun. Layout ini tidak dibongkar
   saat berpindah antarhalaman di dalamnya, jadi sidebar, topbar, dan posisi
   gulir kontainer tetap. */
export default function AplikasiLayout({ children }: { children: ReactNode }) {
  return <ShellAplikasi>{children}</ShellAplikasi>;
}
