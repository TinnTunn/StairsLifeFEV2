Navigasi samping untuk semua peran (mahasiswa, bisnis, admin) di desktop.

```jsx
<Sidebar role="Mahasiswa" active="proyek" onNavigate={go}
  brand={<><img src="assets/logo-mark.svg" width="22" style={{color:"var(--primary)"}} /><b>StairsLife</b></>}
  items={[
    { value: "dashboard", label: "Dashboard", icon: <Icon name="LayoutDashboard" /> },
    { value: "proyek", label: "Cari proyek", icon: <Icon name="Search" /> },
    { value: "lamaran", label: "Lamaran saya", icon: <Icon name="Send" />, badge: 3 },
    { section: "Keuangan" },
    { value: "kontrak", label: "Kontrak", icon: <Icon name="FileText" /> },
    { value: "dompet", label: "Dompet", icon: <Icon name="Wallet" /> },
  ]}
  footer={<Button variant="ghost" fullWidth iconLeft={<Icon name="Settings" />}>Pengaturan</Button>} />
```

Aturan: maksimal 7 item per kelompok; kelompokkan dengan `{ section: "…" }`. Badge merah hanya untuk hal yang butuh tindakan (sengketa, verifikasi ditolak).
