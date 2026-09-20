// Isi halaman detail proyek yang dipakai sisi publik dan aplikasi.

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { useBahasa } from "@/i18n/BahasaProvider";
import { labelAnggaran } from "@/lib/anggaran";
import { formatTanggal } from "@/lib/format";
import type { Project } from "@/lib/types";
import { ApplyAction } from "./ApplyAction";
import styles from "./DetailProyek.module.css";

export interface IsiDetailProyekProps {
  project: Project;
  aksi?: ReactNode;
  catatan?: string;
}

export function IsiDetailProyek({ project, aksi, catatan }: IsiDetailProyekProps) {
  const { t, bahasa } = useBahasa();
  const d = t.proyek.detail;
  const business = project.users?.full_name ?? t.komponen.kartuProyek.bisnis;

  const fakta = [
    { icon: "Clock", label: d.tenggat, nilai: formatTanggal(project.deadline, bahasa) },
    { icon: "GraduationCap", label: d.tingkat, nilai: t.umum.tingkat[project.tier] },
    { icon: "Users", label: d.pelamar, nilai: String(project.applicant_count) },
  ] as const;

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>
            <span className={styles.blockIcon} aria-hidden="true">
              <Icon name="FileText" size={18} />
            </span>
            {d.dikerjakan}
          </h2>
          <p className={styles.body}>{project.description}</p>
        </section>

        {project.deliverables ? (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>
              <span className={styles.blockIcon} aria-hidden="true">
                <Icon name="PackageCheck" size={18} />
              </span>
              {d.hasil}
            </h2>
            <p className={styles.body}>{project.deliverables}</p>
          </section>
        ) : null}

        {project.skills.length > 0 ? (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>
              <span className={styles.blockIcon} aria-hidden="true">
                <Icon name="ListChecks" size={18} />
              </span>
              {d.keahlian}
            </h2>
            <div className={styles.chips}>
              {project.skills.map((skill) => (
                <span key={skill} className={styles.chip}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <aside className={styles.aside}>
        <div className={styles.panel}>
          <Link href={`/pengguna/${project.business_id}`} className={styles.pemasang}>
            <Avatar name={business} size="sm" />
            <span className={styles.pemasangTeks}>
              <span className={styles.pemasangLabel}>{d.pemasang}</span>
              <span className={styles.pemasangNama}>{business}</span>
            </span>
            <Icon name="ChevronRight" size={16} />
          </Link>

          <div className={styles.budget}>
            <span className={styles.budgetLabel}>{d.anggaran}</span>
            <span className={styles.budgetValue}>{labelAnggaran(project, t.komponen.kartuProyek)}</span>
          </div>

          <dl className={styles.facts}>
            {fakta.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className={styles.factLabel}>
                  <Icon name={f.icon} size={16} />
                  {f.label}
                </dt>
                <dd className={styles.factValue}>{f.nilai}</dd>
              </div>
            ))}
          </dl>

          {aksi ?? (
            <ApplyAction projectId={project.id} open={project.status === "open"} businessId={project.business_id} />
          )}

          <p className={styles.escrowNote}>
            <span className={styles.escrowIcon}>
              <Icon name="ShieldCheck" size={16} />
            </span>
            {catatan ?? d.catatanEscrow(business)}
          </p>
        </div>
      </aside>
    </div>
  );
}
