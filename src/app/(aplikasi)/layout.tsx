// Layout grup aplikasi: memasang shell dan penjaga sesi satu kali.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShellAplikasi } from "@/components/layout/ShellAplikasi";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AplikasiLayout({ children }: { children: ReactNode }) {
  return <ShellAplikasi>{children}</ShellAplikasi>;
}
