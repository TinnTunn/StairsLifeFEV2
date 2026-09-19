Avatar orang dan logo bisnis. `AvatarGroup` untuk menumpuk pelamar di kartu proyek.

```jsx
<Avatar name="Rani Pratiwi" size="lg" verified />
<Avatar name="Kopi Senja Malang" shape="rounded" size="md" verified />
<AvatarGroup people={[{name:"Rani Pratiwi"},{name:"Dimas Ardi"},{name:"Sinta Halim"},{name:"Bagus W"},{name:"Nadia P"}]} max={4} />
```

Aturan: `shape="rounded"` untuk entitas bisnis, `circle` untuk orang. Centang hijau hanya untuk akun terverifikasi — jangan dipakai sebagai dekorasi.
