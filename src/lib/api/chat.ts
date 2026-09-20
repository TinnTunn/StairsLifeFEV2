// Klien API obrolan kontrak, tanya jawab, dan dukungan.

import type { UserRole } from "../types";
import { apiFetch } from "./client";

export interface PesanObrolan {
  id: string;
  sender_id: string | null;
  content: string;
  created_at: string;
  sender_role?: string | null;
  is_read?: boolean;
  sender?: { id: string; full_name: string; role: UserRole; avatar_url?: string | null } | null;
}

export interface RuangKontrak {
  id: string;
  status: string;
  agreed_budget: number;
  projects: { id: string; title: string } | null;
  users_contracts_student_idTousers: { id: string; full_name: string } | null;
  users_contracts_business_idTousers: { id: string; full_name: string } | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface RuangTanya {
  room_id: string;
  other_user_id: string;
  other_user: { id: string; full_name: string; role: UserRole; avatar_url?: string | null } | null;
  last_message: string;
  last_message_at: string;
  last_sender_id: string;
}

export type SumberObrolan =
  | { jenis: "kontrak"; id: string }
  | { jenis: "tanya"; id: string }
  | { jenis: "mediasi"; id: string }
  | { jenis: "bantuan" };

export const BATAS_PESAN = 5000;

export const chat = {
  rooms: () => apiFetch<RuangKontrak[]>("/chat/rooms"),
  inquiryRooms: () => apiFetch<RuangTanya[]>("/chat/inquiry-rooms"),

  async ambil(sumber: SumberObrolan): Promise<{ pesan: PesanObrolan[]; lawan?: RuangTanya["other_user"] }> {
    switch (sumber.jenis) {
      case "kontrak":
        return { pesan: await apiFetch<PesanObrolan[]>(`/chat/${sumber.id}/messages`) };
      case "tanya": {
        const r = await apiFetch<{ messages: PesanObrolan[]; other_user: RuangTanya["other_user"] }>(
          `/chat/inquiry/${sumber.id}/messages`,
        );
        return { pesan: r.messages ?? [], lawan: r.other_user };
      }
      case "mediasi": {
        const r = await apiFetch<{ messages: PesanObrolan[] }>(`/chat/mediation/${sumber.id}/messages`);
        return { pesan: r.messages ?? [] };
      }
      case "bantuan": {
        const r = await apiFetch<{ messages: PesanObrolan[] }>("/chat/support");
        return { pesan: r.messages ?? [] };
      }
    }
  },

  kirim(sumber: SumberObrolan, content: string): Promise<PesanObrolan> {
    const body = { content };
    switch (sumber.jenis) {
      case "kontrak":
        return apiFetch<PesanObrolan>(`/chat/${sumber.id}/messages`, { method: "POST", body });
      case "tanya":
        return apiFetch<PesanObrolan>(`/chat/inquiry/${sumber.id}/messages`, { method: "POST", body });
      case "mediasi":
        return apiFetch<PesanObrolan>(`/chat/mediation/${sumber.id}/messages`, { method: "POST", body });
      case "bantuan":
        return apiFetch<PesanObrolan>("/chat/support/messages", { method: "POST", body });
    }
  },
};
