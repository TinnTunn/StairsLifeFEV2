"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../actions/Icon";
import { IconButton } from "../actions/IconButton";
import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./Modal.module.css";

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "danger" | "success";
  /** false untuk keputusan dana: pengguna harus memilih, bukan menutup begitu saja. */
  dismissible?: boolean;
}

const WIDTH = { sm: 400, md: 520, lg: 720 };

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  tone = "default",
  dismissible = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { t } = useBahasa();
  const titleId = useId();
  const descId = useId();

  /* onClose dan dismissible disimpan di ref, dan efek di bawah sengaja hanya
     bergantung pada `open`.

     Pemanggil menulis onClose sebagai fungsi inline, jadi identitasnya baru di
     setiap render. Ketika keduanya masih jadi dependensi, satu ketikan di
     dalam modal sudah cukup membuat efek ini dibersihkan lalu dipasang ulang:
     pembersihannya mengembalikan fokus ke pemicu, pemasangannya memindahkan
     fokus ke elemen pertama di dialog. Akibatnya kolom isian di dalam modal
     hanya menerima satu huruf, sisanya jatuh ke tombol. */
  const onCloseRef = useRef(onClose);
  const dismissibleRef = useRef(dismissible);
  useEffect(() => {
    onCloseRef.current = onClose;
    dismissibleRef.current = dismissible;
  });

  useEffect(() => {
    if (!open) return;

    /* Simpan pemicu supaya fokus kembali ke tempat asalnya saat modal tutup.
       Tanpa ini pengguna keyboard dilempar ke awal halaman. */
    returnFocusRef.current = document.activeElement as HTMLElement | null;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialogRef.current)?.focus();

    /* Jebakan fokus saja tidak cukup: dengan kursor virtual, pembaca layar
       tetap bisa menyusuri halaman di belakang overlay. inert mengeluarkan
       seluruh isi di luar dialog dari fokus sekaligus dari pohon aksesibilitas. */
    const diluar = Array.from(document.body.children).filter(
      (anak) => !anak.contains(dialogRef.current) && !anak.hasAttribute("inert"),
    );
    diluar.forEach((anak) => anak.setAttribute("inert", ""));

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dismissibleRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      /* Jebakan fokus: tanpa ini Tab keluar dari dialog ke halaman di belakangnya,
         yang secara visual tertutup overlay sehingga fokusnya menghilang. */
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      diluar.forEach((anak) => anak.removeAttribute("inert"));
      returnFocusRef.current?.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const toneClass = tone === "danger" ? styles.toneDanger : tone === "success" ? styles.toneSuccess : "";

  return createPortal(
    <div
      className={styles.overlay}
      role="presentation"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={[styles.dialog, toneClass].filter(Boolean).join(" ")}
        style={{ maxWidth: WIDTH[size] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.head}>
          <div className={styles.headRow}>
            <div className={styles.headText}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description ? (
                <p id={descId} className={styles.description}>
                  {description}
                </p>
              ) : null}
            </div>
            {dismissible ? (
              <IconButton label={t.komponen.modal.tutup} onClick={onClose} size="sm">
                <Icon name="XCircle" size={18} />
              </IconButton>
            ) : null}
          </div>
          {children}
        </div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
