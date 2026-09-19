import { bahasaAktif, teksGalat } from "@/i18n/aktif";
import { KAMUS } from "@/i18n/kamus";
import { formatRupiah } from "../format";
import type { ApiEnvelope, ApiErrorBody } from "../types";
import { clearSession, readSession, tandaiSesiBerakhir, writeSession, type Session } from "./session";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";

export class ApiError extends Error {
  readonly status: number;
  /** Validasi DTO gagal mengirim beberapa pesan sekaligus. */
  readonly messages: string[];
  /** Terisi saat login ditolak karena akun disuspend. */
  readonly suspended?: { reason: string };
  /** Kode stabil dari backend, mis. WITHDRAWAL_BELOW_MIN. */
  readonly code?: string;
  readonly params?: Record<string, string | number>;

  constructor(
    status: number,
    messages: string[],
    suspended?: { reason: string },
    code?: string,
    params?: Record<string, string | number>,
  ) {
    super(messages[0] ?? teksGalat().umum);
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
    this.suspended = suspended;
    this.code = code;
    this.params = params;
  }
}

/**
 * Login akun yang disuspend membalas 401 dengan message berupa string JSON,
 * bukan objek. Tanpa parsing ini pengguna hanya melihat JSON mentah.
 */
function readSuspended(message: string | string[]): { reason: string } | undefined {
  if (typeof message !== "string" || !message.trimStart().startsWith("{")) return undefined;
  try {
    const parsed = JSON.parse(message) as { suspended?: boolean; reason?: string };
    if (parsed.suspended) return { reason: parsed.reason ?? teksGalat().akunDibekukan };
  } catch {
    /* Bukan JSON: perlakukan sebagai pesan biasa. */
  }
  return undefined;
}

/**
 * Pesan yang tidak berguna bagi pengguna diganti.
 * Error yang tidak diturunkan dari HttpException lolos dari filter global
 * backend dan tiba sebagai "Internal server error" dalam bahasa Inggris, tanpa
 * kunci success. Diteruskan apa adanya, pengguna membaca istilah
 * teknis asing yang tidak memberi tahu apa pun soal langkah berikutnya.
 */
function pesanManusiawi(pesan: string, status: number): string {
  if (pesan === "Internal server error" || (status >= 500 && !/[a-z]{3,}\s[a-z]{3,}/i.test(pesan))) {
    return teksGalat().server;
  }
  if (status === 503) return teksGalat().layanan;
  return pesan;
}

/**
 * Pesan galat dalam bahasa aktif. Backend menulis pesannya dalam bahasa
 * Indonesia; kode yang dikenal diterjemahkan dari kamus di kedua bahasa supaya
 * nadanya sama dengan antarmuka. Kode yang tidak dikenal memakai pesan server
 * di mode Indonesia, dan pesan umum per status di mode Inggris.
 */
export function pesanDariKode(
  status: number,
  code: string | undefined,
  params: Record<string, string | number> | undefined,
  pesanServer: string[],
): string[] {
  const bahasa = bahasaAktif();
  const kamus = KAMUS[bahasa].galatApi;
  if (code && code in kamus.berparam) {
    const fn = kamus.berparam[code as keyof typeof kamus.berparam];
    return [fn((n) => formatRupiah(n), (params ?? {}) as { amount?: number })];
  }
  if (code && code in kamus.kode) return [kamus.kode[code as keyof typeof kamus.kode]];
  if (bahasa === "id" || status >= 500) return pesanServer;
  return [kamus.perStatus[status] ?? teksGalat().umum];
}

async function toApiError(res: Response): Promise<ApiError> {
  let body: Partial<ApiErrorBody> = {};
  try {
    body = (await res.json()) as Partial<ApiErrorBody>;
  } catch {
    /* Error non-HttpException lolos dari filter global dan bisa bukan JSON. */
  }
  const raw = body.message ?? teksGalat().umum;
  const suspended = readSuspended(raw);
  if (suspended) return new ApiError(res.status, [suspended.reason], suspended, body.code ?? "ACCOUNT_SUSPENDED");
  const pesanServer = Array.isArray(raw) ? raw : [pesanManusiawi(raw, res.status)];
  const messages = pesanDariKode(res.status, body.code, body.params, pesanServer);
  return new ApiError(res.status, messages, undefined, body.code, body.params);
}

