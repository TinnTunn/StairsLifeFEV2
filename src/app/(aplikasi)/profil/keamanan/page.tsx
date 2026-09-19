"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/actions/Button";
import { Icon, type IconName } from "@/components/actions/Icon";
import { IconButton } from "@/components/actions/IconButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Modal } from "@/components/feedback/Modal";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { useKeluar } from "@/components/layout/KeluarProvider";
import { Halaman, useSesiShell } from "@/components/layout/KonteksShell";
import { useBahasa } from "@/i18n/BahasaProvider";
import { akun } from "@/lib/api/akun";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { readSession, writeSession } from "@/lib/api/session";
import app from "../../mahasiswa/dashboard.module.css";
import styles from "./keamanan.module.css";
import { TautanKembali } from "@/components/navigation/TautanKembali";

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function KeamananAkun() {
  const { t } = useBahasa();
  const a = t.fitur.akun;
  return (
    <Halaman title={a.judul} subtitle={a.sub}>
      <TautanKembali href="/profil" label={t.aplikasi.profil.judul} />
      {USE_MOCK ? (
        <EmptyState icon="KeyRound" title={a.judul} description={t.aplikasi.umum.modeContoh} />
      ) : (
        <>
          <GantiSandi />
          <GantiEmail />
          <HapusAkun />
        </>
      )}
    </Halaman>
  );
}

function Kartu({ icon, judul, children, bahaya = false }: { icon: IconName; judul: string; children: ReactNode; bahaya?: boolean }) {
  return (
    <section className={`${styles.kartu} ${bahaya ? styles.bahaya : ""}`} aria-label={judul}>
      <h2 className={styles.judul}>
        <span className={styles.ikon} aria-hidden="true">
          <Icon name={icon} size={18} />
        </span>
        {judul}
      </h2>
      {children}
    </section>
  );
}

function pesanGalat(e: unknown, cadangan: string): string {
  return e instanceof ApiError ? e.messages.join(" ") : cadangan;
}

function Status({ jenis, children }: { jenis: "ok" | "galat"; children: ReactNode }) {
  return (
    <p role={jenis === "galat" ? "alert" : "status"} className={jenis === "galat" ? app.galat : styles.ok}>
      <Icon name={jenis === "galat" ? "AlertTriangle" : "CheckCircle2"} size={18} />
      <span>{children}</span>
    </p>
  );
}

function GantiSandi() {
  const { t } = useBahasa();
  const s = t.fitur.akun.sandi;
  const f = t.auth.bidang;
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState<{ lama?: string; baru?: string; ulang?: string }>({});
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<{ jenis: "ok" | "galat"; teks: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setHasil(null);
    const g = {
      lama: !lama ? s.lamaKosong : undefined,
      baru: baru.length < 8 ? s.pendek : undefined,
      ulang: ulang !== baru ? s.tidakSama : undefined,
    };
    setGalat(g);
    if (g.lama || g.baru || g.ulang) return;

    setLoading(true);
    try {
      const token = await akun.gantiPassword({ current_password: lama, new_password: baru });
      /* Sesi perangkat lain dicabut; perangkat ini memakai pasangan token baru. */
      const kini = readSession();
      if (kini) writeSession({ ...kini, token: token.token, refresh_token: token.refresh_token });
      setLama("");
      setBaru("");
      setUlang("");
      setHasil({ jenis: "ok", teks: s.berhasil });
    } catch (err) {
      setHasil({ jenis: "galat", teks: pesanGalat(err, t.umum.galat.jaringan) });
    } finally {
      setLoading(false);
    }
  }

  const tombolLihat = (
    <IconButton label={lihat ? f.sembunyikanSandi : f.tampilkanSandi} aria-pressed={lihat} onClick={() => setLihat((v) => !v)}>
      <Icon name={lihat ? "EyeOff" : "Eye"} size={18} />
    </IconButton>
  );

  return (
    <Kartu icon="KeyRound" judul={s.judul}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <Input
          label={s.lama}
          type={lihat ? "text" : "password"}
          autoComplete="current-password"
          required
          value={lama}
          error={galat.lama}
          onChange={(e) => {
            setLama(e.target.value);
            setGalat((g) => ({ ...g, lama: undefined }));
          }}
          trailing={tombolLihat}
        />
        <div className={styles.baris}>
          <Input
            label={s.baru}
            type={lihat ? "text" : "password"}
            autoComplete="new-password"
            required
            value={baru}
            hint={s.petunjuk}
            error={galat.baru}
            onChange={(e) => {
              setBaru(e.target.value);
              setGalat((g) => ({ ...g, baru: undefined }));
            }}
          />
          <Input
            label={s.ulang}
            type={lihat ? "text" : "password"}
            autoComplete="new-password"
            required
            value={ulang}
            error={galat.ulang}
            onChange={(e) => {
              setUlang(e.target.value);
              setGalat((g) => ({ ...g, ulang: undefined }));
            }}
          />
        </div>
        {hasil ? <Status jenis={hasil.jenis}>{hasil.teks}</Status> : null}
        <div>
          <Button type="submit" loading={loading}>
            {s.simpan}
          </Button>
        </div>
      </form>
    </Kartu>
  );
}

