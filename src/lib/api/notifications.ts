import type { Notification } from "../types";
import { apiFetch } from "./client";

export const notifications = {
  /** Backend membatasi 50 terbaru dan tidak menyediakan paginasi. */
  list: () => apiFetch<Notification[]>("/notifications"),

  unreadCount: () => apiFetch<{ count: number }>("/notifications/unread-count"),

  markRead: (id: string) => apiFetch<Notification>(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: () => apiFetch<{ count: number }>("/notifications/read-all", { method: "PATCH" }),

  remove: (id: string) => apiFetch<null>(`/notifications/${id}`, { method: "DELETE" }),
};
