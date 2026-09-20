// Kamus Indonesia: pesan galat dari backend.

type Rupiah = (n: number) => string;

export const galatApi = {
  kode: {
    INVALID_CREDENTIALS: "Email atau kata sandi salah.",
    PASSWORD_NOT_SET: "Akun ini belum punya kata sandi. Atur lewat Lupa kata sandi.",
    EMAIL_TAKEN: "Email ini sudah terdaftar.",
    ACCOUNT_SUSPENDED: "Akun ini sedang dibekukan.",
    SESSION_INVALID: "Sesimu sudah berakhir. Silakan masuk lagi.",
    SESSION_REVOKED: "Sesimu sudah berakhir. Silakan masuk lagi.",
    RESET_LINK_INVALID: "Link ganti kata sandi tidak valid atau sudah kedaluwarsa. Minta link baru.",
    VERIFY_LINK_INVALID: "Link verifikasi tidak valid atau sudah kedaluwarsa. Minta link baru dari halaman masuk.",
    REGISTER_FAILED: "Pendaftaran gagal. Coba lagi.",
    ROLE_INVALID: "Hanya akun mahasiswa atau bisnis yang bisa mendaftar.",
    ROLE_REQUIRED: "Akunmu tidak punya akses ke fitur ini.",
    PASSWORD_TOO_SHORT: "Kata sandi minimal 8 karakter.",
    PASSWORD_WRONG: "Kata sandi yang kamu masukkan salah.",
    PASSWORD_SAME: "Kata sandi baru harus berbeda dari yang lama.",
    EMAIL_SAME: "Email baru sama dengan email sekarang.",
    EMAIL_CHANGE_LINK_INVALID: "Link konfirmasi email tidak valid atau sudah kedaluwarsa.",
    ACCOUNT_ADMIN: "Akun admin tidak bisa dihapus dari sini.",
    ACCOUNT_DELETED: "Akun ini sudah dihapus pemiliknya.",
    ACCOUNT_HAS_ACTIVE_CONTRACT: "Masih ada kontrak yang berjalan. Selesaikan dulu sebelum menghapus akun.",
    ACCOUNT_HAS_PENDING_WITHDRAWAL: "Masih ada penarikan dana yang sedang diproses.",
    ACCOUNT_HAS_OPEN_DISPUTE: "Masih ada sengketa yang belum selesai.",

    PROJECT_NOT_FOUND: "Proyek tidak ditemukan. Mungkin sudah dihapus.",
    PROJECT_CLOSED: "Proyek ini sudah tidak menerima lamaran.",
    PROJECT_HAS_CANDIDATE: "Proyek ini sudah punya kandidat terpilih.",
    PROJECT_HAS_CONTRACT: "Proyek ini sudah punya kontrak, jadi tidak bisa dihapus.",
    APPLICATION_DUPLICATE: "Kamu sudah melamar proyek ini.",
    APPLICATION_NOT_FOUND: "Lamaran tidak ditemukan.",
    APPLICATION_NOT_CANCELLABLE: "Lamaran ini sudah diproses, jadi tidak bisa dibatalkan.",
    APPLICATION_NOT_APPROVED: "Terima lamarannya dulu sebelum membuat kontrak.",

    CONTRACT_NOT_FOUND: "Kontrak tidak ditemukan.",
    CONTRACT_NOT_ACTIVE: "Kontrak ini sedang tidak berjalan.",
    CONTRACT_NOT_PENDING_REVIEW: "Kontrak ini tidak sedang menunggu review. Muat ulang halaman.",
    CONTRACT_NOT_PAYABLE: "Kontrak ini tidak bisa dibayar pada status sekarang.",
    CONTRACT_NOT_DISPUTABLE: "Sengketa hanya bisa diajukan saat kontrak berjalan atau menunggu review.",
    DELIVERABLE_FILE_REQUIRED: "Unggah minimal satu berkas hasil kerja.",
    DELIVERABLE_CHANGED: "Hasil kerja sudah berubah sejak halaman dibuka. Periksa lagi sebelum memutuskan.",
    DISPUTE_ACTIVE: "Kontrak ini sedang dalam sengketa. Dana menunggu putusan admin.",
    PAYMENT_EXISTS: "Tagihan untuk kontrak ini sudah dibuat.",
    PAYMENT_NOT_HELD: "Dana belum atau sudah tidak ditahan di escrow.",
    PAYMENT_GATEWAY_ERROR: "Gateway pembayaran sedang bermasalah. Coba lagi beberapa saat lagi.",
    REVIEW_DUPLICATE: "Kamu sudah memberi ulasan untuk kontrak ini.",

    DISPUTE_NOT_FOUND: "Sengketa tidak ditemukan.",
    DISPUTE_CLOSED: "Sengketa sudah ditutup, jadi bukti baru tidak bisa ditambahkan.",
    DISPUTE_REASON_TOO_SHORT: "Tulis alasan minimal 20 karakter.",
    DISPUTE_NOT_OPENER: "Hanya pihak yang mengajukan sengketa yang bisa menambah bukti.",

    WALLET_EMPTY: "Saldo belum tersedia. Selesaikan kontrak untuk mengisi saldo.",
    WALLET_CHANGED: "Saldo berubah. Muat ulang halaman lalu coba lagi.",
    BANK_ACCOUNT_DUPLICATE: "Nomor rekening ini sudah terdaftar.",
    BANK_ACCOUNT_NOT_FOUND: "Rekening tidak ditemukan.",
    BANK_ACCOUNT_IN_USE: "Rekening ini sedang dipakai penarikan yang belum selesai.",

    FILE_TOO_LARGE: "Berkas terlalu besar. Maksimal 10 MB.",
    FILE_TYPE_INVALID: "Jenis berkas tidak didukung.",
    FILE_REQUIRED: "Pilih berkas dulu.",

    CHAT_NEEDS_CONTRACT: "Chat kontrak tersedia setelah kontrak dibuat.",
    CHAT_SELF: "Kamu tidak bisa mengirim pesan ke diri sendiri.",
    USER_SUSPENDED: "Akun ini sedang dibekukan.",
    USER_NOT_FOUND: "Akun tidak ditemukan.",
    ADMIN_PERMISSION_DENIED: "Peranmu tidak punya izin untuk modul ini.",

    FORBIDDEN: "Kamu tidak punya akses ke data ini.",
    NOT_FOUND: "Data tidak ditemukan.",
    TOO_MANY_REQUESTS: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.",
    VALIDATION_FAILED: "Ada isian yang belum sesuai. Periksa lagi formulirnya.",
  },
  berparam: {
    WITHDRAWAL_BELOW_MIN: (rp: Rupiah, p: { amount?: number }) => `Minimal penarikan ${rp(p.amount ?? 0)}.`,
    WITHDRAWAL_BELOW_FEE: (rp: Rupiah, p: { amount?: number }) =>
      `Nominal harus lebih besar dari biaya admin ${rp(p.amount ?? 0)}.`,
    WALLET_INSUFFICIENT: (rp: Rupiah, p: { amount?: number }) => `Saldo tidak cukup. Tersedia ${rp(p.amount ?? 0)}.`,
    ACCOUNT_HAS_BALANCE: (rp: Rupiah, p: { amount?: number }) =>
      `Masih ada saldo ${rp(p.amount ?? 0)}. Tarik saldo dulu sebelum menghapus akun.`,
  },
  perStatus: {
    400: "Permintaan belum bisa diproses. Periksa isian lalu coba lagi.",
    401: "Sesimu sudah berakhir. Silakan masuk lagi.",
    403: "Kamu tidak punya akses ke data ini.",
    404: "Data tidak ditemukan.",
    409: "Data ini sudah ada.",
    429: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.",
  } as Record<number, string>,
};
