Wadah untuk kartu proyek, ringkasan dompet, panel kontrak, dan baris daftar pelamar.

```jsx
<Card interactive as="a" href="#proyek">
  <h3 className="sl-h3">Desain logo & brand kit untuk kedai kopi</h3>
  <Money value={2500000} />
</Card>

<Card raised footer={<Button size="sm">Tarik dana</Button>}>
  <Money value={4150000} size="lg" label="Saldo tersedia" />
</Card>
```

Aturan: kartu di dalam kartu tidak boleh bershadow — pakai `padding="none"` + garis pemisah. Jangan tambah aksen garis kiri berwarna.
