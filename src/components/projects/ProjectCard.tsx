// Kartu ringkas sebuah proyek.

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
  applied?: boolean;
  href?: string;
  applyHref?: string;
  className?: string;
}

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
            <Link href={href ?? `/proyek/${project.id}`} className={styles.titleLink} title={project.title}>
              {project.title}
            </Link>
          </h3>
          <span className={styles.business}>{business}</span>
        </div>
        {applied ? <span className={styles.applied}>{k.dilamar}</span> : null}
      </div>

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

      <div className={styles.foot}>
        <span className={styles.budget}>{labelAnggaran(project, k)}</span>
        <div className={styles.footBawah}>
          <span className={styles.footText}>
            <Icon name="Users" size={14} />
            {k.pelamar(project.applicant_count)}
          </span>
          <span className={styles.aksi}>
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
