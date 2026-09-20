// Klien fetch backend: envelope respons, token, penyegaran sesi, dan unggahan.

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
  readonly messages: string[];
  readonly suspended?: { reason: string };
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

function pesanManusiawi(pesan: string, status: number): string {
  if (pesan === "Internal server error" || (status >= 500 && !/[a-z]{3,}\s[a-z]{3,}/i.test(pesan))) {
    return teksGalat().server;
  }
  if (status === 503) return teksGalat().layanan;
  return pesan;
}

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

const TEMPO_MS = 25_000;
const TEMPO_UNGGAH_MS = 5 * 60_000;

function sinyal(ms: number, milik?: AbortSignal): AbortSignal {
  const batas = AbortSignal.timeout(ms);
  if (!milik) return batas;
  return typeof AbortSignal.any === "function" ? AbortSignal.any([milik, batas]) : milik;
}

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
  anonymous?: boolean;
  signal?: AbortSignal;
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

function bukaBungkusGanda(data: unknown): unknown {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return data;
  const keys = Object.keys(data);
  const bungkus = keys.length === 2 && keys.includes("data") && keys.includes("message");
  return bungkus && (data as { data: unknown }).data == null ? null : data;
}

let refreshBerjalan: Promise<Session | null> | null = null;

function perbaruiSesi(lama: Session): Promise<Session | null> {
  if (refreshBerjalan) return refreshBerjalan;
  refreshBerjalan = (async () => {
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

export const BATAS_UNGGAH: Record<JenisUnggahan, number> = {
  avatar: 10 * 1024 * 1024,
  ktm: 10 * 1024 * 1024,
  selfie: 10 * 1024 * 1024,
  evidence: 10 * 1024 * 1024,
  "chat-image": 10 * 1024 * 1024,
  deliverable: 50 * 1024 * 1024,
};

export function berkasTerlaluBesar(
  berkas: File[],
  type: JenisUnggahan,
): { nama: string; batasMb: number } | null {
  const batas = BATAS_UNGGAH[type];
  const lewat = berkas.find((f) => f.size > batas);
  return lewat ? { nama: lewat.name, batasMb: Math.round(batas / (1024 * 1024)) } : null;
}

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
