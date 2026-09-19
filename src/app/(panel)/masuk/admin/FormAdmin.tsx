"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { IconButton } from "@/components/actions/IconButton";
import { Input } from "@/components/forms/Input";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth } from "@/lib/api/auth";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { tandaiMasuk, writeSession } from "@/lib/api/session";
import { jalurAman } from "@/lib/jalur";
import { idKolom, useGalatKolom } from "@/lib/useGalatKolom";
import styles from "./admin.module.css";

/**
 * Masuk khusus panel admin.
 *
 * Terpisah dari halaman masuk biasa karena isinya memang beda: tidak ada ajakan
 * mendaftar (akun admin tidak dibuat sendiri), tidak ada cerita produk, dan
 * peran diperiksa sebelum sesinya ditulis. Akun bukan admin yang berhasil
 * masuk di sini ditolak dengan alasan yang jelas, bukan dibiarkan mendarat di
 * layar "halaman ini untuk admin".
 */
export function FormAdmin() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useBahasa();
  const a = t.auth.masukAdmin;
  const f = t.auth.bidang;

  /* Tujuan hanya diikuti bila memang di dalam panel admin: parameter lanjut
     datang dari URL dan tidak boleh jadi jalan ke halaman lain. */
  const tujuan = jalurAman(params.get("lanjut"));
  const lanjut = tujuan && tujuan.startsWith("/admin") ? tujuan : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lihatSandi, setLihatSandi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kolom = useGalatKolom<"email" | "password">();

  useEffect(() => () => tandaiMasuk(false), []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const valid = kolom.periksa([
      ["email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), t.auth.galat.emailSalah],
      ["password", !password, t.auth.galat.sandiKosong],
    ]);
    if (!valid) return;

    if (USE_MOCK) {
      setError(a.modeContoh);
      return;
    }

    setLoading(true);
    let berhasil = false;
    try {
      const hasil = await auth.login(email.trim(), password);
      if (hasil.user.role !== "admin") {
        /* Sesi sengaja tidak ditulis: masuk di pintu admin dengan akun biasa
           bukan setengah berhasil, tapi pintu yang salah. */
        setError(a.bukanAdmin);
        return;
      }
      berhasil = true;
      tandaiMasuk(true);
      writeSession(hasil);
      router.replace(lanjut);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setError(t.auth.masuk.tidakCocok);
      else setError(e instanceof ApiError ? e.message : t.umum.galat.jaringan);
    } finally {
      if (!berhasil) setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {error ? (
        <p className={styles.galat} role="alert">
          <Icon name="AlertTriangle" size={16} />
          {error}
        </p>
      ) : null}

      <Input
        label={f.email}
        id={idKolom("email")}
        error={kolom.galat.email}
        type="email"
        required
        autoComplete="username"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          kolom.hapus("email");
        }}
        placeholder={f.emailContoh}
        iconLeft={<Icon name="Mail" size={18} />}
      />

      <Input
        label={f.sandi}
        id={idKolom("password")}
        error={kolom.galat.password}
        type={lihatSandi ? "text" : "password"}
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          kolom.hapus("password");
        }}
        iconLeft={<Icon name="Lock" size={18} />}
        trailing={
          <IconButton
            label={lihatSandi ? f.sembunyikanSandi : f.tampilkanSandi}
            aria-pressed={lihatSandi}
            onClick={() => setLihatSandi((v) => !v)}
          >
            <Icon name={lihatSandi ? "EyeOff" : "Eye"} size={18} />
          </IconButton>
        }
      />

      <Button type="submit" size="lg" fullWidth loading={loading}>
        {a.kirim}
      </Button>

      <p className={styles.catatan}>
        <Icon name="ShieldCheck" size={16} />
        {a.catatan}
      </p>

      <Link href="/masuk" className={styles.tautan}>
        {a.keMasukBiasa}
      </Link>
    </form>
  );
}
