"use client";

import Link from "next/link";
import { use, useState } from "react";
import { Icon } from "@/components/actions/Icon";
import { Avatar } from "@/components/data/Avatar";
import { Obrolan } from "@/components/chat/Obrolan";
import { Halaman } from "@/components/layout/KonteksShell";
import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./tanya.module.css";

/**
 * Tanya jawab sebelum kontrak.
 *
 * Nama lawan bicara ada di kepala kotak obrolan, bukan di topbar: topbar
 * menyebut bagian aplikasi ("Pesan"), sedangkan percakapan ini punya identitas
 * sendiri yang harus menempel pada isinya.
 */
export default function Tanya({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useBahasa();
  const c = t.fitur.pesan;
  const [lawan, setLawan] = useState<{ full_name: string } | null>(null);
  const nama = lawan?.full_name ?? c.lawanMemuat;

  return (
    <Halaman title={c.judul} subtitle={c.tanyaSub}>
      <Obrolan
        sumber={{ jenis: "tanya", id }}
        pembuka={c.tanyaPeringatan}
        onLawan={setLawan}
        kepala={
          <>
            <Link href="/pesan?jenis=tanya" className={styles.kembali} aria-label={c.judul}>
              <Icon name="ArrowLeft" size={18} />
            </Link>
            <Avatar name={nama} size="sm" />
            <span className={styles.nama}>
              <b>{nama}</b>
              <span className={styles.peran}>{c.tanyaSub}</span>
            </span>
          </>
        }
      />
    </Halaman>
  );
}
