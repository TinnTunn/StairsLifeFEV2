// Halaman bantuan: chat dukungan pengguna ke tim.

"use client";

import { Obrolan } from "@/components/chat/Obrolan";
import { Halaman } from "@/components/layout/KonteksShell";
import { useBahasa } from "@/i18n/BahasaProvider";

export default function Bantuan() {
  const { t } = useBahasa();
  const c = t.fitur.pesan;
  return (
    <Halaman title={c.bantuanJudul} subtitle={c.bantuanSub}>
      <Obrolan sumber={{ jenis: "bantuan" }} pembuka={c.bantuanPembuka} />
    </Halaman>
  );
}
