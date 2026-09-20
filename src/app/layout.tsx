// Layout akar: font, tema, bahasa, dan metadata dasar situs.

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Manrope, Schibsted_Grotesk } from "next/font/google";
import { BilahOffline } from "@/components/feedback/BilahOffline";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { KeluarProvider } from "@/components/layout/KeluarProvider";
import { PengelolaGulirJendela } from "@/lib/gulir";
import { LewatiKonten } from "@/components/LewatiKonten";
import { BahasaProvider } from "@/i18n/BahasaProvider";
import { ambilKamus } from "@/i18n/server";
import { SITUS_URL } from "@/lib/situs";
import { themeInitScript } from "@/lib/theme";
import "@/styles/styles.css";
import "@/styles/tema.css";
import "@/styles/app.css";
import "@/styles/motion.css";

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-src",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans-src",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t, bahasa } = await ambilKamus();
  return {
    metadataBase: new URL(SITUS_URL),
    title: {
      default: t.umum.meta.situs,
      template: `%s · ${t.umum.meta.situs}`,
    },
    description: t.umum.meta.deskripsi,
    applicationName: t.umum.meta.situs,
    openGraph: {
      type: "website",
      siteName: t.umum.meta.situs,
      locale: bahasa === "en" ? "en_GB" : "id_ID",
      title: t.umum.meta.situs,
      description: t.umum.meta.deskripsi,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { bahasa } = await ambilKamus();
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang={bahasa} data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <BahasaProvider awal={bahasa}>
          <LewatiKonten />
          <KeluarProvider>{children}</KeluarProvider>
          <PengelolaGulirJendela />
          <RevealObserver />
          <BilahOffline />
        </BahasaProvider>
      </body>
    </html>
  );
}
