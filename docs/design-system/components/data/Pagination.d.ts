import * as React from "react";

/** Pagination tabel. Menampilkan rentang data ("1–10 dari 248") di kiri. */
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page?: number;
  pageCount?: number;
  /** Total data — untuk teks rentang. */
  total?: number;
  /** Data per halaman — untuk teks rentang. */
  perPage?: number;
  onChange?: (page: number) => void;
}

export declare function Pagination(props: PaginationProps): JSX.Element;
