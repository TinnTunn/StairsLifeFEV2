// Daftar butir navigasi tiap peran beserta izin rutenya.

import type { UserRole } from "@/lib/types";
import type { NavItem, SidebarEntry } from "../navigation/Sidebar";

export const BERANDA_PERAN: Record<UserRole, string> = {
  mahasiswa: "/mahasiswa",
  bisnis: "/bisnis",
  admin: "/admin",
};

export const NAV_MAHASISWA: SidebarEntry[] = [
  { href: "/mahasiswa", label: "beranda", icon: "LayoutDashboard", matchNested: false },
  { href: "/mahasiswa/cari", label: "cariProyek", icon: "Search" },
  { href: "/mahasiswa/lamaran", label: "lamaranSaya", icon: "Send" },
  { href: "/kontrak", label: "kontrak", icon: "Kontrak" },
  { href: "/pesan", label: "pesan", icon: "MessageSquare" },
  { section: "dana" },
  { href: "/mahasiswa/dompet", label: "dompet", icon: "Wallet" },
  { href: "/sengketa", label: "sengketaSaya", icon: "Scale" },
  { section: "akun" },
  { href: "/mahasiswa/verifikasi", label: "verifikasi", icon: "BadgeCheck" },
  { href: "/profil", label: "profil", icon: "UserCheck" },
  { href: "/bantuan", label: "bantuan", icon: "Info" },
];

export const BOTTOM_MAHASISWA: NavItem[] = [
  { href: "/mahasiswa", label: "beranda", icon: "Home", matchNested: false },
  { href: "/mahasiswa/cari", label: "cari", icon: "Search" },
  { href: "/mahasiswa/lamaran", label: "lamaran", icon: "Send" },
  { href: "/kontrak", label: "kontrak", icon: "Kontrak" },
  { href: "/mahasiswa/dompet", label: "dompet", icon: "Wallet" },
];

export const NAV_BISNIS: SidebarEntry[] = [
  { href: "/bisnis", label: "beranda", icon: "LayoutDashboard", matchNested: false },
  { href: "/bisnis/proyek", label: "proyekSaya", icon: "Briefcase" },
  { href: "/kontrak", label: "kontrak", icon: "Kontrak" },
  { href: "/pesan", label: "pesan", icon: "MessageSquare" },
  { href: "/sengketa", label: "sengketaSaya", icon: "Scale" },
  { section: "akun" },
  { href: "/profil", label: "profilUsaha", icon: "Store" },
  { href: "/bantuan", label: "bantuan", icon: "Info" },
];

export const BOTTOM_BISNIS: NavItem[] = [
  { href: "/bisnis", label: "beranda", icon: "Home", matchNested: false },
  { href: "/bisnis/proyek", label: "proyek", icon: "Briefcase" },
  { href: "/kontrak", label: "kontrak", icon: "Kontrak" },
  { href: "/profil", label: "profil", icon: "Store" },
];

export const NAV_ADMIN: SidebarEntry[] = [
  { href: "/admin", label: "ringkasan", icon: "LayoutDashboard", matchNested: false },
  { section: "moderasi" },
  { href: "/admin/verifikasi", label: "verifikasiKtm", icon: "BadgeCheck" },
  { href: "/admin/pengguna", label: "pengguna", icon: "Users" },
  { href: "/admin/proyek", label: "proyek", icon: "Briefcase" },
  { href: "/admin/sengketa", label: "sengketa", icon: "Scale" },
  { section: "dana" },
  { href: "/admin/keuangan", label: "keuangan", icon: "Receipt" },
  { href: "/admin/penarikan", label: "penarikan", icon: "Wallet" },
  { section: "komunikasi" },
  { href: "/admin/dukungan", label: "dukungan", icon: "MessageSquare" },
  { href: "/admin/pengumuman", label: "pengumuman", icon: "Bell" },
  { section: "sistem" },
  { href: "/admin/pengaturan", label: "pengaturan", icon: "Settings" },
];

export const BOTTOM_ADMIN: NavItem[] = [
  { href: "/admin", label: "ringkasan", icon: "LayoutDashboard", matchNested: false },
  { href: "/admin/verifikasi", label: "verifikasiKtm", icon: "BadgeCheck" },
  { href: "/admin/sengketa", label: "sengketa", icon: "Scale" },
  { href: "/admin/penarikan", label: "penarikan", icon: "Wallet" },
  { href: "/admin/pengguna", label: "pengguna", icon: "Users" },
];

export const IZIN_RUTE_ADMIN: Array<[string, string]> = [
  ["/admin/verifikasi", "Verification"],
  ["/admin/pengguna", "Users"],
  ["/admin/proyek", "Projects"],
  ["/admin/sengketa", "Disputes"],
  ["/admin/keuangan", "Finance"],
  ["/admin/penarikan", "Finance"],
  ["/admin/dukungan", "Support"],
  ["/admin/pengumuman", "Announcement"],
  ["/admin/pengaturan", "Settings"],
  ["/admin", "Overview"],
];

export function izinUntukRute(href: string): string | null {
  for (const [awal, izin] of IZIN_RUTE_ADMIN) {
    if (href === awal || href.startsWith(`${awal}/`)) return izin;
  }
  return null;
}
