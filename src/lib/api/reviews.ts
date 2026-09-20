// Klien API ulasan.

import type { Review } from "../types";
import { apiFetch } from "./client";

export interface CreateReviewPayload {
  contract_id: string;
  rating: number;
  comment?: string;
  tags?: string[];
}

export const reviews = {
  create: (payload: CreateReviewPayload) =>
    apiFetch<Review>("/reviews", { method: "POST", body: payload }),

  byContract: (contractId: string) => apiFetch<Review[]>(`/reviews/contract/${contractId}`),

  byUser: (userId: string) => apiFetch<Review[]>(`/reviews/user/${userId}`),
};
