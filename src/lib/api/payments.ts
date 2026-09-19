import type { InvoiceResult, Payment } from "../types";
import { apiFetch } from "./client";

export const payments = {
  /**
   * Mengembalikan invoice_url Xendit untuk diarahkan, bukan QR untuk dirender.
   * Setelah bayar, Xendit memantulkan pengguna ke /payment/result.
   */
  createInvoice: (contract_id: string, amount: number, invoice_duration?: number) =>
    apiFetch<InvoiceResult>("/payments/invoice", {
      method: "POST",
      body: { contract_id, amount, ...(invoice_duration ? { invoice_duration } : {}) },
    }),

  /** Cadangan saat webhook Xendit tidak sampai: menarik ulang status invoice. */
  sync: (paymentId: string) => apiFetch<Payment>(`/payments/${paymentId}/sync`),

  release: (paymentId: string) =>
    apiFetch<Payment>(`/payments/escrow/${paymentId}/release`, { method: "PATCH" }),

  mine: () => apiFetch<Payment[]>("/payments/my"),

  byContract: (contractId: string) => apiFetch<Payment | null>(`/payments/contract/${contractId}`),
};
