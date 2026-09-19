import * as React from "react";

/**
 * Pembayaran QRIS untuk **menyetor dana kontrak ke escrow**. Bisnis memindai
 * kode, dana masuk ke rekening penampungan StairsLife, lalu ditahan sampai
 * hasil kerja disetujui.
 *
 * Ini satu-satunya titik uang masuk di produk. Tidak ada paket berlangganan
 * dan tidak ada biaya posting — pemasukan platform berupa komisi yang dipotong
 * saat dana dilepas ke mahasiswa.
 *
 * Kode QR di dalam komponen adalah placeholder dan tidak bisa dipindai; ganti
 * dengan gambar QR asli dari penyedia pembayaran saat implementasi.
 */
export interface QRPaymentProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  status?: "menunggu_pembayaran" | "menunggu_konfirmasi" | "lunas" | "gagal";
  /** Detik tersisa; komponen menghitung mundur sendiri selama status menunggu pembayaran. */
  secondsLeft?: number;
  orderId?: string;
  onRegenerate?: () => void;
  /** Tombol "Saya sudah bayar" — memicu polling status lebih cepat. */
  onConfirm?: () => void;
  /** Hanya dipasang bila konfirmasi manual dipakai. */
  onUploadProof?: () => void;
  /** Menimpa empat langkah instruksi default. */
  steps?: string[];
}

export declare function QRPayment(props: QRPaymentProps): JSX.Element;
