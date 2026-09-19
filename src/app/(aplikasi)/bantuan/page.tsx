"use client";

import { Obrolan } from "@/components/chat/Obrolan";
import { Halaman } from "@/components/layout/KonteksShell";
import { useBahasa } from "@/i18n/BahasaProvider";

/* Chat dukungan pengguna ke tim StairsLife. Balasan admin datang dari inbox
   dukungan di panel admin (room support-{userId}). */
export default function Bantuan() {
  const { t } = useBahasa();
  const c = t.fitur.pesan;
  return (
    <Halaman title={c.bantuanJudul} subtitle={c.bantuanSub}>
      <Obrolan sumber={{ jenis: "bantuan" }} pembuka={c.bantuanPembuka} />
    </Halaman>
  );
}
