import * as React from "react";

/**
 * Ikon Lucide (CDN). Nama ikon PascalCase seperti di lucide.dev — "Wallet",
 * "ShieldCheck", "FileText". Selalu dekoratif (aria-hidden); teks pendamping
 * yang menjelaskan maknanya.
 */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Nama ikon Lucide, PascalCase. */
  name: string;
  /** 16 inline · 20 UI (default) · 24 navigasi · 32+ empty state */
  size?: number;
  /** Default 1.75. Jangan di bawah 1.5. */
  strokeWidth?: number;
  color?: string;
}

export declare function Icon(props: IconProps): JSX.Element;
