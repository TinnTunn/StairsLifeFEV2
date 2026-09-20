// Klien API dompet, penarikan, dan rekening bank.

import type { BankAccount, Wallet, Withdrawal } from "../types";
import { apiFetch } from "./client";

export interface CreateBankAccountPayload {
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_holder: string;
  is_primary?: boolean;
}

export const wallet = {
  summary: () => apiFetch<Wallet>("/withdrawals/wallet"),

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
