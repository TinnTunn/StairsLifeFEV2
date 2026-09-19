import { Icon } from "@/components/actions/Icon";
import type { Kamus } from "@/i18n/kamus";
import { labelAnggaran } from "@/lib/anggaran";
import type { Project, UserTier } from "@/lib/types";
import { HeroTilt } from "./HeroTilt";
import styles from "./beranda-hero.module.css";

const EMOJI_TINGKAT: Record<UserTier, string> = { pemula: "🌱", menengah: "📈", mahir: "🏆" };

/**
 * Kartu kaca yang melayang di hero, seperti hero-card V2. Isinya proyek
 * terbaru yang benar-benar dibuka; kalau belum ada, kartunya tampil dengan
 * label "contoh tampilan" yang terlihat.
 */
export function HeroCard({ project, t }: { project: Project | null; t: Kamus }) {
  const k = t.beranda.kartu;
  const tier = project?.tier ?? "pemula";
  const keahlian = project ? project.skills.slice(0, 3) : k.keahlianContoh;
  const bisnis = project?.users?.full_name ?? k.bisnisContoh;

  return (
    <HeroTilt>
      <span className={styles.halo} aria-hidden="true" />
      <article className={styles.card}>
        <div className={styles.cardHead}>
          <span className={styles.tier}>
            {EMOJI_TINGKAT[tier]} {t.umum.tingkat[tier]}
          </span>
          <span className={styles.cardMeta}>{project ? k.pelamar(project.applicant_count) : k.labelContoh}</span>
        </div>

        <h2 className={styles.cardTitle}>
          {/* Tanpa tautan: proyek hanya bisa dibuka dari dalam aplikasi, dan
              tamu diarahkan mendaftar lebih dulu. */}
          {project ? project.title : k.judulContoh}
        </h2>

        <div className={styles.company}>
          <span className={styles.inisial} aria-hidden="true">
            {bisnis.slice(0, 1).toUpperCase()}
          </span>
          <span>{bisnis}</span>
        </div>

        <div className={styles.skills}>
          {keahlian.map((s) => (
            <span key={s} className={styles.skill}>
              {s}
            </span>
          ))}
        </div>

        <div className={styles.budget}>
          <Icon name="Wallet" size={18} />
          <span>{project ? labelAnggaran(project, k) : k.anggaranContoh}</span>
        </div>

        <span className={styles.cardLabel}>{project ? k.labelNyata : k.labelContoh}</span>
      </article>
    </HeroTilt>
  );
}
