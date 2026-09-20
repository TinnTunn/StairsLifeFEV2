// Klien API pembayaran.

import type { InvoiceResult, Payment } from "../types";
import { apiFetch } from "./client";

export const payments = {
  createInvoice: (contract_id: string, amount: number, invoice_duration?: number) =>
    apiFetch<InvoiceResult>("/payments/invoice", {
      method: "POST",
      body: { contract_id, amount, ...(invoice_duration ? { invoice_duration } : {}) },
    }),

  sync: (paymentId: string) => apiFetch<Payment>(`/payments/${paymentId}/sync`),

  release: (paymentId: string) =>
    apiFetch<Payment>(`/payments/escrow/${paymentId}/release`, { method: "PATCH" }),

  mine: () => apiFetch<Payment[]>("/payments/my"),

  byContract: (contractId: string) => apiFetch<Payment | null>(`/payments/contract/${contractId}`),
};
