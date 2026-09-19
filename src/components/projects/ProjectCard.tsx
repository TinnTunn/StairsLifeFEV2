"use client";

import Link from "next/link";
import { Icon } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { useBahasa } from "@/i18n/BahasaProvider";
import { labelAnggaran } from "@/lib/anggaran";
import { formatTanggal } from "@/lib/format";
import type { Project } from "@/lib/types";
import styles from "./ProjectCard.module.css";

export interface ProjectCardProps {
  project: Project;
  /** Ditampilkan hanya kalau backend benar-benar mengatakan sudah dilamar. */
  applied?: boolean;
  /**
   * Tujuan judul kartu. Bawaannya halaman publik proyek; halaman di dalam
   * shell aplikasi mengarahkannya ke detail versi aplikasi supaya pengguna
   * yang sudah masuk tidak terlempar keluar ke halaman publik berikut
   * header dan footernya.
   */
  href?: string;
  /** Rute formulir lamaran. Tanpa ini tombol Lamar tidak dirender. */
  applyHref?: string;
  className?: string;
}

/**
 * Kartu proyek.
 *
 * Susunannya mengikuti rujukan rancangan dari pemilik produk: avatar bundar,
 * judul besar, nama usaha, satu baris penanda (tingkat, tenggat, kategori),
 * lalu kaki berisi anggaran dan aksinya.
 *
 * Dua hal di rujukan itu tidak ikut. Ikon simpan di pojok kanan atas tidak
 * dipasang karena backend belum punya endpoint simpan proyek sama sekali
 * (lihat celah B di rencana), dan tombol yang tidak menyimpan apa pun lebih
 * buruk daripada tombol yang tidak ada. Warnanya juga mengikuti palet proyek
 * ini, bukan biru tua di rujukan, sesuai DESIGN.md.
 */
export function ProjectCard({ project, applied = false, href, applyHref, className }: ProjectCardProps) {
  const { t, bahasa } = useBahasa();
  const k = t.komponen.kartuProyek;
  const business = project.users?.full_name ?? k.bisnis;

  return (
    <article className={[styles.card, className].filter(Boolean).join(" ")}>
      <div className={styles.head}>
        <Avatar name={business} size="md" verified={project.users?.is_verified} className={styles.avatar} />
        <div className={styles.headText}>
          <h3 className={styles.title}>
            {/* title: judul yang terpotong dua baris tetap bisa dibaca utuh
                tanpa membuka kartunya. */}
            <Link href={href ?? `/proyek/${project.id}`} className={styles.titleLink} title={project.title}>
              {project.title}
            </Link>
          </h3>
          <span className={styles.business}>{business}</span>
        </div>
        {applied ? <span className={styles.applied}>{k.dilamar}</span> : null}
      </div>

      {/* Ringkasan singkat brief-nya. Sebelumnya ruang ini kosong: judul yang
          tingginya dipesan dua baris menyisakan pita hampa di kartu berjudul
          pendek. Diisi isi yang sungguhan, bukan sekadar diberi jarak. */}
      <p className={styles.ringkas}>{project.description}</p>

      <div className={styles.meta}>
        <span className={styles.tier}>{t.umum.tingkat[project.tier]}</span>
        <span className={styles.metaItem}>
          <Icon name="CalendarDays" size={14} />
          {k.tenggat(formatTanggal(project.deadline, bahasa))}
        </span>
        {project.category ? (
          <span className={styles.kategori}>
            <Icon name="Tag" size={14} />
            {project.category}
          </span>
        ) : null}
      </div>

      {/* Kaki selalu dua baris dengan isi yang tetap: nominal sendirian di baris
          atas, lalu jumlah pelamar dan tombolnya. Saat ketiganya berbagi satu
          baris, kartu dengan nominal panjang membungkus jadi tiga baris
          sementara tetangganya dua, dan garis kakinya berhenti sejajar. */}
      <div className={styles.foot}>
        <span className={styles.budget}>{labelAnggaran(project, k)}</span>
        <div className={styles.footBawah}>
          <span className={styles.footText}>
            <Icon name="Users" size={14} />
            {k.pelamar(project.applicant_count)}
          </span>
          <span className={styles.aksi}>
          {/* Bukan tautan kedua ke tujuan yang sama: seluruh kartu sudah jadi
              tautan detail lewat ::after judulnya, jadi label ini cukup jadi
              penanda bahwa kartunya bisa dibuka. Klik di atasnya tetap sampai
              ke tautan itu, dan pembaca layar tidak mendengar tujuan yang sama
              dua kali. */}
            <span className={styles.detail}>{k.detail}</span>
            {applyHref && !applied ? (
              <Link href={applyHref} className={styles.lamar}>
                {k.lamar}
              </Link>
            ) : null}
          </span>
        </div>
      </div>
    </article>
  );
}
