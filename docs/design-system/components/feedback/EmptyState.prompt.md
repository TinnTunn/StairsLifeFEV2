Keadaan kosong: ikon besar + copy ramah + satu jalan keluar. Tanpa ilustrasi (keputusan sistem).

```jsx
<EmptyState icon={<Icon name="Briefcase" size={32} strokeWidth={1.5} />}
  title="Belum ada lamaran masuk"
  description="Proyekmu baru tayang 2 jam lalu. Biasanya lamaran pertama datang dalam sehari."
  action={<Button>Bagikan proyek</Button>}
  secondaryAction={<Button variant="ghost">Ubah deskripsi</Button>} />
```

Aturan copy: sebutkan kondisi apa adanya, beri ekspektasi waktu kalau ada, lalu satu aksi. Jangan menyalahkan pengguna, jangan pakai emoji.
