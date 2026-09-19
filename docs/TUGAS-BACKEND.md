# Tugas backend, langkah demi langkah

Semua yang di bawah ada di `../StairsLifeBEV2`. Yang saya ubah di sana hanya
`.env` dan satu baris enum di `prisma/schema.prisma` (Langkah 6), lalu
menjalankan `prisma db push` dan `prisma generate` ke database baru. Kode
sumber di `src` tidak saya sentuh. Nomor barisnya diambil dari kode saat dokumen
ini ditulis.

**Status 14 September 2026:** database baru hidup dan alur uang sudah diuji
ujung ke ujung lewat frontend. Temuan dari uji itu ada di Langkah 11.

---

## Langkah 1: env sudah saya ubah, CORS terbukti benar

**Sudah dikerjakan.** Cadangan aslinya ada di `.env.backup-sebelum-fe3`.

```
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173, http://127.0.0.1:5501, http://localhost:3001, http://127.0.0.1:3001
```

Entri lama dipertahankan. Diverifikasi dengan backend menyala:

| Uji | Hasil |
|---|---|
| Preflight OPTIONS dari `http://localhost:3001` | 204, dengan `Access-Control-Allow-Origin: http://localhost:3001` |
| Permintaan nyata dari origin 3001 | Header izin ada |
| Origin `http://localhost:9999` | Tanpa header izin, ditolak seperti seharusnya |

Satu koreksi atas laporan saya sebelumnya: `src/common/cors.util.ts` **dipakai**
`main.ts`, bukan kode mati seperti yang saya sampaikan. Ia juga memangkas spasi
di sekitar koma, jadi format `a, b, c` aman.

---

## Langkah 2: proyek Supabase sudah tidak ada

**Selesai, kecuali akun admin (poin 7).** Proyek baru `arwodhjcxjrgyubtzjmn` di
Singapore. Diperiksa hanya-baca setelah disiapkan: 21 tabel, RLS aktif di
semuanya, `admin_roles` berisi dua peran bawaan, tiga bucket dengan setelan
public yang benar, enum `contract_status` sudah memuat `cancelled`. Catatan di
bawah dipertahankan sebagai riwayat dan panduan kalau database perlu dibuat ulang.

Masalah semula: backend menyala dan seluruh rutenya terdaftar, tapi tidak ada
database di ujung sana.

```
(ENOTFOUND) tenant/user postgres.bdsksqmteysuhoftvzoc not found
```

Diagnosisnya pasti, bukan tebakan:

| Uji | Hasil |
|---|---|
| DNS `bdsksqmteysuhoftvzoc.supabase.co` | **Tidak resolve (ENOTFOUND)** |
| REST Supabase | Gagal di level jaringan |
| `GET /api/v1/projects` | 500 |
| Ref proyek di `SUPABASE_URL` dan `DATABASE_URL` | Sama, jadi bukan salah ketik |
| DNS kedua host pooler | Keduanya resolve, jadi bukan masalah jaringan lokal |

Proyek Supabase yang **dijeda** tetap resolve di DNS dan menjawab 503. Yang tidak
resolve sama sekali berarti proyeknya sudah dihapus, atau ref-nya milik proyek
lama yang sudah tidak ada.

### Cara mengisi database baru

**Koreksi atas instruksi saya sebelumnya.** Saya sempat menulis "jalankan migrasi
Prisma", dan itu tidak akan berhasil. `prisma/migrations/` berisi delapan berkas
`.sql` lepas, bukan struktur `NNNN_nama/migration.sql` yang dicari Prisma, jadi
`prisma migrate deploy` tidak menemukan apa pun untuk dijalankan.

### Pengaturan saat membuat proyek

Diturunkan dari cara backend benar-benar memakai Supabase, bukan dari saran umum.
Backend hanya memakai `SUPABASE_SERVICE_ROLE_KEY`; tidak ada anon key di mana pun
di `src`, dan tidak memakai Supabase Auth karena punya JWT sendiri.

