Gelembung chat untuk percakapan mahasiswa ↔ bisnis, termasuk lampiran berkas dan catatan sistem escrow.

```jsx
<ChatBubble side="left" author="Kopi Senja Malang" time="14:28" avatar={<Avatar name="Kopi Senja Malang" size="xs" shape="rounded" />}>
  Halo Rani, boleh lihat versi warna cokelatnya?
</ChatBubble>
<ChatBubble side="right" time="14:32" status="read"
  attachment={{ name: "logo-kopi-senja-v2.pdf", size: "1,8 MB" }}>
  Ini versi cokelatnya, Kak.
</ChatBubble>
<ChatBubble system>Dana Rp 2.500.000 masuk escrow · 10 Sep 2026</ChatBubble>
```

Aturan: peristiwa dana SELALU muncul sebagai `system` bubble di dalam percakapan — riwayat chat sekaligus jadi jejak audit yang bisa dibaca kedua pihak.
