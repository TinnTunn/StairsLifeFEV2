Dialog konfirmasi dan form pendek. Mobile: bottom sheet. Desktop: terpusat.

```jsx
<Modal open={open} onClose={close} tone="danger" title="Ajukan sengketa?"
  description="Dana tetap ditahan di escrow sampai admin memutuskan. Biasanya selesai dalam 3 hari kerja."
  footer={<><Button variant="secondary" onClick={close}>Batal</Button><Button variant="destructive">Ajukan sengketa</Button></>}>
  <Textarea label="Ceritakan yang terjadi" rows={4} />
</Modal>
```

Aturan: judul berupa pertanyaan atau aksi jelas; `description` menyebutkan konsekuensi terhadap dana. Untuk konfirmasi yang menyangkut uang, pakai `dismissible={false}`.
