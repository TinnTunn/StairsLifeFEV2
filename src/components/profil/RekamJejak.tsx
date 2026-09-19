"use client";

import { Icon } from "@/components/actions/Icon";
import { Money } from "@/components/data/Money";
import { Rating } from "@/components/data/Rating";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useBahasa } from "@/i18n/BahasaProvider";
import type { PortfolioItem, PublicProfile } from "@/lib/api/users";
import { formatTanggal } from "@/lib/format";
import styles from "./RekamJejak.module.css";

export interface RekamJejakProps {
  profil: PublicProfile;
  portofolio: {
    items: PortfolioItem[];
    summary: { total_completed: number; unique_categories: number } | null;
  };
}

/**
 * Rekam jejak seseorang: angka ringkas, portofolio kontrak yang sudah selesai,
 * lalu ulasan yang diterimanya.
 *
 * Dipakai halaman profil publik dan halaman profil sendiri. Disatukan supaya
 * keduanya tidak pernah bercerita berbeda tentang orang yang sama: yang dilihat
 * pemiliknya persis yang dilihat calon pemberi kerja.
 *
 * Dua hal sengaja tidak ditampilkan meski dikirim backend: total penghasilan,
 * karena angka pendapatan bukan urusan calon pemberi kerja, dan tautan berkas
 * hasil kerja, karena itu milik klien sebelumnya.
 */
export function RekamJejak({ profil, portofolio }: RekamJejakProps) {
  const { t, bahasa } = useBahasa();
  const g = t.fitur.profilPublik;
  const ringkas = portofolio.summary;
  const item = portofolio.items ?? [];

  /* "Ulasan lain" berarti yang belum terlihat di kartu portofolio di atasnya.
     Backend mengirim seluruh ulasan di satu daftar sementara tiap kartu
     portofolio sudah membawa ulasannya sendiri, jadi tanpa saringan ini ulasan
     yang sama tampil dua kali di halaman yang sama. Dicocokkan lewat waktu
     dibuatnya, satu-satunya penanda yang ada di kedua sisi. */
  const tanda = (u: { created_at: string; rating: number; comment: string | null }) =>
    `${Date.parse(u.created_at)}|${u.rating}|${u.comment ?? ""}`;
  const sudahTampil = new Set(item.filter((k) => k.review).map((k) => tanda(k.review!)));
  const ulasan = (profil.reviews ?? []).filter((r) => !sudahTampil.has(tanda(r)));

  return (
    <>
      <div className={styles.angka}>
        <div className={styles.angkaItem}>
          <span className={styles.angkaNilai}>{ringkas?.total_completed ?? 0}</span>
          <span className={styles.angkaLabel}>{g.selesai}</span>
        </div>
        <div className={styles.angkaItem}>
          <span className={styles.angkaNilai}>{ringkas?.unique_categories ?? 0}</span>
          <span className={styles.angkaLabel}>{g.kategori}</span>
        </div>
        <div className={styles.angkaItem}>
          <span className={styles.angkaNilai}>{profil.review_count}</span>
          <span className={styles.angkaLabel}>{g.ulasanJumlah}</span>
        </div>
      </div>

      <h3 className={styles.judulSeksi}>{g.portofolio}</h3>
      {item.length === 0 ? (
        <EmptyState icon="Briefcase" title={g.kosongJudul} description={g.kosongIsi} />
      ) : (
        <ul className={styles.daftar}>
          {item.map((k) => (
            <li key={k.contract_id} className={styles.kartu}>
              <div className={styles.kartuKepala}>
                <b className={styles.kartuJudul}>{k.project.title}</b>
                <Money value={k.budget} size="sm" />
              </div>
              <p className={styles.kartuMeta}>
                {k.project.category} · {t.umum.tingkat[k.project.tier as keyof typeof t.umum.tingkat] ?? k.project.tier}
                {k.completed_at ? ` · ${g.selesaiPada(formatTanggal(k.completed_at, bahasa))}` : ""}
              </p>
              {k.review ? (
                <div className={styles.ulasan}>
                  <Rating value={k.review.rating} size="sm" />
                  {k.review.comment ? <p className={styles.ulasanTeks}>{k.review.comment}</p> : null}
                  <span className={styles.ulasanOleh}>
                    <Icon name="Store" size={14} />
                    {k.client.full_name}
                  </span>
                </div>
              ) : (
                <p className={styles.metaKecil}>{g.tanpaUlasan}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {ulasan.length > 0 ? (
        <>
          <h3 className={styles.judulSeksi}>{g.ulasanLain}</h3>
          <ul className={styles.daftar}>
            {ulasan.slice(0, 10).map((r) => (
              <li key={r.id} className={styles.kartu}>
                <Rating value={r.rating} size="sm" />
                {r.comment ? <p className={styles.ulasanTeks}>{r.comment}</p> : null}
                <span className={styles.ulasanOleh}>{formatTanggal(r.created_at, bahasa)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