function GantiEmail() {
  const { t } = useBahasa();
  const m = t.fitur.akun.email;
  const session = useSesiShell();
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [galat, setGalat] = useState<{ email?: string; sandi?: string }>({});
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<{ jenis: "ok" | "galat"; teks: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setHasil(null);
    const g = {
      email: !POLA_EMAIL.test(email.trim()) ? m.formatSalah : undefined,
      sandi: !sandi ? m.sandiKosong : undefined,
    };
    setGalat(g);
    if (g.email || g.sandi) return;
    setLoading(true);
    try {
      const r = await akun.mintaGantiEmail({ new_email: email.trim(), password: sandi });
      setSandi("");
      setHasil({ jenis: "ok", teks: m.terkirim(r.pending_email) });
    } catch (err) {
      setHasil({ jenis: "galat", teks: pesanGalat(err, t.umum.galat.jaringan) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Kartu icon="Mail" judul={m.judul}>
      <p className={styles.isi}>{m.sekarang(session.user.email)}</p>
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.baris}>
          <Input
            label={m.baru}
            type="email"
            autoComplete="email"
            required
            value={email}
            error={galat.email}
            onChange={(e) => {
              setEmail(e.target.value);
              setGalat((g) => ({ ...g, email: undefined }));
            }}
          />
          <Input
            label={m.sandi}
            type="password"
            autoComplete="current-password"
            required
            value={sandi}
            error={galat.sandi}
            onChange={(e) => {
              setSandi(e.target.value);
              setGalat((g) => ({ ...g, sandi: undefined }));
            }}
          />
        </div>
        {hasil ? <Status jenis={hasil.jenis}>{hasil.teks}</Status> : null}
        <div>
          <Button type="submit" variant="secondary" loading={loading}>
            {m.kirim}
          </Button>
        </div>
      </form>
    </Kartu>
  );
}

function HapusAkun() {
  const { t } = useBahasa();
  const h = t.fitur.akun.hapus;
  const session = useSesiShell();
  const { keluar } = useKeluar();
  const [buka, setBuka] = useState(false);
  const [ketik, setKetik] = useState("");
  const [sandi, setSandi] = useState("");
  const [alasan, setAlasan] = useState("");
  const [dicoba, setDicoba] = useState(false);
  const [loading, setLoading] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  const ketikBenar = ketik.trim() === h.kataKunci;

  async function hapus() {
    setDicoba(true);
    setGalat(null);
    if (!ketikBenar || !sandi) return;
    setLoading(true);
    try {
      await akun.hapus({ password: sandi, ...(alasan.trim() ? { reason: alasan.trim() } : {}) });
      setBuka(false);
      keluar(session.user.full_name);
    } catch (err) {
      setGalat(pesanGalat(err, t.umum.galat.jaringan));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Kartu icon="Trash2" judul={h.judul} bahaya>
      <p className={styles.isi}>{h.isi}</p>
      <p className={styles.syarat}>{h.syarat}</p>
      <div>
        <Button variant="destructive" onClick={() => setBuka(true)}>
          {h.tombol}
        </Button>
      </div>

      <Modal
        open={buka}
        onClose={() => !loading && setBuka(false)}
        tone="danger"
        size="sm"
        title={h.modalJudul}
        description={h.modalIsi}
        dismissible={!loading}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBuka(false)} disabled={loading}>
              {h.batal}
            </Button>
            <Button variant="destructive" onClick={hapus} loading={loading} disabled={!ketikBenar || !sandi}>
              {h.konfirmasi}
            </Button>
          </>
        }
      >
        <Input
          label={h.ketik(h.kataKunci)}
          autoComplete="off"
          value={ketik}
          onChange={(e) => setKetik(e.target.value)}
          error={dicoba && !ketikBenar ? h.ketikSalah(h.kataKunci) : undefined}
        />
        <Input label={h.sandi} type="password" autoComplete="current-password" required value={sandi} onChange={(e) => setSandi(e.target.value)} />
        <Textarea label={h.alasan} rows={2} maxLength={500} value={alasan} onChange={(e) => setAlasan(e.target.value)} hint={h.alasanPetunjuk} />
        {galat ? <Status jenis="galat">{galat}</Status> : null}
      </Modal>
    </Kartu>
  );
}
