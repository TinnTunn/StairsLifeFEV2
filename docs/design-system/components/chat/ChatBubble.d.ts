import * as React from "react";

/**
 * Gelembung chat. `side="right"` = pesan pengguna sendiri (terakota solid),
 * kiri = lawan bicara (kartu putih bergaris). `system` = catatan sistem di
 * tengah, dipakai untuk peristiwa escrow di dalam percakapan.
 */
export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  side?: "left" | "right";
  /** Nama pengirim, hanya tampil di sisi kiri. */
  author?: string;
  /** Waktu singkat, mis. "14:32". */
  time?: string;
  status?: "sending" | "sent" | "read";
  attachment?: { name: string; size?: string };
  /** Catatan sistem (pill abu di tengah), mis. "Dana Rp 2.500.000 masuk escrow". */
  system?: boolean;
  showAvatar?: boolean;
  avatar?: React.ReactNode;
}

export declare function ChatBubble(props: ChatBubbleProps): JSX.Element;
