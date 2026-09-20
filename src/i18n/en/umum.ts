// Kamus Inggris: kata umum yang dipakai lintas halaman.

import type { umum as Id } from "../id/umum";

export const umum: typeof Id = {
  meta: {
    situs: "StairsLife",
    deskripsi:
      "The freelance platform for Indonesian university students. Work on real projects for small businesses, paid through escrow that is held until the work is approved.",
  },
  aksi: {
    masuk: "Log in",
    daftarGratis: "Sign up free",
    keluar: "Log out",
    batal: "Cancel",
    tutup: "Close",
    kembali: "Back",
    lihatSemua: "See all",
    muatUlang: "Reload",
    keBeranda: "Go to my dashboard",
    keDompet: "Back to wallet",
    keProyekSaya: "Back to my projects",
    keProfil: "Back to profile",
    keDetailProyek: "Back to project",
    bukaMenu: "Open menu",
    tutupMenu: "Close menu",
    lewatiKeKonten: "Skip to main content",
  },
  bahasa: {
    label: "Language",
    pilih: "Choose language",
    nama: { id: "Indonesia", en: "English" },
  },
  tema: {
    terang: "Light theme. Switch to dark.",
    gelap: "Dark theme. Switch to light.",
  },
  peran: {
    mahasiswa: "Student",
    bisnis: "Business",
    admin: "Admin",
  },
  tingkat: {
    pemula: "Beginner",
    menengah: "Intermediate",
    mahir: "Advanced",
  },
  galat: {
    jaringan: "Could not reach the server.",
    lambat: "The server did not answer in time. Check your connection, then try again.",
    berkasBesar: (nama: string, mb: number) => `${nama} is larger than ${mb} MB. Please make it smaller first.`,
    server: "The server is having problems. Please try again in a moment.",
    layanan: "The service is unavailable right now. Please try again in a moment.",
    umum: "Something went wrong on the server.",
    muatUlangHalaman: "Try reloading this page.",
    modeContoh: "Sample mode is on, so this action was not sent to the server.",
    akunDibekukan: "Your account is suspended.",
  },
  dataContoh: {
    judul: "Sample data",
    isi: "The backend is not connected yet, so what you see here is sample data, not real data.",
  },
  memuat: "Loading",
  offline: {
    judul: "You are offline",
    isi: "Your most recent changes may not be saved. This page refreshes itself once the connection is back.",
  },
  keluar: {
    judul: (nama: string) => `See you soon, ${nama}`,
    isi: "Closing your session and removing login data from this device.",
  },
  masuk: {
    memeriksa: "Checking your account",
    memeriksaIsi: "One moment, we're matching your email and password.",
    judul: (nama: string) => `Welcome, ${nama}`,
    isi: "Getting your dashboard ready.",
    daftarJudul: (nama: string) => `Your account is ready, ${nama}`,
  },
};