| Pengaturan | Pilih | Alasan |
|---|---|---|
| Region | Singapore (`ap-southeast-1`) | Terdekat dengan Malang, sama dengan proyek lama. **Jebakan:** pilihan umum "Asia-Pacific" jatuh ke Sydney (`ap-southeast-2`). Diukur dari mesin pengembangan: TCP ke pooler Singapore median 20 ms, ke pooler Sydney 257 ms. Region tidak bisa diganti setelah proyek dibuat, jadi pilih Singapore secara spesifik |
| Enable Data API | **Nyala** | `@supabase/supabase-js` dipakai login, chat, peran admin, log audit, dan unggah berkas. Tanpa Data API semuanya gagal, dan karena bug di Langkah 3, login gagal itu terbaca "Email atau password salah" |
| Automatically expose new tables | Nyala | Tabel dari `prisma db push` perlu hak akses untuk `service_role`. Kalau dimatikan, hak itu harus di-`GRANT` manual per tabel |
| Enable automatic RLS | **Nyala** | Pengaturan di atas ikut memberi akses tabel ke peran `anon`. Tanpa RLS, siapa pun yang memegang anon key bisa membaca tabel `users` langsung, **termasuk kolom `password_hash`**, melewati NestJS sepenuhnya. Dengan RLS nyala dan tanpa policy, `anon` tidak dapat apa-apa, sedangkan backend tidak terpengaruh: `service_role` dan pemilik tabel (koneksi Prisma) sama-sama melewati RLS |

Simpan password database sekarang. Kalau isinya punya karakter khusus seperti
`@ # / : ? &`, karakter itu harus di-percent-encode di `DATABASE_URL`, misalnya
`@` jadi `%40`. Kalau tidak, Prisma gagal dengan pesan autentikasi yang tidak
menyebut penyebab sebenarnya.

### Mengisi database

Untuk database yang benar-benar kosong, urutannya begini:

**1. Tambahkan `cancelled` ke enum lebih dulu** (Langkah 6 di bawah, kerjakan
sekarang supaya tidak perlu SQL tambahan nanti):

```
prisma/schema.prisma baris 337, tambahkan cancelled ke enum contract_status
```

