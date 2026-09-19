import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/actions/Icon";
import { Button } from "@/components/actions/Button";
import { IconButton } from "@/components/actions/IconButton";
import { Card } from "@/components/data/Card";
import { Money } from "@/components/data/Money";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Checkbox } from "@/components/forms/Checkbox";
import { Input } from "@/components/forms/Input";
import { Radio } from "@/components/forms/Radio";
import { Select } from "@/components/forms/Select";
import { Switch } from "@/components/forms/Switch";
import { Textarea } from "@/components/forms/Textarea";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./kit.module.css";

export const metadata: Metadata = {
  title: "Kit komponen",
  robots: { index: false, follow: false },
};

const STATUSES = [
  "draft",
  "aktif",
  "menunggu_pembayaran",
  "escrow_ditahan",
  "dikerjakan",
  "menunggu_review",
  "selesai",
  "sengketa",
  "ditolak",
  "terkirim",
  "dilihat",
  "seleksi",
  "diterima",
  "terverifikasi",
  "disuspend",
  "lunas",
  "gagal",
  "kedaluwarsa",
  "dikembalikan",
  "dibagi_sebagian",
];

/**
 * Halaman internal untuk memeriksa komponen di kedua tema dan di setiap
 * breakpoint. Tidak tersambung ke navigasi mana pun dan tidak diindeks.
 * Hanya ada saat pengembangan: di build produksi rutenya 404, dan teksnya
 * sengaja tidak masuk kamus karena bukan halaman untuk pengguna.
 */
export default function KitPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <div>
          <h1 className="sl-h1">Kit komponen</h1>
          <p className="sl-body-sm">Halaman internal. Bukan bagian dari produk.</p>
        </div>
        <ThemeToggle />
      </header>

      <section className={styles.block}>
        <h2 className="sl-h3">Tombol</h2>
        <div className={styles.row}>
          <Button variant="primary">Lamar proyek</Button>
          <Button variant="secondary" iconLeft={<Icon name="Bookmark" size={18} />}>
            Simpan proyek
          </Button>
          <Button variant="ghost">Lihat rincian</Button>
          <Button variant="destructive">Ajukan sengketa</Button>
          <Button loading>Memproses</Button>
          <Button disabled>Tidak tersedia</Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">Kecil</Button>
          <Button size="md">Sedang</Button>
          <Button size="lg">Besar</Button>
          <Button href="/">Tautan sebagai tombol</Button>
        </div>
        <div className={styles.row}>
          <IconButton label="Cari proyek">
            <Icon name="Search" />
          </IconButton>
          <IconButton label="Buka notifikasi" variant="outline">
            <Icon name="Bell" />
          </IconButton>
          <IconButton label="Tambah proyek" variant="solid">
            <Icon name="Plus" />
          </IconButton>
          <IconButton label="Hapus berkas" variant="danger">
            <Icon name="Trash2" />
          </IconButton>
        </div>
      </section>

      <section className={styles.block}>
        <h2 className="sl-h3">Status</h2>
        <div className={styles.row}>
          {STATUSES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className="sl-h3">Nominal</h2>
        <div className={styles.row}>
          <Money value={2500000} label="Nilai kontrak" />
          <Money value={2375000} tone="in" label="Diterima mahasiswa" />
          <Money value={2500000} tone="held" label="Ditahan StairsLife" />
          <Money value={125000} tone="out" label="Biaya layanan" />
          <Money value={2500000} size="lg" />
        </div>
      </section>

      <section className={styles.block}>
        <h2 className="sl-h3">Kartu</h2>
        <div className={styles.cards}>
          <Card header={<strong className="sl-body">Kartu biasa</strong>}>
            <p className="sl-body-sm">Garis 1px, tanpa bayangan.</p>
          </Card>
          <Card interactive header={<strong className="sl-body">Kartu bisa diklik</strong>}>
            <p className="sl-body-sm">Naik 1px saat disentuh kursor atau difokus keyboard.</p>
          </Card>
          <Card
            selected
            header={<strong className="sl-body">Kartu terpilih</strong>}
            footer={<span className="sl-caption">Footer berlatar pasir</span>}
          >
            <p className="sl-body-sm">Garis terakota menandai pilihan.</p>
          </Card>
        </div>
      </section>

      <section className={styles.block}>
        <h2 className="sl-h3">Isian</h2>
        <div className={styles.form}>
          <Input label="Nama lengkap" placeholder="Nama lengkap" required />
          <Input label="Email" type="email" placeholder="email@contoh.com" hint="Dipakai untuk masuk." />
          <Input label="Anggaran" prefix="Rp" numeric placeholder="2500000" />
          <Input label="Kata sandi" type="password" error="Kata sandi minimal 8 karakter." />
          <Select
            label="Tingkat pengalaman"
            options={[
              { value: "pemula", label: "Pemula" },
              { value: "menengah", label: "Menengah" },
              { value: "mahir", label: "Mahir" },
            ]}
            hint="Menentukan proyek mana yang bisa kamu lamar."
          />
          <Textarea
            label="Surat lamaran"
            maxLength={2000}
            showCount
            hint="Minimal 50 karakter."
            placeholder="Ceritakan kenapa kamu cocok untuk proyek ini."
          />
        </div>
        <div className={styles.form}>
          <Checkbox label="Simpan proyek ini" description="Muncul di daftar tersimpan." />
          <Checkbox label="Sudah pernah dilamar" defaultChecked />
          <Checkbox label="Sebagian terpilih" indeterminate />
          <Radio name="peran" label="Saya mahasiswa" description="Mencari proyek berbayar." />
          <Radio name="peran" label="Saya punya usaha" description="Memasang proyek." />
          <Switch label="Notifikasi lamaran baru" description="Berlaku seketika." defaultChecked />
        </div>
      </section>
    </main>
  );
}
