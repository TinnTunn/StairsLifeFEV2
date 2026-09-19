"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/actions/Button";
import { Icon } from "@/components/actions/Icon";
import { IconButton } from "@/components/actions/IconButton";
import { Input } from "@/components/forms/Input";
import { BERANDA_PERAN as BERANDA } from "@/components/layout/nav-items";
import { useBahasa } from "@/i18n/BahasaProvider";
import { auth } from "@/lib/api/auth";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { ambilSesiBerakhir, tandaiMasuk, writeSession } from "@/lib/api/session";
import { LayarProses } from "@/components/feedback/LayarProses";
import { idKolom, useGalatKolom } from "@/lib/useGalatKolom";
import { AKUN_CONTOH, mockLogin } from "@/lib/mock/session";
import { FormBanding } from "../banding/FormBanding";
import { jalurAman } from "@/lib/jalur";
import styles from "./auth.module.css";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  /* Tujuan yang kembali ke halaman auth sendiri tidak diikuti: navigasinya tidak
     berpindah halaman dan layar "Selamat datang" akan tertahan. */
  const lanjutMentah = jalurAman(params.get("lanjut"));
  const lanjut = lanjutMentah && !/^\/(masuk|daftar)(\/|\?|$)/.test(lanjutMentah) ? lanjutMentah : null;
  const { t } = useBahasa();
  const m = t.auth.masuk;
  const f = t.auth.bidang;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lihatSandi, setLihatSandi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kolom = useGalatKolom<"email" | "password">();
  /* Layar berputar: "memeriksa" bila pemeriksaan kata sandi terasa lama,
     "masuk" setelah berhasil sampai beranda selesai dimuat. Formulir ini
     dibongkar begitu halaman tujuan tampil, jadi layarnya ikut hilang. */
  const [layar, setLayar] = useState<{ jenis: "memeriksa" } | { jenis: "masuk"; nama: string } | null>(null);

  useEffect(() => () => tandaiMasuk(false), []);

  /* Penanda "sesi berakhir" ada di sessionStorage, yang tidak ada di server,
     jadi baru boleh dibaca setelah halaman terpasang. Dibaca di microtask,
     bukan langsung di badan efek, supaya render hidrasi selesai lebih dulu. */
  const [sesiBerakhir, setSesiBerakhir] = useState(false);
  useEffect(() => {
    let batal = false;
    void Promise.resolve().then(() => {
      if (!batal && ambilSesiBerakhir()) setSesiBerakhir(true);
    });
    return () => {
      batal = true;
    };
  }, []);
  /* Login akun beku berhenti di sini; tanpa jalan banding, pengguna yang
     saldonya masih di dompet tidak punya cara resmi meminta akses kembali. */
  const [beku, setBeku] = useState<{ alasan: string; banding: boolean } | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBeku(null);
    const valid = kolom.periksa([
      ["email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), t.auth.galat.emailSalah],
      ["password", !USE_MOCK && !password, t.auth.galat.sandiKosong],
    ]);
    if (!valid) return;
    setLoading(true);
    /* Permintaan cepat cukup memakai spinner di tombol; layar penuh baru
       muncul bila pemeriksaan melewati 350 ms, supaya tidak berkedip. */
    const tunda = window.setTimeout(() => setLayar({ jenis: "memeriksa" }), 350);
    let berhasil = false;

    try {
      const hasil = USE_MOCK ? mockLogin(email) : await auth.login(email.trim(), password);
      if (!hasil) {
        setError(m.bukanAkunContoh);
        return;
      }
      berhasil = true;
      tandaiMasuk(true);
      setLayar({ jenis: "masuk", nama: hasil.user.full_name.split(" ")[0] || hasil.user.full_name });
      writeSession(hasil);
      router.replace(lanjut ?? BERANDA[hasil.user.role]);
    } catch (e) {
      if (e instanceof ApiError && e.suspended) {
        /* Backend membalas 401 dengan message berupa string JSON untuk kasus
           ini. Client sudah menguraikannya jadi pesan yang bisa dibaca. */
        setBeku({ alasan: e.suspended.reason, banding: false });
      } else if (e instanceof ApiError && e.status === 401) {
        setError(m.tidakCocok);
      } else {
        setError(e instanceof ApiError ? e.message : t.umum.galat.jaringan);
      }
    } finally {
      window.clearTimeout(tunda);
      if (!berhasil) {
        setLayar(null);
        setLoading(false);
      }
    }
  }

  const b = t.fitur.banding;
  const tampilanLayar = layar ? (
    layar.jenis === "masuk" ? (
      <LayarProses judul={t.umum.masuk.judul(layar.nama)} isi={t.umum.masuk.isi} />
    ) : (
      <LayarProses judul={t.umum.masuk.memeriksa} isi={t.umum.masuk.memeriksaIsi} />
    )
  ) : null;
  if (beku?.banding) {
    return <FormBanding emailAwal={email} onKembali={() => setBeku(null)} />;
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {tampilanLayar}
      {sesiBerakhir && !error && !beku ? (
        <p className={styles.info} role="status">
          <Icon name="Info" size={16} />
          {m.sesiBerakhir}
        </p>
      ) : null}
      {beku ? (
        <div className={styles.error} role="alert">
          <Icon name="Ban" size={18} />
          <span className={styles.errorList}>
            <b className={styles.errorBaris}>{b.judul}</b>
            <span className={styles.errorBaris}>{b.alasan(beku.alasan)}</span>
            <span className={styles.errorBaris}>{b.isi}</span>
            <span className={styles.errorBaris}>
              <Button type="button" size="sm" variant="secondary" onClick={() => setBeku({ ...beku, banding: true })}>
                {b.buka}
              </Button>
            </span>
          </span>
        </div>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          <Icon name="AlertTriangle" size={18} />
          {error}
        </p>
      ) : null}

      <Input
        label={f.email}
        type="email"
        name="email"
        id={idKolom("email")}
        error={kolom.galat.email}
        autoComplete="email"
        required
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
          type={lihatSandi ? "text" : "password"}
          name="password"
          id={idKolom("password")}
          error={kolom.galat.password}
          autoComplete="current-password"
          required={!USE_MOCK}
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
          hint={USE_MOCK ? m.sandiDiabaikan : undefined}
        />

      <div className={`${styles.foot} ${styles.footKanan}`}>
        <Link href="/lupa-password">{m.lupa}</Link>
      </div>

      <Button type="submit" size="lg" fullWidth loading={loading}>
        {m.kirim}
      </Button>

      {USE_MOCK ? (
        <div className={styles.demo}>
          {m.demo}
          <span className={styles.demoList}>
            {AKUN_CONTOH.map((a) => (
              <Button key={a.email} type="button" size="sm" variant="secondary" onClick={() => setEmail(a.email)}>
                {a.email}
              </Button>
            ))}
          </span>
        </div>
      ) : null}
    </form>
  );
}
