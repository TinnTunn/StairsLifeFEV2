// Peta status backend ke kunci lencana status.

import type {
  ApplicationStatus,
  ContractStatus,
  DisputeStatus,
  PaymentStatus,
  ProjectStatus,
  VerificationStatus,
  WithdrawalStatus,
} from "./types";

export const APPLICATION_STATUS: Record<ApplicationStatus, string> = {
  pending: "terkirim",
  shortlisted: "seleksi",
  approved: "diterima",
  rejected: "ditolak",
};

export const CONTRACT_STATUS: Record<ContractStatus, string> = {
  active: "dikerjakan",
  pending_review: "menunggu_review",
  completed: "selesai",
  disputed: "sengketa",
  cancelled: "dibatalkan",
};

export const PROJECT_STATUS: Record<ProjectStatus, string> = {
  open: "aktif",
  inProgress: "dikerjakan",
  completed: "selesai",
  disputed: "sengketa",
  cancelled: "ditutup",
};

export const PAYMENT_STATUS: Record<PaymentStatus, string> = {
  pending: "menunggu_pembayaran",
  held: "escrow_ditahan",
  released: "lunas",
  refunded: "dikembalikan",
  split_settled: "dibagi_sebagian",
  expired: "kedaluwarsa",
  failed: "gagal",
};

export const VERIFICATION_STATUS: Record<VerificationStatus, string> = {
  pending: "menunggu_review",
  approved: "terverifikasi",
  rejected: "ditolak",
};

export const WITHDRAWAL_STATUS: Record<WithdrawalStatus, string> = {
  pending: "menunggu_konfirmasi",
  processing: "dikerjakan",
  completed: "selesai",
  rejected: "ditolak",
  failed: "gagal",
};

export const DISPUTE_STATUS: Record<DisputeStatus, string> = {
  open: "sengketa",
  under_review: "menunggu_review",
  in_review: "menunggu_review",
  mediation: "menunggu_review",
  resolved: "selesai",
  rejected: "ditolak",
};
