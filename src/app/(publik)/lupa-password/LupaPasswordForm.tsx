// Formulir permintaan atur ulang kata sandi.

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Input } from "@/components/forms/Input";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth } from "@/lib/api/auth";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import styles from "../masuk/auth.module.css";

export function LupaPasswordForm() {
  const { t } = useBahasa();
  const l = t.auth.lupa;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [terkirim, setTerkirim] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(l.modeContoh);
        return;
      }
      await auth.forgotPassword(email);
      setTerkirim(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.umum.galat.jaringan);
    } finally {
      setLoading(false);
    }
  }

  if (terkirim) {
    return (
      <div role="status">
        <EmptyState icon="MailCheck" title={l.terkirimJudul} description={l.terkirim(email)} />
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {error ? (
        <p className={styles.error} role="alert">
          <Icon name="AlertTriangle" size={18} />
          {error}
        </p>
      ) : null}
      <Input
        label={t.auth.bidang.email}
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.auth.bidang.emailContoh}
        iconLeft={<Icon name="Mail" size={18} />}
      />
      <Button type="submit" size="lg" fullWidth loading={loading}>
        {l.kirim}
      </Button>
    </form>
  );
}
