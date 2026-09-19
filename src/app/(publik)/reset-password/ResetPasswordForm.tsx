"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Input } from "@/components/forms/Input";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth } from "@/lib/api/auth";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import styles from "../masuk/auth.module.css";

export function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const { t } = useBahasa();
  const r = t.auth.reset;
  const [sandi, setSandi] = useState("");
  const [ulangi, setUlangi] = useState("");
  const [loading, setLoading] = useState(false);
  const [selesai, setSelesai] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <EmptyState
        icon="KeyRound"
        title={r.tanpaTokenJudul}
        description={r.tanpaTokenIsi}
        action={<Button href="/lupa-password">{r.mintaBaru}</Button>}
      />
    );
  }

  if (selesai) {
    return (
      <EmptyState
        icon="Check"
        title={r.selesaiJudul}
        description={r.selesaiIsi}
        action={<Button href="/masuk">{r.masuk}</Button>}
      />
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (sandi.length < 8) {
      setError(t.auth.galat.sandiPendek);
      return;
    }
    if (sandi !== ulangi) {
      setError(t.auth.galat.sandiBeda);
      return;
    }

    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(t.umum.galat.modeContoh);
        return;
      }
      await auth.resetPassword(token!, sandi);
      setSelesai(true);
    } catch (e) {
      setError(e instanceof ApiError ? `${e.message} ${r.tautanBerlaku}` : t.umum.galat.jaringan);
    } finally {
      setLoading(false);
    }
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
        label={r.sandiBaru}
        type="password"
        autoComplete="new-password"
        required
        value={sandi}
        onChange={(e) => setSandi(e.target.value)}
        hint={t.auth.bidang.minimal8}
        iconLeft={<Icon name="Lock" size={18} />}
      />
      <Input
        label={r.ulangi}
        type="password"
        autoComplete="new-password"
        required
        value={ulangi}
        onChange={(e) => setUlangi(e.target.value)}
        iconLeft={<Icon name="Lock" size={18} />}
      />
      <Button type="submit" size="lg" fullWidth loading={loading}>
        {r.kirim}
      </Button>
    </form>
  );
}