/* Batas waktu satu permintaan. Tanpa ini, backend yang menggantung (bukan
   menolak) membuat kerangka pemuatan berputar tanpa akhir dan tombol terkunci
   selamanya. Unggahan diberi batas jauh lebih longgar: berkas hasil kerja boleh
   sampai 50 MB dan koneksi seluler butuh waktu. */
const TEMPO_MS = 25_000;
const TEMPO_UNGGAH_MS = 5 * 60_000;

function sinyal(ms: number, milik?: AbortSignal): AbortSignal {
  const batas = AbortSignal.timeout(ms);
  if (!milik) return batas;
  return typeof AbortSignal.any === "function" ? AbortSignal.any([milik, batas]) : milik;
}

/**
 * fetch melempar TypeError telanjang saat jaringan putus, dan pesannya
 * ("Failed to fetch") sampai ke layar apa adanya dalam bahasa Inggris.
 * Di sini kegagalan jaringan dan kehabisan waktu diubah jadi ApiError dengan
 * pesan yang bisa dibaca pengguna. Pembatalan yang disengaja (deps berubah,
 * komponen dibongkar) diteruskan apa adanya supaya tidak tampil sebagai galat.
 */
function lemparGalatKirim(e: unknown): never {
  if (e instanceof DOMException && e.name === "AbortError") throw e;
  const habis = e instanceof DOMException && e.name === "TimeoutError";
  throw new ApiError(
    habis ? 408 : 0,
    [habis ? teksGalat().lambat : teksGalat().jaringan],
    undefined,
    habis ? "REQUEST_TIMEOUT" : "NETWORK_ERROR",
  );
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Kirim tanpa Authorization walau ada token. Dipakai endpoint publik. */
  anonymous?: boolean;
  signal?: AbortSignal;
  /** Diteruskan ke fetch Next untuk halaman yang dirender di server. */
  next?: { revalidate?: number; tags?: string[] };
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(API_BASE.replace(/\/$/, "") + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function send<T>(path: string, options: RequestOptions, token?: string): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: sinyal(TEMPO_MS, options.signal),
      ...(options.next ? { next: options.next } : {}),
    });
  } catch (e) {
    lemparGalatKirim(e);
  }

  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return undefined as T;

  const envelope = (await res.json()) as ApiEnvelope<T>;
  return bukaBungkusGanda(envelope.data) as T;
}

/**
 * Interceptor backend membuka { data, message } dengan `data?.data ?? data`.
 * Saat service mengembalikan data null, `??` jatuh ke objek utuhnya, sehingga
 * yang tiba adalah { data: null, message } alih-alih null. Tanpa ini, "belum ada
 * pengajuan verifikasi" dan "kontrak belum punya pembayaran" terbaca sebagai
 * objek yang ada. Hanya kasus null yang terbungkus ganda, jadi hanya itu yang
 * dibuka. Hapus setelah interceptor backend diperbaiki.
 */
function bukaBungkusGanda(data: unknown): unknown {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return data;
  const keys = Object.keys(data);
  const bungkus = keys.length === 2 && keys.includes("data") && keys.includes("message");
  return bungkus && (data as { data: unknown }).data == null ? null : data;
}

/* Refresh token berotasi dan hanya berlaku sekali (lihat SesiService di
   backend). Beberapa permintaan yang kedaluwarsa bersamaan harus berbagi satu
   refresh; kalau masing-masing mengirim refresh token yang sama, hanya yang
   pertama berhasil dan sisanya membuat pengguna keluar. */
let refreshBerjalan: Promise<Session | null> | null = null;

