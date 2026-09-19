import * as React from "react";

/**
 * Placeholder saat memuat. Shimmer halus 1,4s; berhenti otomatis bila
 * pengguna memilih prefers-reduced-motion (token durasi ikut turun).
 * Jangan pakai spinner untuk halaman penuh — pakai skeleton berbentuk kontennya.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  radius?: string;
  /** Lingkaran seukuran `height` — untuk avatar. */
  circle?: boolean;
}

export interface SkeletonCardProps {
  lines?: number;
  /** Sertakan bulatan avatar di baris atas. */
  media?: boolean;
  style?: React.CSSProperties;
}

export interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  style?: React.CSSProperties;
}

export declare function Skeleton(props: SkeletonProps): JSX.Element;
export declare function SkeletonCard(props: SkeletonCardProps): JSX.Element;
export declare function SkeletonTable(props: SkeletonTableProps): JSX.Element;
