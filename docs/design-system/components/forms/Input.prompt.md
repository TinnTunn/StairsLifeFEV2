Kolom teks + label + hint/error dalam satu komponen — jangan pisah `<label>` sendiri.

```jsx
<Input label="Judul proyek" placeholder="Desain logo & brand kit untuk kedai kopi" required />
<Input label="Anggaran" prefix="Rp" numeric defaultValue="2.500.000" hint="Dana ditahan di escrow sampai kamu menyetujui hasil." />
<Input label="Email kampus" error="Email ini belum terdaftar. Cek lagi atau daftar dulu." iconLeft={<Icon name="Mail" size={16} />} />
```

Aturan: nominal rupiah selalu `numeric` + `prefix="Rp"`; pesan error jelas dan menawarkan jalan keluar, bukan "Invalid input".