function perbaruiSesi(lama: Session): Promise<Session | null> {
  if (refreshBerjalan) return refreshBerjalan;
  refreshBerjalan = (async () => {
    // Tab lain mungkin sudah memperbarui token lebih dulu.
    const kini = readSession();
    if (!kini) return null;
    if (kini.refresh_token !== lama.refresh_token) return kini;
    try {
      const baru = await send<{ token: string; refresh_token: string }>("/auth/refresh", {
        method: "POST",
        body: { refresh_token: kini.refresh_token },
      });
      const sesi = { ...kini, token: baru.token, refresh_token: baru.refresh_token };
      writeSession(sesi);
      return sesi;
    } catch (e) {
      const setelah = readSession();
      if (setelah && setelah.refresh_token !== lama.refresh_token) return setelah;
      // Sesi benar-benar berakhir hanya bila server menolaknya. Galat jaringan
      // tidak boleh mengeluarkan pengguna.
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        tandaiSesiBerakhir();
        clearSession();
        return null;
      }
      throw e;
    }
  })().finally(() => {
    refreshBerjalan = null;
  });
  return refreshBerjalan;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const session = options.anonymous ? null : readSession();

  try {
    return await send<T>(path, options, session?.token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !session?.refresh_token) throw error;
    const baru = await perbaruiSesi(session);
    if (!baru) throw error;
    return await send<T>(path, options, baru.token);
  }
}

export type JenisUnggahan = "avatar" | "ktm" | "selfie" | "deliverable" | "evidence" | "chat-image";

/* Batas ukuran per jenis, mengikuti upload.controller.ts di backend. Diperiksa
   di klien supaya pengguna tidak menunggu unggahan besar selesai hanya untuk
   ditolak server di ujung. */
export const BATAS_UNGGAH: Record<JenisUnggahan, number> = {
  avatar: 10 * 1024 * 1024,
  ktm: 10 * 1024 * 1024,
  selfie: 10 * 1024 * 1024,
  evidence: 10 * 1024 * 1024,
  "chat-image": 10 * 1024 * 1024,
  deliverable: 50 * 1024 * 1024,
};

/** Berkas pertama yang melebihi batas jenisnya, beserta batas itu dalam MB. */
export function berkasTerlaluBesar(
  berkas: File[],
  type: JenisUnggahan,
): { nama: string; batasMb: number } | null {
  const batas = BATAS_UNGGAH[type];
  const lewat = berkas.find((f) => f.size > batas);
  return lewat ? { nama: lewat.name, batasMb: Math.round(batas / (1024 * 1024)) } : null;
}

/**
 * Upload memakai multipart, bukan JSON.
 * Urutan field penting: multer membaca req.body.type untuk memilih daftar
 * ekstensi yang diizinkan, dan req.body hanya terisi dari field yang sudah
 * lewat di stream. type harus ditambahkan sebelum file.
 */
async function kirimUnggah<T>(file: File, type: JenisUnggahan, token?: string): Promise<T> {
  const form = new FormData();
  form.append("type", type);
  form.append("file", file);

  let res: Response;
  try {
    res = await fetch(buildUrl("/upload"), {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
      signal: sinyal(TEMPO_UNGGAH_MS),
    });
  } catch (e) {
    lemparGalatKirim(e);
  }

  if (!res.ok) throw await toApiError(res);
  return bukaBungkusGanda((await res.json() as ApiEnvelope<T>).data) as T;
}

/**
 * Unggahan ikut alur pembaruan token yang sama dengan apiFetch.
 * Token akses hanya berlaku satu jam, sedangkan unggah KTM, hasil kerja, dan
 * bukti sengketa terjadi setelah formulir panjang diisi: persis saat token
 * paling mungkin sudah kedaluwarsa. Tanpa ini pengguna kehilangan pekerjaannya
 * hanya karena harus masuk ulang.
 */
export async function apiUpload<T>(file: File, type: JenisUnggahan): Promise<T> {
  const session = readSession();

  try {
    return await kirimUnggah<T>(file, type, session?.token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !session?.refresh_token) throw error;
    const baru = await perbaruiSesi(session);
    if (!baru) throw error;
    return await kirimUnggah<T>(file, type, baru.token);
  }
}
