"use client";

import { useState } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { ApiError, apiFetch } from "@/lib/api/client";
import { Button } from "../actions/Button";
import { Icon } from "../actions/Icon";
import styles from "./TombolBerkas.module.css";

/**
 * Berkas verifikasi, hasil kerja, dan bukti sengketa ada di bucket privat.
 * Tab dibuka saat klik, lalu diarahkan setelah signed URL didapat, supaya
 * tidak diblokir sebagai popup. Backend yang memutuskan siapa boleh membuka.
 */
export function TombolBerkas({
  path,
  label,
  icon = "FileImage",
}: {
  path: string;
  label: string;
  icon?: "FileImage" | "FileText" | "Paperclip";
}) {
  const { t } = useBahasa();
  const [membuka, setMembuka] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buka() {
    setError(null);
    if (path.startsWith("https://")) {
      window.open(path, "_blank", "noopener");
      return;
    }
    const tab = window.open("", "_blank");
    if (tab) tab.opener = null;
    setMembuka(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/upload/signed-url", { query: { path } });
      if (tab) tab.location.href = url;
      else window.location.assign(url);
    } catch (e) {
      tab?.close();
      setError(e instanceof ApiError ? e.message : t.admin.umum.gagalBuka);
    } finally {
      setMembuka(false);
    }
  }

  return (
    <span className={styles.berkas}>
      <Button size="sm" variant="secondary" onClick={buka} loading={membuka} iconLeft={<Icon name={icon} size={16} />}>
        {label}
      </Button>
      {error ? (
        <span role="alert" className={styles.galat}>
          {error}
        </span>
      ) : null}
    </span>
  );
}
