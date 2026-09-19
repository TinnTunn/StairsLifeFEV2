import type { BankAccount, Wallet, Withdrawal } from "../types";
import { apiFetch } from "./client";

export interface CreateBankAccountPayload {
  bank_name: string;
  /** Huruf besar, angka, atau underscore. Contoh: BCA, MANDIRI. */
  bank_code: string;
  account_number: string;
  account_holder: string;
  is_primary?: boolean;
}

export const wallet = {
  /** Saldo tersimpan sebagai BigInt di database, tapi tiba sebagai number. */
  summary: () => apiFetch<Wallet>("/withdrawals/wallet"),

  /* Minimum kotor 50.000 dan biaya admin 2.500 keduanya bisa diubah lewat env
     backend, jadi jangan dikeraskan sebagai konstanta di sini. */
  requestWithdrawal: (bank_account_id: string, amount: number) =>
    apiFetch<Withdrawal>("/withdrawals", { method: "POST", body: { bank_account_id, amount } }),

  withdrawals: () => apiFetch<Withdrawal[]>("/withdrawals/my"),
};

export const bankAccounts = {
  list: () => apiFetch<BankAccount[]>("/bank-accounts"),

  create: (payload: CreateBankAccountPayload) =>
    apiFetch<BankAccount>("/bank-accounts", { method: "POST", body: payload }),

  detail: (id: string) => apiFetch<BankAccount>(`/bank-accounts/${id}`),

  setPrimary: (id: string) =>
    apiFetch<BankAccount>(`/bank-accounts/${id}/primary`, { method: "PATCH" }),

  remove: (id: string) => apiFetch<{ id: string }>(`/bank-accounts/${id}`, { method: "DELETE" }),
};