**2. Perbarui tiga nilai di `.env`** dari dashboard Supabase proyek baru:
`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Ambil
`DATABASE_URL` dari Connection String mode **Session pooler**, bukan Direct.

**3. Dorong skema:**

```bash
npx prisma db push
```

Ini membuat sembilan belas tabel dan semua enum dari `schema.prisma`, termasuk
`wallets`, `wallet_transactions`, `bank_accounts`, `withdrawals`, dan
`notifications`. Tidak perlu berkas SQL untuk semua itu.

**4. Jalankan dua berkas SQL ini di Supabase SQL Editor.** Hanya dua, karena
hanya dua tabel yang dipakai kode tapi tidak ada di `schema.prisma`:

| Berkas | Kenapa perlu |
|---|---|
| `prisma/migrations/admin_roles.sql` | Tabel `admin_roles`, dipakai `RolesService` lewat Supabase client |
| `prisma/migrations/audit_logs.sql` | Tabel `audit_logs`, dipakai `AuditService` untuk mencatat aksi admin |

Opsional tapi disarankan: `payment_integrity_constraints.sql`, isinya CHECK
constraint untuk alur pembayaran. Bacanya dulu, berkas itu menyuruh menjalankan
blok pemeriksaan sebelum blok perubahan.

**5. Berkas yang TIDAK perlu dijalankan** di database kosong, supaya kamu tidak
membuang waktu atau membuat tabel yatim:

| Berkas | Alasan dilewati |
|---|---|
| `manual_notifications.sql` | Berkasnya sendiri bilang tidak perlu kalau pakai `db push` di database fresh |
| `xendit_payment_gateway.sql` | Semua tabelnya (`wallets`, `withdrawals`, `bank_accounts`, `wallet_transactions`) sudah ada di `schema.prisma` |
| `fix_enums.sql` | `split_settled` sudah ada di `schema.prisma`; `cancelled` sudah kamu tambahkan di langkah 1 |
| `sprint_full_schema.sql` | Membuat `payment_intents`, `portfolios`, `project_skills`, dan `skills`. Saya grep seluruh `src`: keempatnya tidak dipakai satu baris kode pun. `skills` yang dipakai kode adalah kolom array di `users` dan `projects`, bukan tabel |
| `dev_clear_chat_history.sql` | Utilitas dev untuk menghapus pesan, bukan migrasi |

**6. Buat tiga bucket Storage.** Backend tidak membuatnya sendiri; tidak ada
`createBucket` di mana pun, jadi tanpa ketiganya setiap unggahan gagal. Nama
harus persis sama, diambil dari `src/modules/upload/upload.service.ts` baris 22
sampai 24:

| Bucket | Public | Isinya |
|---|---|---|
| `stairslife-uploads` | **Nyala** | Avatar dan gambar chat. Backend mengembalikan URL publik langsung |
| `verification` | Mati | Foto KTM dan selfie verifikasi. Dibuka lewat signed URL satu jam |
| `stairslife-private` | Mati | Hasil kerja dan bukti sengketa. Dibuka lewat signed URL, dipaksa unduh |

Salah menyetel `verification` jadi publik berarti foto KTM mahasiswa bisa dibuka
siapa saja yang menebak path-nya.

**7. Buat satu akun admin.** Registrasi publik menolak `role: 'admin'`
(`RegisterDto` hanya menerima `mahasiswa` dan `bisnis`), jadi akun admin pertama
harus dibuat lewat SQL Editor: daftar sebagai bisnis lewat aplikasi, lalu
`UPDATE users SET role = 'admin' WHERE email = '...'`.

**8. Set `NEXT_PUBLIC_USE_MOCK=0`** di `.env.local` frontend. Sudah, sejak
database baru hidup. Kembalikan ke `1` hanya kalau perlu membuka aplikasi tanpa
backend.

---

## Langkah 3: login menyamarkan gangguan database sebagai salah password

Ini temuan baru, dan hanya muncul karena backend dijalankan melawan database
yang mati. Tidak terlihat dari membaca kode saja.

**Berkas:** `src/modules/auth/auth.service.ts` baris 126.

```ts
const { data: user } = await supabase.from('users')...
```

Objek `error` dari Supabase dibuang seluruhnya. Kegagalan koneksi, error izin,
dan "email tidak ada" jadi tidak bisa dibedakan: ketiganya membuat `user`
undefined, lalu jatuh ke `throw new UnauthorizedException('Email atau password
salah')` di baris 141.

Akibatnya, saat database bermasalah, **setiap pengguna diberi tahu bahwa
passwordnya salah.** Saya membuktikannya barusan: dengan database mati, login
menjawab 401 "Email atau password salah", bukan 503.

```diff
-    const { data: user } = await supabase
+    const { data: user, error } = await supabase
       .from('users')
       ...
       .single();
+
+    // PGRST116 = tidak ada baris, itu memang "email tidak terdaftar".
+    // Kode lain berarti gangguan infrastruktur, bukan kesalahan pengguna.
+    if (error && error.code !== 'PGRST116') {
+      throw new ServiceUnavailableException(
+        'Layanan sedang bermasalah. Coba lagi beberapa saat lagi.',
+      );
+    }
```

Frontend saya sudah menerjemahkan 503 jadi pesan Indonesia yang benar, jadi
begitu ini diperbaiki pengguna langsung melihat pesan yang tepat.

---

## Langkah 4: bug sengketa

**Berkas:** `src/modules/disputes/disputes.service.ts` baris 194.

Penjaganya memeriksa `'in_review'`, tapi tidak ada satu pun kode yang menulis
nilai itu. Yang ditulis admin lewat DTO adalah `'under_review'`
(`src/modules/admin/dto/resolve-dispute.dto.ts` baris 13). Akibatnya begitu admin
mulai memeriksa sengketa, pihak yang mengajukan tidak bisa lagi mengirim bukti.
Di produk yang menahan uang orang, ini merugikan tepat di saat paling genting.

```diff
-    if (dispute.status !== 'open' && dispute.status !== 'in_review') {
+    if (dispute.status !== 'open' && dispute.status !== 'under_review') {
       throw new BadRequestException(
         'Sengketa sudah ditutup, tidak bisa menambah bukti baru',
       );
     }
```

Sekalian putuskan nasib `'mediation'`. Nilai itu diperiksa di `create` (baris 43)
tapi tidak pernah ditulis apa pun. Kalau memang tidak dipakai, buang; kalau
dipakai, tambahkan ke DTO admin.

---

## Langkah 5: ulasan bisa dibaca siapa saja

**Berkas:** `src/modules/reviews/reviews.controller.ts` dan `reviews.service.ts`
baris 150.

`getByContract` hanya menerima `contractId`, tanpa `user.id`, dan tidak memeriksa
apa pun. Siapa pun yang punya akun bisa membaca ulasan kontrak orang lain kalau
tahu ID-nya. Endpoint kontrak yang lain sudah memeriksa pihak; yang ini terlewat.

Controller:

```diff
   @Get('contract/:contractId')
-  getByContract(@Param('contractId') contractId: string) {
-    return this.reviewsService.getByContract(contractId);
+  getByContract(
+    @CurrentUser() user: JwtUser,
+    @Param('contractId') contractId: string,
+  ) {
+    return this.reviewsService.getByContract(contractId, user.id);
   }
```

Service, di awal `getByContract`:

```ts
async getByContract(contractId: string, userId: string) {
  const contract = await this.prisma.contracts.findUnique({
    where: { id: contractId },
    select: { student_id: true, business_id: true },
  });
  if (!contract) throw new NotFoundException('Kontrak tidak ditemukan');
  if (contract.student_id !== userId && contract.business_id !== userId) {
    throw new ForbiddenException('Kamu bukan pihak dalam kontrak ini');
  }
  // sisanya seperti sekarang
}
```

`getByUser` tidak perlu diubah: ulasan seseorang memang sudah tampil di profil
publiknya lewat `GET /users/:id`.

Frontend saya sudah memanggil endpoint ini dari halaman kontrak, dan pemanggilnya
selalu pihak kontrak, jadi perubahan ini tidak memutus apa pun di sisi saya.

---

## Langkah 6: enum `contract_status` kurang satu nilai

**Sudah dikerjakan** dan terdorong ke database baru.

**Berkas:** `prisma/schema.prisma` baris 337.

`admin.service.ts` menulis `'cancelled'` saat sengketa dimenangkan bisnis, dan
itu hanya berhasil karena nilainya ditambahkan lewat migrasi SQL terpisah. Prisma
tidak tahu, jadi tipe yang dihasilkannya salah.

```diff
 enum contract_status {
   active
   pending_review
   completed
   disputed
+  cancelled
 }
```

Lalu `npx prisma generate`. Tipe frontend saya sudah memuat `cancelled`, jadi
setelah ini keduanya cocok.

---

## Langkah 7: endpoint health

**Berkas:** `src/app.module.ts` baris 61, `controllers: []`.

`README.md` menyuruh `curl http://localhost:3000/api/v1` sebagai cek kesehatan,
tapi tidak ada controller sama sekali di situ, jadi hasilnya 404. Probe deploy
Railway akan menganggap servisnya mati.

Buat `src/app.controller.ts`:

```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return { status: 'ok', version: process.env.npm_package_version ?? null };
  }
}
```

lalu daftarkan di `app.module.ts`: `controllers: [AppController]`.

---

## Langkah 8: paginasi dan saringan proyek

Ini yang paling terasa begitu proyeknya bertambah. `GET /projects` sekarang
mengirim **seluruh** proyek terbuka sekaligus, tanpa batas, dan hanya menerima
`search`, `tier`, dan `category`.

Yang perlu ditambah ke `FilterProjectDto`:

- `page` dan `limit`, dengan respons `{ items, pagination }` seperti yang sudah
  dipakai `GET /withdrawals` dan `GET /admin/finances/detail`, supaya bentuknya
  konsisten
- `location`, `budget_min`, `budget_max`

`src/common/dto/pagination.dto.ts` sudah ada di repo tapi tidak dipakai satu
controller pun. Bisa dipakai di sini daripada menulis paginasi manual untuk
ketiga kalinya.

Beri tahu saya kalau sudah, supaya saya sambungkan panel saringnya. Sekarang
frontend sengaja hanya menampilkan tiga saringan yang benar-benar didukung.

---

## Langkah 9: bug kecil yang bisa menyusul

| Berkas | Masalah | Perbaikan |
|---|---|---|
| `admin.service.ts` sekitar 505 | `favor_business` hanya mengubah status jadi `refunded`; `XenditService.createRefund` tidak pernah dipanggil, jadi uangnya dipindahkan manual lewat dashboard | Putuskan: otomatiskan, atau tulis prosedurnya supaya tidak terlupa saat ada sengketa sungguhan |
| `chat.controller.ts` `support-inbox` | Tidak menyaring prefix room, jadi inbox dukungan admin ikut memuat room `inquiry-` dan `mediation-` | Saring `room_id` yang berawalan `support-` |
| `chat.controller.ts` mediasi | `POST /chat/mediation/:disputeId/messages` menyimpan pesan tapi tidak mengirim event WebSocket, padahal support dan inquiry mengirim | Samakan dengan jalur yang lain |
| `auth.service.ts` `_generateTokenPair` | Token hanya memuat `sub`, `email`, `role`. `ChatGateway` membaca `payload.full_name`, jadi `userName` selalu undefined dan pengirim jatuh ke "Seseorang" | Tambahkan `full_name` ke payload, atau ambil dari database di gateway |
| `payments.service.ts` | `invalidateFeeCache()` tidak pernah dipanggil, jadi perubahan komisi baru berlaku setelah 60 detik | Panggil dari `PATCH /admin/settings` |

---

## Langkah 10: keputusan model produk

**Verifikasi bisnis: sudah diputuskan, tidak jadi dibangun.** Bisnis tidak
diverifikasi, karena menyetor dana kontrak ke escrow adalah verifikasinya.
Perilaku backend sekarang (`is_verified: true` saat akun bisnis dibuat) sudah
benar dan tidak perlu diubah. Antrean verifikasi bisnis di spesifikasi layar
(A3) dibuang.

Tinggal satu yang belum diputuskan. Selama belum, saya tidak akan membangun
layarnya, karena memalsukannya akan terlihat bekerja lalu gagal saat
disambungkan.

**Moderasi proyek.** `project_status` tidak punya nilai menunggu, dan
`ProjectsService.create` langsung menyetel `'open'`. Spesifikasi layar punya
antrean moderasi admin. Kalau moderasi memang mau ada, enum dan alurnya harus
ditambah lebih dulu.

---

## Langkah 11: temuan dari uji sambung ujung ke ujung

Ditemukan saat menjalankan alur nyata lewat frontend: pasang proyek, lamar,
terima, buat kontrak, bayar escrow di Xendit staging, kirim hasil, minta
perbaikan, kirim ulang, setujui, ulasan dua arah, tambah rekening, tarik dana.
Semua yang bisa ditambal di frontend sudah ditambal, jadi aplikasinya tetap
benar. Perbaikan di bawah menghapus akar masalahnya.

### Prioritas tinggi

| Berkas | Masalah | Perbaikan |
|---|---|---|
| `common/interceptors/response.interceptor.ts` baris 39 | `data?.data ?? data`: saat service mengembalikan `{ data: null }`, `??` jatuh ke objek utuh, jadi klien menerima `{ data: null, message }` alih-alih `null`. Kena di `GET /users/me/verification` (mahasiswa yang belum mengajukan terbaca "sedang direview") dan `GET /payments/contract/:id` (kontrak tanpa pembayaran terbaca punya pembayaran) | `data && typeof data === 'object' && 'data' in data ? data.data : data`. Setelah itu, hapus `bukaBungkusGanda` di `src/lib/api/client.ts` frontend |
| `modules/applications/applications.service.ts` baris 26 | `applyToProject` tidak memeriksa `is_verified`. Frontend menutup tombol lamar untuk mahasiswa yang belum diverifikasi (sesuai `PAGES_AND_FLOWS.md`), tapi siapa pun bisa melamar lewat API langsung. Terbukti: akun uji yang belum disetujui berhasil melamar | Tolak dengan 403 kalau pelamar belum `is_verified` |
| `modules/contracts/contracts.service.ts` baris 395 | Minta perbaikan menimpa `contracts.deliverable_notes` dengan alasan penolakan. Kiriman ulang tanpa catatan (baris 147 dan 155) tidak menghapusnya, jadi alasan bisnis tampil sebagai "catatan dari mahasiswa" | Jangan tulis alasan ke `deliverable_notes` (sudah tersimpan di `contract_deliverables.rejection_reason`), dan tulis `dto.deliverable_notes ?? null` saat kirim ulang |
| `modules/users/users.service.ts` baris 59 | `submitVerification` menimpa pengajuan apa pun dan mengembalikan status ke `pending`, termasuk yang sudah `approved`. Mahasiswa terverifikasi yang mengirim ulang kembali masuk antrean, sementara `is_verified` tetap true. Saat menimpa, `reviewed_at`, `reviewed_by`, dan `rejection_reason` dari penolakan lama juga tidak dikosongkan, jadi pengajuan `pending` membawa tanggal dan alasan penolakan sebelumnya | Tolak kalau status `pending` atau `approved`; izinkan hanya setelah `rejected`. Setel ketiga kolom itu ke `null` saat menimpa |
| Tidak ada | Tidak ada cara resmi membuat admin. Satu-satunya jalan `UPDATE users SET role = 'admin'` di SQL Editor, dan salah ketik email tidak memberi peringatan apa pun (SQL Editor tetap menulis "Success" untuk 0 baris, dan ini benar-benar terjadi saat uji) | Skrip seed kecil, misalnya `npm run create-admin -- email`, yang gagal dengan jelas kalau emailnya tidak ada |

### Prioritas sedang

| Berkas | Masalah | Perbaikan |
|---|---|---|
| `modules/applications/applications.service.ts` baris 109 | `GET /applications/:id` hanya mengirim kolom mentah, tanpa proyek, pemilik usaha, atau kontrak, padahal `GET /applications/my` membawa ketiganya. Frontend sekarang mencari lamaran di `/my` dulu | Sertakan relasi yang sama dengan `/my` |
| `modules/bank-accounts/dto/create-bank-account.dto.ts` baris 13, 33, 38 | `@Length` tanpa `message`, jadi pengguna menerima pesan bawaan class-validator: "account_number must be longer than or equal to 6 characters". Frontend sekarang memvalidasi lebih dulu | Beri pesan bahasa Indonesia di setiap dekorator. Periksa DTO lain dengan pola yang sama |
| `modules/upload/upload.service.ts` `resolvePath` | Nama asli berkas tidak disimpan di mana pun, jadi hasil kerja hanya bisa ditampilkan sebagai "Berkas 1, PNG" | Simpan `file_name` di `contract_deliverables`, atau sertakan di path |

### Kosmetik

| Berkas | Masalah |
|---|---|
| `modules/email/email.service.ts` baris 63, `templates/welcome.template.ts` baris 32 | Tautan email memakai `/verify-email`, `/?tab=verification`, dan `/?tab=projects`. Frontend sudah mengalihkannya di `next.config.ts`, jadi tidak ada yang rusak, tapi tautan langsung ke `/verifikasi-email`, `/mahasiswa/verifikasi`, dan `/bisnis/proyek/baru` menghemat satu lompatan |
| `modules/email/templates/welcome.template.ts` baris 24 sampai 35 | Email selamat datang bisnis menyuruh "Lengkapi profil bisnis & verifikasi", padahal bisnis tidak diverifikasi (keputusan produk). Semua baris dan tombolnya juga diawali emoji |
| `modules/payments/payments.service.ts` baris 204 | Deskripsi invoice memakai em dash (`— kontrak ...`) dan tampil di halaman checkout Xendit |
| `modules/payments/payments.service.ts` baris 377, 387, 411, 467, 552 | Judul notifikasi diawali emoji (🔒 ✅ ⏰ 💰). Frontend tidak memakai emoji di mana pun, jadi notifikasi akan terasa dari produk lain |
| `prisma/schema.prisma` model `applications` | Tidak ada `updated_at`, jadi waktu lamaran diseleksi, diterima, atau ditolak tidak tercatat. Timeline di frontend hanya bisa memberi tanggal pada langkah "dikirim" |

---

## Sisa endpoint yang belum ada

Delapan hal ini diminta spesifikasi layar tapi tidak punya endpoint. Urutannya
menurut seberapa cepat terasa hilang:

1. Proyek tersimpan (simpan dan hapus simpanan)
2. Laporan dan aduan pengguna
3. Preferensi notifikasi
4. Ganti email dan ganti kata sandi dari halaman pengaturan
5. Hapus akun
6. Pertanyaan tambahan dari bisnis di form lamaran
7. Master data kategori, institusi, jurusan, keahlian
8. Revokasi refresh token, karena `POST /auth/logout` sekarang tidak melakukan
   apa pun di sisi server dan token curian tetap berlaku sampai kedaluwarsa
