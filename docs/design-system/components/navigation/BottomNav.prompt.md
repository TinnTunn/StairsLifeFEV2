Navigasi bawah untuk mobile. Maksimal 5 item — mahasiswa: Beranda, Cari, Kontrak, Chat, Dompet.

```jsx
<BottomNav active="cari" onNavigate={go} items={[
  { value: "beranda", label: "Beranda", icon: <Icon name="Home" size={22} /> },
  { value: "cari", label: "Cari", icon: <Icon name="Search" size={22} /> },
  { value: "kontrak", label: "Kontrak", icon: <Icon name="FileText" size={22} /> },
  { value: "chat", label: "Chat", icon: <Icon name="MessageSquare" size={22} />, badge: 2 },
  { value: "dompet", label: "Dompet", icon: <Icon name="Wallet" size={22} /> },
]} />
```
