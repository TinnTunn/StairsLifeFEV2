// Klien API pengguna, profil publik, dan portofolio.

import type { Review, User, Verification } from "../types";
import { apiFetch } from "./client";

export interface UpdateProfilePayload {
  full_name?: string;
  bio?: string;
  university?: string;
  major?: string;
  semester?: number;
  skills?: string[];
  portfolio_url?: string;
  phone?: string;
  company_name?: string;
  business_type?: string;
  location?: string;
  avatar_url?: string;
}

export interface PublicProfile {
  user: Omit<User, "email" | "is_suspended" | "suspension_reason" | "updated_at">;
  reviews: Review[];
  review_count: number;
  rating_distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface PortfolioItem {
  contract_id: string;
  project: { id: string; title: string; category: string; tier: string; skills: string[] };
  client: { id: string; full_name: string; avatar_url: string | null };
  budget: number;
  started_at: string | null;
  completed_at: string | null;
  deliverable_url: string | null;
  review: { rating: number; comment: string | null; created_at: string } | null;
}

export const users = {
  me: () => apiFetch<User>("/users/me"),

  updateMe: (payload: UpdateProfilePayload) =>
    apiFetch<User>("/users/me", { method: "PATCH", body: payload }),

  verification: () =>
    apiFetch<Pick<Verification, "id" | "status" | "submitted_at" | "reviewed_at" | "rejection_reason"> | null>(
      "/users/me/verification",
    ),

  submitVerification: (payload: {
    ktm_image_url: string;
    university: string;
    selfie_url?: string;
    student_id_number?: string;
  }) => apiFetch<Verification>("/users/me/verification", { method: "POST", body: payload }),

  profile: (id: string) => apiFetch<PublicProfile>(`/users/${id}`),

  portfolio: (id: string) =>
    apiFetch<{
      user_id: string;
      user_role: string;
      total_projects: number;
      items: PortfolioItem[];
      summary: {
        total_completed: number;
        total_earnings: number;
        unique_categories: number;
        average_rating: number;
      };
    }>(`/users/${id}/portfolio`),
};
