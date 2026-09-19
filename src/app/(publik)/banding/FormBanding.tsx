"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth } from "@/lib/api/auth";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import styles from "../masuk/auth.module.css";

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Banding akun yang dibekukan. Pemilik akun tidak bisa masuk, jadi form ini
 * publik dan hanya meminta email akun. Backend selalu membalas sama, apa pun
 * emailnya, supaya status akun orang lain tidak bisa ditebak dari sini.
 */
export function FormBanding({ emailAwal = "", onKembali }: { emailAwal?: string; onKembali?: () => void }) {
  const { t } = useBahasa();
  const b = t.fitur.banding;
  const [email, setEmail] = useState(emailAwal);
  const [pesan, setPesan] = useState("");
  const [dicoba, setDicoba] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terkirim, setTerkirim] = useState(false);

  const galatEmail = dicoba && !POLA_EMAIL.test(email.trim()) ? b.emailSalah : undefined;
  const galatPesan = dicoba && pesan.trim().length < 5 ? b.pesanPendek : undefined;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setDicoba(true);
    setError(null);
    if (!POLA_EMAIL.test(email.trim()) || pesan.trim().length < 5) return;
    setLoading(true);
    try {
      if (USE_MOCK) {
        setError(t.aplikasi.umum.modeContoh);
        return;
      }
      await auth.suspendedAppeal(email.trim(), pesan.trim());
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
        <EmptyState
          icon="MailCheck"
          title={b.terkirimJudul}
          description={b.terkirimIsi}
          action={
            onKembali ? (
              <Button variant="secondary" onClick={onKembali}>
                {b.kembali}
              </Button>
            ) : (
              <Button href="/masuk" variant="secondary">
                {b.kembali}
              </Button>
            )
          }
        />
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
        label={b.email}
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={galatEmail}
        iconLeft={<Icon name="Mail" size={18} />}
      />
      <Textarea
        label={b.pesan}
        required
        rows={5}
        maxLength={1000}
        showCount
        value={pesan}
        onChange={(e) => setPesan(e.target.value)}
        hint={b.pesanPetunjuk}
        error={galatPesan}
      />
      <Button type="submit" size="lg" fullWidth loading={loading}>
        {b.kirim}
      </Button>
      {onKembali ? (
        <Button type="button" variant="ghost" fullWidth onClick={onKembali}>
          {b.kembali}
        </Button>
      ) : null}
    </form>
  );
}
