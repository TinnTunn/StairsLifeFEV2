import * as React from "react";

export interface TimelineItem {
  label: string;
  /** Cap waktu siap tampil, mis. "12 Sep 2026 · 14:20". */
  time?: string;
  description?: string;
  /** Pelaku, mis. "Kopi Senja Malang" atau "Admin". */
  by?: string;
  /** done: sudah terjadi (hijau) · active: sedang berlangsung (terakota) · todo: belum (abu) · alert: hasil negatif (merah) */
  tone?: "done" | "active" | "todo" | "alert";
}

/**
 * Timeline riwayat status vertikal — detail lamaran (mahasiswa) dan detail
 * pelamar (bisnis). Berbeda dari ContractStepper: ini riwayat yang sudah
 * terjadi dengan cap waktu dan pelaku, bukan tahap yang akan datang.
 */
export interface StatusTimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

export declare function StatusTimeline(props: StatusTimelineProps): JSX.Element;
