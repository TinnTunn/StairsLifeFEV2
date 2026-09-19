import type { ReactNode } from "react";
import { Icon } from "@/components/actions/Icon";
import { AlihkanJikaMasuk } from "@/components/layout/AlihkanJikaMasuk";
import type { IconName } from "@/components/actions/icon-registry";
import { ambilKamus } from "@/i18n/server";
import styles from "./shell.module.css";

type Sisi = "umum" | "mahasiswa" | "bisnis";

/* Setiap poin adalah perilaku aplikasi yang sudah diuji ujung ke ujung, bukan
   klaim pemasaran: tidak ada jumlah pengguna atau testimoni karangan di sini. */
const IKON: Record<Sisi, IconName[]> = {
  umum: ["Lock", "Kontrak", "Wallet"],
  mahasiswa: ["BadgeCheck", "Lock", "Wallet"],
  bisnis: ["Store", "Receipt", "PenLine"],
};

const KEADAAN = ["selesai", "aktif", "nanti"] as const;

/** Layout split gaya V2: kolom aurora di kiri, kartu formulir di atas cream-mesh. */
export async function AuthShell({
  sisi = "umum",
  lebar = false,
  alihkanJikaMasuk = true,
  children,
}: {
  sisi?: Sisi;
  lebar?: boolean;
  /** Matikan untuk halaman yang juga dibuka pengguna yang sudah masuk, misalnya ganti kata sandi dari email. */
  alihkanJikaMasuk?: boolean;
  children: ReactNode;
}) {
  const { t } = await ambilKamus();
  const panel = t.auth.panel[sisi];
  const alur = t.auth.panel.alur;

  return (
    <div className={styles.shell}>
      {alihkanJikaMasuk ? <AlihkanJikaMasuk /> : null}
      <aside className={styles.art} aria-label={t.auth.panel.label}>
        <div className={styles.artIsi}>
          <span className={styles.eyebrow}>{panel.eyebrow}</span>
          <p className={styles.artJudul}>
            {panel.judul} <span className={styles.aksen}>{panel.aksen}</span>
          </p>
          <p className={styles.artSub}>{panel.isi}</p>
          <ul className={styles.artPoin}>
            {panel.poin.map((teks, i) => (
              <li key={teks} className={styles.artItem} style={{ ["--urutan" as string]: i }}>
                <span className={styles.artIkon}>
                  <Icon name={IKON[sisi][i]} size={16} />
                </span>
                {teks}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.alur}>
          <div className={styles.alurKepala}>
            <span className={styles.alurJudul}>{alur.judul}</span>
            <span className={styles.alurStatus}>{alur.status}</span>
          </div>
          <ol className={styles.alurLangkah}>
            {alur.langkah.map((l, i) => (
              <li key={l} className={styles.alurItem} data-keadaan={KEADAAN[i]}>
                <span className={styles.alurTitik} aria-hidden="true">
                  {i === 0 ? <Icon name="Check" size={14} /> : i + 1}
                </span>
                {l}
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <div className={styles.form}>
        <div className={[styles.card, lebar ? styles.cardLebar : ""].filter(Boolean).join(" ")}>{children}</div>
      </div>
    </div>
  );
}
