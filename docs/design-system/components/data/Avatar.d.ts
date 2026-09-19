import * as React from "react";

/**
 * Avatar pengguna. Tanpa foto: inisial di atas latar terakota lembut.
 * `verified` = centang hijau — hanya untuk identitas yang sudah lolos verifikasi
 * (mahasiswa ber-KTM, bisnis terverifikasi).
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string;
  /** xs 24 · sm 32 · md 40 · lg 56 · xl 72 */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  verified?: boolean;
  online?: boolean;
  /** circle untuk orang, rounded untuk logo bisnis. */
  shape?: "circle" | "rounded";
}

export interface AvatarGroupProps {
  people: Array<{ name?: string; src?: string }>;
  size?: "xs" | "sm" | "md";
  /** Sisanya jadi "+N". Default 4. */
  max?: number;
  style?: React.CSSProperties;
}

export declare function Avatar(props: AvatarProps): JSX.Element;
export declare function AvatarGroup(props: AvatarGroupProps): JSX.Element;
