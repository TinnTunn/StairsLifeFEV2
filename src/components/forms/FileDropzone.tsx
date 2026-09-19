"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { Icon } from "../actions/Icon";
import { IconButton } from "../actions/IconButton";
import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./FileDropzone.module.css";

export interface FileDropzoneProps {
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  onRemove?: (index: number) => void;
  error?: string;
  disabled?: boolean;
}

function ukuran(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

/**
 * Zona jatuhnya adalah <button> sungguhan, bukan div ber-role.
 * Tarik-lepas tidak punya padanan keyboard, jadi memilih lewat tombol harus
 * benar-benar bisa difokus dan ditekan dengan Enter atau Spasi.
 */
export function FileDropzone({
  label,
  hint,
  accept,
  multiple = false,
  files,
  onFiles,
  onRemove,
  error,
  disabled = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useBahasa();
  const [over, setOver] = useState(false);
  const errorId = useId();

  function terima(list: FileList | null) {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  }

  function jatuh(event: DragEvent) {
    event.preventDefault();
    setOver(false);
    if (!disabled) terima(event.dataTransfer.files);
  }

  return (
    <div className={styles.wrap}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <button
        type="button"
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        className={[styles.zone, over ? styles.zoneOver : "", error ? styles.zoneInvalid : ""]
          .filter(Boolean)
          .join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={jatuh}
      >
        <span className={styles.zoneIcon}>
          <Icon name="Upload" size={28} />
        </span>
        <span>
          {t.komponen.dropzone.tarik} <span className={styles.pick}>{t.komponen.dropzone.pilih}</span>
        </span>
        <span className={styles.hint}>{hint ?? t.komponen.dropzone.petunjuk}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => terima(e.target.files)}
        className="sl-visually-hidden"
        tabIndex={-1}
      />

      {error ? (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      ) : null}

      {files.length > 0 ? (
        <ul className={styles.list}>
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className={styles.item}>
              <span className={styles.itemIcon}>
                <Icon name="FileText" size={16} />
              </span>
              <span className={styles.itemName}>{f.name}</span>
              <span className={styles.itemSize}>{ukuran(f.size)}</span>
              {onRemove ? (
                <IconButton label={t.komponen.dropzone.hapus(f.name)} size="sm" onClick={() => onRemove(i)}>
                  <Icon name="Trash2" size={15} />
                </IconButton>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
