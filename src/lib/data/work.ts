// Pembaca lamaran, kontrak, dan dompet milik pengguna.

import { teksGalat } from "@/i18n/aktif";
import { applications as applicationsApi } from "../api/applications";
import { ApiError, USE_MOCK } from "../api/client";
import { contracts as contractsApi, type ContractDeliverable } from "../api/contracts";
import { payments as paymentsApi } from "../api/payments";
import { projects as projectsApi } from "../api/projects";
import { reviews as reviewsApi } from "../api/reviews";
import { wallet as walletApi } from "../api/wallet";
import { MOCK_PROJECTS } from "../mock/projects";
import { MOCK_APPLICATIONS, MOCK_CONTRACTS, MOCK_PAYMENTS, MOCK_WALLET } from "../mock/work";
import type { Application, Contract, Payment, Project, Review, Wallet } from "../types";

export interface Hasil<T> {
  data: T;
  sample: boolean;
  error?: string;
}

function pesan(error: unknown): string {
  return error instanceof ApiError ? error.message : teksGalat().jaringan;
}

async function ambil<T>(mock: T, nyata: () => Promise<T>, kosong: T): Promise<Hasil<T>> {
  if (USE_MOCK) return { data: mock, sample: true };
  try {
    const data = await nyata();
    if (Array.isArray(kosong) && !Array.isArray(data)) return { data: kosong, sample: false };
    return { data, sample: false };
  } catch (error) {
    return { data: kosong, sample: false, error: pesan(error) };
  }
}

export const myApplications = () => ambil<Application[]>(MOCK_APPLICATIONS, applicationsApi.mine, []);

export const myContracts = () => ambil<Contract[]>(MOCK_CONTRACTS, contractsApi.mine, []);

export const myWallet = async (): Promise<Hasil<Wallet>> => {
  const hasil = await ambil<Wallet>(MOCK_WALLET, walletApi.summary, {
    amount: 0,
    pending_amount: 0,
    total_earned: 0,
    total_withdrawn: 0,
    recent_transactions: [],
  });
  const d = hasil.data;
  return {
    ...hasil,
    data: {
      ...d,
      recent_transactions: Array.isArray(d?.recent_transactions) ? d.recent_transactions : [],
    },
  };
};

export async function getApplication(id: string): Promise<Hasil<Application | null>> {
  if (USE_MOCK) return { data: MOCK_APPLICATIONS.find((a) => a.id === id) ?? null, sample: true };
  try {
    const milikku = (await applicationsApi.mine()).find((a) => a.id === id);
    if (milikku) return { data: milikku, sample: false };
    return { data: await applicationsApi.detail(id), sample: false };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return { data: null, sample: false };
    return { data: null, sample: false, error: pesan(error) };
  }
}

export async function getContract(id: string): Promise<Hasil<Contract | null>> {
  if (USE_MOCK) return { data: MOCK_CONTRACTS.find((c) => c.id === id) ?? null, sample: true };
  try {
    return { data: await contractsApi.detail(id), sample: false };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return { data: null, sample: false };
    return { data: null, sample: false, error: pesan(error) };
  }
}

export async function getContractPayment(contractId: string): Promise<Hasil<Payment | null>> {
  if (USE_MOCK) return { data: MOCK_PAYMENTS.find((p) => p.contract_id === contractId) ?? null, sample: true };
  try {
    return { data: await paymentsApi.byContract(contractId), sample: false };
  } catch (error) {
    return { data: null, sample: false, error: pesan(error) };
  }
}

export const myProjects = () =>
  ambil<Project[]>(
    MOCK_PROJECTS,
    () => projectsApi.mine(),
    [],
  );

export async function projectApplications(projectId: string): Promise<Hasil<Application[]>> {
  if (USE_MOCK) {
    return { data: MOCK_APPLICATIONS.filter((a) => a.project_id === projectId), sample: true };
  }
  try {
    return { data: await applicationsApi.byProject(projectId), sample: false };
  } catch (error) {
    return { data: [], sample: false, error: pesan(error) };
  }
}

export async function contractReviews(contractId: string): Promise<Hasil<Review[]>> {
  if (USE_MOCK) return { data: [], sample: true };
  try {
    return { data: await reviewsApi.byContract(contractId), sample: false };
  } catch (error) {
    return { data: [], sample: false, error: pesan(error) };
  }
}

export async function contractDeliverables(contractId: string): Promise<Hasil<ContractDeliverable[]>> {
  if (USE_MOCK) return { data: [], sample: true };
  try {
    return { data: await contractsApi.deliverables(contractId), sample: false };
  } catch (error) {
    return { data: [], sample: false, error: pesan(error) };
  }
}
