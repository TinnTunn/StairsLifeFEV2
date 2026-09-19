Pembungkus ikon Lucide. Halaman harus memuat Lucide UMD lebih dulu: `<script src="https://unpkg.com/lucide@0.469.0/dist/umd/lucide.js"></script>`.

```jsx
<Icon name="ShieldCheck" size={20} />
<Icon name="Wallet" size={24} color="var(--primary)" />
<Icon name="Inbox" size={40} strokeWidth={1.5} />   {/* empty state */}
```

Ikon inti yang dipakai berulang di produk: `ShieldCheck` (escrow/aman), `Wallet` (dompet), `FileText` (kontrak), `Briefcase` (proyek), `MessageSquare` (chat), `Users` (pelamar), `Star` (rating), `BadgeCheck` (terverifikasi), `Upload`/`Paperclip` (berkas), `Scale` (sengketa), `LayoutDashboard`, `Search`, `Bell`, `ChevronRight`.

Aturan: 20px stroke 1.75 untuk UI, jangan mencampur ikon isi (filled) dengan garis, jangan pakai emoji sebagai ikon.
