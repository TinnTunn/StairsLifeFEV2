import * as React from "react";

/**
 * Lockup StairsLife. Wordmark dirender sebagai **teks hidup** dalam
 * `--font-display`, bukan gambar — jadi tajam di semua ukuran, ikut warna
 * induknya, dan tidak perlu aset raster. Mark kayu tetap SVG.
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tinggi mark dalam px; ukuran wordmark mengikuti (0.78×). Default 22. */
  size?: number;
  /** Sembunyikan wordmark, sisakan mark saja. Default true (tampil). */
  wordmark?: boolean;
  /**
   * teak = utama · walnut = cetak & merchandise · flat = di bawah 22px.
   * `flat` dirender sebagai SVG inline dengan `fill="currentColor"`, jadi
   * warnanya mengikuti `color` / induknya. Varian kayu memakai `<img>`
   * karena fill-nya eksplisit.
   */
  wood?: "teak" | "walnut" | "flat";
  /** Warna wordmark. Default `--text-strong`; pakai `--ink-text` di permukaan tinta. */
  color?: string;
  /** Path relatif ke folder assets. Default "assets". */
  basePath?: string;
}

export declare function Logo(props: LogoProps): JSX.Element;
